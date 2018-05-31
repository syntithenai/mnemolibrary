var express = require('express');
var router = express.Router();
var utils = require("../utils")
var config = require("../config")
const Papa = require('papaparse')
var ObjectId = require('mongodb').ObjectID;
const get = require('simple-get');
const mustache = require('mustache');

const MongoClient = require('mongodb').MongoClient
let db;
MongoClient.connect(config.databaseConnection, (err, client) => {
  if (err) return console.log(err)
  db = client.db(config.database) 
  // seed topicCollections
    db.collection('topicCollections').find().toArray().then(function(topicCollections) {
        if (topicCollections!= null && topicCollections.length > 0) {
            // OK
            console.log('Topic collections exists');
        } else {
            console.log('Create Topic collections ');
            db.collection ('topicCollections').insertMany(config.topicCollections);
        }
    }).catch(function(e) {
        console.log('Error creating topic collections on init');
        console.log(e);
    });
})

//arn:aws:s3:::mnemolibrary.com

//const database = require('../../oauth/database');



    // 'successTally':{$lt : 4}}  // retire topics after all questions have successTally 4
           
router.get('/recenttopics', (req, res) => {
    if (req.query.user && req.query.user.length > 0) {
        let collatedTopics={};
        db.collection('userquestionprogress').aggregate([
            { $match: {
                    'user': req.query.user 
                
            }},
            { $group: {'_id': "$topic",
                'questions': { $sum: 1 },
                'topic': { $last: "$topic" },
                'successRate': { $avg: "$successRate" },
            }},
            {$sort:{"successRate":1}}
        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            result.toArray().then(function(final) {
                let topics=[];
                final.map(function(val,key) {
                    collatedTopics[val.topic]={_id:val.topic,topic:val.topic,questions:val.questions,successRate:val.successRate}
                    if (val.topic) topics.push({quiz:{$eq:val.topic}});
                });
                console.log(['topics',topics]);
                    //'quiz': {$in:[topics]} ,
                let topicCriteria={}
                if (topics.length > 0) {
                    topicCriteria={$or : topics};
                }
                let criteria={$and:[{access:{$eq:'public'}},topicCriteria]};
                
                db.collection('questions').aggregate([
                    { $match: criteria
                    },
                    { $group: {'_id': "$quiz",
                        'questions': { $sum: 1 },
                        'topic': { '$last': "$quiz" },
                    }}
                ], function (qerr, questionResult) {
                    if (qerr) {
                        console.log(qerr);
                        return;
                    }
                    questionResult.toArray().then(function(questionFinal) {
                        questionFinal.map(function(val,key) {
                            
                            collatedTopics[val.topic].total=val.questions;
                        });
                        
                        console.log(['aggq',collatedTopics]);
                        res.send(Object.values(collatedTopics));
                    });
                })
                
                
            });
            
        });
    } else {
        res.send({});
    }
})

router.get('/usersuccessprogress', (req, res) => {
    if (req.query.user && req.query.user.length > 0) {
        db.collection('userquestionprogress').aggregate([
            { $match: {'user': req.query.user}},
            { $group: {'_id': "$successTally",
                'questions': { $sum: 1 }}},
            
        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            result.toArray().then(function(final) {
                res.send(final);
            });
            
        });
    } else {
        res.send({});
    }
})

//    month: { $month: "$timestamp" }, day: { $dayOfMonth: "$timestamp" }, year: { $year: "$timestamp" } 
                

router.get('/useractivity', (req, res) => {
    console.log('UA',req.query.user);
    if (req.query.user && req.query.user.length > 0) {
        db.collection('seen').aggregate([
            { $match: {'user': req.query.user}},
            { $project: {
                    "timestamp": {
                        "$add": [ new Date(0), "$timestamp" ]
                    },
                 } 
            },
            { $group: {
                _id : {
                   "year": { "$year": "$timestamp" },
                   "month": { "$month": "$timestamp" },
                   "day": { "$dayOfMonth": "$timestamp" },
                },
                'tally': { $sum: 1 }}
            },
            
        ], function (err, result) {
            if (err) {
                console.log(err);
                return;
            }
            result.toArray().then(function(seen) {
                // now success
                db.collection('successes').aggregate([
                    { $match: {'user': req.query.user}},
                    { $project: {
                            "timestamp": {
                                "$add": [ new Date(0), "$timestamp" ]
                            },
                         } 
                    },
                    { $group: {
                        _id : {
                           "year": { "$year": "$timestamp" },
                           "month": { "$month": "$timestamp" },
                           "day": { "$dayOfMonth": "$timestamp" },
                        },
                        'tally': { $sum: 1 }}
                    },
                    
                ], function (err, successresult) {
                if (err) {
                    console.log(err);
                    return;
                }
                successresult.toArray().then(function(success) {
                    res.send({seen:seen,success:success});
                });
            });
        });
    })
    } else {
        
    }
})



router.use('/s3', require('react-s3-uploader/s3router')({
    bucket: "mnemolibrary.com",
    region: 'us-west-2', //optional
    //signatureVersion: 'v4', //optional (use for some amazon regions: frankfurt and others)
    headers: {'Access-Control-Allow-Origin': '*'}, // optional
    ACL: 'private', // this is default
    uniquePrefix: false // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
}));






