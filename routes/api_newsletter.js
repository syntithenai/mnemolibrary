var express = require('express');
var router = express.Router();
var utils = require("../utils")
var alexaUtils = require("../alexa/alexautils")
var config = require("../config")
const Papa = require('papaparse')
var ObjectId = require('mongodb').ObjectID;
const get = require('simple-get');
const mustache = require('mustache');

var fetch = require('node-fetch');

function initRoutes(router,db) {

	function generateNewsletter(content,user,token) {
		let html = ''
		if (user) {
			html = content.replace(':::USER:::',user.name ? user.name : user.avatar)
		}
		while (html.indexOf(':::CODE:::') != -1) {
			html = html.replace(':::CODE:::','?code='+token)
		}
		var fulllink = config.protocol + "://"  + config.host ;
        while (html.indexOf('http://:::LINK:::') != -1) {
			html = html.replace('http://:::LINK:::',fulllink)
		}
		while (html.indexOf('https://:::LINK:::') != -1) {
			html = html.replace('https://:::LINK:::',fulllink)
		}
		return '<div style="margin-left:1em">' + html + '</div>';

	}
	
	router.get('/newsletters', (req, res) => {
		db().collection('newsletters').find({deleted:{$ne:"TRUE"}}).sort({createDate:-1}).toArray(function(err,results) {
			if (err) {
				console.log(err)
			} else {
				//results.map(function(result) {
					//result.
					//return result ? {_id:result._id,createDate:result.createDate}
				//})
				//if (status === "sending") {
			//let dateDiff = new Date().getTime() - new Date(req.body.updatedDate).getTime()
			//if (dateDiff > 3600000) {
				//status="paused"
			//} 
		//}
		
				res.send(results)
			}
		})
	})
	
	router.post('/savenewsletter', (req, res) => {
		let status = 'new';
		console.log(['snpost',JSON.stringify(req.body)])
		if (req.body.status && req.body.status.length > 0) status = req.body.status;
		// if long delay since last message update status to paused
		let newsletter = {
			publishKey:req.body.publishKey && req.body.publishKey.length > 0 ? req.body.publishKey  : 'key-'+Math.random(),
			createDate: req.body.createDate && req.body.createDate > 0 ? req.body.createDate : new Date(),
			updatedDate: new Date(),
			content:req.body.content && req.body.content.length > 0 ? req.body.content  : '',
			subscribers:req.body.subscribers && req.body.subscribers.length > 0 ? req.body.subscribers  : '',
			sentTo:req.body.sentTo && req.body.sentTo.length > 0 ? req.body.sentTo  : '',
			pingedBy:req.body.pingedBy && req.body.pingedBy.length > 0 ? req.body.pingedBy  : '',
			deleted: (req.body.deleted),
			status: status
		}
		console.log(['SAVE NEWSLETTER',newsletter]);
		if (req.body._id && req.body._id.length > 0) {
			db().collection('newsletters').updateOne({_id:ObjectId(req.body._id)},{$set:newsletter}).then(function(result) {
				console.log([' update SNLETTER',result.result])
				res.send(newsletter)
			});
		} else {
			newsletter._id =  ObjectId()
			db().collection('newsletters').insertOne(newsletter).then(function(result) {
				console.log(['insert SNLETTER',result.result])
				newsletter._id = result.insertedId
				res.send(newsletter)
			});
		}
	})
	
	function sendNewsletterTo(newsletter,user) {
		console.log(['SEND NEWSLETTER TO ',user,newsletter])
		let p = new Promise(function(resolve,reject) {
			var params={
				username: user.username,
				password: user.password,
				'grant_type':'password',
				'client_id':config.clientId,
				'client_secret':config.clientSecret
			};
			fetch("http://localhost:3000/oauth/token", {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			  },
			  
			  body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
			}).then(function(response) {
				return response.json();
			}).then(function(token) {
				let html = generateNewsletter(newsletter.content,user,token.access_token);
				utils.sendMail(config.mailFrom,user.username,"Mnemo's Library Newsletter",html).then(function(mailFeedback) {
					resolve({ok:true,message:'Sent email to '+user.username,mailFeedback:mailFeedback })
				}).catch(function(e) {
					reject({error:e})
				})

			}).catch(function(e) {
			   console.log(e);
			   reject({error:e});
			});
		});
		return p		

	}
	
	router.post('/sendtestnewsletter', (req, res) => {
		// find admin user
		db().collection('users').findOne({_id:ObjectId(req.body.user)}).then(function(user) {
			
			db().collection('newsletters').findOne({_id:ObjectId(req.body.id)}).then(function(newsletter) {
				//console.log(['publish u',	user])
				if (user && newsletter && newsletter.publishKey && newsletter.publishKey.length > 0 && newsletter.publishKey === req.body.publishKey) {
			
				//console.log(['publish u',	user])
				//if (user && user.publishKey && user.publishKey.length > 0 && user.publishKey === req.body.publishKey) {
					//console.log(['publish matck key',	user])
					if (req.body.content && req.body.content.length > 0) {
					//	console.log(['publish is test',	req.body.userEmail])
						// get auth key
						var params={
							username: user.username,
							password: user.password,
							'grant_type':'password',
							'client_id':config.clientId,
							'client_secret':config.clientSecret
						};
						if (req.body.userEmail && req.body.userEmail.length > 0) {
							fetch("http://localhost:3000/oauth/token", {
							  method: 'POST',
							  headers: {
								'Content-Type': 'application/x-www-form-urlencoded',
								//Authorization: 'Basic '+btoa(config.clientId+":"+config.clientSecret) 
							  },
							  
							  body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
							}).then(function(response) {
								return response.json();
							}).then(function(token) {
								let html = generateNewsletter(req.body.content,user,token.access_token);
								utils.sendMail(config.mailFrom,req.body.userEmail,"Mnemo's Library Newsletter",html).then(function() {
									res.send({ok:true,message:'Sent test email to '+req.body.userEmail })
								}).catch(function(e) {
									res.send({error:e})
								})

							}).catch(function(e) {
							   console.log(e);
							   res.send({error:e});
							});
						}
					} else {
						res.send({error:'No message content'});
					}
				} else {
					res.send({error:'Invalid key'});
				}
			}).catch(function(e) {
			   console.log(e);
			   res.send({error:e});
			});		
		}).catch(function(e) {
		   console.log(e);
		   res.send({error:e});
		});	
    })
	
	
	
	//router.post('/newsletterping', (req, res) => {
		//// if no id requested, return a list of newsletters
		
		//// if have id but no code, return the code
		
		//// if have id and code, process queue and return status
		
    //})
	
	router.get('/newslettersubscribers', (req, res) => {
		//if (req.query.user && req.query.user.length > 0) {
			db().collection('users').find({$and:[{email_me:{$ne:'none'}},{email_me:{$ne:'comments'}}]}).toArray(function(err,results) {
				//cdb().collection('users').updateOne({_id:ObjectId(req.query.user)},{$set:{publishKey:key}})
				res.send({total:results ? results.length : '0'});
			});
		//} else {
			//res.send({error:'invalid missing user parameters'})
		//}
	})

	router.post('/publishnewsletter', (req, res) => {
		if (req.body.id) {
			// get the newsletter
			db().collection('newsletters').findOne({_id:ObjectId(req.body.id)}).then(function(newsletter) {
				// check the publishKey
				if (newsletter && newsletter.publishKey && newsletter.publishKey.length > 0 && newsletter.publishKey === req.body.publishKey) {
					// lookup subscribers
					db().collection('users').find({$and:[{email_me:{$ne:'none'}},{email_me:{$ne:'comments'}}]}).toArray(function(err,subscribers) {
						if (err) {
							console.log(err)
							res.send({ok:false})
						} else {
							newsletter.subscribers = subscribers
							newsletter.toSend = subscribers
							newsletter.status = 'active'
							newsletter.sentDate = new Date()
							newsletter.updatedDate = new Date()
							db().collection('newsletters').save(newsletter).then(function() {
								res.send({ok:true})
							}).catch(function (e) {
								res.send({ok:false,error:e})
							});
							
						}
					});
				} else {
					res.send({ok:false,error:'no key match'})

				}
			})
		}else {
			res.send({ok:false,error:'missing parameters'})
		}
	})
	
	
	router.post('/newslettersend', (req, res) => {
		let messageLimit=1;
		// get oldest active newsletter
		db().collection('newsletters').find({status:'active'}).sort({startDate:1}).toArray().then(function(newsletters) {
			if (newsletters && newsletters.length > 0) {
				let newsletter = newsletters[0];
				// compare sent to subscribers
				
				if (newsletter.toSend && newsletter.toSend.length > 0) {
					// next slice of recipients
					let recipients = newsletter.toSend.splice(0,messageLimit)
					if (recipients && recipients.length) {
						let promises=[]
						recipients.map(function(recipient) {
							if (!newsletter.sentTo) newsletter.sentTo=[] 
							newsletter.sentTo.push(recipient);
							// send messages
							promises.push(sendNewsletterTo(newsletter,recipient))
						});
						// wait for all messages to send then update newsletter
						Promise.all(promises).then(function(sendMessages) {
							db().collection('newsletters').save(newsletter).then(function(mailMessages) {
								console.log(['NEWSLETTERS SENT',mailMessages])
								res.send({ok:true,newsletters:newsletters,message:JSON.stringify(mailMessages)})
							})
						});
					} else {
						res.send({finished:true,ok:true,newsletters:newsletters})
					}
				} else {
					// all done
					 // save finished status
					 newsletter.status = 'complete'
					 newsletter.completeDate = new Date()
					 db().collection('newsletters').save(newsletter).then(function() {
						res.send({finished:true,ok:true,message:'Newsletter sent to all recipients',newsletters:newsletters})
					})
				}
			}  else {
				res.send({ok:true,finished:true})
			}
		})
	})
	
};


