const mustache = require('mustache');
const nodemailer = require('nodemailer');
const template= require('./template');
const config=require('./config');
var ObjectId = require('mongodb').ObjectID;
var removeDiacritics=require('./diacritics');
    
let utilFunctions =  {
    //munge:function (val) {
        //if (val) {
            //val = val.trim().toLowerCase().replace(/\//g, " ").replace("["," ").replace("]"," ").replace("{"," ").replace("}"," ").replace("("," ").replace(")"," ").replace("|"," ").replace("&"," ").replace("*"," ").replace(":"," ").replace(";"," ").replace("~"," ").replace("@"," ").replace("#"," ").replace("="," ").replace("\r\n"," ").replace("\n"," ");
            //// strip
            //val = val.trim().replace(/[^0-9 'a-z]/gi, '');
            //val = removeDiacritics(val);
            //val = val.slice(0,139).trim();
            //if (val.indexOf("mnemo's")==0) val = val.replace("mnemo's","nemo's");
            //return val;
        //} else {
            //return ''
        //}
    //},
    //mungeLong:function (val) {
        //if (val) {
             //val = val.trim().toLowerCase().replace(/\//g, " ").replace("["," ").replace("]"," ").replace("{"," ").replace("}"," ").replace("("," ").replace(")"," ").replace("|"," ").replace("&"," ").replace("*"," ").replace(":"," ").replace(";"," ").replace("~"," ").replace("@"," ").replace("#"," ").replace("="," ").replace("\r\n"," ").replace("\n"," ");
            //// strip
            //val = val.trim().replace(/[^0-9 'a-z]/gi, '');
            //val = removeDiacritics(val);
            //val = val.trim();
            //return val;
        //} else {
            //return ''
        //}
    //},
    //similarity : function(s1, s2) {
      //var longer = s1;
      //var shorter = s2;
      //if (s1.length < s2.length) {
        //longer = s2;
        //shorter = s1;
      //}
      //var longerLength = longer.length;
      //if (longerLength == 0) {
        //return 1.0;
      //}
      //return (longerLength - utilFunctions.editDistance(longer, shorter)) / parseFloat(longerLength);
    //},

    //editDistance : function(s1, s2) {
      //s1 = s1.toLowerCase();
      //s2 = s2.toLowerCase();

      //var costs = new Array();
      //for (var i = 0; i <= s1.length; i++) {
        //var lastValue = i;
        //for (var j = 0; j <= s2.length; j++) {
          //if (i == 0)
            //costs[j] = j;
          //else {
            //if (j > 0) {
              //var newValue = costs[j - 1];
              //if (s1.charAt(i - 1) != s2.charAt(j - 1))
                //newValue = Math.min(Math.min(newValue, lastValue),
                  //costs[j]) + 1;
              //costs[j - 1] = lastValue;
              //lastValue = newValue;
            //}
          //}
        //}
        //if (i > 0)
          //costs[s2.length] = lastValue;
      //}
      //return costs[s2.length];
    //},
    //intersect : function() {
       //var set = {};
       //[].forEach.call(arguments, function(a,i){
         //var tokens = a.match(/\w+/g);
         //if (!i) {
           //tokens.forEach(function(t){ set[t]=1 });
         //} else {
           //for (var k in set){
             //if (tokens.indexOf(k)<0) delete set[k];
           //}
         //}
       //});
    //return Object.keys(set);
  //},
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
            //console.log(error);
            res.send('FAIL');
          } else {
            //console.log('Email sent: ' + info.response);
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
        ////console.log(json);
        let questions = [];
        for (var questionKey in json['questions']) {
				////console.log('index q '+questionKey);
			const question = json['questions'][questionKey]
			if (question && question.question && question.question.length > 0) {
			   // //console.log(question);
				//question.tags = question.tags ? question.tags.trim().toLowerCase() : '';
				var id = question._id ? question._id :  new ObjectId();
				question._id = id;
				
				var tagList = [];
				if (question.tags) {
					let splitList = question.tags.trim().toLowerCase().split(",");
					splitList.forEach(function(tag) {
						tagList.push(tag.trim());
					});
					question.tags = tagList;
				}
				// //console.log(question.tags);
				////console.log(question.access);
				// only generate tags for public questions    
				if (question.access==="public") {
				  //  //console.log('public');
					for (var tagKey in tagList) {
				//        //console.log(tagList[tagKey]);
					  //  //console.log(['taglist each',tagKey,tagList[tagKey]]);
						var tag = tagList[tagKey].trim().toLowerCase();
			  //          //console.log(tag);
						if (tag.length > 0) {
							if (! (Array.isArray(tags[tag]))) {
								tags[tag] = 1
							}
						}
					}
				}
				questions.push(question);
			}
        }
        ////console.log('CREATED IINDEX');
        ////console.log(tags);
        return {'questions':questions,'tags':tags};
    },
   

}

module.exports = utilFunctions;
