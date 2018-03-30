var express = require('express');
var router = express.Router();
var utils = require("../utils")
var config = require("../config")
const Papa = require('papaparse')
var ObjectId = require('mongodb').ObjectID;
const get = require('simple-get');

const MongoClient = require('mongodb').MongoClient
let db;
MongoClient.connect(config.databaseConnection, (err, client) => {
  if (err) return console.log(err)
  db = client.db(config.database) 
})

//const database = require('../../oauth/database');


router.post('/import', (req, res) => {
    console.log(['import']);
    let that = this;
    let url = config.masterSpreadsheet;
    // load mnemonics and collate tags, topics
    var request = get(url, function(err,response) {
        if (err) {
            console.log(['e',err]);
            return;
        }
        //console.log(['response',response]);
        Papa.parse(response, {
            'header': true, 
            'complete': function(data) {
                 //console.log(['parse',data]);
                const toImport = {'questions':data.data};
                let json = utils.createIndexes(toImport);
               // console.log(['parsed',data,data.errors,json]);
                
                for (collection in json) {
                  //  console.log(['save collection',collection,Array.isArray(json[collection]),json[collection]]);
                    if (Array.isArray(json[collection])) {
                        console.log(['IMPORT AS ARRAY',collection]);
                        if (collection=="words") {
                            console.log(json[collection]);
                        }
                       let ids=[];
                       for (var a in json[collection]) {
                        if (json[collection][a] && json[collection][a].hasOwnProperty('_id')) {
                            let id = json[collection][a]._id;   
                            ids.push(id);
                            delete json[collection][a]._id;   
                        
                            db.collection(collection).update({_id:ObjectId(id)},{$set:json[collection][a]},{upsert:true}).then(function() {
                                console.log(['done array update']);
                            }).catch(function(e) {
                                console.log(['array update err',e]);
                            });
                        }
                        // cleanup
                        db.collection(collection).find({_id:{$nin:ids}}).toArray().then(function(results) {
                            console.log('DELETE THESE');
                            console.log(results);
                            if (Array.isArray(results)) {
                                results.forEach(function(toDelete) {
                                    db.collection(collection).deleteOne({_id:toDelete._id}).then(function(ok) {
                                        console.log('deleted');
                                    }).catch(function(e) {
                                        console.log(['err',e]);
                                    });
                                });
                            }
                        });
                    }   
                       //let bulk = db.collection(collection).initializeOrderedBulkOp();
                        //for (var a in json[collection]) {
                            //let find={}
                            //if (json[collection][a] && json[collection][a].hasOwnProperty('_id')) {
                                //find._id = json[collection][a]._id;
                            //}
                            //bulk.find(find).upsert().updateOne({
                              //$set: json[collection][a],
                            //});
                        //}
                        //let result = bulk.execute().then(function() {
                            //console.log(['bulk',JSON.stringify(result,undefined,2)]);
                        //});
                        

                        
                       //var ops = []
                        //for (var a in json[collection]) {
                            //let id = json[collection][a]._id;
                            //console.log(id);
                            //delete json[collection][a]._id;
                            //let op = {
                                //updateOne: {
                                    //filter: { _id: new ObjectId(id) },
                                    //update: {
                                        //$set: json[collection][a],
                                        //$setOnInsert: json[collection][a]
                                    //},
                                    //upsert: true
                                //}
                            //};
                            //ops.push(op)
                           //// console.log(['op',JSON.stringify(op)]);
                        //}
                        //console.log(['ops',ops.length]);
                        //let sbulk = db.collections(collection).bulkWrite(ops, function(err,bulk) {
                            //console.log(['done bulk',err,bulk]);
                        //});
                        //console.log(['done bulk',sbulk]);
                        //.then(function(bulk) {
                            //console.log(['done bulk',bulk]);
                        //}).catch(function(e) {
                            //console.log(['err',e]);
                        //});
                       
                        ////console.log([json[collection]]);
                        //for (var a in json[collection]) {
                            //if (json[collection][a] && json[collection][a].hasOwnProperty('_id')) {
                                //let id = json[collection][a]._id;
                                //console.log([id,json[collection][a]]);
                                //var backup = JSON.stringify(json[collection][a]);
                                //db.collection(collection).findOne({_id:id}).then(function (question) {
                                    //console.log(['found',id,json[collection][a],backup]);
                                    //if (question) {
                                        //console.log(['found so update', backup,question]);
                                        //if (json[collection][a]) {
                                            //db.collection(collection).update({_id:question._id},{$set:JSON.parse(backup)});   
                                        //}
                                        
                                    //} else {
                                        //console.log(['insert res',a,json[collection][a]]);
                                        //if (json[collection][a]) {
                                            //db.collection(collection).insert(json[collection][a]).then(function(res) {
                                                    //console.log(['insert res',res]);
                                            //}).catch(function(err) {
                                                //console.log(['insert err',err]);
                                            //});  
                                        //}
                                    //}
                                //}).catch(function(err) {
                                    //console.log(['find err',err]);
                                //});  
                            //} else  {
                                //console.log(['no id',json[collection][a]]);
                            //}
                        //}
                            
                            //if (json[collection][a].hasOwnProperty('_id')) {
                                //let id = json[collection][a]._id;
                                //console.log([id,json[collection][a]]);
                                //db.collection(collection).findOne({_id:id}).then(function (question) {
                                    //if (question) {
                                        //console.log(['found',question.id,question]);
                                    
                                        ////delete json[collection][a]._id;
                                        //console.log('update');
                                        //db.collection(collection).update({_id:question._id},{$set:json[collection][a]});   
                                    //} else {
                                        //console.log(['insert',json[collection][a]]);
                                        ////delete json[collection][a]._id;
                                        //db.collection(collection).insert(json[collection][a]).then(function(res) {
                                                //console.log(['insert res',res]);
                                        //}).catch(function(err) {
                                            //console.log(['update res',err]);
                                        //});   
                                    //}
                                    
                                //}).catch(function(err) {
                                            //console.log(['find err',err]);
                                        //});   ;  
                            //}
                        
                    } else {
                        //console.log('IMPORT AS SINGLE');
                        db.collection(collection).update({_id:json[collection]._id},json[collection],{upsert:true});   
                    }
                }
                  
                //db.collection('questions').dropIndex();
                //db.collection('questions').createIndex({
                    //question: "text"
                    ////,
                    ////interrogative: "text",
                    ////mnemonic: "text",
                    ////answer: "text"
                //});  
                res.send({'message':'Import complete'});
            }
        }) 
    })  
})
//  bulk ops 
//var ops = []
                        //for (var a in json[collection]) {
                            //let id = json[collection][a]._id;
                            //console.log(id);
                            ////delete json[collection][a]._id;
                            //ops.push(
                                //{
                                    //updateOne: {
                                        //filter: { _id: id },
                                        //update: {
                                            //$set: json[collection][a],
                                            //$setOnInsert: json[collection][a]
                                        //},
                                        //upsert: true
                                    //}
                                //}
                            //)

                        //}
                        //console.log(['ops',ops.length]);
                        //db.collections(collection).bulkWrite(ops, { ordered: false }).then(function(bulk) {
                            //console.log(['done bulk',bulk]);
                        //}).catch(function(e) {
                            //console.log(['err',e]);
                        //});