module.exports = initRoutes;
  
	
//:::LINK:::/recentcomments:::CODE:::
	
	
	//router.get('/resetnewsletterstatus', (req, res) => {
		  //db().collection('users').find({$and:[{email_me:{$ne:'none'}},{email_me:{$ne:'comments'}}]}).toArray(function(err,results) {
									////	console.log(['publish for real res',results,req.body.content])
									//let emails=[];
									//if (req.body.content && req.body.content.length > 0) {
										////console.log(['send emails MC',req.body.user,req.body.publishKey,req.body.content,results])
										//if (results) {
											//let promises = [];
											////results.map(function(user) {
												//let newsletter = {
													//_id:ObjectId(),
													//user: user,
													//publishKey:key,
													//subscribers:results.map(function(result) { return (result ? result._id : null)}),
												    //createDate: new Date(),
												    //updatedDate: new Date()
												//}
												
												//db().collection('newsletter').insertOne(newsletter).then(function() {
													//res.sent({ok:true,status:"queued"})
												//});
											////	return null;
											////})
											////Promise.all(promises).then(function(final) {
												////console.log(['USERS AND TOKENS',final])
												////res.send({ok:true,sentTo:final.length})
											////});
										//}
										//// iterate users building in dynamic elements
											//// send email
									//}
								//});
//var params={
													//username: user.username,
													//password: user.password,
													//'grant_type':'password',
													//'client_id':config.clientId,
													//'client_secret':config.clientSecret
												//};
												//promises.push(new Promise(function(resolve,reject) {
													//fetch("http://localhost:3000/oauth/token", {
													  //method: 'POST',
													  //headers: {
														//'Content-Type': 'application/x-www-form-urlencoded',
														////Authorization: 'Basic '+btoa(config.clientId+":"+config.clientSecret) 
													  //},
													  
													  //body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
													//}).then(function(response) {
														//return response.json();
													//}).then(function(token) {
														
														//// only send newsletter from live site
														////if (config.host === 'mnemolibrary.com') {
															////console.log('really send email to '+user.username)
														//let interval = 3000;
														////setTimeout(function() {
															//let html = generateNewsletter(req.body.content,user,token.access_token);
															//utils.sendMail(config.mailFrom,user.username,"Mnemo's Library Newsletter",html).then(function() {
																//resolve({email:user.username,html});
															//});
														////,interval}
														////} else {
															//////console.log('no send email not live site to '+user.username)
															
														////}
													//}).catch(function(e) {
													   //console.log(e);
													   //reject()
													//});
												//}))

	//})
	