router.get('/sitemap', (req, res) => {
    var fs = require('fs');
    ROOT_APP_PATH = fs.realpathSync('.'); console.log(ROOT_APP_PATH);
    
    var questionTemplate =  `
            <html>
                <head>
                  <title>{{header}}? - Mnemo's Library</title>
                  <meta charset="UTF-8">
                  <meta name="description" content="{{mnemonic}}">
                  <meta name="keywords" content="{{tags}},mnemonics,trivia,learn,dementia,brain">
                  <meta name="author" content="Captain Mnemo">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body>
                    <div className="card question container" >
                        <h1>Mnemo's Library Loading</h1>
                            <div  style='float: left;' >
                            <br/><br/><br/>
                            <img src='../loading.gif' style="opacity: 0.2"/>
                            
                            </div>
                            <h4 className="card-title">{{header}}?</h4>
                            
                            <div className="card-block answer">
                                <div  className='card-text'><b>Answer</b> <span><pre>{{answer}}</pre></span></div>
                            </div>
                            <div className="card-block mnemonic">
                                <div  className='card-text'><b>Mnemonic</b> <span><pre>{{mnemonic}}</pre></span></div>
                            </div>
                            <div className="card-block link">
                                <a href={question.link} target='_new' >{{link}}</a>
                            </div>
                            <div className="card-block attribution">
                                <div  className='card-text'><b>Attribution/Source</b> <span>{{attribution}}</span></div>
                            </div>
                            
                           <div className="card-block topic">
                                <b>Topic&nbsp;&nbsp;&nbsp;</b> <span>{{quiz}}</span><br/>
                            </div>
                            
                            <div   className="card-block tags" >
                              <b>Tags&nbsp;&nbsp;&nbsp;</b>
                               {{tags}}
                            </div>
                            
                             <script>
                            
                            setTimeout(function() {
                                document.location='http://mnemolibrary.com?question={{id}}'
                            },2500);
                            
                            </script>
                    </div>
                </body>
                </html>
                `;
                
    //var deleteFolderRecursive = function(path) {
      //if (fs.existsSync(path)) {
        //fs.readdirSync(path).forEach(function(file, index){
          //var curPath = path + "/" + file;
          //if (fs.lstatSync(curPath).isDirectory()) { // recurse
            //deleteFolderRecursive(curPath);
          //} else { // delete file
            //fs.unlinkSync(curPath);
          //}
        //});
        //fs.rmdirSync(path);
      //}
    //};
    let criteria={access:{$eq:'public'}};
    db.collection('questions').find(criteria).toArray().then(function(results) {
         //console.log(['no user res',results ? results.length : 0]);  
        let siteMap=[]; 
        //deleteFolderRecursive(ROOT_APP_PATH+"/client/public/cache");
        if (!fs.existsSync(ROOT_APP_PATH+"/client/public/cache")) {
            fs.mkdirSync(ROOT_APP_PATH+"/client/public/cache");
        }
        
        console.log(['queryids',req.query.ids]);
        results.map(function(question,key) {
             siteMap.push(config.protocol+'://'+config.host+'/cache/page_'+question._id+'.html');
             let page = mustache.render(questionTemplate,{id:question._id,header:question.interrogative + ' ' + question.question,answer:question.answer,mnemonic:question.mnemonic,attribution:question.attribution,quiz:question.quiz,tags:question.tags});
             if (req.query.ids) {
                 
                let ids = req.query.ids.split(","); 
                //console.log(ids);
                if (ids.indexOf(String(question._id))!=-1) {
                    console.log(['queryids match',question._id]);
                    if (fs.existsSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html')) {
                        fs.unlinkSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html');
                    }
                    fs.writeFileSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html', page, function(err) {
                        if(err) {
                            return console.log(err);
                        }
                    });                  
                }
             } else {
                 if (fs.existsSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html')) {
                        fs.unlinkSync(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html');
                    }
                
                 fs.writeFile(ROOT_APP_PATH+"/client/public/cache/page_"+question._id+'.html', page, function(err) {
                    if(err) {
                        return console.log(err);
                    }
                });                  
             }
        });  
        if (fs.existsSync(ROOT_APP_PATH+"/client/public/sitemap.txt")) {
            fs.unlinkSync(ROOT_APP_PATH+"/client/public/sitemap.txt");
        }
                   
        fs.writeFile(ROOT_APP_PATH+"/client/public/sitemap.txt", siteMap.join("\n"), function(err) {
            if(err) {
                return console.log(err);
            }
            console.log("Wrote sitemap!");
        }); 

    })
    
});

router.post('/reportproblem', (req, res) => {
    let content='Reported By ' + req.body.user.username + '<br/><br/>' + req.body.problem + '<br/><br/>Question: ' + JSON.stringify(req.body.question);
    db.collection('reportedProblems').save(req.body);
    //console.log(['report',req.body]);
    utils.sendMail(config.mailFrom,config.mailFrom,"Problem Content Report from Mnemo's Library ",content);
    res.send('sent email');
});



router.post('/import', (req, res) => {
  //  console.log(['import']);
    let that = this;
    let url = config.masterSpreadsheet;
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
            'complete': function(data) {
                // console.log(['parse',data]);
                const toImport = {'questions':data.data};
                let json = utils.createIndexes(toImport);
                
                // iterate questions collecting promises and insert/update as required
                let promises=[];
                for (var a in json.questions) {
                 //  console.log([a]); //,json[collection][a]]);
                    if (json.questions[a]) {
                        let record =  json.questions[a];
                        if (!record.successRate) record.successRate = Math.random()/100; // randomisation to get started
                        // remove and restore id to allow update
                        let thePromise = null;
                        // convert to ObjectId or create new 
                        if (json.questions[a].hasOwnProperty('_id')&& String(json.questions[a]._id).length > 0) {
                            record._id = ObjectId(json.questions[a]._id); 
                            if (record.question==="Le Verrier") {
                                console.log(['USe ID',record._id]);
                            } 
                        } else {
                             record._id = ObjectId();  
                             console.log(['NEW ID',record._id]);
                        }
                        thePromise = new Promise(function(resolve,reject) {
                            if (record.question==="Le Verrier") {
                                console.log(['SAVE',record._id,record]);
                            }
                            db.collection('questions').save(record).then(function(resy) {
                                //console.log(['UPDATE']);
                                //let newRecord={_id:record._id,discoverable:record.discoverable,admin_score : record.admin_score,mnemonic_technique:record.mnemonic_technique,tags:record.tags,quiz:record.quiz,access:record.access,interrogative:record.interrogative,prefix:record.prefix,question:record.question,postfix:record.postfix,mnemonic:record.mnemonic,answer:record.answer,link:record.link,image:record.image,homepage:record.homepage}
                                resolve(record._id);
                                
                            }).catch(function(e) {
                                console.log(['array update err',e]);
                                reject();
                            });
                            
                        })   
                        promises.push(thePromise);
                        
                    }
                }
                Promise.all(promises).then(function(ids) {
                    //console.log(['del ids',ids]);
                    // delete all questions that are not in this updated set (except userTopic questions)
                    db.collection('questions').remove({$and:[{_id:{$nin:ids}},{userTopic:{$not:{$exists:true}}}]}).then(function(dresults) {
                       // console.log('DELETEd THESE');
                       // console.log(ids);
                        // update tags
                        //console.log('UPDATE TAGS');
                        //console.log(Object.keys(json.tags));
                        updateTags(json.tags);
                        // create indexes   
                        db.collection('questions').dropIndex();
                        db.collection('questions').createIndex({
                            question: "text",
                            prefix: "text",
                            postfix: "text",
                            interrogative: "text",
                            answer:"text",
                            //mnemonic: "text",
                            //answer: "text"
                        });
                       
                       //db.collection('words').dropIndex();
                        //db.collection('words').createIndex({
                            //text: "text"                    
                        //}); 
                        
                        // sitemap
                       

                        
                        let unparsed = Papa.unparse(json.questions,{quotes: true});
                        res.send(unparsed);
                    });
                    
                    
                    
                    
                });
            }
        });
    })
                
});