// UPDATE ROUTINE ??
  //for (collection in json) {
                    //console.log(['save collection',collection,Array.isArray(json[collection]),json[collection]]);
                    //if (Array.isArray(json[collection])) {
                        //console.log('IMPORT AS ARRAY');
                        //for (var a in json[collection]) {
                            //console.log(['iMport array row',a,json[collection][a]]);
                           //db.collection(collection).update({_id:json[collection][a]._id},json[collection][a],{upsert:true}).then(function() {
                               //console.log('upated array item');
                           //}).catch(function(e) {
                               //console.log(e);
                           //});    
                        //}
                        ////db.collection(collection).updateMany({_id:},json[collection],{upsert:true});   
                    //} else {
                        //console.log('IMPORT AS SINGLE',json[collection]);
                        //db.collection(collection).update({_id:json[collection]._id},json[collection],{upsert:true}).then(function() {
                               //console.log('upated single');
                           //}).catch(function(e) {
                               //console.log(e);
                           //});    ;   
                    //}
                //}

//db.quizzes.createIndex(
//{
//question: "text",
//interrogative: "text",
//mnemonic: "text",
//answer: "text"
//}
//)  
//db.tags.createIndex(
//{
//question: "text",
//interrogative: "text",
//mnemonic: "text",
//answer: "text"
//}
//)

