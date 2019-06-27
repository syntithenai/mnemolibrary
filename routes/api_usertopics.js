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
	

	function updateTags(tags) {
		//console.log(['UPDATETAGS']);
		////console.log(tags);
		let p = new Promise(function(resolve,reject) {
			let promises=[];
			Object.keys(tags).map(function(tag,key) {
			  //  //console.log(['UPDATETAGS matching']);
				let criteria=[];
				criteria.push({'tags': {$in:[tag]}});
				////console.log(criteria);
				let ip = new Promise(function(iresolve,ireject) {
					db().collection('questions').find({$and:criteria}).toArray().then(function(result) {
							////console.log(['UPDATETAGS found']);
							////console.log(result);
							if (result.length > 0) {
								////console.log('UPDATETAGS found questions');
								db().collection('words').findOne({text:{$eq:tag}}).then(function(word) {
									////console.log('UPDATETAGS UPDATED WORD');
									////console.log(word);
									if (word) {
										////console.log('UPDATETAGS UPDATED');
										word.value=result.length;
										db().collection('words').save(word).then(function(saveres) {
										  //      //console.log('UPDATETAGS TAG');
												////console.log(saveres);
												iresolve();
										});                            
									} else {
										db().collection('words').save({'text':tag,value:result.length}).then(function(saveres) {
											//    //console.log('UPDATETAGS TAG NEW');
											   // //console.log(saveres);
											   iresolve();
										});                            
									}
								});
							} else {
								db().collection('words').remove({text:{$eq:tag}}).then(function(word) {
									////console.log('UPDATETAGS REMOVED TAG');
								   iresolve();
								});
							}
					 })
				}) ;
				promises.push(ip);
			});
			Promise.all(promises).then(function() {
				resolve();
			});
			
		});
		return p;
	}




	function updateMnemonics(mnemonics) {
		//console.log(['update mnemonics',mnemonics]);
		mnemonics.map(function(mnemonic) {
			// use importId -1 to flag userTopic mnemonics 
			db().collection('mnemonics').remove({$and:[{importId:-1},{question:{$eq:ObjectId(mnemonic.question)}}]}).then(function(delresult) {
			   mnemonic.importId = -1;
			   db().collection('mnemonics').insert(mnemonic).then(function() {
				   //console.log('inserted');
				});
			}).catch(function(e) {
				console.log({'erri1':e});
			});
		});

	}

	router.post('/saveusertopic', (req, res) => {
		//let body=JSON.parse(req.body);
		//res.send({message:req.body});
		let body=req.body;
		//console.log(['SAVEUSERTOP',body]);
		if (body.user  && Array.isArray(body.questions) && body.topic) {
			let id = body._id && String(body._id).length > 0 ? new ObjectId(body._id) : new ObjectId();
			db().collection('users').findOne({_id:ObjectId(body.user)}).then(function(user) {
				//console.log(['deleted question',result]);
				let questions = Array.isArray(body.questions) ? body.questions : [];
				let errors={};
				let foundIndex=null;
				questions.map(function(question,key) {
					if (req.body.deleteQuestion && String(req.body.deleteQuestion).length > 0 && questions[key]._id === req.body.deleteQuestion) {
						// skip
						//console.log('skip');
						foundIndex = key;
						//delete questions[key];
					} else {
						//console.log('add');
						// ensure id
						
						questions[key]._id = questions[key]._id && String(questions[key]._id).length > 0 ? new ObjectId(questions[key]._id) : new ObjectId();
					
						// required question fields
						//if (question.mnemonic && question.mnemonic.length === 0) {
							//if (!errors.hasOwnProperty(key)) errors[key]=[];
							//errors[key].push('mnemonic');
						//}
						//if (question.shortanswer && question.shortanswer.length === 0) {
							//if (!errors.hasOwnProperty(key)) errors[key]=[];
							//errors[key].push('shortanswer');
						//}
						if (question.question && question.question.length === 0) {
							if (!errors.hasOwnProperty(key)) errors[key]=[];
							errors[key].push('question');
						}
						//if (question.tags.length === 0) {
							//if (!errors.hasOwnProperty(key)) errors[key]=[];
							//errors[key].push('tags');
						//}                
					}

				});
				//console.log(questions);
				if (foundIndex != null && !isNaN(foundIndex) && foundIndex >= 0) {
					////questions = questions.slice(0,foundIndex);
					//questions.splice(foundIndex,1);
					//console.log(['SPLICE',foundIndex,questions,questions.slice(0,foundIndex), questions.slice(foundIndex+1)]);
					questions = questions.slice(0,foundIndex).concat(questions.slice(foundIndex+1));
				}
				
				let toSave = {_id:id,user:ObjectId(user._id),questions:questions,topic:body.topic,publishedTopic:user.avatar + "'s "+body.topic,topicpassword:req.body.topicpassword,restriction:req.body.restriction};
				toSave.updated=new Date().getTime();
				//console.log(['saveusertopic']);
				//console.log(JSON.stringify(toSave));
				//console.log(questions);
				if (req.body.deleteQuestion && String(req.body.deleteQuestion).length > 0) {
					db().collection('questions').remove({_id:ObjectId(req.body.deleteQuestion)}).then(function(result) {
						//console.log(['deleted question',result]);
						
					}).catch(function(err) {
						console.log(['del q usertopic ERR',err]);
					});
					
				}
				
				db().collection('userTopics').save(toSave).then(function(result) {
					//console.log(['saved usertopic',result]);
					res.send({id:id,errors:errors,questions:questions});
				}).catch(function(err) {
				  //  //console.log(['save usertopic ERR',err]);
					res.send({message:'Invaddlid request ERR'});
				});
			}).catch(function(err) {
				console.log(['del q usertopic ERR',err]);
			});
		} else {
			res.send({message:'Invaddlid request'});
		}
	})


	router.post('/myusertopics', (req, res) => {
		////console.log(['seen',req.body]);
		if (req.body.user && req.body.user.length > 0) {
	  //      //console.log('MUT');
	  //      //console.log(db);
			db().collection('userTopics').find({user:ObjectId(req.body.user)}).sort({topic:1}).toArray(function(err, result) {
				res.send(result);
			});
		} else {
			res.send({message:'Invalid request'});
		}
	})

	router.post('/usertopic', (req, res) => {
		////console.log(['usrtop',req.body]);
		if (req.body._id && req.body._id.length > 4) {  // non empty and not string null
			db().collection('userTopics').findOne({_id:ObjectId(req.body._id)}).then(function(result) {
				res.send(result);
			}).catch(function(e) {
				res.send({'err':e});
			});
		} else {
			res.send({message:'Invalid request'});
		}
	})

	router.post('/unpublishusertopic', (req, res) => {
		////console.log(['del usrtop',req.body]);
		if (req.body._id && req.body._id.length > 0) {
			
			db().collection('userTopics').findOne({$and:[{user:ObjectId(req.body.user)},{_id:ObjectId(req.body._id)}]}).then(function(result) {
			   if (result) {
					let tags={};
						   
		  //          //console.log(['NOW delete related q',questionsToDelete]);
				   db().collection('questions').find({userTopic:{$eq:ObjectId(req.body._id)}}).toArray().then(function(questions) {
			//            //console.log(['delete related q',questionsToDelete]);
						   if (Array.isArray(questions)) {
							   questions.map(function(question,key) {
								   if (Array.isArray(question.tags)) {
									   question.tags.map(function(tag,key) {
										   tags[tag]=1;
									   });
								   }
							   });
								db().collection('questions').remove({userTopic:{$eq:ObjectId(req.body._id)}}).then(function(delresult) {
								   updateTags(tags);
								}).catch(function(e) {
									//console.log({'erri1':e});
								});
								db().collection('multiplechoicequestions').remove({userTopic:{$eq:ObjectId(req.body._id)}}).then(function(delresult) {
								   //updateTags(tags);
								}).catch(function(e) {
									//console.log({'erri1':e});
								});
						   } 
					
					
						   
					}).catch(function(e) {
						//console.log({'erri1':e});
					});
					result.published=false;
					db().collection('userTopics').save(result);
					// TODO also tags and topics ??????
					// topic
			
				   
			   }
				
			   
			   
				res.send(result);
			}).catch(function(e) {
				res.send({'err':e.message});
			});
		} else {
			res.send({message:'Invalid request'});
		}
	})


	router.post('/deleteusertopic', (req, res) => {
		////console.log(['del usrtop',req.body]);
		if (req.body._id && req.body._id.length > 0) {
			
			db().collection('userTopics').findOne({$and:[{user:ObjectId(req.body.user)},{_id:ObjectId(req.body._id)}]}).then(function(result) {
			   if (result) {
					let tags={};
						   
		  //          //console.log(['NOW delete related q',questionsToDelete]);
				   db().collection('questions').find({userTopic:{$eq:ObjectId(req.body._id)}}).toArray().then(function(questions) {
			//            //console.log(['delete related q',questionsToDelete]);
							   if (Array.isArray(questions)) {
								   questions.map(function(question,key) {
									   if (Array.isArray(question.tags)) {
										   question.tags.map(function(tag,key) {
											   tags[tag]=1;
										   });
									   }
								   });
									db().collection('questions').remove({userTopic:{$eq:ObjectId(req.body._id)}}).then(function(delresult) {
									   updateTags(tags);
										db().collection('userTopics').remove({_id:ObjectId(req.body._id)}).then(function(delresult) {
								  //          //console.log(result);
										}).catch(function(e) {
											//console.log({'erri2':e});
										});
									   
									}).catch(function(e) {
										//console.log({'erri1':e});
									});
									db().collection('multiplechoicequestions').remove({userTopic:{$eq:ObjectId(req.body._id)}}).then(function(delresult) {
									   //updateTags(tags);
									}).catch(function(e) {
										//console.log({'erri1':e});
									});
							   } 
					
					
						   
					}).catch(function(e) {
						//console.log({'erri1':e});
					});
					// TODO also tags and topics ??????
					// topic
			
				   
			   }
				
			   
			   
				res.send(result);
			}).catch(function(e) {
				res.send({'err':e.message});
			});
		} else {
			res.send({message:'Invalid request'});
		}
	})

	router.post('/publishusertopic', (req, res) => {
		////console.log(['pub usrtop',req.body]);
		let preview=req.body.preview;
		let tags={}
		let mnemonics=[]; 
		let mcQuestions=[];                     
		if (req.body._id && req.body._id.length > 0) {
			db().collection('userTopics').findOne({$and:[{user:ObjectId(req.body.user)},{_id:ObjectId(req.body._id)}]}).then(function(userTopic) {
				db().collection('users').findOne({_id:ObjectId(userTopic.user)}).then(function(user) {
					db().collection('questions').find({$and:[{userTopic:{$eq:req.body._id}},{isPreview:{$eq:false}}]}).toArray().then(function(questions) {
						// save questions
						//let questionsMap={};  // used to track new/old/deleted questions
						let questionsFullMap={};
						questions.map(function(val,key) {
							//questionsMap[val._id]=ObjectId(val._id);
							questionsFullMap[val._id]=val;
						});
						let errors={};
						let newQuestions = [];
						if (userTopic.questions && userTopic.questions.length > 0) {
							userTopic.questions.map(function(questionR,key) {
								let question = JSON.parse(JSON.stringify(questionR));
			                  // console.log(['PUBLISH',question,key]);
								question.sort=key;
								question.quiz=user.avatar+'\'s '+userTopic.topic;
								if (question._id) {
									//delete questionsMap[question._id];
									question._id = ObjectId(question._id);
								} else {
									question._id = new ObjectId();
								}
								question._id = question._id ? ObjectId(question._id) : new ObjectId();
								//if (!preview) {
								//} 
								//if (!question.access && preview) {
									//question.access=user.username;
								//}
								if (questionsFullMap.hasOwnProperty(question._id) && questionsFullMap[question._id].successRate) {
									question.successRate=questionsFullMap[question._id].successRate;
								} else {
									question.successRate=Math.random()/100;
								}
								question.isPreview=false;
								if (userTopic.topicpassword && userTopic.topicpassword.length > 0) {
									question.topicpassword = userTopic.topicpassword; 
									question.access="restricted";
								} else {
									question.access="public";
								}
								
										
								question.updated=new Date().getTime();
								question.user=ObjectId(user._id);
								question.userQuestion=true;
								question.userTopic=ObjectId(req.body._id);
								if (question.mnemonic && question.mnemonic.length > 0) {
									question.hasMnemonic = true;
									mnemonics.push({user:question.user,question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question});
								} else {
									question.hasMnemonic = false;
								}
								 if (Array.isArray(question.tags)) {
									   question.tags.map(function(tag,key) {
										   tags[tag]=1;
									   });
								   }
								//if (question.mnemonic.length === 0) {
									//if (!errors.hasOwnProperty(key)) errors[key]=[];
									//errors[key].push('mnemonic');
								//}
								//if (question.interrogative.length === 0) {
									//if (!errors.hasOwnProperty(key)) errors[key]=[];
									//errors[key].push('interrogative');
								//}
								if (question.question.length === 0) {
									if (!errors.hasOwnProperty(key)) errors[key]=[];
									errors[key].push('question');
								}
								//if (question.answer.length === 0) {
									//if (!errors.hasOwnProperty(key)) errors[key]=[];
									//errors[key].push('answer');
								//}
								// related MC question
								if (question.quiz && question.quiz.length > 0
									&& question.specific_question && question.specific_question.length > 0
									&& question.specific_answer && question.specific_answer.length > 0
									&& question.multiple_choices && question.multiple_choices.length > 0
								) {
									console.log(['NEW MC QUESTION']);
									let newQuestion ={_id:ObjectId(),topic:question.quiz,question:question.specific_question,answer:question.specific_answer,multiple_choices:question.multiple_choices,questionId:ObjectId(question._id),feedback:question.feedback,importId:'USERTOPIC-'+req.body._id,userTopic:ObjectId(req.body._id)}
									if (question.autoshow_image==="YES" && question.image) newQuestion.image = question.image;
									if (question.autoplay_media==="YES" && question.media) newQuestion.media = question.media;
									
									mcQuestions.push(newQuestion)
								}
								newQuestions.push(question);
								
							});
							let promises=[];
							if (Object.keys(errors).length>0) {
								res.send({errors:errors});
							} else {
								if (!preview) {
								   userTopic.published = true;
								   userTopic.questions = newQuestions; 
								   userTopic.publishedTopic = user.avatar+'\'s '+userTopic.topic;
								}
								// save questions
								// clear previous preview q
								///
								//let deleteCriteria={$and:[{userTopic:{$eq:req.body._id}}]};
								//if (preview) {
								let    deleteCriteria={$and:[{userTopic:{$eq:ObjectId(req.body._id)}},{isPreview:{$eq:true}}]};
								//}
								db().collection('questions').remove(deleteCriteria).then(function() {
								   // //console.log('CLEANED UP PREVIEW QUESTIONS');
									promises.push(newQuestions.map(function(question,key) {
										if (preview) {
											question.quiz = "Preview "+question.quiz;
											question._id=new ObjectId();
											question.isPreview = true;
											question.access = user._id;
										}
										db().collection('questions').save(question).then(function() {
											////console.log(['saved q',question]);
												//if (preview) {
													//db().collection('questions').remove({$and:[{userTopic:{$eq:req.body._id}},{isPreview:true}]});  
												//} else {
																							  
												   //// db().collection('questions').remove({_id:{$in:Object.values(questionsMap)}});
												//}
										}).catch(function(e) {
											//console.log(['failed saved q',e]);
										});
									}));
									 
									Promise.all(promises).then(function() {
										updateTags(tags);
										updateMnemonics(mnemonics);
										db().collection('multiplechoicequestions').remove({userTopic:{$eq:ObjectId(req.body._id)}}).then(function(delresult) {
											//console.log(['INSERT MC QUESTIONS',mcQuestions])
										    if (mcQuestions && mcQuestions.length > 0) {
												try {
													db().collection('multiplechoicequestions').insertMany(mcQuestions).then(function(ires) {
													//	console.log(['INSERTed MC QUESTIONS',ires])
												
													})
												} catch(e) {
													console.log(['failed saved mc q',e]);
												};
											}
										}).catch(function(e) {
											console.log({'erri1':e});
										});
									});  
									
								
									// save usertopic
									db().collection('userTopics').save(userTopic).then(function(result) {
										////console.log(['saved r',result]);
									}).catch(function(e) {
										 //console.log(['failed saved r',e]);
									});
									//if (preview) {
										//res.send({});
									//} else {
										res.send(userTopic);
									//}
									
								});
							}
						}
						 
						//let id=result.topicId ? ObjectId(result.topicId) : new ObjectId();
						//let topic={_id:id,topic:}
						
					 }).catch(function(e) {
						res.send({'err':e.message});
					})
				 }).catch(function(e) {
					res.send({'err':e.message});
				})
			}).catch(function(e) {
				res.send({'err':e.message});
			});
		} else {
			res.send({message:'Invalid request'});
		}
	})
};


module.exports = initRoutes;