router.get('/topiccollections', (req, res) => {
    db.collection('topicCollections').find({}).sort({sort:1}).toArray().then(function(collections) {
        db.collection('userTopics').find({published:{$eq:true}}).sort({updated:-1}).limit(10).toArray().then(function(userTopics) {
            let topics=[];//sort({updated:-1}).
            console.log(['TOPICCOLLES',userTopics]);
            userTopics.map(function(key,val) {
                    topics.push(key.publishedTopic);
            });
            if (topics.length > 0) {
                collections.push({name:'Community',sort:7,topics:topics});
            }
                
            res.send(collections);
        });
    }).catch(function(e) {
        console.log(e);
        res.send({});
    });
});


router.get('/progress', (req, res) => {
    if (req.query.user && req.query.user.length > 0) {
        db.collection('progress').findOne({user:req.query.user}).then(function(progress) {
            res.send(progress);
        }).catch(function(e) {
            console.log(e);
            res.send({});
        });
    } else {
        res.send({});
    }
})


router.post('/discover', (req, res) => {
   // console.log('discover',req.body.user);
    let orderBy = req.body.orderBy ? req.body.orderBy : 'successRate';
    let sortFilter={};
    let limit = 20;
    let criteria = [];
    if (req.body.user) {
        criteria.push({$or:[{access:{$eq:req.body.user}},{access :{$eq:'public'}}]})
    } else {
        criteria.push({access :{$eq:'public'}});
    }
    if (req.body.topic) {
        criteria.push({quiz:{$eq:req.body.topic}});
        orderBy = 'sort';
    }
    criteria.push({discoverable :{$ne:'no'}});
    // question block
    criteria.push({$or:[{block :{$lte:0}},{block :{$exists:false}}]});
    // filtering
    let blockCriteria=[];
    if (req.body.blocks) {
        let blocks = req.body.blocks;
        if (blocks.tag && Array.isArray(blocks.tag)) {
            blocks.tag.forEach(function(tag) {
                blockCriteria.push({'tags': {$nin:[tag]}});
                //blockCriteria.push({'tags': {$regex:tag}});
            });
        }
        if (blocks.topic && Array.isArray(blocks.topic)) {
            blocks.topic.forEach(function(topic) {
                console.log({$ne: topic});
                blockCriteria.push({quiz: {$ne: topic}});
            });
        }
        if (blocks.technique && Array.isArray(blocks.technique)) {
            blocks.technique.forEach(function(technique) {
                console.log({$ne: technique});
                blockCriteria.push({mnemonic_technique: {$ne: technique}});
            });
        }
    }
    //console.log(['BC',blockCriteria]);
    if (blockCriteria.length > 0) {
        blockCriteria.forEach(function(c) {
            criteria.push(c);
        });
        
    }
    sortFilter[orderBy]=-1;
    
    let user = req.body.user ? req.body.user : null;
   // console.log(['discover',orderBy]);
    db.collection('userquestionprogress').find({user:user}).toArray().then(function(progress) {
         if (progress) {
             //console.log(['progress res',progress]);
            let notThese = [];
            for (var seenId in progress) {
                notThese.push(ObjectId(progress[seenId].question));
            };
            
            //for (var seenId in progress.block) {
                //notThese.push(ObjectId(seenId));
            //};
          //  console.log(['disco NOTHTES',notThese]);
            criteria.push({'_id': {$nin: notThese}});
            //console.log(['disco criteria',criteria]);
            db.collection('questions').find({$and:criteria})
            //db.collection('questions').aggregate({$match:{$nin:notThese}})
            .sort(sortFilter).limit(limit).toArray().then(function( questions) {
               //   console.log(['user res',questions ? questions.length : 0,questions]);    
                res.send({questions:questions});
            })
        } else {
            //console.log(['no user']);    
            // NO USER, SHOW BY POPULAR
             db.collection('questions').find({$and:criteria}).limit(limit).toArray().then(function(results) {
                 //console.log(['no user res',results ? results.length : 0]);    
                res.send({'questions':results});
            })
        }
    }).catch(function(e) {
        console.log(['e',e]);
        res.send('e '+JSON.stringify(e));
    })
})

