const mustache = require('mustache');
const nodemailer = require('nodemailer');
const template= require('./template');
const config=require('./config');
var ObjectId = require('mongodb').ObjectID;

module.exports = {
  sendMail : function(from,to,subject,html) {
    var transporter = nodemailer.createTransport(config.transport);

    var mailOptions = {
      from: from,
      to: to,
      subject: subject,
      html: html
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
        res.send('FAIL');
      } else {
        console.log('Email sent: ' + info.response);
        res.send('OK');
      }
    });

},
   renderLogin: function renderLogin(req,vars) {
        let templateVars = Object.assign({},req.body);
        templateVars = Object.assign(templateVars,vars);
        templateVars.clientId = config.clientId;
        templateVars.clientSecret = config.clientSecret;
        //templateVars.successUrl = config.successUrl;
        
        return mustache.render(template.login,templateVars);
    },
    
    sendTemplate: function sendTemplate(req,res,vars) {
        let templateVars = Object.assign({},req.query);
        templateVars = Object.assign(templateVars,vars);
        res.send(mustache.render(template.layout,templateVars));    
    },
    
    updateIndexes: function (json,quizzes,tags,relatedTags,tagTopics,topicTags,indexedQuestions) {
                // collate quizzes and tags
        //console.log(json);
        for (var questionKey in json['questions']) {
          //  console.log('index q '+questionKey);
            const question = json['questions'][questionKey]
            //question.tags = question.tags ? question.tags.trim().toLowerCase() : '';
            if (question.access=="public") {
                //console.log('public q');
                var id = question._id ? question._id :  new ObjectId();
                question._id = id;
                var tagList = question.tags.split(',');
                //var quiz = question.quiz;
                //if (! (Array.isArray(quizzes[quiz]))) {
                    //quizzes[quiz] = []
                //}
                //quizzes[quiz].push(id);        
                //console.log(['taglist',tagList]);
                for (var tagKey in tagList) {
                  //  console.log(['taglist each',tagKey,tagList[tagKey]]);
                    var tag = tagList[tagKey].trim().toLowerCase();
                    if (tag.length > 0) {
                        if (! (Array.isArray(tags[tag]))) {
                            tags[tag] = []
                        }
                        //if (! (Array.isArray(relatedTags[tag]))) {
                            //relatedTags[tag] = {}
                        //}
                        //if (!(Array.isArray(tagTopics[tag]))) {
                            //tagTopics[tag] = []
                        //}
                        //if (! (Array.isArray(topicTags[quiz]))) {
                            //topicTags[quiz] = []
                        //}
                        tags[tag].push(id);
                        //if (!tagTopics[tag].includes(quiz)) {
                            //tagTopics[tag].push(quiz)
                        //}
                        //if (!topicTags[quiz].includes(tag)) {
                            //topicTags[quiz].push(tag)
                        //}
                        //tagList.forEach(function(relatedTag) {
                            //if (relatedTag !== tag) {
                                //relatedTags[tag][relatedTag]=true;
                            //}
                        //});
                        
                    }
                    
                }
                indexedQuestions[id]=questionKey;
            }
        }
        let words = [];
        let finalTags = [];
        for (let tag in tags) {
            words.push({_id: new ObjectId(),text:tag, value: tags[tag].length});
            finalTags.push({'title':tag,questions:[]});
        }
        return {'questions':json['questions'], 'indexedQuestions':indexedQuestions,'topics':quizzes,'words':words,'tags':finalTags};
    },
    
    createIndexes: function (json) {
        var quizzes = {};
        var tags = {};
        var relatedTags = {};
        var tagTopics = {};
        var topicTags = {};
        var updatedQuestions = [];
        let indexedQuestions= {};
        
        return this.updateIndexes(json,quizzes,tags,relatedTags,tagTopics,topicTags,indexedQuestions);
  }

}
