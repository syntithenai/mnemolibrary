var express = require('express');
var router = express.Router();
var utils = require("../utils")
var config = require("../config")
var fetch = require('node-fetch');
const mustache = require('mustache');
const crypto = require("crypto"); 
var faker = require('faker');

const database = require('../oauth/database');
const User = database.User;
const OAuthAccessToken = database.OAuthAccessToken;
database.connect();

const MongoClient = require('mongodb').MongoClient
let db;
MongoClient.connect(config.databaseConnection, (err, client) => {
  if (err) return //console.log(err)
  db = client.db(config.database) 
})
var ObjectId = require('mongodb').ObjectID;
 
const userModelName='users';

// MEMBERSHIP/LOGIN
router.get("/",function(req,res) {
    utils.sendTemplate(req,res,{"content":utils.renderLogin(req)});
})

//,'authorization_code','client_credentials','refresh_token'
router.get('/me',function(req,res) {
          OAuthAccessToken.findOne({ accessToken:req.query.code})
            .then(function(token)  {
                ////console.log(['token',token]);
                let now = new Date();
                let expire = 0;
                if (token && token.accessTokenExpiresAt)  expire = new Date(token.accessTokenExpiresAt);
                if (now >= expire) {
                    res.send('token expired' );
                } else {
                    
                    if (token != null) {
                        User.findOne({ _id:token.user}).then(function(user) {
                            if (user != null) {
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
                                    ////console.log(['got token',token]);
                                    res.send({user:user,token:token});
                                })
                                .catch(function(err) {
                                    //console.log(['ERR',err]);
                                });
                                
                            } else {
                                res.send('no matching user' );
                            }          
                        });
                    } else {
                        res.send('no matching token' );
                    }
                }
            }).catch(function(e) {
                //console.log(['failed',e]);
                res.send('failed');
            });
    
})


router.post('/saveuser', function(req, res) {
   // //console.log(req.body);
    if (req.body._id && req.body._id.length > 0) {
        if (req.body.password && req.body.password.trim().length > 0 && req.body.password2 != req.body.password)  {
            res.send({warning_message:'Passwords do not match'});
        } else {
            ////console.log(['find on saveuser',req.body._id]);
            db.collection(userModelName).findOne(ObjectId(req.body._id), function(err, item) {
             // //console.log([err,item]);
              if (err) {
                  //console.log(err);
                  res.send({warning_message:err});
              } else if (item!=null) {
                  if (req.body.password && req.body.password.trim().length > 0) item.password=req.body.password;
                  item.name = req.body.name;
                  if (req.body.selectedMnemonics) item.selectedMnemonics=req.body.selectedMnemonics;
                  if (req.body.difficulty) item.difficulty=req.body.difficulty;
                  if (req.body.streak) item.streak=req.body.streak;
                  if (req.body.questions) item.questions=req.body.questions;
                  if (req.body.recall) item.recall=req.body.recall;
                //  console.log(['TPPW',req.body.topicPasswords])
                  if (req.body.topicPasswords) item.topicPasswords=req.body.topicPasswords;
                  // update avatar only when changed
                 // //console.log(['CHECK AVATORA',item.avatar,req.body.avatar]);
                  if (req.body.avatar && req.body.avatar.length > 0 && item.avatar != req.body.avatar) {
                      db.collection(userModelName).findOne({avatar:{$eq:req.body.avatar}}, function(err, avUser) {
                          if (avUser!=null) {
                             // //console.log('FOUND');
                              //avUser.;
                              res.send({warning_message:"Avatar name is already taken, try something different."});
                          } else {
                             // //console.log('SET');
                              item.avatar = req.body.avatar;
                              // no update email address, item.username = req.body.username;
                              //    //console.log(['save new item',item]);
                              db.collection(userModelName).update({'_id': ObjectId(item._id)},{$set:item}).then(function(xres) {
                                    //res.redir(config.authorizeUrl);
                                  item.warning_message="Saved changes";
                                  res.send(item);
                              });  
                          }
                      });
                  } else {
                    db.collection(userModelName).update({'_id': ObjectId(item._id)},{$set:item}).then(function(xres) {
                            //res.redir(config.authorizeUrl);
                          item.warning_message="Saved changes";
                          res.send(item);
                      });  
                  }
              } else {
                  res.send({warning_message:'ERROR: No user found for update'});
              }
            }); 
        }
    } else {
        res.send({warning_message:'Missing required information.'});
    }
});


