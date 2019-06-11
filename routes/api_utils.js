var express = require('express');
var router = express.Router();
var utils = require("../utils")
var alexaUtils = require("../alexa/alexautils")
var config = require("../config")
const Papa = require('papaparse')
var ObjectId = require('mongodb').ObjectID;
const get = require('simple-get');
const mustache = require('mustache');

function initRoutes(router,db) {
	router.get('/dumpalexa',(req,res) => {    
		let munge = alexaUtils.munge;    
		var fs = require('fs');
		ROOT_APP_PATH = fs.realpathSync('.'); 
		//console.log(ROOT_APP_PATH);
		TMP_PATH='/tmp'
		db().collection('questions').distinct('quiz',{$and:[{ok_for_alexa:{$eq:true}},{discoverable:{$ne:'no'}},{access:{$eq:'public'}}]}).then(function(results) {
				// TOPICS
				let topics=[];
				let topicsO={};
				////console.log(results);
				results.map(function(val,key) {
					let strip=munge(val);
					if (val && val.length > 0 && strip.length > 0)  {
						topicsO[strip]=true;
					}
				});
				topics = Object.keys(topicsO);
				// TAGS
				//db().collection('words').distinct('text').then(function(results) {
					let tags=[];
					let tagsO={};
					////  //console.log(results);
					//results.map(function(val,key) { 
						//let strip=munge(val);
						//if (val && val.length > 0 && strip.length > 0)  {
							//tagsO[strip]=true;
						//}
					//});
					//tags = Object.keys(tagsO);
					// SHORTANSWERS
					db().collection('questions').find({$and:[{ok_for_alexa:{$eq:true}},{discoverable:{$ne:'no'}},{access:{$eq:'public'}}]}).toArray().then(function(results) {
						let answers=[];
						let answersO={};
						let spelledWords=[];
						let spelledWordsO={};
						results.map(function(val,key) {
							if (val && val.hasOwnProperty('answer'))  {
								// don't submit answer to model if there is a specific answer or also_accept
								//if (val && val.hasOwnProperty('specific_answer') && String(val.specific_answer).length > 0)  {
									//// skip
								//} else if (val && val.hasOwnProperty('also_accept') && String(val.also_accept).length > 0)  {
									//// skip
								//} else {
									if (val.answer.split(' ').length < 5) {
										let oval = munge(val.answer);
										if (oval.length > 0) {
											answersO[oval.slice(0,139)]=true;
										}
									} 
									//if (val.answer.split(' ').length < 4) {
										//let oval = munge(val.answer);
										//////console.log(['OVAL',oval]);
										//if (oval.length > 0) {
											//oval = String(oval).split(' ').slice(0,3).join("").split('').join(' ')
											//spelledWordsO[oval]=true;
										//}
									//}
								//}
							}
							if (val && val.hasOwnProperty('specific_answer'))  {
								let strip=munge(val.specific_answer);
								if (strip.length > 0) {
									answersO[strip.slice(0,139)]=true;
									let spaced=strip.split('').join(' ').slice(0,160);
								   // //console.log('specific answer '+strip+spaced);
									spelledWordsO[spaced]=true;
								}
							}
							if (val && val.hasOwnProperty('also_accept'))  {
								let alsoAcceptParts=val.also_accept.split(",");
								alsoAcceptParts.map(function(oval,okey) {
									let strip=munge(oval);
									if (strip.length > 0) {
										let spaced=strip.split('').join(' ').slice(0,160);
										////console.log('also accept answer '+strip+spaced);
										spelledWordsO[spaced]=true;
										answersO[strip]=true;
									}
								});
							}
							if (val && val.hasOwnProperty('tags') && val.tags.length > 0) {
								////console.log(['process tags',val.tags]);
								val.tags.map(function(val,key) {
									tagsO[val]=true;
								});
							}
						});
						answers = Object.keys(answersO);
						spelledWords = Object.keys(spelledWordsO);
						tags=Object.keys(tagsO);
						// QUESTIONS
						db().collection('questions').distinct('question',{$and:[{ok_for_alexa:{$eq:true}},{discoverable:{$ne:'no'}},{access:{$eq:'public'}}]}).then(function(results) {
							let questions=[];
							let questionsO={};
							results.map(function(val,key) {
								if (val && val.length > 0)  {
									let strip=munge(val);
									if (strip.length > 0) {
										questionsO[strip.slice(0,139)]=true;
									}
								}
							});
							questions = Object.keys(questionsO);
							// MNEMONICS
							db().collection('questions').distinct('mnemonic',{$and:[{ok_for_alexa:{$eq:true}},{discoverable:{$ne:'no'}},{access:{$eq:'public'}}]}).then(function(results) {
								let mnemonics=[];
								let mnemonicsO={};
								let mnemonicsLastWordsO={};
								results.map(function(val,key) {
									if (val && val.length > 0)  {
										val = alexaUtils.strip(munge(val));
										if (val.length > 0) {
											mnemonicsO[val.slice(0,139)]=true;  // alexa limit 140 char
											let parts = val.split(' ');
											let lastWord = parts[parts.length-1];
											mnemonicsLastWordsO[lastWord]=true;                                        
										}
									}
								});
								mnemonics = Object.keys(mnemonicsO);
								let mnemonicLastWords = Object.keys(mnemonicsLastWordsO);
								db().collection('questions').distinct('interrogative',{$and:[{ok_for_alexa:{$eq:true}},{discoverable:{$ne:'no'}},{access:{$eq:'public'}}]}).then(function(results) {    
									let interrogatives=[];
									let interrogativesO={};
									results.map(function(val,key) {
										if (val && val.length > 0)  {
											val = munge(val);
											if (val.length > 0) {
												interrogativesO[val]=true;
											}
										}
									});
									interrogatives = Object.keys(interrogativesO);
									//,questions:questions,interrogatives:interrogatives
									//
									let allDone = {topics:topics,tags:tags,mnemonics:mnemonics,answers:answers}; //,spelledWords:spelledWords  ,mnemonicLastWords:mnemonicLastWords
									//let allDone = {};
									//console.log(JSON.stringify(allDone));
									if (!fs.existsSync(TMP_PATH+'/alexa')) {
										fs.mkdirSync(TMP_PATH+'/alexa');
									}
									if (!fs.existsSync(TMP_PATH+'/alexa/models')) {
										fs.mkdirSync(TMP_PATH+'/alexa/models');
									}
									if (!fs.existsSync(TMP_PATH+'/alexa/.ask')) {
										fs.mkdirSync(TMP_PATH+'/alexa/.ask');
									}
									if (config.development) {
										fs.copyFileSync(ROOT_APP_PATH+'/alexa/skill.dev.json',TMP_PATH+'/alexa/skill.json');
									} else {
										fs.copyFileSync(ROOT_APP_PATH+'/alexa/skill.live.json',TMP_PATH+'/alexa/skill.json');
									}
									if (config.development) {
										fs.copyFileSync(ROOT_APP_PATH+'/alexa/.ask/config-dev',TMP_PATH+'/alexa/.ask/config');
									} else {
										fs.copyFileSync(ROOT_APP_PATH+'/alexa/.ask/config-live',TMP_PATH+'/alexa/.ask/config');
									}
									fs.writeFile(TMP_PATH+'/alexa/vocabdump.js', 'module.exports = '+JSON.stringify(allDone), function(err,result) {
										if(err) {
											return //console.log(err);
										}
										//console.log('NOW WRITE ALEXA MODELS');
										let alexaapp = require('../alexa/mnemoslibrary')
										let schema = alexaapp.schemas.askcli("nemo's library") ;
										if (config.development) {
											schema = alexaapp.schemas.askcli("nemo's developer") ;
										}
										let languages=['US','AU','CA','GB'];
										let promises=[];
										languages.map(function(lang,key) {
											//console.log('write '+lang);
											let p = new Promise(function(resolve,reject) {
												fs.writeFile(TMP_PATH+'/alexa/models/en-'+lang+'.json',schema, function(err,result) {
													if(err) {
														return //console.log(err);
													}
													resolve();
												});                                
											});
											promises.push(p);
										});
										Promise.all(promises).then(function() {
											//console.log('wrote all ');
											// copy directory, even if it has subdirectories or files
											const fse = require('fs-extra')
											fse.copySync(TMP_PATH+'/alexa', ROOT_APP_PATH+'/alexa')
											//var exec = require('child_process').exec;
											//exec('ask deploy --no-wait', {
											  //cwd: ROOT_APP_PATH+'/alexa'
											//}, function(error, stdout, stderr) {
											  //// work with result
											  //console.log(error);
											  //console.log(stderr);
											  //console.log(stdout);
											  //console.log('done');
											//});
											res.send({ok:true});
										});
										
									});
								});
							});
						});
						
					});
				//});
				
			});
	})




	// SUPPORT OLD PATH TO UPLOADED FILES FOR NOW
	router.use('/s3', require('react-s3-uploader/s3router')({
		bucket: "mnemolibrary.com",
		region: 'us-west-2', //optional
		//signatureVersion: 'v4', //optional (use for some amazon regions: frankfurt and others)
		headers: {'Access-Control-Allow-Origin': '*'}, // optional
		ACL: 'private', // this is default
		uniquePrefix: false // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
	}));



	router.get('/sitemap', (req, res) => {
		res.send('');
		return ;
		var fs = require('fs');
		ROOT_APP_PATH = fs.realpathSync('.'); //console.log(ROOT_APP_PATH);
		
		var questionTemplate =  `
				<html>
					<head>
					  <title>{{header}}? - Mnemo's Library {{header}}</title>
					  <meta charset="UTF-8">
					  <meta name="description" content="{{mnemonic}}">
					  <meta name="keywords" content="{{tags}},mnemonics,trivia,learn,dementia,brain">
					  <meta name="author" content="Captain Mnemo">
					  <meta name="viewport" content="width=device-width, initial-scale=1.0">
					</head>
					<body>
						<div className="card question container" >
							<h1>Mnemo's Library</h1>
								<h4 className="card-title">{{header}}?</h4>
								
								<div className="card-block mnemonic">
									<div  className='card-text'><b>Mnemonic</b> <span><pre>{{mnemonic}}</pre></span></div>
								</div>
								
							   <div className="card-block topic">
									<b>Topic&nbsp;&nbsp;&nbsp;</b> <span>{{quiz}}</span><br/>
								</div>
								
								<div   className="card-block tags" >
								  <b>Tags&nbsp;&nbsp;&nbsp;</b>
								   {{tags}}
								</div>
								<br/>
								<br/>
								<img src="/arrow-right.png" />
								<a style="font-size: 1.3em; color: black; border: 1px solid black; background-color: lightgrey; padding: 1em;" href='https://mnemolibrary.com?question={{id}}'><span >&nbsp;&nbsp;Learn more at Mnemo's Library</span></a>
								
						</div>
					</body>
					</html>
					`;


		let criteria={access:{$eq:'public'}};
		db().collection('questions').find(criteria).toArray().then(function(results) {
			 ////console.log(['no user res',results ? results.length : 0]);  
			let siteMap=[]; 
			//deleteFolderRecursive(ROOT_APP_PATH+"/client/public/cache");
			if (!fs.existsSync(ROOT_APP_PATH+"/client/public/cache")) {
				fs.mkdirSync(ROOT_APP_PATH+"/client/public/cache");
			}
			
			////console.log(['queryids',req.query.ids]);
			results.map(function(question,key) {
				 siteMap.push(config.protocol+'://mnemolibrary.com/cache/page_'+question._id+'.html');
				 let page = mustache.render(questionTemplate,{id:question._id,header:question.interrogative + ' ' + question.question,answer:question.answer,mnemonic:question.mnemonic,attribution:question.attribution,quiz:question.quiz,tags:question.tags});
				 if (req.query.ids) {
					 
					let ids = req.query.ids.split(","); 
					////console.log(ids);
					if (ids.indexOf(String(question._id))!=-1) {
					   // //console.log(['queryids match',question._id]);
						if (fs.existsSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html')) {
							fs.unlinkSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html');
						}
						fs.writeFileSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html', page, function(err) {
							if(err) {
								return //console.log(err);
							}
						});                  
					}
				 } else {
					 if (fs.existsSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html')) {
							fs.unlinkSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html');
						}
					
					 fs.writeFile(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html', page, function(err) {
						if(err) {
							return //console.log(err);
						}
					});                  
				 }
			});  
			if (fs.existsSync(ROOT_APP_PATH+"/client/public/sitemap.txt")) {
				fs.unlinkSync(ROOT_APP_PATH+"/client/public/sitemap.txt");
			}
					   
			fs.writeFile(ROOT_APP_PATH+"/client/public/sitemap.txt", siteMap.join("\n"), function(err) {
				if(err) {
					return //console.log(err);
				}
				//console.log("Wrote sitemap!");
			}); 

		})
		
	});


	router.get('/indexes', (req, res) => {
		db().collection('questions').dropIndexes();
		db().collection('questions').createIndex({
			question: "text",
			interrogative: "text",
			answer:"text",
			question:"text",
			mnemonic: "text",
			//answer: "text"
		});
	   
	   db().collection('words').dropIndexes();
		db().collection('words').createIndex({
			text: "text"                    
		}); 
	});

	router.post('/import', (req, res) => {
	  console.log(['import']);
	  console.log(['import']);
		let that = this;
		let url = ''; //config.masterSpreadsheet;
		let mnemonics = [];
		let checkMnemonics=[];
		let importId = req.body.importId && req.body.importId > 0 ? parseInt(req.body.importId,10) : 0;
		if (config.importSheets && config.importSheets.length > importId) {
			url = config.importSheets[importId];
		} else {
			res.send('Invalid import sheet '+importId);
			return;
		}
		console.log(['IMPORT URL',url]);
		// load mnemonics and collate tags, topics
		var request = get(url, function(err,response) {
			if (err) {
				console.log(['e',err]);
				return;
			}
			// clear and reimport topicCollections
			
			//console.log(['response',response]);
			Papa.parse(response, {
				'header': true, 
				'delimiter': ",",	
				'newline': "",	
				'quoteChar': '"',
				//'escapeChar': "\\",
				
				'complete': function(data) {
					const toImport = {'questions':data.data};
					let json = utils.createIndexes(toImport);
					console.log('got indexes');
					// iterate questions collecting promises and insert/update as required
					let promises=[];
					for (var a in json.questions) {
					 //console.log([a]); //,json[collection][a]]);
						if (json.questions[a]) {
							let record =  json.questions[a];
							if (!record.successRate) record.successRate = Math.random()/100; // randomisation to get started
							if (record.ok_for_alexa && record.ok_for_alexa==="no") {
								record.ok_for_alexa=false  
							} else {
								record.ok_for_alexa=true
							}
							record.importId = importId;
							
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							record.answer = record.answer.replace('""','"');
							
						   //record.answer = record.answer.replace(/^"(.*)"$/, '$1');
						   //record.answer = record.answer.replace(/^"(.*)"$/, '$1');
						   //record.answer = record.answer.replace(/^"(.*)"$/, '$1');
							// remove and restore id to allow update
							let thePromise = null;
							let recordExists = false;
							// convert to ObjectId or create new 
							if (json.questions[a].hasOwnProperty('_id')&& String(json.questions[a]._id).length > 0) {
								record._id = ObjectId(json.questions[a]._id); 
								recordExists = true;
							} else {
								 record._id = ObjectId();  
								 console.log(['NEW ID',record._id]);
							}
							if (record.mnemonic && record.mnemonic.length > 0) {
								record.hasMnemonic = true;
								
							} else {
								record.hasMnemonic = false;
							}
							function saveQuestion() {
								//console.log('SAVE QUESTION')
								thePromise = new Promise(function(resolve,reject) {
									db().collection('questions').save(record).then(function(resy) {
									   // console.log(['UPDATE']);
										//let newRecord={_id:record._id,discoverable:record.discoverable,admin_score : record.admin_score,mnemonic_technique:record.mnemonic_technique,tags:record.tags,quiz:record.quiz,access:record.access,interrogative:record.interrogative,prefix:record.prefix,question:record.question,postfix:record.postfix,mnemonic:record.mnemonic,answer:record.answer,link:record.link,image:record.image,homepage:record.homepage}
										if (record.hasMnemonic) {
											let newMnemonic = {user:'default',question:record._id,mnemonic:record.mnemonic,questionText:record.question,technique:record.mnemonic_technique,importId:importId};
											mnemonics.push(newMnemonic);
										}
										//console.log(['SAVED QUESTION'])
										resolve(record._id);
										
									}).catch(function(e) {
										console.log(['import error saving question',e]);
										reject();
									});
									
								})   
								promises.push(thePromise);
							}
							
							saveQuestion();
							
						   if (recordExists && !record.hasMnemonic) {
							   checkMnemonics.push(record._id);
							}
							
						}
					}
					Promise.all(promises).then(function(ids) {
						
						// send import file back before tidy up and indexing
						let unparsed = Papa.unparse(json.questions,{quotes: true});
						res.send(unparsed);
					
						console.log(['IMPORT ALL DONE now MNEMONICS ',ids,mnemonics]);
					   // clear default user mnemonics
						db().collection('mnemonics').remove({$and:[{user:'default'},{importId:importId}]}).then(function(dresults) {
					   // bulk save mnemonics 
							db().collection('mnemonics').insertMany(mnemonics);
						});
					   // console.log(['del ids',ids]);
						// delete all questions that are not in this updated set (except userTopic questions)
						db().collection('questions').remove({$and:[{importId:importId},{_id:{$nin:ids}},{userTopic:{$not:{$exists:true}}}]}).then(function(dresults) {
						   console.log('DELETEd THESE');
						   console.log(ids);
							// update tags
						   // console.log('UPDATE TAGS and indexes');
							////console.log(Object.keys(json.tags));
							updateTags(json.tags).then(function() {
								// create indexes   
								db().collection('questions').dropIndexes();
								db().collection('questions').createIndex({
									question: "text",
									interrogative: "text",
									answer:"text",
									question:"text",
									mnemonic: "text",
									//answer: "text"
								});
							   
								db().collection('words').dropIndexes();
								db().collection('words').createIndex({
									text: "text"                    
								}); 
								console.log('CHECK EXISTING RECORD FOR MNEMONICS')
								checkMnemonics.map(function(questionId) {
									db().collection('mnemonics').find({question:ObjectId(questionId)}).toArray().then(function(resy) {
										if (resy.length > 0) {
											console.log('CHECK EXISTING RECORD FOR MNEMONICS FOUND',resy)
											//record.hasMnemonic = true;
											db().collection('questions').updateOne({_id:ObjectId(questionId)},{$set:{hasMnemonic:true}}).then(function() {
												console.log('UPDATED QUESTIONS SET HASMNEMONIC TRUES')
											});
										}
									});
								});
								//
									//saveQuestion();
								//});

								
								
							  //  console.log('created indexes');                            
							});
						   
						});
						
						
						
						
					});
				}
			});
		})
					
	});


	router.post('/importmultiplechoicequestions', (req, res) => {
	  console.log(['import MC']);
	  let that = this;
		let url = ''; //config.masterSpreadsheet;
		let mnemonics = [];
		let checkMnemonics=[];
		let importId = req.body.importId && req.body.importId > 0 ? parseInt(req.body.importId,10) : 0;
		if (config && config.importMultipleChoice && config.importMultipleChoice.length > importId) {
			url = config.importMultipleChoice[importId];
		} else {
			console.log([config.importMultipleChoice,importId]);
			res.send('Invalid import sheet '+importId);
			return;
		}
		console.log(['IMPORT URL',url]);
		// load mnemonics and collate tags, topics
		var request = get(url, function(err,response) {
			if (err) {
				console.log(['e',err]);
				return;
			}
			// clear and reimport topicCollections
			
			//console.log(['response',response]);
			Papa.parse(response, {
				'header': true, 
				'delimiter': ",",	
				'newline': "",	
				'quoteChar': '"',
				//'escapeChar': "\\",
				
				'complete': function(data) {
				//	const toImport = {'questions':data.data};
					//console.log(['IMPORTED',data.data]);
					console.log(['IMPORTED','Errors ->',data.errors]);
					let toSave=[];
					if (data && data.data) {
						data.data.map(function(mcQuestion) {
							if (mcQuestion) {
								if (mcQuestion.topic && mcQuestion.topic.length > 0
									&& mcQuestion.specific_question && mcQuestion.specific_question.length > 0
									&& mcQuestion.specific_answer && mcQuestion.specific_answer.length > 0
									&& mcQuestion.multiple_choices && mcQuestion.multiple_choices.length > 0
								) {
									toSave.push({topic:mcQuestion.topic,question:mcQuestion.specific_question,answer:mcQuestion.specific_answer,multiple_choices:mcQuestion.multiple_choices,questionId:ObjectId(mcQuestion.questionId),feedback:mcQuestion.feedback,importId:importId,user:'default',createDate:0})
								}
							}
						});
						// clear all from previous imports of this sheet then save all
						db().collection('multiplechoicequestions').remove({$and:[{user:'default'},{importId:importId}]}).then(function(dresults) {
							db().collection('multiplechoicequestions').insertMany(toSave).then(function() {
								console.log('Saved mc questions '+toSave.length);
								res.send({ok:true});
							}).catch(function(err) {
								console.log(err)
								res.send({ok:false});
							});
						});
					}

				}
			});
		})
					
	});

};


module.exports = initRoutes;
    
