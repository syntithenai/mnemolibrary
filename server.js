const fs = require('fs');
const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const MongoClient = require('mongodb').MongoClient
const Papa = require('papaparse')
//const XMLHttpRequest = require('xhr2');
const get = require('simple-get');
app.use(bodyParser.urlencoded({extended: true}))

const port = 5000;


let db;

MongoClient.connect('mongodb://mongo:27017/', (err, client) => {
  if (err) return console.log(err)
  db = client.db('mnemo') 

})

app.post('/api/create', (req, res) => {
  db.collection('questions').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

  
function createIndexes(json) {
        var quizzes = {};
        var tags = {};
        var relatedTags = {};
        var tagTopics = {};
        var topicTags = {};
        // collate quizzes and tags
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question.ID
            var tagList = question.tags.split(',')
            var quiz = question.quiz;
            if (! (Array.isArray(quizzes[quiz]))) {
                quizzes[quiz] = []
            }
            quizzes[quiz].push(id);
        
            for (var tagKey in tagList) {
                
                var tag = tagList[tagKey].trim().toLowerCase();
                if (tag.length > 0) {
                    if (! (Array.isArray(tags[tag]))) {
                        tags[tag] = []
                    }
                    if (! (Array.isArray(relatedTags[tag]))) {
                        relatedTags[tag] = {}
                    }
                    if (!(Array.isArray(tagTopics[tag]))) {
                        tagTopics[tag] = []
                    }
                    if (! (Array.isArray(topicTags[quiz]))) {
                        topicTags[quiz] = []
                    }
                    tags[tag].push(id);
                    if (!tagTopics[tag].includes(quiz)) {
                        tagTopics[tag].push(quiz)
                    }
                    if (!topicTags[quiz].includes(tag)) {
                        topicTags[quiz].push(tag)
                    }
                    tagList.forEach(function(relatedTag) {
                        if (relatedTag !== tag) {
                            relatedTags[tag][relatedTag]=true;
                        }
                    });
                    
                }
                
            }
            indexedQuestions[id]=questionKey;
        }
        let words = [];
        for (let tag in tags) {
            words.push({text:tag, value: tags[tag].length});
        }
        return {'questions':json['questions'], 'indexedQuestions':indexedQuestions,'topics':quizzes,'words':words,'tags':tags,'relatedTags':relatedTags,'topicTags':topicTags,'tagTopics':tagTopics};
  };


app.get('/api/import', (req, res) => {

    let that = this;
    let url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vTz3rAzVov3GQqn-9Yb_4wFxjLymAbN5xWqGk5Cl_F80StXCTV1N9hJEoocSg51h13DDXvKp9ukiBIK/pub?gid=876915125&single=true&output=csv';
    // load mnemonics and collate tags, topics
    var request = get(url, function(err,response) {
        Papa.parse(response, {
            'header': true, 
            'complete': function(data) {
                const toImport = {'questions':data.data};
                let json = createIndexes(toImport);
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
                res.send({'express':'Done'});
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




app.get('/api/discover', (req, res) => {
    db.collection('questions').find({}).sort({score:-1}).limit(20).toArray(function(err, results) {
        res.send({'questions':results});
    })
    
})

app.get('/api/questions', (req, res) => {
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
            return {};
        //db.collection('questions').find({}).sort({question:1}).toArray(function(err, results) {
          //res.send({'questions':results});
        }
    }
    
})

app.listen(port, () => console.log(`Listening on port ${port}`));