router.get('/review', (req, res) => {
    console.log('review');
    let limit=20;
     let orderBy = (req.query.orderBy == 'successRate') ? 'successRate' : 'timeScore'
     let orderMeBy = {};
     orderMeBy[orderBy] = 1;          
     let criteria=[];
     if (req.query.band && req.query.band.length > 0) {
         if (parseInt(req.query.band,10) > 0) {
             criteria.push({successTally:{$eq:parseInt(req.query.band,10)}});
         } else {
             criteria.push({$or:[{successTally:{$eq:0}},{successTally:{$exists:false}}]});
         }
         
     } 
     //else {
        criteria.push({$or:[{block :{$lte:0}},{block :{$exists:false}}]});
         let oneHourBack = new Date().getTime() - 1800000;
         //criteria.push({seen:{$lt:oneHourBack}});   
         criteria.push({$or:[{seen:{$lt:oneHourBack}},{successTally:{$not:{$gt:0}}}]});   
         
     //}
     criteria.push({user:req.query.user});
     //console.log({seen:{$lt:oneHourBack}});
     if (req.query.user && req.query.user.length > 0) {
         // sort by successTally and then most recently seen first
         console.log(JSON.stringify(criteria));
        db.collection('userquestionprogress').find({$and:criteria}).sort({'successTally':1,'seen':1}).limit(limit).toArray().then(function(questions) {
      //      console.log(questions);
            //let questions=[];
            if (questions) {
                //for (var questionId in progress.seen) {
                    //if (!progress.block.hasOwnProperty(questionId)) {
                        //const seenTally = progress.seenTally.hasOwnProperty(questionId) ? progress.seenTally[questionId] : 1;
                        //if (seenTally > 0) {
                            //const successTally = progress.successTally.hasOwnProperty(questionId) ? progress.successTally[questionId] : 0;
                            //const seen = progress.seen[questionId];
                            //const success = progress.success.hasOwnProperty(questionId) ? progress.success[questionId] : 0;
                            //const successRate = progress.successRate.hasOwnProperty(questionId) ? progress.successRate[questionId] : 0;
                            //const timeScore = progress.timeScore.hasOwnProperty(questionId) ? progress.timeScore[questionId] : 0;
                            //const question = {'successRate':successRate,'timeScore':timeScore,'questionId':questionId};
                            //questions.push(question);
                        //} 
                    //}
                //}
             
                //let orderBy = (req.body.orderBy == 'successRate') ? 'successRate' : 'timeScore'
                //questions.sort(function(a,b) {
                    //if (a[orderBy] === b[orderBy]) {
                        //return 0;
                    //} else if (a[orderBy] > b[orderBy]) {
                        //return 1;
                    //} else {
                        //return -1;
                    //}
                //});
             //  console.log(['REVIEW',questions]);
               // questions = questions.slice(0,limit);
               // let questionIds = [];
                let questionKeys = [];
                let indexedQuestions = {};
                let successAndDateKeyed={};
                let successKeys=[];
                let successDateKeys={};
                //let i = 0;
                questions.forEach(function(question) {
                    successTally = parseInt(question.successTally,10) > 0 ? parseInt(question.successTally,10) : 0;
                    if (!successAndDateKeyed.hasOwnProperty(successTally)) {
                        successAndDateKeyed[successTally]={};
                        successKeys.push(successTally);
                    };
                    let d = new Date(question.seen);
                    let dateKey=d.getDate()+' '+d.getMonth()+' '+d.getFullYear();
                    if (!successAndDateKeyed[successTally].hasOwnProperty(dateKey)) {
                        successAndDateKeyed[successTally][dateKey]=[];
                        if (!successDateKeys.hasOwnProperty(successTally)) {
                            successDateKeys[successTally] = [];
                        }
                        successDateKeys[successTally].push(dateKey);
                    };
                    successAndDateKeyed[successTally][dateKey].push(question);
                //    questionIds.push(question.questionId);
                    questionKeys.push(ObjectId(question.question));
                //    indexedQuestions[question.questionId] = i;
                //    i++;
                });
                let successAndDateOrderedIds=[];
                successKeys.forEach(function(successTally) {
                    //let tallyGroup=
                  //  console.log(successTally,successAndDateKeyed[successTally]);
                    successDateKeys[successTally].forEach(function(day) {
                        let shuffleGroup = successAndDateKeyed[successTally][day];
                        shuffleGroup.sort(function() {
                          return .5 - Math.random();
                        });
                        shuffleGroup.forEach(function(question) {
                            successAndDateOrderedIds.push(ObjectId(question.question));
                        });
                    }); 
                });
 //               }
                
                
                console.log(['REVItEW',successAndDateOrderedIds]);
                db.collection('questions').find({_id:{$in:successAndDateOrderedIds}}).toArray(function(err,results) {
                   // console.log([err,results]);
                    let questionIndex={};
                    results.forEach(function(question) {
                        questionIndex[question._id]=question;
                        //console.log(question._id);
                    });
                    let orderedResults=[];
                    successAndDateOrderedIds.forEach(function(question) {
                        if (questionIndex[question]) {
                            orderedResults.push(questionIndex[question]);   
                        }
                    });
                    console.log(['q',err,orderedResults]);
                    //res.send({'currentQuestion':'0','currentQuiz':questionIds,'questions':results,indexedQuestions:indexedQuestions});
                    res.send({'questions':orderedResults});
                    //res.send({'questions':results});
                })
            } else {
                res.send('Invalid request, no user progress');
            }
        });
    } else {
        res.send({message:'Invalid request'});
    }
})


