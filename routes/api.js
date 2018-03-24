var express = require('express');
var router = express.Router();
var utils = require("../utils")
var config = require("../config")
const Papa = require('papaparse')

const get = require('simple-get');

const MongoClient = require('mongodb').MongoClient
let db;
MongoClient.connect(config.databaseConnection, (err, client) => {
  if (err) return console.log(err)
  db = client.db(config.database) 
})

//const database = require('../../oauth/database');


router.post('/import', (req, res) => {

    let that = this;
    let url = config.masterSpreadsheet;
    // load mnemonics and collate tags, topics
    var request = get(url, function(err,response) {
        Papa.parse(response, {
            'header': true, 
            'complete': function(data) {
                const toImport = {'questions':data.data};
                let json = utils.createIndexes(toImport);
                console.log(['parsed',data,data.errors,json]);
                for (collection in json) {
                    console.log(['save collection',collection,Array.isArray(json[collection]),json[collection]]);
                    if (Array.isArray(json[collection])) {
                        db.collection(collection).insertMany(json[collection]);   
                    } else {
                        db.collection(collection).insert(json[collection]);   
                    }
                }
                  
                db.collection('questions').dropIndex();
                db.collection('questions').createIndex({
                    question: "text"
                    //,
                    //interrogative: "text",
                    //mnemonic: "text",
                    //answer: "text"
                }); 
                res.send({'message':'Import complete'});
            }
        })
    })  
})

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




router.get('/discover', (req, res) => {
    db.collection('questions').find({}).sort({score:-1}).limit(20).toArray(function(err, results) {
        res.send({'questions':results});
    })
})

router.get('/questions', (req, res) => {
    let limit = 20;
    let skip = 0;
    if (req.query.limit && req.query.limit > 0) {
        limit = req.query.limit;
    }
    if (req.query.skip && req.query.skip > 0) {
        skip = req.query.skip;
    }
    console.log(['questions request',req.query.search,req.query.technique]);
    if (req.query.search && req.query.search.length > 0) {
        if (req.query.technique && req.query.technique.length > 0) {
            db.collection('questions').find({$text: {$search: req.query.search}, 'mnemonic_technique': req.query.technique}).limit(limit).skip(skip).project({score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        } else {
            db.collection('questions').find({$text: {$search: req.query.search}}).project({score: {$meta: "textScore"}}).limit(limit).skip(skip).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
              res.send({'questions':results});
            })
        }
    } else {
        if (req.query.technique && req.query.technique.length > 0) {
            db.collection('questions').find({'mnemonic_technique': req.query.technique}).limit(limit).skip(skip).project({score: {$meta: "textScore"}}).sort({score:{$meta:"textScore"}}).toArray(function(err, results) {
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
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
        let user = req.body.user;
        let question = req.body.question;
        
        db.collection('likes').find({'user':user,question:question}).toArray(function(err, results) {
            if (results.length > 0) {
                // OK
                res.send({});
            } else {
                // create a vote
                db.collection('likes').insert({'user':user,question:question}).then(function(inserted) {
                    // collate tally of all likes for this question and save to question.score
                    db.collection('likes').find({question:question}).toArray(function(err, results) {
                        db.collection('questions').updateOne({ID: question},{$set: {score:results.length?results.length:0}}).then(function() {
                            res.send({message:'Thanks for your like'});
                        });
                        
                    });
                }).catch(function(e) {
                    console.log(e);
                  res.send({message:'Invalid request error'});  
                });
            } 
            
        })
    } else {
        res.send({message:'Invalid request'});
    }
})


router.post('/block', (req, res) => {
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
        let user = req.body.user;
        let question = req.body.question;
        db.collection('blocks').find({'user':user,question:question}).toArray(function(err, results) {
            if (results.length > 0) {
                // OK
                res.send({});
            } else {
                // create a block
                db.collection('blocks').insert({'user':user,question:question}).then(function(inserted) {
                    res.send({message:'Question blocked'});
                }).catch(function(e) {
                    console.log(e);
                  res.send({message:'Invalid request error'});  
                });
            } 
        })
    } else {
        res.send({message:'Invalid request'});
    }
})

router.post('/seen', (req, res) => {
    console.log(['seen',req.body]);
    if (req.body.user && req.body.user.length > 0 && req.body.question && String(req.body.question).length > 0 ) {
        console.log(['seen ok']);
        let user = req.body.user;
        let question = req.body.question;
        db.collection('seen').find({user:user,question:question}).toArray(function(err, result) {
            console.log(['seen found',result]);
            if (result.length > 0) {
                console.log(['seen update']);
                let ts = new Date().getTime();
                db.collection('seen').update({_id:result[0]._id},{timestamp: ts});
                res.send({});
            } else {
                // create a seen record
                console.log(['seen insert']);
                let ts = new Date().getTime();
                db.collection('seen').insert({user:user,question:question,timestamp:ts}).then(function(inserted) {
                    console.log(['seen inserted']);
                    // collate tally of all seen, calculate success percentage to successScore
                    db.collection('seen').find({question:question}).toArray(function(err, seens) {
                        console.log(['seen found many to q']);
                        db.collection('successes').find({question:question}).toArray(function(err, successes) {
                            console.log(['seen found successes']);
                            // save to seenTally, successScore
                            db.collection('seenTally').updateOne({question: question},{$set:{question:question,tally:seens.length}},{upsert:true});
                            let score = successes.length > 0 ? seens.length/successes.length : 0;
                            db.collection('successScore').updateOne({question: question},{$set:{question:question,score:score}},{upsert:true});
                            console.log(['seen done']);
                            res.send({});
                        });
                    });
                });
            }
            
        })
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
        db.collection('successes').findOne({user:user,question:question}).toArray(function(err, result) {
            console.log(['found success',result]);
            if (result && result._id) {
                console.log(['success update']);
                let ts = new Date().getTime();
                db.collection('successes').update(result._id,{timestamp: ts});
                console.log(['updated']);
                res.send({message:'OK update'});

            } else {
                console.log(['success insert']);
                let ts = new Date().getTime();
                db.collection('successes').insert({user:user,question:question,timestamp:ts}).then(function(inserted) {
                    console.log(['success inserted']);
                    // collate tally of all success, calculate success percentage to successScore
                    db.collection('seen').find({question:question}).toArray(function(err, seens) {
                        console.log(['got seens',seens]);
                        db.collection('successes').find({question:question}).toArray(function(err, successes) {
                            console.log(['got successes',successes]);
                            // save to successTally, successScore
                            db.collection('successTally').updateOne({question: question},{$set:{question:question,tally:success.length}},{upsert:true});
                            let score = successes.length > 0 ? seens.length/successes.length : 0;
                            db.collection('successScore').updateOne({question: question},{$set:{question:question,score:score}},{upsert:true});
                            console.log(['saved tallies']);
                            res.send({message:'OK'});
                        });
                    });
                });
            }
        })
    } else {
        res.send({message:'Invalid request'});
    }
})


module.exports = router;

