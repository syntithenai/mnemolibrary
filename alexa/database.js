var ObjectId = require('mongodb').ObjectID;



/*
 * 
  
  
  // //console.log('discover',req.body.user);
    let orderBy = req.body.orderBy ? req.body.orderBy : 'successRate';
    let sortFilter={};
    let limit = 20;
    let criteria = [];
    
    function discoverQuery() {
        sortFilter[orderBy]=-1;
        sortFilter['successRate']=1;
        console.log(['disco criteria',JSON.stringify(criteria)]);
        db.collection('questions').find({$and:criteria})
        //db.collection('questions').aggregate({$match:{$nin:notThese}})
        .sort(sortFilter).limit(limit).toArray().then(function( questions) {
           //   //console.log(['user res',questions ? questions.length : 0,questions]);    
            res.send({questions:questions});
        })
    };
    

    // DO WE HAVE A USER
    if (req.body.user) {
        criteria.push({$or:[{access:{$eq:ObjectId(req.body.user)}},{access :{$eq:'public'}}]})
        // question block
        //criteria.push({$or:[{block :{$lte:0}},{block :{$exists:false}}]});
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
                    ////console.log({$ne: topic});
                    blockCriteria.push({quiz: {$ne: topic}});
                });
            }
            if (blocks.technique && Array.isArray(blocks.technique)) {
                blocks.technique.forEach(function(technique) {
                    ////console.log({$ne: technique});
                    blockCriteria.push({mnemonic_technique: {$ne: technique}});
                });
            }
        }
        ////console.log(['BC',blockCriteria]);
        if (blockCriteria.length > 0) {
            blockCriteria.forEach(function(c) {
                criteria.push(c);
            });
            
        }
        let user = req.body.user ? req.body.user : null;
        db.collection('users').find({_id:ObjectId(user)}).toArray().then(function(users) {
            if (users.length > 0) {
                let fullUser=users[0];
                //for (var seenId in progress.block) {
                    //notThese.push(ObjectId(seenId));
                //};
               // //console.log(['disco NOTHTES',notThese]);
               // allow non discoverable and remove difficulty filter on topic search
                if (req.body.topic) {
                    criteria.push({quiz:{$eq:req.body.topic}});
                    orderBy = 'sort';
                } else {
                    criteria.push({discoverable :{$ne:'no'}});
                    if (fullUser.difficulty) {
                        criteria.push({'difficulty': {$eq: fullUser.difficulty}});
                    } else {
                        criteria.push({'difficulty': {$eq: '2'}});
                    }
                }
                
               db.collection('userquestionprogress').find({
                        $and:[
                            {'user': {$eq:ObjectId(user)}} , 
                            {$or:[
                                {block: {$gt:0}}, 
                                {seen: {$gt:0}}, 
                            ]}
                            ]}).toArray().then(function(progress) {
                     if (progress) {
                        // //console.log(['progress res',progress]);
                        let notThese = [];
                        for (var seenId in progress) {
                            notThese.push(ObjectId(progress[seenId].question));
                        };
                        criteria.push({'_id': {$nin: notThese}});
                        discoverQuery();
                       
                    } else {
                        ////console.log(['no user']);    
                        // NO USER, SHOW BY POPULAR
                        discoverQuery();
                         //db.collection('questions').find({$and:criteria}).limit(limit).toArray().then(function(results) {
                             //////console.log(['no user res',results ? results.length : 0]);    
                            //res.send({'questions':results});
                        //})
                    }
                }).catch(function(e) {
                    //console.log(['e',e]);
                    res.send('e '+JSON.stringify(e));
                })
            }
        });
    } else {
        criteria.push({access :{$eq:'public'}});
        discoverQuery();
    }
    
  
 * 
 * */