function sendToken(req,res,user) {
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
        //Authorization: 'Basic '+btoa(config.clientId+":"+config.clientSecret) 
      },
      
      body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
    }).then(function(response) {
        return response.json();
    }).then(function(token) {
      //  //console.log(['got token',token]);
       res.send({code:token.access_token});
    }).catch(function(e) {
       // //console.log(e);
         res.send({message:'Error logging in'});
    });
}

router.post('/googlesignin',function(req,res) {
   // //console.log(['/googlesignin']);
    if (req.body.email && req.body.email.length > 0) {
     //   //console.log(['/googlesignin have mail',req.body.email]);
         db.collection(userModelName).findOne({username:req.body.email}).then(function(user) {
       //      //console.log(['/googlesignin fnd',user]);
              if (user!=null) {
                 sendToken(req,res,user);
              } else {
                  var pw = crypto.randomBytes(20).toString('hex');
                  let item={name:req.body.name,username:req.body.email,password:pw};
                  if (!item.avatar) item.avatar = faker.commerce.productAdjective()+faker.name.firstName()+Math.round(Math.random()*10000000)
                  db.collection(userModelName).insert(item,function(err,result) {
                   sendToken(req,res,item);
                  })
              }
         }).catch(function(e) {
             //console.log(e);
             res.send({message:'Invalid request e'});
         });
    } else {
        res.send({message:'Invalid request'});
    }
    
    
})


router.post('/recover', function(req, res) {
    
   // //console.log(['recover',req.body]);
    if (req.body.email && req.body.email.length > 0 && req.body.code && req.body.code.length > 0) {
        if (req.body.password.length==0 || req.body.password2.length==0) {
            res.send({warning_message:'Empty password is not allowed'});
        } else if (req.body.password2 != req.body.password)  {
            res.send({warning_message:'Passwords do not match'});
        } else {
     //       //console.log(['find on saveuser',req.body.email]);
            db.collection(userModelName).findOne({username:req.body.email}, function(err, item) {
              //console.log([err,item]);
              if (err) {
                  //console.log(err);
                  res.send({warning_message:err});
              } else if (item!=null) {
                  item.tmp_password = req.body.password;
                  item.token=req.body.code;
                  // no update email address, item.username = req.body.username;
                  db.collection(userModelName).update({'_id': ObjectId(item._id)},{$set:item}).then(function(xres) {
                        //res.redir(config.authorizeUrl);
                     //var hostParts = req.headers.host.split(":");
                     //var host = hostParts[0];
                        
                       var link = config.protocol + "://"  + config.host + '/?recovery='+item.token;
                       var mailTemplate =  mustache.render(`<div>Hi {{name}}! <br/>


To confirm your password recovery of your account with Mnemo's Library, please click the link below.<br/>

<a href="{{link}}" >Confirm your password update</a><br/>

If you did not recently request a password recovery for your Mnemo's Library account, please ignore this email.<br/><br/>

Mnemo's Library

                                  </div>`,{link:link,name:item.name});
       //                //console.log(mailTemplate);
                                //res.redir(config.authorizeUrl);
                       utils.sendMail(config.mailFrom,req.body.email,"Update your password on Mnemo's Library",
                                 mailTemplate
                              );  
                      item.warning_message="Sent recovery email";
                      res.send(item);
                  });  
                  
              } else {
                  res.send({warning_message:'ERROR: No user found for recovery'});
              }
            }); 
        }
    } else {
        res.send({warning_message:'Missing required information.'});
    }
});



