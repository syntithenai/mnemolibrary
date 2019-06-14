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
		let content='Reported By ' + req.body.user.username + '<br/><br/>' + req.body.problem + '<br/><br/>Question: ' + JSON.stringify(req.body.question);
		let data = req.body;
		data.createDate = new Date()
				
		db().collection('reportedProblems').save(data);
		////console.log(['report',req.body]);
		utils.sendMail(config.mailFrom,config.mailFrom,"Problem Content Report from Mnemo's Library ",content);
		res.send('sent email');
	});

	router.post('/savecomment', (req, res) => {
		//console.log(['TRY save comment',req.body]);
			
		if (req.body.user && (req.body.type === 'note' || req.body.type === 'comment')) {
			let data = req.body;
			if (data._id) {
				data._id = ObjectId(data._id)
			} else {
				data.createDate = new Date()
			}
			data.user = ObjectId(req.body.user)
			data.question = ObjectId(req.body.question)
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
				//console.log(['deleted comment',JSON.stringify(filter)]);
					res.send({ok:true})
				});
		} else {
			console.log('no delete invalid filter')
			res.send({ok:false})
		}
	});
	
	router.get('/comments', (req, res) => {
		//console.log(['FIND COMMENTS',req.query])
			
		let filter = []
		// filter by question
		if (req.query.question) {
			filter.push({question : {$eq: ObjectId(req.query.question)}});
			if (req.query.user) {
				filter.push({$or:[{type:{$eq:'comment'}},{$and:[{type:{$eq:'note'}},{user:{$eq:ObjectId(req.query.user)}}]}]});
			} else {
				filter.push({type:{$eq:'comment'}});
			}
			//console.log(['FIND COMMENTS',JSON.stringify({$and:filter})])
			db().collection('comments').find({$and:filter}).sort({createDate:-1}).toArray(function(err,results) {
				//console.log(['FOUND COMMENTS',err,results])
				res.send(results)
			});
		// recent comments
		} else {
			let limit = req.query.limit && req.query.limit > 0 ? req.query.limit : 10;
			//console.log(['FIND COMMENTS',JSON.stringify({$and:filter})])
			db().collection('comments').find().sort({createDate:-1}).limit(limit).toArray(function(err,results) {
				console.log(['FOUND COMMENTS',err,results])
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