// search questions
router.get('/questions', (req, res) => {
    console.log('search questions');
    console.log(req.query);
    let limit = 20;
    let skip = 0;
    if (req.query.limit && req.query.limit > 0) {
        limit = req.query.limit;
    }
    if (req.query.skip && req.query.skip > 0) {
        skip = req.query.skip;
    }
    // tags and topics
    let criteria=[];
    if (req.query.user) {
        criteria.push({$or:[{access:{$eq:req.query.user}},{access:{$eq:'public'}}]})
    } else {
        criteria.push({access :{$eq:'public'}});
    }
   // console.log(['questions request',req.query.search,req.query.technique]);
    if (req.query.search && req.query.search.trim().length > 0) {
        // SEARCH BY technique and text query
        criteria.push({$text: {$search: req.query.search.trim()}});
        //criteria.push({question: {$regex: req.query.search.trim().toLowerCase()}});
        if (req.query.technique && req.query.technique.trim().length > 0) {
            criteria.push({'mnemonic_technique': {$eq:req.query.technique.trim()}});
        // SEARCH BY text query
        }
       // console.log(criteria);
        db.collection('questions').find({$and:criteria}).limit(limit).skip(skip).project({score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
          res.send({'questions':results});
        })
    } else {
        // SEARCH BY technique
        if (req.query.technique && req.query.technique.length > 0) {
            criteria.push({'mnemonic_technique': {$eq:req.query.technique}});
            db.collection('questions').find({$and:criteria}).limit(limit).skip(skip).project({score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        // SEARCH BY topic
        } else  if (req.query.topic && req.query.topic.length > 0) {
            //console.log(['topic search',req.query.topic,{'quiz': {$eq:req.query.topic}}]);
            let topic = req.query.topic.trim(); //.toLowerCase(); 
            criteria.push({'quiz': {$eq:topic}});
          //  console.log(['topic search C    ',criteria]);
            db.collection('questions').find({$and:criteria}).sort({sort:1}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        // SEARCH BY tag
        } else if (req.query.tag && req.query.tag.length > 0) {
            if (req.query.tag) { 
                let tag = req.query.tag.trim().toLowerCase(); 
                criteria.push({'tags': {$in:[tag]}});
              //  console.log(['search by tag',criteria,tag]);
                db.collection('questions').find({$and:criteria}).limit(limit*10).skip(skip).sort({question:1}).toArray(function(err, results) {
                //    console.log(['search by tag res',results]);
                  res.send({'questions':results});
                })
            }
        // search by question (return single element array
        } else if (req.query.question && req.query.question.length > 0) {
            if (req.query.question) { 
                let question = req.query.question.trim().toLowerCase(); 
                criteria.push({'_id': ObjectId(question)});
               // console.log(['search by id',criteria,question]);
                db.collection('questions').find({$and:criteria}).limit(limit).skip(skip).sort({question:1}).toArray(function(err, results) {
                 //   console.log(['search by id res',results]);
                    res.send({'questions':results});
                })
            }
        } else {
            res.send({'questions':[]});
        //db.collection('questions').find({}).sort({question:1}).toArray(function(err, results) {
          //res.send({'questions':results});
        }
    }
    
})


router.post('/like', (req, res) => {
   // console.log(['like']);
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0  && req.body.mnemonic && String(req.body.mnemonic).length > 0 ) {
      //  console.log(['ok']);
        let user = req.body.user;
        let question = req.body.question;
        db.collection('question').findOne({'_id':ObjectId(question)}).then(function(theQuestion) {
     //       console.log(['like',question,theQuestion]);
            //let startScore = theQuestion && theQuestion.score ? parseInt(theQuestion.score) : 0;
            db.collection('likes').find({'user':user,question:question}).toArray(function(err, results) {
                if (results.length > 0) {
                    // OK
       //             console.log(['like found existing so ignore']);
                    res.send({});
                } else {
                    // create a votet
         //           console.log(['like vote']);
                    db.collection('likes').insert({'user':user,question:question,mnemonic:req.body.mnemonic}).then(function(inserted) {
           //             console.log(['like inserted']);
                        // collate tally of all likes for this question and save to question.score
                        db.collection('likes').find({question:question}).toArray(function(err, likes) {
                           // console.log(['col likes',likes]);
                            let newScore=0;
                            if (likes && likes.length > 0) {
                                newScore=likes.length;
                            }
                            if (question && question.admin_score && parseFloat(question.admin_score) > 0) {
                                newScore =newScore + parseFloat(question.admin_score)/2;
                            }
                          //  console.log(['like new score',newScore]);
                            db.collection('questions').update({_id: ObjectId(question)},{$set: {score:newScore}}).then(function() {
               //                 console.log(['like final']);
                                res.send({message:'Thanks for your like'});
                            });
                            
                        });
                    }).catch(function(e) {
                        console.log(e);
                      res.send({message:'Invalid request error'});  
                    });
                } 
                
            })
        })
    } else {
        res.send({message:'Invalid request'});
    }
})


router.post('/block', (req, res) => {
    //console.log(['block']);
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
      //  console.log(['block ok']);
        let user = req.body.user;
        let question = req.body.question;
        db.collection('userquestionprogress').findOne({'user':user,question:req.body.question}).then(function(progress) {
        //    console.log(['block',progress]);
            if (progress) {
                // OK
                progress.block = new Date().getTime();
                progress.topic = req.body.topic;
                db.collection('userquestionprogress').update({_id:progress._id},progress).then(function() {
          //          console.log(['set block time',progress]);
                    res.send({});
                });
                
            } else {
                  progress = {'user':user,question:req.body.question};
                  progress.block = new Date().getTime();
                  progress.topic = req.body.topic;
                  db.collection('userquestionprogress').save(progress).then(function() {
          //          console.log(['set block time',progress]);
                    res.send({});
                });
//                  res.send({message:'Invalid request error'});  
            } 
        })
    } else {
        res.send({message:'Invalid request'});
    }
})

// update question stats into the questions collection
function updateQuestionTallies(user,question,tallySuccess=false) {
    db.collection('questions').findOne({_id:ObjectId(question)}).then(function(result) {
            if (result && result._id) {
                let data={};
                data.seenTally = result.seenTally ? parseInt(result.seenTally,10) + 1 : 1;
                let successTally = result.successTally ? parseInt(result.successTally,10) + 1 : (tallySuccess?1:0);
                data.successTally = successTally;
                data.successRate = data.seenTally > 0 ? successTally/data.seenTally : 0;
                db.collection('questions').update({_id: question},{$set:data}).then(function(qres) {
                   // console.log(['saved question',qres]);
                });
                updateUserQuestionProgress(user,question,result.quiz,tallySuccess);
            }
    }).catch(function(e) {
        console.log(['update q err',e]);
    });
     

}

// update per user progress stats into the userquestionprogress collection
function updateUserQuestionProgress(user,question,quiz,tallySuccess) {
    db.collection('userquestionprogress').findOne({user:user,question:question}).then(function(progress) {
        if (!progress) progress = {user:user,question:question};
        progress.topic=quiz;
        progress.seenTally = progress.seenTally ? parseInt(progress.seenTally,10) + 1 : 1;
        progress.seen = new Date().getTime();
        if (tallySuccess) {
            progress.successTally = progress.successTally ? parseInt(progress.successTally,10) + 1 : 1;
            progress.success = progress.seen;
        }
        progress.successRate = (parseInt(progress.successTally,10) > 0 && parseInt(progress.seenTally,10) > 0) ? progress.successTally/progress.seenTally : 0;
        progress.block=0;
        db.collection('userquestionprogress').save(progress).then(function() {
            //if (tallySuccess) {
                //// the seen and successes collections contain a single record per user/question containing the last seen/success date as a timestamp integer
                //db.collection('seen').findOne({question:question,user:user}).then(function( seenResult) {
                    //db.collection('successes').findOne({question:question,user:user}).then(function( successResult) {
                        //let seen = seenResult ? seenResult.timestamp : 0;
                        //let success = successResult ? successResult.timestamp : 0;
                        //const time = new Date().getTime();
                        //var timeDiff = 0;
                        //if (success > 0) {
                            //timeDiff = seen - success;
                        //} else {
                            //timeDiff = time - seen;
                        //}
                        //let data={};
                        //// integrate success rate and time between seen and success
                        ////progress.timeScore = (parseInt(progress.successTally,10) > 0 && parseInt(progress.seenTally) > 0) ? (progress.successTally + timeDiff* 0.00000001)/progress.seenTally : 0;
                        //progress.timeScore = progress.successRate;
                        //db.collection('userquestionprogress').save(progress).then(function(sres) {
                               ////console.log(['saved again',sres]);
                        //}).catch(function(e) {
                                //console.log(['err',e]);
                        //});
                        
                    //}).catch(function(e) { 
                        //console.log(['err',e]);
                    //});
                //}).catch(function(e) {
                    //console.log(['err',e]);
                //});
            //}
            });
    
  }).catch(function(e) {
      console.log(['err',e]);
  });
    
}



router.post('/seen', (req, res) => {
    //console.log(['seen',req.body]);
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
      //  console.log(['seen ok']);
        let user = req.body.user;
        let question = req.body.question;
        //db.collection('seen').find({user:user,question:question}).toArray(function(err, result) {
        ////    console.log(['seen found',result]);
            //if (result.length > 0) {
          ////      console.log(['seen update']);
                //let ts = new Date().getTime();
                //db.collection('seen').update({_id:ObjectId(result[0]._id)},{$set:{timestamp: ts}}).then(function(updated) {
                    //updateQuestionTallies(user,question);    
                    //res.send('updated');
                //}).catch(function(e) {
                    //res.send('error on update');
                //});
            //} else {
                // create a seen record
            //    console.log(['seen insert']);
                let ts = new Date().getTime();
                db.collection('seen').insert({user:user,question:question,timestamp:ts}).then(function(inserted) {
              //      console.log(['seen inserted']);
                    // collate tally of all seen, calculate success percentage to successScore
                    updateQuestionTallies(user,question);
                    res.send('inserted');
                }).catch(function(e) {
                    res.send('error on insert');
                });
         //   }
           
            
            
       // });
    } else {
        res.send({message:'Invalid request'});
    }
})


