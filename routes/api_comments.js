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
	
	router.post('/reportproblem', (req, res) => {
		let content='Reported By ' + req.body.userAvatar + '<br/><br/>' + req.body.comment + '<br/><br/>';
		if (req.body.question) {
			let question = req.body.question;
			content += 'Question: ' + (question.interrogative ? question.interrogative + ' ' : '') + question.question;
			let  link = config.protocol + "://"  + config.host + '/discover/topic/'+question.quiz+'/'+question._id;
			content += '\n\n<br/><a href="'+link+'" >View Question</a>'
		}
		
		
		let data = req.body;
		data.createDate = new Date()
				
		db().collection('reportedProblems').save(data);
		////console.log(['report',req.body]);
		utils.sendMail(config.mailFrom,config.mailFrom,"Problem Content Report from Mnemo's Library ",content);
		res.send({ok:'sent email'});
	});

	router.post('/savecomment', (req, res) => {
		console.log(['TRY save comment',req.body]);
			
		if (req.body.user && (req.body.type === 'note' || req.body.type === 'comment'|| req.body.type === 'question')) {
			let data = req.body;
			if (data._id && data._id !== null && data._id !== 'null') {
				data._id = ObjectId(data._id)
			}
			 //else {
				//data.createDate = new Date()
			//}
			
			data.user = ObjectId(req.body.user)
			data.question = ObjectId(req.body.question);
			data.questionComplete = req.body.questionComplete;
			// send mail when reply is added/updated
			if (req.body.isReply && req.body.userEmail  && req.body.userEmail.length > 0) {
				if (req.body.userEmailPreferences && req.body.userEmailPreferences === "none") {
					console.log('USER PREFERS NO EMAIL')
					
				} else { 
					if (req.body.replies && req.body.replies.length > 0) {
						let replyText=req.body.replies[req.body.replies.length - 1].text;
						let replyAvatar=req.body.replies[req.body.replies.length - 1].userAvatar;						
						let content=replyAvatar + ' replied to your comment <br/><i>"' + req.body.comment + '"</i><br/><br/>'+replyAvatar +' said <i>"' + replyText + '"</i><br/>';
						if (req.body.questionText) {
							content += '\n\n<br/>\n\n<br/>Question: ' + req.body.questionText;
						}
						let  link = config.protocol + "://"  + config.host + '/discover/topic/'+req.body.questionTopic+'/'+req.body.question;
						let  linkProfile = config.protocol + "://"  + config.host + '/profile';
						content += '\n\n<br/><a href="'+link+'" >View Discussion</a>'
						content += '\n\n<br/><br/><b>You can change your email notification preferences on the <a href="'+linkProfile+'" >Profile Page</a>'
						
						utils.sendMail(config.mailFrom,req.body.userEmail,"Reply to your comment on Mnemo's Library ",content);
						console.log('SENT COMMENT REPLY')
					}
				}
			}

			db().collection('comments').save(data).then(function() {
				//console.log(['save comment',data]);
				res.send({ok:true})
			});
		} else {
			console.log('no save invalid comment')
			res.send({ok:false})
		}
	});
	
	router.post('/deletecomment', (req, res) => {
		
		if (req.body.user && req.body.question && req.body.comment) {
			
			let filter = {$and:[{_id:{$eq:ObjectId(req.body.comment)}},{user:{$eq:ObjectId(req.body.user)}},{question:{$eq:ObjectId(req.body.question)}}]}
			
			db().collection('comments').deleteOne(filter).then(function() {
			//	console.log(['deleted comment',JSON.stringify(filter)]);
					res.send({ok:true})
				});
		} else {
			console.log('no delete invalid filter')
			res.send({ok:false})
		}
	});
	
	router.get('/comments', (req, res) => {
		console.log(['FIND COMMENTS',req.query])
			
		let filter = []
		if (req.query.filter && req.query.filter.length > 0) {
			let filterParts = req.query.filter.trim().split(' ');
			let innerFilter=[]
			filterParts.map(function(token) {
				innerFilter.push({$or:[{comment:{$regex:token}},{userAvatar:{$regex:token}},{questionTopic:{$regex:token}},{questionText:{$regex:token}}]})
			})
			filter.push({$and:innerFilter})
		}
		console.log(['FIND COMMENTS F',filter])
		
		// filter by question
		if (req.query.question) {
			filter.push({question : {$eq: ObjectId(req.query.question)}});
			if (req.query.user) {
				filter.push({$or:[{type:{$eq:'question'}},{type:{$eq:'comment'}},{$and:[{type:{$eq:'note'}},{user:{$eq:ObjectId(req.query.user)}}]}]});
			} else {
				filter.push({$or:[{type:{$eq:'question'}},{type:{$eq:'comment'}}]});
			}
			//console.log(['FIND COMMENTS',JSON.stringify({$and:filter})])
			db().collection('comments').find({$and:filter}).sort({createDate:-1}).toArray(function(err,results) {
				//console.log(['FOUND COMMENTS',err,results])
				res.send(results)
			});
		// recent comments
		} else {
			let limit = req.query.limit && req.query.limit > 0 ? parseInt(req.query.limit,10) : 30;
			console.log(['FIND COMMENTS Q',JSON.stringify({$and:filter})])
			filter.push({$or:[{type:{$eq:'question'}},{type:{$eq:'comment'}}]})
			db().collection('comments').find({$and:filter}).sort({createDate:-1}).limit(limit).toArray(function(err,results) {
				//console.log(['FOUND COMMENTS',err,results])
				res.send(results)
			});
		}
	});
	
	
	router.get('/notes', (req, res) => {
		//console.log(['FIND COMMENTS',req.query])
			
		let filter = []
		// filter by question
		if (req.query.question && req.query.user) {
			filter.push({question : {$eq: ObjectId(req.query.question)}});
			filter.push({$and:[{type:{$eq:'note'}},{user:{$eq:ObjectId(req.query.user)}}]});
			//console.log(['FIND COMMENTS',JSON.stringify({$and:filter})])
			db().collection('comments').find({$and:filter}).sort({createDate:-1}).toArray(function(err,results) {
				//console.log(['FOUND COMMENTS',err,results])
				res.send(results)
			});
		// recent comments
		} else {
			res.send([])
		}
	});
	

};


module.exports = initRoutes;
