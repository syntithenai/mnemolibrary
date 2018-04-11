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
        // clear and reimport topicCollections
        
        //console.log(['response',response]);
        Papa.parse(response, {
            'header': true, 
            'complete': function(data) {
                 console.log(['parse',data]);
                const toImport = {'questions':data.data};
                let json = utils.createIndexes(toImport);
                console.log(['parsed',data.errors,json]);
                       
                for (collection in json) {
                    //console.log(['save collection',collection,Array.isArray(json[collection]),json[collection]]);
                    if (Array.isArray(json[collection])) {
                        console.log(['IMPORT AS ARRAY '+collection ]);
                        //if (collection=="words") {
                            //console.log(json[collection]);
                        //}
                       let promises=[];
                       let questionPromises=[];
                       for (var a in json[collection]) {
                         //  console.log([a]); //,json[collection][a]]);
                            if (json[collection][a]) {
                                let record =  json[collection][a];
                                if (collection === "questions") {
                                    record.successRate = Math.random()/100; // randomisation to get started
                                    console.log(['IMPORT',record]);
                          
                                }
                                if (record.tags) {
                                  let aTags = record.tags.trim().toLowerCase().split(',');
                                  let nTags = [];
                                  aTags.forEach(function(aTag) {
                                      nTags.push(aTag.trim());
                                  });
                                  record.tags=nTags;
                                }
                                console.log(record.tags);
                                // remove and restore id to allow update
                                let thePromise = null;
                                if (json[collection][a].hasOwnProperty('_id')&& json[collection][a]._id.length > 0) {
                                    let id = json[collection][a]._id;  
                                    delete record._id;
                                    thePromise = new Promise(function(resolve,reject) {
                                        db.collection(collection).update({_id:ObjectId(id)},{$set:record},{upsert:true}).then(function(resy) {
                                            console.log(['UPDATE']);
                                            let newRecord={_id:id,discoverable:record.discoverable,admin_score : record.admin_score,mnemonic_technique:record.mnemonic_technique,tags:record.tags,quiz:record.quiz,access:record.access,interrogative:record.interrogative,prefix:record.prefix,question:record.question,postfix:record.postfix,mnemonic:record.mnemonic,answer:record.answer,link:record.link,image:record.image,homepage:record.homepage}
                                            resolve(newRecord);
                                            
                                        }).catch(function(e) {
                                            console.log(['array update err',e]);
                                            reject();
                                        });
                                        
                                    })   
                                } else {
                                    thePromise = new Promise(function(resolve,reject) {
                                        db.collection(collection).insert(record).then(function(resy) {
                                            console.log(['INSERT']);
                                            let newRecord={_id:resy.insertedIds[0],discoverable:record.discoverable,admin_score : record.admin_score,mnemonic_technique:record.mnemonic_technique,tags:record.tags,quiz:record.quiz,access:record.access,interrogative:record.interrogative,prefix:record.prefix,question:record.question,postfix:record.postfix,mnemonic:record.mnemonic,answer:record.answer,link:record.link,image:record.image,homepage:record.homepage}
                                            resolve(newRecord);
                                            
                                        }).catch(function(e) {
                                            console.log(['array update err',e]);
                                            reject();
                                        });;
                                    })
                                }
                                
                                if (collection === "questions") {
                                    questionPromises.push(thePromise);
                                } else {
                                    promises.push(thePromise);
                                }
                                
                            }
                        }
                       console.log(['STARTED UPDATES',promises,questionPromises]);
                        // cleanup 
                            // TODO warning problem here if ever loading multiple sheets
                        let b = function (collection) {
                            if (promises.length > 0) {
                                console.log('othr promises' + collection);
                                Promise.all(promises).then((dresults) => {
                                    let ids = [];
                                    dresults.forEach(function(result) {
                                        ids.push(result._id);
                                    });
                                    
                                    console.log(['del ids',collection,ids]);
                                    db.collection(collection).find({_id:{$nin:ids}}).toArray().then(function(dresults) {
                                        console.log('DELETE THESE');
                                        console.log(dresults);
                                        if (Array.isArray(dresults)) {
                                            dresults.forEach(function(toDelete) {
                                                db.collection(collection).deleteOne({_id:toDelete._id}).then(function(ok) {
                                                    console.log('deleted');
                                                }).catch(function(e) {
                                                    console.log(['err',e ]);
                                                });
                                            });
                                        }
                                    });
                                });
                            }
                        }
                        b(collection);
                        

                        // question promises - delete and download
                        if (questionPromises.length > 0) {
                             Promise.all(questionPromises)
                              .then((results) => {
                          //      console.log("All prom done", results);
                                let ids = [];
                                results.forEach(function(result) {
                                    ids.push(result._id);
                                });
                                 // cleanup 
                                // TODO warning problem here if ever loading multiple sheets
                                //db.collection(collection).find({_id:{$nin:ids}}).toArray().then(function(dresults) {
                                    //console.log('DELETE THESE');
                                    //console.log(dresults);
                                    //if (Array.isArray(dresults)) {
                                        //dresults.forEach(function(toDelete) {
                                            //db.collection(collection).deleteOne({_id:toDelete._id}).then(function(ok) {
                                                //console.log('deleted');
                                            //}).catch(function(e) {
                                                //console.log(['err',e ]);
                                            //});
                                        //});
                                    //}
                                //});

                                
                                //res.set({"Content-Disposition":"attachment; filename=questions2.csv"});
                                let unparsed = Papa.unparse(results,{quotes: true});
                                //unparsed='sssss';
                            //    console.log('papa');
                               // console.log(csvQuestions);
                              //  console.log(unparsed);
                                res.send(unparsed);
                              })
                              .catch((e) => {
                                  console.log(e);
                                  // Handle errors here
                              });   
                        }
                      

                    
                      
                  
                        
                    } else {
                        console.log('IMPORT AS SINGLE'+collection);
                        db.collection(collection).update({_id:json[collection]._id},json[collection],{upsert:true}).then(function(res) {
                                if (res.result && res.result.upserted && Array.isArray(res.result.upserted) && res.result.upserted.length > 0) {
                                //    console.log(['done array update',res.result.upserted[0]._id]);
                                    //csvQuestions.push({_id:res.result.upserted[0]._id}.assign(json[collection]));
                                    //let data = json[collection];
                                    //data._id = res.result.upserted[0]._id;
                                    //let thePromise = new Promise((resolve) => {resolve(data)});
                                    //allPromises.push(thePromise);
                                }
                                
                            }).catch(function(e) {
                                console.log(['obj update err',e]);
                            });;   
                    }
                }
                console.log('NOW CREATE INDEXES FOR QUESTIONS TEXT');
                  
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
               
                
                //res.send({'message':'Import complete'});
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

router.get('/topiccollections', (req, res) => {
    db.collection('topicCollections').find({}).sort({sort:1}).toArray().then(function(collections) {
        res.send(collections);
    }).catch(function(e) {
        console.log(e);
        res.send({});
    });
});

router.get('/lookups', (req, res) => {
    db.collection('tags').findOne().then(function(tags) {
        db.collection('topics').findOne().then(function(topics) {
            db.collection('tagTopics').findOne().then(function(tagTopics) {
                db.collection('topicTags').findOne().then(function(topicTags) {
                    db.collection('relatedTags').findOne().then(function(relatedTags) {
                        db.collection('words').find().toArray().then(function(words) {
                           // db.collection('contentPages').find().toArray().then(function(contentPages) {
                                if (tags) delete tags._id;
                                if (topics) delete topics._id;
                                if (tagTopics) delete tagTopics._id;
                                if (topicTags) delete topicTags._id;
                                if (relatedTags) delete relatedTags._id;
                                res.send({tags:tags,topics:topics,tagTopics:tagTopics,topicTags:topicTags,relatedTags:relatedTags,words:words});
                            //}).catch(function(e) {
                            //console.log(e);
                            //});
                        }).catch(function(e) {
                            console.log(e);
                        });
                    }).catch(function(e) {
                        console.log(e);
                    });
                }).catch(function(e) {
                    console.log(e);
                });
            }).catch(function(e) {
                console.log(e);
            });
        }).catch(function(e) {
            console.log(e);
        });
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


router.post('/discover', (req, res) => {
    console.log('discover',req.body.user);
    let orderBy = req.body.orderBy ? req.body.orderBy : 'successRate';
    let sortFilter={};
    let limit = 20;
    let criteria = [];
    if (req.body.user) {
        criteria.push({$or:[{access:{$eq:req.body.user}},{access :{$eq:'public'}}]})
    } else {
        criteria.push({access :{$eq:'public'}});
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
    console.log(['BC',blockCriteria]);
    if (blockCriteria.length > 0) {
        blockCriteria.forEach(function(c) {
            criteria.push(c);
        });
        
    }
    sortFilter[orderBy]=1;
    
    let user = req.body.user ? req.body.user : null;
    console.log(['discover',orderBy]);
    db.collection('userquestionprogress').find({user:user}).sort(sortFilter).toArray().then(function(progress) {
         if (progress) {
             //console.log(['progress res',progress]);
            let notThese = [];
            for (var seenId in progress) {
                notThese.push(ObjectId(progress[seenId].question));
            };
            
            //for (var seenId in progress.block) {
                //notThese.push(ObjectId(seenId));
            //};
            console.log(['disco NOTHTES',notThese]);
            criteria.push({'_id': {$nin: notThese}});
            console.log(['disco criteria',criteria]);
            db.collection('questions').find({$and:criteria})
            //db.collection('questions').aggregate({$match:{$nin:notThese}})
            .sort(sortFilter).limit(limit).toArray().then(function( questions) {
               //   console.log(['user res',questions ? questions.length : 0,questions]);    
                res.send({questions:questions});
            })
        } else {
            console.log(['no user']);    
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

function shuffle (array) {
  var i = 0
    , j = 0
    , temp = null

  for (i = array.length - 1; i > 0; i -= 1) {
    j = Math.floor(Math.random() * (i + 1))
    temp = array[i]
    array[i] = array[j]
    array[j] = temp
  }
}

router.get('/review', (req, res) => {
    //console.log('review');
    let limit=20;
     let orderBy = (req.body.orderBy == 'successRate') ? 'successRate' : 'timeScore'
     let orderMeBy = {};
     orderMeBy[orderBy] = 1;          
     let criteria=[];
     criteria.push({user:req.query.user});
     criteria.push({$or:[{block :{$lte:0}},{block :{$exists:false}}]});
     let oneHourBack = new Date().getTime() - 1800000;
     //criteria.push({seen:{$lt:oneHourBack}});   
     //console.log({seen:{$lt:oneHourBack}});
     if (req.query.user && req.query.user.length > 0) {
         // sort by successTally and then most recently seen first
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
                    console.log(successTally,successAndDateKeyed[successTally]);
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
                   // console.log(results);
                    let questionIndex={};
                    results.forEach(function(question) {
                        questionIndex[question._id]=question;
                        //console.log(question._id);
                    });
                    let orderedResults=[];
                    successAndDateOrderedIds.forEach(function(question) {
                        orderedResults.push(questionIndex[question]);   
                    });
                    //console.log(['q',err,orderedResults]);
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
    console.log(['questions request',req.query.search,req.query.technique]);
    if (req.query.search && req.query.search.trim().length > 0) {
        // SEARCH BY technique and text query
        criteria.push({$text: {$search: req.query.search.trim()}});
        //criteria.push({question: {$regex: req.query.search.trim().toLowerCase()}});
        if (req.query.technique && req.query.technique.trim().length > 0) {
            criteria.push({'mnemonic_technique': {$eq:req.query.technique.trim()}});
        // SEARCH BY text query
        }
        console.log(criteria);
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
            console.log(['topic search',req.query.topic,{'quiz': {$eq:req.query.topic}}]);
            criteria.push({'quiz': {$eq:req.query.topic}});
            console.log(['topic search C    ',criteria]);
            db.collection('questions').find({$and:criteria}).sort({question:1}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        // SEARCH BY tag
        } else if (req.query.tag && req.query.tag.length > 0) {
            if (req.query.tag) { 
                let tag = req.query.tag.trim().toLowerCase(); 
                criteria.push({'tags': {$in:[tag]}});
                console.log(['search by tag',criteria,tag]);
                db.collection('questions').find({$and:criteria}).limit(limit*2).skip(skip).sort({question:1}).toArray(function(err, results) {
                    console.log(['search by tag res',results]);
                  res.send({'questions':results});
                })
            }
        // search by question (return single element array
        } else if (req.query.question && req.query.question.length > 0) {
            if (req.query.question) { 
                let question = req.query.question.trim().toLowerCase(); 
                criteria.push({'_id': ObjectId(question)});
                console.log(['search by id',criteria,question]);
                db.collection('questions').find({$and:criteria}).limit(limit).skip(skip).sort({question:1}).toArray(function(err, results) {
                    console.log(['search by id res',results]);
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
                    // create a votet
         //           console.log(['like vote']);
                    db.collection('likes').insert({'user':user,question:question}).then(function(inserted) {
           //             console.log(['like inserted']);
                        // collate tally of all likes for this question and save to question.score
                        db.collection('likes').find({question:question}).toArray(function(err, likes) {
                            console.log(['col likes',likes]);
                            let newScore=0;
                            if (likes && likes.length > 0) {
                                newScore=likes.length;
                            }
                            if (question && question.admin_score && parseFloat(question.admin_score) > 0) {
                                newScore =newScore + parseFloat(question.admin_score)/2;
                            }
                            console.log(['like new score',newScore]);
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
                db.collection('userquestionprogress').update({_id:progress._id},progress).then(function() {
          //          console.log(['set block time',progress]);
                    res.send({});
                });
                
            } else {
                  progress = {'user':user,question:req.body.question};
                  progress.block = new Date().getTime();
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
                updateUserQuestionProgress(user,question,tallySuccess);
            }
    }).catch(function(e) {
        console.log(['update q err',e]);
    });
     

}

// update per user progress stats into the userquestionprogress collection
function updateUserQuestionProgress(user,question,tallySuccess) {
    db.collection('userquestionprogress').findOne({user:user,question:question}).then(function(progress) {
        if (!progress) progress = {user:user,question:question};
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
        db.collection('seen').find({user:user,question:question}).toArray(function(err, result) {
        //    console.log(['seen found',result]);
            if (result.length > 0) {
          //      console.log(['seen update']);
                let ts = new Date().getTime();
                db.collection('seen').update({_id:ObjectId(result[0]._id)},{$set:{timestamp: ts}}).then(function(updated) {
                    updateQuestionTallies(user,question);    
                                    res.send('updated');
                }).catch(function(e) {
                    res.send('error on update');
                });
            } else {
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
            }
           
            
            
        });
    } else {
        res.send({message:'Invalid request'});
    }
})


router.post('/success', (req, res) => {
    console.log(['success']);
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
        let user = req.body.user;
        let question = req.body.question;
        console.log(['success']);
        db.collection('successes').findOne({user:user,question:question}).then(function(result) {
            console.log(['found success',result]);
            if (result && result._id) {
                console.log(['success update']);
                let ts = new Date().getTime();
                db.collection('successes').update({_id:ObjectId(result._id)},{$set:{timestamp: ts}}).then(function() {
                    updateQuestionTallies(user,question,true);
                    console.log(['updated']);
                    res.send('updated');

                }).catch(function(e) {
                    console.log(e);
                    res.send('err on update');
                });
                
            } else {
                console.log(['success insert']);
                let ts = new Date().getTime();
                db.collection('successes').insert({user:user,question:question,timestamp:ts}).then(function(inserted) {
                    updateQuestionTallies(user,question,true);
                    res.send('inserted');
                }).catch(function(e) {
                    console.log(e);
                    res.send('err on insert');
                });;
            }
        }).catch(function(e) {
            console.log(e);
            res.send('err on find');
        });
    } else {
        res.send({message:'Invalid request'});
    }
})


module.exports = router;
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