router.post('/success', (req, res) => {
    //console.log(['success']);
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
        let user = req.body.user;
        let question = req.body.question;
      //  console.log(['success']);
       // db.collection('successes').findOne({user:user,question:question}).then(function(result) {
        //    console.log(['found success',result]);
            //if (result && result._id) {
          ////      console.log(['success update']);
                //let ts = new Date().getTime();
                //db.collection('successes').update({_id:ObjectId(result._id)},{$set:{timestamp: ts}}).then(function() {
                    //updateQuestionTallies(user,question,true);
            ////        console.log(['updated']);
                    //res.send('updated');

                //}).catch(function(e) {
                    //console.log(e);
                    //res.send('err on update');
                //});
                
            //} else {
              //  console.log(['success insert']);
                let ts = new Date().getTime();
                db.collection('successes').insert({user:user,question:question,timestamp:ts}).then(function(inserted) {
                    updateQuestionTallies(user,question,true);
                    res.send('inserted');
                }).catch(function(e) {
                    console.log(e);
                    res.send('err on insert');
                });;
          //  }
        //}).catch(function(e) {
            //console.log(e);
            //res.send('err on find');
        //});
    } else {
        res.send({message:'Invalid request'});
    }
})

router.post('/savemnemonic', (req, res) => {
 //   console.log(['seen',req.body]);
    if (req.body.user && req.body.question && req.body.mnemonic && req.body.mnemonic.length > 0) {//   && req.body.technique  && req.body.questionText ) {
        let user = req.body.user;
        let question = req.body.question;
        let id = req.body._id ? ObjectId(req.body._id) : new ObjectId();
        let toSave = {_id:id,user:req.body.user,question:req.body.question,mnemonic:req.body.mnemonic,questionText:req.body.questionText,technique:req.body.technique};
        db.collection('mnemonics').save(toSave).then(function(updated) {
            res.send('updated');
        }).catch(function(e) {
            res.send('error on update');
        });
    } else {
        res.send({message:'Invalid request'});
    }
})

router.post('/mnemonics', (req, res) => {
//    console.log(['mnemonics',req.body.question]);
    if (req.body.question && req.body.question.length > 0) {
        let promises=[];
        db.collection('mnemonics').find({question:req.body.question}).toArray(function(err, result) {
            //result.map(function(key,mnemonic));
//            console.log(['mnemonics found',result]);
            res.send(result);
        });
    } else {
        res.send({message:'Invalid request'});
    }
})