router.get('/lookups', (req, res) => {
    db.collection('tags').findOne().then(function(tags) {
        db.collection('topics').findOne().then(function(topics) {
            db.collection('tagTopics').findOne().then(function(tagTopics) {
                db.collection('topicTags').findOne().then(function(topicTags) {
                    db.collection('relatedTags').findOne().then(function(relatedTags) {
                        db.collection('words').find().toArray().then(function(words) {
                            delete tags._id;
                            delete topics._id;
                            delete tagTopics._id;
                            delete topicTags._id;
                            delete relatedTags._id;
                            res.send({tags:tags,topics:topics,tagTopics:tagTopics,topicTags:topicTags,relatedTags:relatedTags,words:words});
                        });
                    })
                })
            })
        })
    }).catch(function(e) {
        console.log(e);
        res.send({});
    });

})



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


router.get('/discover', (req, res) => {
   console.log('discoer');
    let orderBy = req.query.orderBy ? req.query.orderBy : 'successRate';
    let sortFilter={};
    let limit = 5;
    sortFilter[orderBy]=-1;
    let user = req.query.user ? req.query.user : null;
    console.log(['disco',orderBy]);
    db.collection('progress').findOne({user:user}).then(function(progress) {
         if (progress && progress.seen) {
            let notThese = [];
            for (var seenId in progress.seen) {
                notThese.push(ObjectId(seenId));
            };
            console.log(['disco NOTHTES',notThese]);
            db.collection('questions').find({'_id': {$nin: notThese}})
            //db.collection('questions').aggregate({$match:{$nin:notThese}})
            .sort(sortFilter).limit(limit).toArray().then(function( questions) {
                console.log(['user res',questions ? questions.length : 0]);    
                res.send({questions:questions});
            })
        } else {
            console.log(['no user']);    
            // NO USER, SHOW BY POPULAR
             db.collection('questions').find({}).sort(sortFilter).limit(limit).toArray().then(function(results) {
                 console.log(['no user res',results ? results.length : 0]);    
                res.send({'questions':results});
            })
        }
    }).catch(function(e) {
        console.log(['e',e]);
        res.send('e '+JSON.stringify(e));
    })
})
  //if (req.query.user && req.query.user.length > 0) {
        //let user = req.query.user;
        //console.log(['discoer',user]);
        //db.collection('questions').aggregate([
           //{ $match : { score : '10' } } ,
           ////{ $match : { _id : '5ab81f45a75fe100687f30e0' } } ,
          ////{ "$match": {  } },
          ////{ "$sort": { "progress.timeScore": -1 } },
          ////{ "$limit": 20 },
          ////{ "$lookup":  {
           ////from: "progress",
           ////let: { question_id: "$_id" },
           ////pipeline: [
              ////{ $match:
                 ////{ $expr:
                    ////{ $and:
                       ////[
                         ////{ $eq: [ "$user",  req.query.user ] },
                       //////  { $eq: [ "$question", "$$question_id" ] }
                       ////]
                    ////}
                 ////}
              ////},
              ////{ $project: { questions: 0, _id: 0 } }
           ////],
           ////as: "progress"
         ////} },
          ////{ "$unwind": "$progress" },
          ////{ "$project": {
            ////"question": 1,
            ////"answer": 1,
            //////"progress.questions": 1,
            //////"progress._id": 1
          ////} }
          
        //]).toArray().then(function(results) {
            //console.log(results);
            //res.send({'ddd':results});
        //}).catch(function(e) {
            //console.log(['e',e]);
            //r(['e',e]);
        //});
        