router.post('/signup', function(req, res) {
    
    if (req.body.username && req.body.username.length > 0 && req.body.name && req.body.name.length>0 && req.body.avatar && req.body.avatar.length>0 && req.body.password && req.body.password.length>0 && req.body.password2 && req.body.password2.length>0) {
        if (req.body.password2 != req.body.password)  {
            res.send({warning_message:'Passwords do not match.'});
        } else {
             // update avatar only when changed
           // //console.log('seek avatar');
            db.collection(userModelName).find({avatar:{$eq:req.body.avatar}}).toArray().then(function(avUser) {
             // //console.log(['found avatar',avUser]);
              if (avUser!=null && avUser.length>0) {
//                   avUser.warning_message="Avatar name is already taken, try something different.";
                //  //console.log(['realy found avatar',avUser]);
                  res.send({warning_message:'Avatar name is already taken, try something different.'});
              } else {
            //      //console.log(['set avatar',req.body.avatar]);
                  
                db.collection(userModelName).findOne({username:req.body.username}, function(err, ditem) {
                  if (ditem!=null) {
                      res.send({warning_message:'An account with that email address already exists.'});
                  } else {
                      let item={name:req.body.name,username:req.body.username,password:req.body.password,avatar:req.body.avatar};
                      db.collection(userModelName).insert(item,function(err,result) {
                          var params={
                                username: item.username,
                                password: req.body.password,
                                'grant_type':'password',
                                'client_id':config.clientId,
                                'client_secret':config.clientSecret
                          };
                         // no update email address, item.username = req.body.username;
                          //    //console.log(['save new item',item]);
                          db.collection(userModelName).update({'_id': ObjectId(item._id)},{$set:item}).then(function(xres) {
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
                                            ////console.log(['got token',token]);
                                            item.token = token.access_token;
                                            item.tmp_password=item.password;
                                            item.password='';
                                            db.collection(userModelName).update({'_id': ObjectId(item._id)},{$set:item}).then(function(result2) {
                                                // //console.log(['jjjjj']);
                                                 //var hostParts = req.headers.host.split(":");
                                                 //var host = hostParts[0];
                                                 var link = config.protocol + "://"  + config.host + '/?confirm='+token.access_token;
                                                //res.redir(config.authorizeUrl);
                                                  utils.sendMail(config.mailFrom,req.body.username,'Confirm your registration with Mnemos Library',
                                                  mustache.render(`<div>Hi {{name}}! <br/>

                                Welcome to Mnemo's Library.<br/>

                                To confirm your registration, please click the link below.<br/>

                                <a href="{{link}}" >Confirm registration</a> ({{link}})<br/>

                                If you did not recently register with Mnemo's Library, please ignore this email.<br/><br/>

                                Mnemo's Library

                                                  
                                                  
                                                  </div>`,{link:link,name:item.name})
                                              );
                                              item.warning_message = 'Check your email to confirm your sign up.';
                                              res.send(item);
                                            
                                            });
                                            //db.collection(userModelName).update({"_id":result._id},{$set:item},function(err,result) {
                                                
                                            //});  
                                        })
                                        .catch(function(err) {
                                            //console.log(['ERR',err]);
                                        });
                                  });  
                              
                          });
                      }
                  })  
                }
            }).catch(function(err) {
                //console.log(['ERR',err]);
            });;
        }
    } else {
        res.send({warning_message:'Missing required information.'});
    }
    
});
router.post('/signin', function(req, res) {
    ////console.log(req.body);
    if (req.body.username && req.body.username.length > 0 && req.body.password && req.body.password.length>0) {
            db.collection(userModelName).findOne({username:req.body.username,password:req.body.password}, function(err, item) {
              if (item!=null) {
                      var params={
                            username: req.body.username,
                            password: req.body.password,
                            'grant_type':'password',
                            'client_id':config.clientId,
                            'client_secret':config.clientSecret
                      };
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
                           // //console.log(['got token',token]);
                           res.send({code:token.access_token});
                        }).catch(function(e) {
                            //console.log(e);
                             res.send({message:'Error logging in'});
                        });
              } else {
                  res.send({warning_message:'Invalid login credentials.'});
              }
            });  
    } else {
         res.send({warning_message:'Missing required information'});
    }
});



//,'authorization_code','client_credentials','refresh_token'
router.get('/doconfirm',function(req,res) {
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
                     // //console.log(['KKK',user]); 
                      user.save().then(function() {
                        //  //console.log(['approved']);
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
                         //       //console.log(['got token',token,config.successUrl + '?code='+token.access_token]);
                                //res.redirect(config.successUrl + '?code='+token.access_token);
                                res.send({user:user,token:token});
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




router.get('/dorecover',function(req,res) {
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
                      fetch("http://localhost:3000/oauth/token", {
                          method: 'POST',
                          headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                          },
                          
                          body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
                        }).then(function(response) {
                            return response.json();
                        }).then(function(token) {
                    //        //console.log(['got token',token,config.successUrl + '?code='+token.access_token]);
                            //res.redirect(config.successUrl + '?code='+token.access_token);
                            res.send({user:user,token:token});
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



// TESTS
//router.get('/mail',function(req,res) {
  //utils.sendMail(config.mailFrom,'syntithenai@gmail.com','mnemo tester message','<div>This is a message</div>');
//});



module.exports = router;