router.post('/mymnemonics', (req, res) => {
    //console.log(['seen',req.body]);
    if (req.body.user && req.body.user.length > 0) {
        db.collection('mnemonics').find({user:req.body.user}).toArray(function(err, result) {
            res.send(result);
        });
    } else {
        res.send({message:'Invalid request'});
    }
})

router.post('/deletemnemonic', (req, res) => {
    if (req.body._id && req.body._id.length > 0) {
        db.collection('mnemonics').remove({_id:ObjectId(req.body._id)}).then(function(result) {
            res.send(result);
        });
    } else {
        res.send({message:'Invalid request'});
    }
})

router.post('/saveusertopic', (req, res) => {
    //let body=JSON.parse(req.body);
    //res.send({message:req.body});
    let body=req.body;
//    console.log(['SAVEUSERTOP',body]);
    if (body.user  && body.questions && body.topic) {
        let id = body._id && String(body._id).length > 0 ? new ObjectId(body._id) : new ObjectId();
        let user = body.user;
        let questions = body.questions;
        let toSave = {_id:id,user:user,questions:questions,topic:body.topic,publishedTopic:body.publishedTopic};
        toSave.updated=new Date().getTime();
//        console.log(['saveusertopic']);
//        console.log([toSave]);
        // validation info
        let errors={};
        questions.map(function(question,key) {
            if (question.mnemonic.length === 0) {
                if (!errors.hasOwnProperty(key)) errors[key]=[];
                errors[key].push('mnemonic');
            }
            if (question.answer.length === 0) {
                if (!errors.hasOwnProperty(key)) errors[key]=[];
                errors[key].push('answer');
            }
            if (question.question.length === 0) {
                if (!errors.hasOwnProperty(key)) errors[key]=[];
                errors[key].push('question');
            }
            //if (question.tags.length === 0) {
                //if (!errors.hasOwnProperty(key)) errors[key]=[];
                //errors[key].push('tags');
            //}

        });
        if (req.body.deleteQuestion && String(req.body.deleteQuestion).length > 0) {
            db.collection('questions').remove({_id:ObjectId(req.body.deleteQuestion)}).then(function(result) {
                console.log(['deleted question',result]);
                
            }).catch(function(err) {
//                console.log(['save usertopic ERR',err]);
            });
        }
        
        db.collection('userTopics').save(toSave).then(function(result) {
//            console.log(['saved usertopic',result]);
            res.send({id:id,errors:errors});
        }).catch(function(err) {
            console.log(['save usertopic ERR',err]);
            res.send({message:'Invaddlid request ERR'});
        });
        
        
    } else {
        res.send({message:'Invaddlid request'});
    }
})


router.post('/myusertopics', (req, res) => {
    //console.log(['seen',req.body]);
    if (req.body.user && req.body.user.length > 0) {
  //      console.log('MUT');
  //      console.log(db);
        db.collection('userTopics').find({user:req.body.user}).sort({topic:1}).toArray(function(err, result) {
            res.send(result);
        });
    } else {
        res.send({message:'Invalid request'});
    }
})

router.post('/usertopic', (req, res) => {
    //console.log(['usrtop',req.body]);
    if (req.body._id && req.body._id.length > 0) {
        db.collection('userTopics').findOne({_id:ObjectId(req.body._id)}).then(function(result) {
            res.send(result);
        }).catch(function(e) {
            res.send({'err':e});
        });
    } else {
        res.send({message:'Invalid request'});
    }
})

router.get('/tags', (req, res) => {
    //console.log(['usrtop',req.query]);
    //if (req.body.title && req.body.title.length > 0) {
        //criteria[]
    //}
    let search=req.query.title.trim();   
    let sort= {value:1};
    if (req.query.sort && req.query.sort.length > 0) {
        sort={};
        sort[req.query.sort] = 1;
    }
    let criteria={};
    if (search.length > 0) {
        criteria={$text: {$search: search}}
    }
    db.collection('words').find(criteria).sort(sort).limit(200).toArray().then(function(results) {
          let final=[];
          //console.log(results);
          results.map(function(key,val) {
      //          console.log([search,key,val]);
                if (search && search.length > 0) {
                    if (key.text.indexOf(search) >= 0) {
                        final.push(key);
                    }
                } else {
                    final.push(key);
                }
            });
            res.send(final);
    }).catch(function(e) {
        res.send({'err':e});
    });
    //} else {
        //res.send({message:'Invalid request'});
    //}
})

router.get('/topics', (req, res) => {
    //console.log(['topics',req.body]);
    let search = req.query.title;
    //if (req.body._id && req.body._id.length > 0) {
        db.collection('questions').distinct('quiz').then(function(results) {
            let final={};
            results.map(function(key,val) {
      //          console.log([search,key,val]);
                if (search && search.length > 0 && key.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
                    final[key]=1;
                } 
            });
            res.send(final);
        }).catch(function(e) {
            res.send({'err':e.message});
        });
    //} else {
        //res.send({message:'Invalid request'});
    //}
})

function updateTags(tags) {
    //console.log(['UPDATETAGS']);
    //console.log(tags);
    Object.keys(tags).map(function(tag,key) {
      //  console.log(['UPDATETAGS matching']);
        let criteria=[];
        criteria.push({'tags': {$in:[tag]}});
        //console.log(criteria);
        db.collection('questions').find({$and:criteria}).toArray().then(function(result) {
                //console.log(['UPDATETAGS found']);
                //console.log(result);
                if (result.length > 0) {
                    //console.log('UPDATETAGS found questions');
                    db.collection('words').findOne({text:{$eq:tag}}).then(function(word) {
                        //console.log('UPDATETAGS UPDATED WORD');
                        //console.log(word);
                        if (word) {
                            //console.log('UPDATETAGS UPDATED');
                            word.value=result.length;
                            db.collection('words').save(word).then(function(saveres) {
                              //      console.log('UPDATETAGS TAG');
                                    //console.log(saveres);
                            });                            
                        } else {
                            db.collection('words').save({'text':tag,value:result.length}).then(function(saveres) {
                                //    console.log('UPDATETAGS TAG NEW');
                                   // console.log(saveres);
                            });                            
                        }
                    });
                } else {
                    db.collection('words').remove({text:{$eq:tag}}).then(function(word) {
                        //console.log('UPDATETAGS REMOVED TAG');
                    });
                }
         });
    });
}