router.get('/review', (req, res) => {
    let limit=10;
    if (req.query.user && req.query.user.length > 0) {
        db.collection('progress').findOne({user:req.query.user}).then(function(progress) {
            let questions=[];
            if (progress) {
                for (var questionId in progress.seen) {
                    if (!progress.block.hasOwnProperty(questionId)) {
                        const seenTally = progress.seenTally.hasOwnProperty(questionId) ? progress.seenTally[questionId] : 1;
                        if (seenTally > 0) {
                            const successTally = progress.successTally.hasOwnProperty(questionId) ? progress.successTally[questionId] : 0;
                            const seen = progress.seen[questionId];
                            const success = progress.success.hasOwnProperty(questionId) ? progress.success[questionId] : 0;
                            const successRate = progress.successRate.hasOwnProperty(questionId) ? progress.successRate[questionId] : 0;
                            const timeScore = progress.timeScore.hasOwnProperty(questionId) ? progress.timeScore[questionId] : 0;
                            const question = {'successRate':successRate,'timeScore':timeScore,'questionId':questionId};
                            questions.push(question);
                        }
                    }
                }
            
                let orderBy = (req.body.orderBy == 'successRate') ? 'successRate' : 'timeScore'
                questions.sort(function(a,b) {
                    if (a[orderBy] === b[orderBy]) {
                        return 0;
                    } else if (a[orderBy] > b[orderBy]) {
                        return 1;
                    } else {
                        return -1;
                    }
                });
               // console.log(['REVIEW',questions]);
                questions = questions.slice(0,limit);
               // let questionIds = [];
                let questionKeys = [];
                //let indexedQuestions = {};
                //let i = 0;
                questions.forEach(function(question) {
                //    questionIds.push(question.questionId);
                    questionKeys.push(ObjectId(question.questionId));
                //    indexedQuestions[question.questionId] = i;
                //    i++;
                });
                //console.log(['REVIEW',questionKeys]);
                db.collection('questions').find({_id:{$in:questionKeys}}).toArray(function(err,results) {
                    //console.log(['q',err,results]);
                    //res.send({'currentQuestion':'0','currentQuiz':questionIds,'questions':results,indexedQuestions:indexedQuestions});
                    res.send({'questions':results});
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
    let limit = 20;
    let skip = 0;
    if (req.query.limit && req.query.limit > 0) {
        limit = req.query.limit;
    }
    if (req.query.skip && req.query.skip > 0) {
        skip = req.query.skip;
    }
    // tags and topics
   // console.log(['questions request',req.query.search,req.query.technique]);
    if (req.query.search && req.query.search.length > 0) {
        // SEARCH BY technique and text query
        if (req.query.technique && req.query.technique.length > 0) {
            db.collection('questions').find({$text: {$search: req.query.search}, 'mnemonic_technique': req.query.technique}).limit(limit).skip(skip).project({score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        // SEARCH BY text query
        } else {
            db.collection('questions').find({$text: {$search: req.query.search}}).project({score: {$meta: "textScore"}}).limit(limit).skip(skip).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        }
    } else {
        // SEARCH BY technique
        if (req.query.technique && req.query.technique.length > 0) {
            db.collection('questions').find({'mnemonic_technique': req.query.technique}).limit(limit).skip(skip).project({score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        // SEARCH BY topic
        } else  if (req.query.topic && req.query.topic.length > 0) {
            db.collection('questions').find({'quiz': req.query.topic}).limit(limit).skip(skip).sort({question:1}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        // SEARCH BY tag
        } else if (req.query.tag && req.query.tag.length > 0) {
            db.collection('questions').find({'tags': {$regex:req.query.tag}}).limit(limit).skip(skip).sort({question:1}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        } else {
            res.send({'questions':[]});
        //db.collection('questions').find({}).sort({question:1}).toArray(function(err, results) {
          //res.send({'questions':results});
        }
    }
    
})


router.post('/like', (req, res) => {
   // console.log(['like']);
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
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
                    // create a vote
         //           console.log(['like vote']);
                    db.collection('likes').insert({'user':user,question:question}).then(function(inserted) {
           //             console.log(['like inserted']);
                        // collate tally of all likes for this question and save to question.score
                        db.collection('likes').find({question:question}).toArray(function(err, likes) {
             //               console.log(['col likes',likes]);
                            db.collection('questions').update({_id: ObjectId(question)},{$set: {score:likes.length}}).then(function() {
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
        db.collection('progress').findOne({'user':user}).then(function(progress) {
        //    console.log(['block',progress]);
            if (progress) {
                // OK
                progress.block[question] = new Date().getTime();
                db.collection('progress').update({_id:progress._id},progress).then(function() {
          //          console.log(['set block time',progress]);
                    res.send({});
                });
                
            } else {
                  res.send({message:'Invalid request error'});  
            } 
        })
    } else {
        res.send({message:'Invalid request'});
    }
})

function updateQuestionTallies(user,question,tallySuccess=false) {
    //console.log(['update tallies for question',question]);
    db.collection('questions').findOne({_id:ObjectId(question)}).then(function(result) {
         //   console.log(['update res',result]);
            if (result && result._id) {
                //// get success tstamp and seen tstamp for calculations
                //db.collection('seen').find({question:question}).toArray(function( seenResult) {
                    //console.log(['seenResult',seenResult]);
                    //db.collection('successes').find({question:question}).toArray(function( successResult) {
                        //console.log(['successResult',successResult]);
                          let data={};
                          data.seenTally = result.seenTally ? parseInt(result.seenTally,10) + 1 : 1;
                          let successTally = result.successTally ? parseInt(result.successTally,10) + 1 : (tallySuccess?1:0);
                        //  console.log(['tallySuccess',tallySuccess]);
                          //if (tallySuccess) 
                          data.successTally = successTally;
                          data.successRate = data.seenTally > 0 ? successTally/data.seenTally : 0;
                          //console.log(['save question',data]);
                          db.collection('questions').update({_id: question},{$set:data}).then(function(qres) {
                               // console.log(['saved question',qres]);
                          });
                         
                   //});
                //});
                updateUserTallies(user,question,tallySuccess);
            }
    }).catch(function(e) {
        console.log(['update q err',e]);
    });
     
    //db.collection('seen').find({question:question}).toArray(function(err, seens) {
        //console.log(['seen found many to q']);
        //db.collection('successes').find({question:question}).toArray(function(err, successes) {
            //console.log(['seen found successes']);
            //// save to seenTally, successScore
            //let score = successes.length > 0 ? seens.length/successes.length : 0;
            //db.collection('questions').updateOne({_id: ObjectId(question)},{$set:{seenTally:seens.length,successScore:score}});
            //console.log(['seen done']);
            //res.send({});
        //});
    //});
}


function updateUserTallies(user,question,tallySuccess=false) {
  //  console.log(['update user tallies',user,question,tallySuccess]);
     // update user progress stats
  db.collection('progress').findOne({user:user}).then(function(progress) {
      //console.log(['update user tallies prog',progress]);
     let insert=false;
     if (progress) {
         //update
     } else {
         // insert
         insert=true;
         progress = {user:user,'seen':{},'success':{},'seenTally':{},'successTally':{},'successRate':{},'timeScore':{},'block':{},'likes':{}}
     }
     progress.seen[question]=new Date().getTime();
     progress.seenTally[question] = progress.seenTally[question] ? parseInt(progress.seenTally[question],10) : 1;
     if (tallySuccess) {
         progress.success[question]=new Date().getTime();
         progress.successTally[question] = progress.successTally[question] ? parseInt(progress.successTally[question],10) : 1;
     }
     progress.successRate[question] = progress.seenTally[question] ? progress.successTally[question]/progress.seenTally[question] : 0;
     
     // lookup timestamps for timeScore calculation
    db.collection('seen').findOne({question:question,user:user}).then(function( seenResult) {
       // console.log(['seenResult',seenResult]);
        db.collection('successes').findOne({question:question,user:user}).then(function( successResult) {
         //   console.log(['successResult',successResult]);
             // update question progress stats
             let seen = seenResult ? seenResult.timestamp : 0;
             let success = successResult ? successResult.timestamp : 0;
             const time = new Date().getTime();
              var timeDiff = 0;
              if (success > 0) {
                  timeDiff = seen - success;
              } else {
                  timeDiff = time - seen;
              }
              let data={};
              progress.seenTally[question] = progress.seenTally[question]? parseInt(progress.seenTally[question],10) + 1 : 1;
              let successTally=0;
              if (success > 0) {
                  successTally = progress.successTally[question] ? parseInt(progress.successTally[question],10) + 1 : 1 ;
              }
              //console.log(['tallySuccess',tallySuccess]);
              if (tallySuccess) progress.successTally[question] = successTally;
              progress.timeScore[question] = (successTally + timeDiff* 0.00000001)/progress.seenTally[question] ;
              progress.successRate[question] = successTally/progress.seenTally[question];
             // console.log(['save progress',progress,timeDiff]);
             if (insert) {
                 db.collection("progress").insert(progress).then(function() {
                   // console.log(['progress inserted',progress]);  
                    updateUserQuestionProgress(user,question,progress);
                 }).catch(function(e) {
                    console.log(['err',e]);
                });
            } else {
                db.collection("progress").update({user:user},{$set:progress}).then(function() {
                    //console.log(['progress updated',progress]); 
                    updateUserQuestionProgress(user,question,progress);
                 }).catch(function(e) {
                    console.log(['err',e]);
                });
            }
             
        });
    });
     
     
  }).catch(function(e) {
      console.log(['err',e]);
  });
    
}

function updateUserQuestionProgress(user,question,fullProgress) {
    //console.log(['update user question tallies',user,question]);
     // update user progress stats
  db.collection('userquestionprogress').findOne({user:user,question:question}).then(function(foundprogress) {
      //console.log(['update user tallies prog',foundprogress]);
        let progress = {question:question,user:user};
        progress.successRate = fullProgress.successRate[question];
        progress.timeScore = fullProgress.timeScore[question];
         if (!foundprogress) {
        //     console.log(['progress insert',progress]);  
             db.collection("userquestionprogress").insert(progress).then(function() {
          //      console.log(['progress inserted',progress]);  
             }).catch(function(e) {
                console.log(['err',e]);
            });
        } else {
            //console.log(['progress update',progress]);  
            db.collection("userquestionprogress").update({user:user,question:question},{$set:progress}).then(function() {
              //  console.log(['progress updated',progress]); 
             }).catch(function(e) {
                console.log(['err',e]);
            });
        }
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
        db.collection('seen').find({user:user,question:question}).toArray(function(err, result) {
        //    console.log(['seen found',result]);
            if (result.length > 0) {
          //      console.log(['seen update']);
                let ts = new Date().getTime();
                db.collection('seen').update({_id:ObjectId(result[0]._id)},{$set:{timestamp: ts}}).then(function(updated) {
                    updateQuestionTallies(user,question);    
                });
                res.send({});
            } else {
                // create a seen record
            //    console.log(['seen insert']);
                let ts = new Date().getTime();
                db.collection('seen').insert({user:user,question:question,timestamp:ts}).then(function(inserted) {
              //      console.log(['seen inserted']);
                    // collate tally of all seen, calculate success percentage to successScore
                    updateQuestionTallies(user,question);
                });
            }
           
            
            
        })
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
        db.collection('successes').findOne({user:user,question:question}).then(function(result) {
        //    console.log(['found success',result]);
            if (result && result._id) {
          //      console.log(['success update']);
                let ts = new Date().getTime();
                db.collection('successes').update({_id:ObjectId(result._id)},{$set:{timestamp: ts}}).then(function() {
                    updateQuestionTallies(user,question,true);
            //        console.log(['updated']);
                    res.send({message:'OK update'});

                }).catch(function(e) {
                    console.log(e);
                    res.send({});
                });
                
            } else {
              //  console.log(['success insert']);
                let ts = new Date().getTime();
                db.collection('successes').insert({user:user,question:question,timestamp:ts}).then(function(inserted) {
                    updateQuestionTallies(user,question,true);
                });
            }
        })
    } else {
        res.send({message:'Invalid request'});
    }
})


module.exports = router;

