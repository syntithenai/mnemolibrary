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
    
    createIndexes: function (json) {
        let tags = {};
        // collate quizzes and tags
        //console.log(json);
        let questions = [];
        for (var questionKey in json['questions']) {
            //console.log('index q '+questionKey);
            const question = json['questions'][questionKey]
            //question.tags = question.tags ? question.tags.trim().toLowerCase() : '';
            var id = question._id ? question._id :  new ObjectId();
            question._id = id;
            
            var tagList = [];
            if (question.tags) {
                tagList = question.tags.trim().toLowerCase().split(",");
                question.tags = tagList;
            }
           // console.log(question.tags);
            //console.log(question.access);
            // only generate tags for public questions    
            if (question.access==="public") {
              //  console.log('public');
                for (var tagKey in tagList) {
            //        console.log(tagList[tagKey]);
                  //  console.log(['taglist each',tagKey,tagList[tagKey]]);
                    var tag = tagList[tagKey].trim().toLowerCase();
          //          console.log(tag);
                    if (tag.length > 0) {
                        if (! (Array.isArray(tags[tag]))) {
                            tags[tag] = 1
                        }
                    }
                }
            }
            questions.push(question);
        }
        //console.log('CREATED IINDEX');
        //console.log(tags);
        return {'questions':questions,'tags':tags};
    },
   

}