router.post('/unpublishusertopic', (req, res) => {
    //console.log(['del usrtop',req.body]);
    if (req.body._id && req.body._id.length > 0) {
        
        db.collection('userTopics').findOne({_id:ObjectId(req.body._id)}).then(function(result) {
           if (result) {
                let tags={};
                       
      //          console.log(['NOW delete related q',questionsToDelete]);
               db.collection('questions').find({userTopic:{$eq:req.body._id}}).toArray().then(function(questions) {
        //            console.log(['delete related q',questionsToDelete]);
                           if (Array.isArray(questions)) {
                               questions.map(function(question,key) {
                                   if (Array.isArray(question.tags)) {
                                       question.tags.map(function(tag,key) {
                                           tags[tag]=1;
                                       });
                                   }
                               });
                                db.collection('questions').remove({userTopic:{$eq:req.body._id}}).then(function(delresult) {
                                   updateTags(tags);
                                }).catch(function(e) {
                                    console.log({'erri1':e});
                                });
                           } 
                
                
                       
                }).catch(function(e) {
                    console.log({'erri1':e});
                });
                result.published=false;
                db.collection('userTopics').save(result);
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
    //console.log(['del usrtop',req.body]);
    if (req.body._id && req.body._id.length > 0) {
        
        db.collection('userTopics').findOne({_id:ObjectId(req.body._id)}).then(function(result) {
           if (result) {
                let tags={};
                       
      //          console.log(['NOW delete related q',questionsToDelete]);
               db.collection('questions').find({userTopic:{$eq:req.body._id}}).toArray().then(function(questions) {
        //            console.log(['delete related q',questionsToDelete]);
                           if (Array.isArray(questions)) {
                               questions.map(function(question,key) {
                                   if (Array.isArray(question.tags)) {
                                       question.tags.map(function(tag,key) {
                                           tags[tag]=1;
                                       });
                                   }
                               });
                                db.collection('questions').remove({userTopic:{$eq:req.body._id}}).then(function(delresult) {
                                   updateTags(tags);
                                    db.collection('userTopics').remove({_id:ObjectId(req.body._id)}).then(function(delresult) {
                              //          console.log(result);
                                    }).catch(function(e) {
                                        console.log({'erri2':e});
                                    });
                                   
                                }).catch(function(e) {
                                    console.log({'erri1':e});
                                });
                           } 
                
                
                       
                }).catch(function(e) {
                    console.log({'erri1':e});
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
    //console.log(['pub usrtop',req.body]);
    let preview=req.body.preview;
    let tags={}
                         
    if (req.body._id && req.body._id.length > 0) {
        db.collection('userTopics').findOne({_id:ObjectId(req.body._id)}).then(function(userTopic) {
            db.collection('users').findOne({_id:ObjectId(userTopic.user)}).then(function(user) {
                db.collection('questions').find({$and:[{userTopic:{$eq:req.body._id}},{isPreview:{$eq:false}}]}).toArray().then(function(questions) {
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
          //                  console.log(['PUBLISH',question,key]);
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
                                question.access="public";
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
                                        
                            question.updated=new Date().getTime();
                            question.user=user._id;
                            question.userQuestion=true;
                            question.userTopic=req.body._id;
                             if (Array.isArray(question.tags)) {
                                   question.tags.map(function(tag,key) {
                                       tags[tag]=1;
                                   });
                               }
                            if (question.mnemonic.length === 0) {
                                if (!errors.hasOwnProperty(key)) errors[key]=[];
                                errors[key].push('mnemonic');
                            }
                            //if (question.interrogative.length === 0) {
                                //if (!errors.hasOwnProperty(key)) errors[key]=[];
                                //errors[key].push('interrogative');
                            //}
                            if (question.question.length === 0) {
                                if (!errors.hasOwnProperty(key)) errors[key]=[];
                                errors[key].push('question');
                            }
                            if (question.answer.length === 0) {
                                if (!errors.hasOwnProperty(key)) errors[key]=[];
                                errors[key].push('answer');
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
                            }
                            // save questions
                            // clear previous preview q
                            ///
                            //let deleteCriteria={$and:[{userTopic:{$eq:req.body._id}}]};
                            //if (preview) {
                            let    deleteCriteria={$and:[{userTopic:{$eq:req.body._id}},{isPreview:{$eq:true}}]};
                            //}
                            db.collection('questions').remove(deleteCriteria).then(function() {
                                console.log('CLEANED UP PREVIEW QUESTIONS');
                                promises.push(newQuestions.map(function(question,key) {
                                    if (preview) {
                                        question.quiz = "Preview "+question.quiz;
                                        question._id=new ObjectId();
                                        question.isPreview=true;
                                        question.access=user.username;
                                    }
                                    db.collection('questions').save(question).then(function() {
                                        console.log(['saved q',question]);
                                            //if (preview) {
                                                //db.collection('questions').remove({$and:[{userTopic:{$eq:req.body._id}},{isPreview:true}]});  
                                            //} else {
                                                                                          
                                               //// db.collection('questions').remove({_id:{$in:Object.values(questionsMap)}});
                                            //}
                                    }).catch(function(e) {
                                        console.log(['failed saved q',e]);
                                    });
                                }));
                                 
                                Promise.all(promises).then(function() {
                                    updateTags(tags);
                                });  
                                // save usertopic
                                db.collection('userTopics').save(userTopic).then(function(result) {
                                    console.log(['saved r',result]);
                                }).catch(function(e) {
                                    console.log(['failed saved r',e]);
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




module.exports = router;
    
