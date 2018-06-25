var express = require('express');
var router = express.Router();
const bodyParser= require('body-parser')
var config = require('../../config');
var fetch = require('node-fetch');

//var oauthserver = require('oauth2-server');
//var mustache = require('mustache');
//var model = require('../model')
//var utils = require('../../utils')

//var mongoose = require('mongoose');
////console.log(config.databaseConnection+config.database);
//var mongoUri = config.databaseConnection+config.database; // 'mongodb://mongo:27017/oauth';
//mongoose.connect(mongoUri, function(err, res) {
	//if (err) {
		//return console.error('Error connecting to "%s":', mongoUri, err);
	//}
	////console.log('Connected successfully to "%s"', mongoUri);
//});

const db = require('../../oauth/database');
const User = db.User;
db.connect();

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));


//,'authorization_code','client_credentials','refresh_token'
router.get('/confirm',function(req,res) {
    let params = req.query;
     //let request = oauthserver.Request(req);
    //let response = oauthserver.Response(res);
    //return oauth.authenticate(request, response, options)
      //.then(function(token) {
      //  //console.log(['APPROVE USER',params]); //,token,params,req]);    
          User.findOne({ token:params.code})
            .then(function(user)  {
                //let now = new Date();
                //let expire = new Date(token.accessTokenExpiresAt)
                //if (now >= expire) {
                    //res.send('token expired try recover password' );
                //} else {
                    
                    if (user != null) {
                        ////console.log(['res1',user,user._id,user.username,user.token,user.tmp_password]);
                        var userId = user._id;
                        //const user = new User({name:user2.name,username:user2.username,_id:user2._id,password:user2.tmp_password, token: null});
                       // //console.log(['res2',userId]);  
                          //res.send('registration '+params.code );
                          ////console.log(user);  
                      ////console.log(user._id);  
                      
                      user.password = user.tmp_password;
                      user.token = undefined;
                      user.tmp_password = undefined;
                   //   //console.log(['KKK',user]); 
                      user.save().then(function() {
                          ////console.log(['approved']);
                           var params={
                                username: user.username,
                                password: user.password,
                                'grant_type':'password',
                                'client_id':config.clientId,
                                'client_secret':config.clientSecret
                          };
                          fetch(config.protocol + "://" +config.host+'/oauth/token', {
                              method: 'POST',
                              headers: {
                                'Content-Type': 'application/x-www-form-urlencoded',
                              },
                              
                              body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
                            }).then(function(response) {
                                return response.json();
                            }).then(function(token) {
                         //       //console.log(['got token',token,config.successUrl + '?code='+token.access_token]);
                                res.redirect(config.successUrl + '?code='+token.access_token);
                            });
                      }).catch(function(e) {
                          //console.log(['Failed confirmation',e]);
                          res.send('failed ' );
                      });
                        
                    } else {
                        res.send('no matching registration' );
                    }
               // }
            }).catch(function(e) {
                //console.log(['failed',e]);
                res.send('failed');
            });
        
      //})
      //.catch(function(err) {
        //// handle error condition
      //});
    
    
    
})




router.get('/recover',function(req,res) {
        let params = req.query;
     //   //console.log(['RECOVER USER',params]); //,token,params,req]);    
          User.findOne({ token:params.code})
            .then(function(user)  {
             //   //console.log(['found',user]);
                if (user != null) {
            //        //console.log(['res1',user,user._id,user.username,user.token,user.tmp_password]);
                    var userId = user._id;
                    //const user = new User({name:user2.name,username:user2.username,_id:user2._id,password:user2.tmp_password, token: null});
               //     //console.log(['res2',userId]);  
                      //res.send('registration '+params.code );
                      ////console.log(user);  
                  ////console.log(user._id);  
                  
                  user.password = user.tmp_password;
                  user.token = undefined;
                  user.tmp_password = undefined;
        //          //console.log(['KKK',user]); 
                  user.save().then(function() {
                  //    //console.log(['approved']);
                       var params={
                            username: user.username,
                            password: user.password,
                            'grant_type':'password',
                            'client_id':config.clientId,
                            'client_secret':config.clientSecret
                      };
                      fetch(req.protocol + "://" +req.headers.host+'/oauth/token', {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          
                          body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
                        }).then(function(response) {
                            return response.json();
                        }).then(function(token) {
                    //        //console.log(['got token',token,config.successUrl + '?code='+token.access_token]);
                            res.redirect(config.successUrl + '?code='+token.access_token);
                        });
                  }).catch(function(e) {
                      //console.log(['Failed confirmation',e]);
                      res.send('failed ' );
                  });
                    
                } else {
                    res.send('no matching registration' );
                }
            }).catch(function(e) {
                //console.log(['failed',e]);
                res.send('failed');
            });
        
      //})
      //.catch(function(err) {
        //// handle error condition
      //});
    
    
    
})


//router.use(router.oauth.errorHandler());




module.exports = router;