let databaseFunctions = {
    nextDiscoveryQuestion: function (db,database,request,response) {
        //console.log('nextDiscoveryQuestion');
        //return new Promise(function(resolve,reject) {resolve()});
        let orderBy = request.slots['orderBy'] ? request.slots['orderBy'].value : 'successRate';
        let sortFilter={};
        let limit = 1;
        let criteria = [];
        return new Promise(function(resolve,reject) {
            databaseFunctions.getUser(db,database,request,response).then(function(user) {
                //console.log('nextDiscoveryQuestion got user');
                //console.log(user);
                let session = request.getSession();
                let tagFilter = ''
                let topicFilter = ''
                if (session.get('tagFilter')) {
                    tagFilter=session.get('tagFilter')
                //    tagFilter = closestTag(tagFilter)[0];
                } else if (session.get('topicFilter')){
                    topicFilter=session.get('topicFilter')
                 //   topicFilter=closestTopic(topicFilter)[0];
                }
                
                if (topicFilter) {
                    //criteria.push({quiz:{$eq:topicFilter}});
                    criteria.push({quiz:new RegExp('^' + topicFilter + '$', 'i')});
                    orderBy = 'sort';
                } else if (tagFilter) { 
                    let tag = String(tagFilter).trim().toLowerCase(); 
                    criteria.push({'tags': {$in:[tag]}});
                } else {
                    criteria.push({discoverable :{$ne:'no'}});
                    if (user) {
                        console.log('USER DISCOVER ');
                        let ruser=JSON.parse(JSON.stringify(user));
                        console.log([ruser]);
                            
                        if (ruser.difficulty > 0) {
                            criteria.push({'difficulty': {$eq: ruser.difficulty}});
                        } else {
                            criteria.push({'difficulty': {$eq: '2'}});
                        }
                    }
                        
                }
                
               // //console.log(['filter',tagFilter,topicFilter]);
                criteria.push({ok_for_alexa :{$eq:true}});
                sortFilter[orderBy]=-1;
                sortFilter['successRate']=-1;
                
                if (user) {
                    //console.log('nextDiscoveryQuestion have user');
                    criteria.push({$or:[{access:{$eq:ObjectId(user._id)}},{access :{$eq:'public'}}]})
                    let progressCriteria = {
                        $and:[
                            {'user': {$eq:ObjectId(user._id)}} , 
                            {$or:[
                                {block: {$gt:0}}, 
                                {seen: {$gt:0}}, 
                            ]}, 
                    ]};
                    //progressCriteria = {'user': {$eq:user._id}};
                    //console.log([user._id,progressCriteria]);
                    db.collection('userquestionprogress').find(progressCriteria).toArray().then(function(progress) {
                        if (progress) {
                           // //console.log(['progress res',progress]);
                            let notThese = [];
                            for (var seenId in progress) {
                                notThese.push(ObjectId(progress[seenId].question));
                            };
                            criteria.push({'_id': {$nin: notThese}});
                            //console.log(['disco criteria',notThese,criteria]);
                        }
                        console.log(JSON.stringify(criteria));
                        db.collection('questions').find({$and:criteria}).sort(sortFilter).limit(limit).toArray().then(function( questions) {
                            //console.log(['user res',questions ? questions.length : 0,questions]);    
                            resolve(questions);
                        })
                    });


                } else {
                    console.log('PUBLIC DISCOVER')
                    criteria.push({ok_for_alexa :{$eq:true}});
                    criteria.push({access :{$eq:'public'}});
                    // NO USER, SHOW BY POPULAR
                     //db.collection('questions').find({$and:criteria}).limit(limit).toArray().then(function(results) {
                       ////  //console.log(['no user res',results ? results.length : 0]);    
                        //resolve(results);
                    //})
                    
                    db.collection('questions').aggregate([{ $match: {$and:criteria}}, {$sample: { size: 1 }} ]
                        ,function (err, result) {
                        if (err) {
                            //console.log(err);
                            return;
                            resolve(null);
                        }
                        result.toArray().then(function(final) {
                            resolve(final);
                        });        
                    });
                }
            });
        });    
    },

    getReviewQuestions: function (db,database,request,response) {
         ////console.log('review');
         let session = request.getSession();
                    
         let limit=10;
         let orderBy = 'timeScore'
         let orderMeBy = {};
         orderMeBy[orderBy] = 1;          
         let criteria=[];
         //console.log('review');
         return new Promise(function(resolve,reject) {
            databaseFunctions.getUser(db,database,request,response).then(function(user) {
           //     //console.log('review gotuser');
                if (user) {
                     //if (req.query.band && req.query.band.length > 0) {
                         //if (parseInt(req.query.band,10) > 0) {
                             //criteria.push({successTally:{$eq:parseInt(req.query.band,10)}});
                         //} else {
                             //criteria.push({$or:[{successTally:{$eq:0}},{successTally:{$exists:false}}]});
                         //}
                         
                     //} 
                    let tagFilter = ''
                    let topicFilter = ''
            
                    if (session.get('reviewTagFilter')) {
                        tagFilter=session.get('reviewTagFilter')
                    } else if (session.get('reviewTopicFilter')){
                        topicFilter=session.get('reviewTopicFilter')
                    }
                    ////console.log(['filter',tagFilter,topicFilter]);
                    if (topicFilter) {
                        criteria.push({topic:new RegExp('^' + topicFilter + '$', 'i')});
                        orderBy = 'sort';
                    } 
                    if (tagFilter) { 
                        let tag = tagFilter.trim().toLowerCase(); 
                        criteria.push({'tags': {$in:[tag]}});
                    }
                    //console.log(['filter',tagFilter,topicFilter]);
                    
                    if (!tagFilter && !topicFilter) { 
                        let oneHourBack = new Date().getTime() - 1800000;
                        criteria.push({$or:[{seen:{$lt:oneHourBack}},{seenTally:{$not:{$gt:1}}}]});    
                    }
                 
                    criteria.push({$or:[{block :{$lte:0}},{block :{$exists:false}}]});
                    if (user && String(user._id).length > 0) {
                         criteria.push({user:ObjectId(user._id)});
                        // sort by successTally and then most recently seen first
                     //    //console.log(JSON.stringify(criteria));
                        db.collection('userquestionprogress').find({$and:criteria}).sort({'successTally':1,'seen':1}).limit(limit).toArray().then(function(questions,error) {
                            if (questions) {
                               // //console.log(questions);
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
                              //  //console.log(['REVItEW',successAndDateOrderedIds]);
                                db.collection('questions').find({_id:{$in:successAndDateOrderedIds}}).limit(limit).toArray(function(err,results) {
                                   // //console.log([err,results]);
                                    let questionIndex={};
                                    results.forEach(function(question) {
                                        questionIndex[question._id]=question;
                                        ////console.log(question._id);
                                    });
                                    let orderedResults=[];
                                    successAndDateOrderedIds.forEach(function(question) {
                                        if (questionIndex[question]) {
                                            orderedResults.push(questionIndex[question]);   
                                        }
                                    });
                                  //  //console.log(['RESOLVE',orderedResults[0]]);
                                    resolve(orderedResults);
                                })
                            } else {
                                resolve(null);
                            }
                        });
                    } else {
                        resolve(null);
                    }

                }
            });
        });
    },

    logStatus: function (db,database,type,question,request,response) {
        return databaseFunctions.getUser(db,database,request,response).then(function(user) {
            if (user && user._id && (type==="seen" || type==="successes")) {
                let ts = new Date().getTime();
                db.collection(type).insert({user:ObjectId(user._id),question:ObjectId(question),timestamp:ts}).then(function(inserted) {
                    //console.log(['LOG '+type]);
                    // collate tally of all seen, calculate success percentage to successScore
                    databaseFunctions.updateQuestionTallies(db,database,user._id,question,(type==="successes"));
                    //res.send('inserted');
                }).catch(function(e) {
                   //console.log(e);
                });            
            }
        });
    },

    getUser: function(db,database,request,response) {
        let accessToken = request.getSession().details.user ? request.getSession().details.user.accessToken : '';
       // //console.log('get user',accessToken,request.getSession());
        return new Promise(function(resolve,reject) {
            if (accessToken) {
                database.OAuthAccessToken.findOne({accessToken:accessToken})
                .then(function(token)  {
         //           //console.log(['found token',token]);
                    if (token != null) {
                        return database.User.findOne({ _id:ObjectId(token.user)}).then(function(user) {
           //                 //console.log(['resolve user',user]);
                            resolve(user);
                        })
                    }
                    resolve(null);
                });  
            } else {
                resolve(null);
            }
        })
    },
    
    blockQuestion: function(db,database,user,question,topic) {
        //console.log(['block',user,question,topic]);
        if (user && user._id) {
            db.collection('userquestionprogress').findOne({$and:[{'user': {$eq:ObjectId(user)}},{question:{$eq:ObjectId(question)}} ]}).then(function(progress) {
                    if (progress) {
                        // OK
                        progress.block = 1; //new Date().getTime();
                        progress.topic = topic;
                        db.collection('userquestionprogress').update({_id:progress._id},progress).then(function() {
                          //  //console.log(['update',progress]);
                        });
                    } else {
                          progress = {'user':ObjectId(user),question:ObjectId(question)};
                          progress.block = 1; //new Date().getTime();
                          progress.topic = topic;
                          db.collection('userquestionprogress').save(progress).then(function() {
                            //  //console.log(['insert',progress]);
                        });
                    } 
                })
        }
    },
    
    // UPDATE PROGRESS
    // update question stats into the questions collection
    updateQuestionTallies: function(db,database,user,question,tallySuccess=false) {
        if (user) {
            db.collection('questions').findOne({_id:ObjectId(question)}).then(function(result) {
                    if (result && result._id) {
                        let data={};
                        if (!tallySuccess) {
                            data.seenTally = result.seenTally ? parseInt(result.seenTally,10) + 1 : 1;
                        } else {
                            let successTally = result.successTally ? parseInt(result.successTally,10) + 1 : 1;
                            data.successTally = successTally;
                            data.successRate = data.seenTally > 0 ? successTally/data.seenTally : 0;                    
                        }
                        db.collection('questions').update({_id: ObjectId(question)},{$set:data}).then(function(qres) {
                           // //console.log(['saved question',qres]);
                        });
                        databaseFunctions.updateUserQuestionProgress(db,database,user,question,result.quiz,result.tags,tallySuccess);
                    }
            }).catch(function(e) {
                //console.log(['update q err',e]);
            });            
        }
         

    },

    // update per user progress stats into the userquestionprogress collection
    updateUserQuestionProgress: function (db,database,user,question,quiz,tags,tallySuccess) {
        ////console.log('UUQP');
        db.collection('userquestionprogress').findOne({$and:[{'user': {$eq:ObjectId(user)}},{question:ObjectId(question)} , {block:{ $not: { $gt: 0 } }}]}).then(function(progress) {
            if (!progress) progress = {user:ObjectId(user),question:ObjectId(question)};
            progress.topic=quiz;
            progress.tags=tags;
            if (!tallySuccess) {
                progress.seenTally = progress.seenTally ? parseInt(progress.seenTally,10) + 1 : 1;
                progress.seen = new Date().getTime();
            } else {
                progress.successTally = progress.successTally ? parseInt(progress.successTally,10) + 1 : 1;
                progress.success = progress.seen;
                progress.successRate = (parseInt(progress.successTally,10) > 0 && parseInt(progress.seenTally,10) > 0) ? progress.successTally/progress.seenTally : 0;
            }
                
            progress.block=0;
            db.collection('userquestionprogress').save(progress).then(function() {
                ////console.log('UUQP SAVED');
            
            });
        
      }).catch(function(e) {
          //console.log(['err',e]);
      });
        
    }
}
module.exports=databaseFunctions 
