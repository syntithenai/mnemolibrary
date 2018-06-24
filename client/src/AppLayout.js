/* global gapi */
/* global Paho */
import React, { Component } from 'react';
//import AdSense from 'react-adsense';
//let Paho = require('paho-mqtt')
 
import Navigation from './Navigation';
//import SingleQuestion from './SingleQuestion';

import AboutPage from './AboutPage';
import TermsOfUse from './TermsOfUse';
import IntroPage from './IntroPage';
//import ReviewPage from './ReviewPage';
import CreatePage from './CreatePage';
import ReviewPage from './ReviewPage';
import TagsPage from './TagsPage';
import TopicsPage from './TopicsPage';
import LoginPage from './LoginPage';
import ProfilePage from './ProfilePage';
import SearchPage from './SearchPage';
import QuizCarousel from './QuizCarousel';
import Footer from './Footer';
import FindQuestions from './FindQuestions';
import CreateHelp from './CreateHelp';
import FAQ from './FAQ';
import ReactGA from 'react-ga';
//import { BrowserRouter as Router, Route, Link } from "react-router-dom";
//import SignIn from './SignIn';
//import FindQuestions from './FindQuestions';

import 'whatwg-fetch'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

//import { confirmAlert } from 'react-confirm-alert'; // Import
//import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
    

import Utils from './Utils';
var config = require('../../config')
    
export default class AppLayout extends Component {

  constructor(props) {
      super(props);
      let defaultUsers={'default':{
          'seenIntro': false, 
          'questions':{'seen':{},'success':{},'seenTally':{},'successTally':{},'successRate':{},'timeScore':{},'block':{},'likes':{}},
          'topics':{},
          'tags':{},
        //  'review':[]
        }};
        let users = null;
      this.GoogleAuth = null; // Google Auth object.
      this.mqttClient = null;
      this.mqttClientId = null;
      
      let userString = localStorage.getItem('users');
      if (userString) {
          let data = JSON.parse(userString);
          users = data['users'];
      }
      this.state = {
          title : "Mnemo's Library",
          message: null,
          currentPage: "", //splash
          currentQuestion: 0,
          questions: [],
          indexedQuestions: [],
          topics: [],
          tags: [],
          words: [],
          relatedTags: [],
          tagTopics: {},
          topicTags: {},
          users: users ? users : defaultUsers,  // really progress vs user/token below
          currentQuiz: [],
          tagFilter : null,
          response : null,
          user:null,
          token:null,
          mnemonic_techniques :	["homonym","association","alliteration","rhyme","acronym","mnemonic major system","visual"],
          topicCollections:[],
          discoveryBlocks:{tag:[],topic:[],technique:[]},
      }
      // make 'this' available in setCurrentPage function
      this.setCurrentPage = this.setCurrentPage.bind(this);
      this.setQuiz = this.setQuiz.bind(this);
      this.setQuizFromQuestion = this.setQuizFromQuestion.bind(this);
      this.setQuizFromQuestionId = this.setQuizFromQuestionId.bind(this);
      this.setQuizFromTopic = this.setQuizFromTopic.bind(this);
      this.setReviewFromTopic = this.setReviewFromTopic.bind(this);
      this.discoverQuizFromTopic = this.discoverQuizFromTopic.bind(this);
      this.setQuizFromTag = this.setQuizFromTag.bind(this);
      this.updateProgress = this.updateProgress.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.reviewBySuccessBand = this.reviewBySuccessBand.bind(this);
      //this.getTagsByTitle = this.getTagsByTitle.bind(this);
      //this.getTopicsByTitle = this.getTopicsByTitle.bind(this);
      //this.getQuestionsByTag = this.getQuestionsByTag.bind(this);
      //this.getQuestionsByTopic = this.getQuestionsByTopic.bind(this);
      
      //this.getQuestionsForReview = this.getQuestionsForReview.bind(this);
      //this.getTopicsForReview = this.getTopicsForReview.bind(this);
      //this.getTagsForReview = this.getTagsForReview.bind(this);
      //this.getTagsByTitle = this.getTagsByTitle.bind(this);
      //this.getTopicsByTitle = this.getTopicsByTitle.bind(this);
      //this.getQuestionsByTag = this.getQuestionsByTag.bind(this);
      //this.getQuestionsByTopic = this.getQuestionsByTopic.bind(this);
         
      // this.finishTopic = this.finishTopic.bind(this);
       //this.finishReview = this.finishReview.bind(this);
       this.clearTagFilter = this.clearTagFilter.bind(this);
       this.setMessage = this.setMessage.bind(this);
       this.setQuizFromDiscovery = this.setQuizFromDiscovery.bind(this);
       
       this.saveSuggestion = this.saveSuggestion.bind(this);
       this.login = this.login.bind(this);
       this.isAdmin = this.isAdmin.bind(this);
       this.refreshLogin = this.refreshLogin.bind(this);
       this.loginByToken = this.loginByToken.bind(this);
       this.loginByRecovery = this.loginByRecovery.bind(this);
       this.loginByConfirm = this.loginByConfirm.bind(this);
       this.logout = this.logout.bind(this);
       this.isLoggedIn = this.isLoggedIn.bind(this);
       this.saveUser = this.saveUser.bind(this);
       this.loginByLocalStorage = this.loginByLocalStorage.bind(this);
       this.like = this.like.bind(this);
       this.import = this.import.bind(this);
        this.discoverQuestions = this.discoverQuestions.bind(this);
        this.finishQuiz = this.finishQuiz.bind(this);
        this.getQuestionsForReview = this.getQuestionsForReview.bind(this);
        this.setCurrentQuestion = this.setCurrentQuestion.bind(this);
        this.setCurrentQuiz = this.setCurrentQuiz.bind(this);
        this.setDiscoveryBlock = this.setDiscoveryBlock.bind(this);
        this.clearDiscoveryBlock = this.clearDiscoveryBlock.bind(this);
        this.clearDiscoveryBlocks = this.clearDiscoveryBlocks.bind(this);
        this.setQuizFromTechnique = this.setQuizFromTechnique.bind(this);
         this.openAuth = this.openAuth.bind(this);
        this.shout=this.shout.bind(this);
        this.startMqtt=this.startMqtt.bind(this);
        // listen to messages from child iframe
        //window.addEventListener('message', function(e) {
        //// check message origin
        ////if ( e.origin === 'http://www.dyn-web.com' ) {
            //console.log(['WINDOW MESSAGE',e]);
            //this.setState({token:e.data['token']} ); // task received in postMessage
        ////}
       
        //});
  };
  
  getQueryStringValue (key) {  
          return decodeURIComponent(window.location.search.replace(new RegExp("^(?:.*[&\\?]" + encodeURIComponent(key).replace(/[\.\+\*]/g, "\\$&") + "(?:\\=([^&]*))?)?.*$", "i"), "$1"));  
  } 
          
      
  openAuth(service) {
      console.log(['oauth '+service]);
      let authRequest={response_type:'code',redirect_uri:this.getQueryStringValue('redirect_uri'),response_type:this.getQueryStringValue('response_type'),scope:this.getQueryStringValue('scope'),state:this.getQueryStringValue('state')}
    
      this.setCurrentPage('login');
      localStorage.setItem('oauth',service);
      localStorage.setItem('oauth_request',JSON.stringify(authRequest));
  };

  shout(action,params) {
      console.log('shout');
    try {
       let messageO={'from':this.mqttClientId,action:action,params:params}; 
        
       let message = new Paho.MQTT.Message(JSON.stringify(messageO));
        message.destinationName = "presence";
       this.mqttClient.send(message) 
    } catch (e) {
        console.log(e);
    }
  };


    startMqtt(user) {
        let that = this;
        if (user && String(user._id).length > 0) {
            // MQTT
            this.mqttClientId=  'nemo_'+user._id; //Math.random().toString(16).substr(2, 8);
            // Create a client instance
            let client =  new Paho.MQTT.Client(config.externalMqtt, Number(9001), this.mqttClientId);
            this.mqttClient=client;
            // set callback handlers
            this.mqttClient.onConnectionLost = onConnectionLost;
            this.mqttClient.onMessageArrived = onMessageArrived;
             
            // connect the client
            this.mqttClient.connect({onSuccess:onConnect,useSSL:true,keepAliveInterval:60,timeout:3000});  //
            
        }
         
        // called when the client connects
        function onConnect() {
          // Once a connection has been made, make a subscription and send a message.
          console.log("onConnect");
          that.mqttClient.subscribe("users/"+user._id);
        }
            // called when the client loses its connection
        function onConnectionLost(responseObject) {
          if (responseObject && responseObject.errorCode !== 0) {
            console.log("onConnectionLost:"+responseObject.errorMessage);
          }
        }
         
        // called when a message arrives
        function onMessageArrived(message) {
            console.log('onmessage');
            try {
                if (message) {
                    let json = {}
                    try {
                       json = JSON.parse(message.payloadString);  
                    } catch (e) {
                         console.log(['NOTJSON',message.payloadString]);
                    }  
                    console.log(json);
            
                    if (json && json.from && json.from.length > 0 && json.from !== that.mqttClientId ) {
                        console.log('onmessage');
                        if (json.action==="page" ) {
                            //if (json.page==="discover") {
                                ////that.setQuizFromDiscovery();
                            //} else if (json.page==="review") {
                               //// that.getQuestionsForReview();
                               //// that.setState({'message':null,'currentPage': json.page,title: Navigation.pageTitles[json.page]});
                            //} else {
                                //that.setCurrentPage(json.params);
                            //}
                            
                        }  else if (json.action==="discover") {
                            that.discoverFromQuestionId(json.question);
                        }  else if (json.action==="review") {
                            that.reviewFromQuestionId(json.question);
                        }
                        console.log(json);
                     } else {
                        console.log('bad json in message');
            
                     }
                }
            }  catch (e) {
                 console.log(['onmttmessage error',e]);
            }  

        }

        
    };
    
    componentDidMount() {
      let that = this;
      ReactGA.initialize(config.analyticsKey);
        
        const script = document.createElement("script");
        script.src = "https://apis.google.com/js/platform.js";
        script.onload = () => {
           // console.log('loaded gapis platform');
           //gapi.auth2.init({
                //clientId: this.props.clientId,
                //scope: 'profile email'
            //}).then(function() {
                
                //console.log('iNIT loaded gapis client platform');
            //});
          gapi.load('client:auth2', () => {
                //});
                //console.log('loaded gapis client platform');
                gapi.client.init({
                    clientId: config.clientId,
                    scope: 'profile email'
                }).then(function () {
                  //// Listen for sign-in state changes.
                  //gapi.auth2.getAuthInstance();
                //gapi.client.setApiKey(this.props.clientId);
                //console.log('loaded gapis client platform set key');
                //gapi.load('client:auth2', function() {
                    //console.log('loaded gapis client platform auth2',gapi.auth2);
                    let instance=gapi.auth2.getAuthInstance();  
                    //console.log(['loaded gapis client platform',instance]);
                    that.GoogleAuth = instance;
                });
              });
            //console.log('loaded gapis platform ex1');
          //console.log('loaded gapis platform ex2');
        };
        //console.log('loaded gapis platform ex3');

        document.body.appendChild(script);

    if (window.location.search) {
          let parts = window.location.search.slice(1).split("&");
          parts.forEach(function(part) {
              let iParts=part.split("=");
              // load by token ?
              if (iParts[0]==="oauth") {
                  that.openAuth(iParts[1]);
              } else if (iParts[0]==="confirm") {
                  that.loginByConfirm(window.location.search.slice(9));
              } else if (iParts[0]==="recovery") {
                  that.loginByRecovery(window.location.search.slice(10));
              } else if (iParts[0]==="code") {
                  that.loginByToken(window.location.search.slice(6));
              }
          });
    } 
   // console.log([this.state.user,this.state.token]);
    // try login from localstorage
    let token = JSON.parse(localStorage.getItem('token'));
      if (token) {
     //     console.log('login by local store');
          that.refreshLogin(token);
      }
    
    if (window.location.search) {
        let parts = window.location.search.slice(1).split("&");
        parts.forEach(function(part) {
              let iParts=part.split("=");

              // search on load
              if (iParts[0]==="page") {
                  that.setCurrentPage(iParts[1]);
              } else if (iParts[0]==="question") {
                  that.setQuizFromQuestionId(iParts[1]);
              } else if (iParts[0]==="tag") {
                  that.setQuizFromTag({text:iParts[1]});
              } else if (iParts[0]==="topic") {
                  that.setQuizFromTopic(iParts[1]);
              }
              
        });
      }
      
     
      
      //// load tags and quizzes and indexes
      //fetch('/api/lookups')
      //.then(function(response) {
        ////console.log(['got response', response])
        //return response.json()
      //}).then(function(json) {
        ////console.log(['create indexes', json])
        //that.setState(json);
      //}).catch(function(ex) {
        //console.log(['parsing failed', ex])
      //})
      fetch('/api/topiccollections')
      .then(function(response) {
        //console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        //console.log(['create indexes', json])
        that.setState({topicCollections:json});
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  }
  

  refreshLogin (token=null) {
      if (!token) {
          token=this.state.token;
      }
      var state={};
      var that = this;
      state.user = this.state.user;
      //state.currentPage = 'home';
      //console.log('refresh token');
        //console.log(user);
        var params={
            'refresh_token':token.refresh_token,
            'grant_type':'refresh_token',
            'client_id':config.clientId,
            'client_secret':config.clientSecret
          };
        fetch('/oauth/token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            //Authorization: 'Basic '+btoa(config.clientId+":"+config.clientSecret) 
          },
          body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
        }).then(function(response) {
            return response.json();
            
        }).then(function(res) {
            //console.log(['ddtoken response',res]);
            state.token = res;
          //  console.log(['refreshed token',res]);
//            that.setState(state);
  //          localStorage.setItem('token',JSON.stringify(res));
            fetch('/login/me?code='+state.token.access_token, {
              method: 'GET',
            }).then(function(response) {
                return response.json();
                
            }).then(function(res) {
            //    console.log(['ddtoken response',res]);
                state.user = res.user;
                state.token = res.token;
                localStorage.setItem('token',JSON.stringify(res.token));
                localStorage.setItem('user',JSON.stringify(state.user));
                that.setState(state);
                that.startMqtt(res.user)
                //setInterval(function() {
              ////      console.log('toke ref tok');
                    //that.refreshLogin(state.user)
                //},(parseInt(that.state.token.expires_in,10)-1)*1000);
            })
            .catch(function(err) {
                console.log(['ERR',err]);
            });
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });

  }

 isAdmin() {
        if (this.state.user && this.state.user.username && 
        (this.state.user.username==="stever@syntithenai.com" 
            || this.state.user.username==="syntithenai@gmail.com" 
//            || this.state.user.username==="sofieblossom@gmail.com" 
            || this.state.user.username==="mnemoslibrary@gmail.com" 
            || this.state.user.username.toLowerCase()==="trevorryan123@gmail.com")) {
            return true;
        }
        return false;
    };
    
  login (user) {
      if (user) {
          var state={};
          var that = this;
          state.user = user;
          //state.currentPage = 'home';
          //console.log('login at root');
            //console.log(user);
            var params={
                username: user.email ? user.email : user.username,
                password: user.password,
                'grant_type':'password',
                'client_id':config.clientId,
                'client_secret':config.clientSecret
              };
            fetch('/oauth/token', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                //Authorization: 'Basic '+btoa(config.clientId+":"+config.clientSecret) 
              },
              body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
            }).then(function(response) {
                return response.json();
                
            }).then(function(res) {
               // console.log(['ddtoken response',res]);
                state.token = res;
                localStorage.setItem('token',JSON.stringify(res));
                localStorage.setItem('user',JSON.stringify(that.state.user));
                that.startMqtt(that.state.user)
                // load progress
                //fetch('/api/progress')
                  //.then(function(response) {
                ////    console.log(['got response', response])
                    //return response.json()
                  //}).then(function(json) {
                  ////  console.log(['set progress', json])
                    //that.setState(state);
                    //that.updateProgress(json);

                  //}).catch(function(ex) {
                    //console.log(['parsing failed', ex])
                  //})
                    setInterval(function() {
                       // console.log('toke ref');
                        that.refreshLogin(state.token)
                    },(parseInt(this.state.token.expires_in,10)-1)*1000);
            })
            .catch(function(err) {
                console.log(['ERR',err]);
            });
        }
  }
  
  loginByLocalStorage() {
      //return ;
      ////console.log(['loginByLocalStorage1',localStorage.getItem('token'),JSON.parse(localStorage.getItem('token'))]);
      //if (localStorage.getItem('token') && localStorage.getItem('token').length > 0 && localStorage.getItem('user') && localStorage.getItem('user').length > 0) {
          ////this.setState({user:JSON.parse(localStorage.getItem('user')),token:JSON.parse(localStorage.getItem('token'))});
          //this.login(JSON.parse(localStorage.getItem('user')));
      //}
  };
  
  loginByToken(token) {
      let state = {token: token};
      let that = this;
      fetch('/login/me?code='+token, {
          method: 'GET',
        }).then(function(response) {
            return response.json();
            
        }).then(function(res) {
        //    console.log(['ddtoken response',res]);
            state.user = res.user;
            state.token = res.token;
            localStorage.setItem('token',JSON.stringify(res.token));
            localStorage.setItem('user',JSON.stringify(state.user));
            that.setState(state);
            that.startMqtt(state.user)
            setInterval(function() {
          //      console.log('toke ref tok');
                that.refreshLogin(state.user)
            },(parseInt(that.state.token.expires_in,10)-1)*1000);
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
  };
  
    loginByConfirm(token) {
      let state = {token: token};
      let that = this;
      fetch('/login/doconfirm?code='+token, {
          method: 'GET',
        }).then(function(response) {
            return response.json();
            
        }).then(function(res) {
        //    console.log(['ddtoken response',res]);
            state.user = res.user;
            state.token = res.token;
            localStorage.setItem('token',JSON.stringify(res.token));
            localStorage.setItem('user',JSON.stringify(state.user));
            that.setState(state);
            that.startMqtt(state.user)
            setInterval(function() {
            //    console.log('toke ref tok');
                that.refreshLogin(state.user)
            },(parseInt(this.state.token.expires_in,10)-1)*1000);
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
  };
  
    loginByRecovery(token) {
      let state = {token: token};
      let that = this;
      fetch('/login/dorecover?code='+token, {
          method: 'GET',
        }).then(function(response) {
            return response.json();
            
        }).then(function(res) {
        //    console.log(['ddtoken response',res]);
            state.user = res.user;
            state.token = res.token;
            localStorage.setItem('token',JSON.stringify(res.token));
            localStorage.setItem('user',JSON.stringify(state.user));
            that.setState(state);
            that.startMqtt(state.user)
            setInterval(function() {
              //  console.log('toke ref tok');
                that.refreshLogin(state.user)
            },(parseInt(this.state.token.expires_in,10)-1)*1000);
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
  };
  
  logout() {
      var state={};
      state.user = '';
      state.token = '';
      this.analyticsEvent('logout')
      state.currentPage = 'splash';
      localStorage.setItem('token','{}');
      localStorage.setItem('user','{}');
      this.setState(state);
      //console.log(['logout',gapi.auth2]);
      //console.log(this.state);
      //this.GoogleAuth.disconnect();
      //let GoogleAuth = gapi.auth2.getAuthInstance();
      this.GoogleAuth.disconnect();
      window.location='/';
      //gapi.auth2.getAuthInstance().disconnect();
      //var auth2 = gapi.auth2.getAuthInstance();
        //auth2.signOut().then(function () {
          //console.log('User signed out.');
        //});
    //console.log('logout at root');
      
  };
        
  isLoggedIn() { 
      //
      if (this.state.token && this.state.token.access_token && this.state.token.access_token.length > 0 && this.state.user && this.state.user.username  && this.state.user.username.length > 0) {
          return true;
      } else {
          return false;
      }
  };  
  
     saveUser(user,child) {
         let that = this;
        fetch('/login/saveuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        }).then(function(res) {
            return res.json();  
        }).then(function(res) {
            console.log('saved user');
            
            console.log(res);
            console.log(user);
            
            child.setState(res);
            //that.setState({users:{default:user}});
            that.setState({user:user});
        }).catch(function(err) {
            //console.log(err);
            child.setState({'warning_message':'Not Saved'});
        });
    };
   
   
   saveQuestion(data) {
       console.log(['save quesgtions',data]);
   } 
  
  analyticsEvent(page) {
     // console.log(['ANALYTICS CURRENTPAGE',page]);
      ReactGA.event({
          category: 'Navigation',
          action:  page
        });
      
  };
  
  setCurrentPage(page) {
      this.analyticsEvent(page);
      if (page==="review") {
          this.getQuestionsForReview();
      } 
      //else if (page==="discover") {
         //this.setQuizFromDiscovery();
         //page='home'
      //}
      this.setState({'message':null,'currentPage': page,title: Navigation.pageTitles[page]});
  };  
 
  setCurrentQuiz(quiz) {
      this.setState({'currentQuiz':quiz});
  };  

    setCurrentQuestion(id) {
       // console.log(['set current question',id]);
        this.setState({currentQuestion:parseInt(id,10)});
    };
    
  isCurrentPage(page) {
      return (this.state.currentPage === page);
  }; 
 
  setMessage(message) {
      this.setState({'message':message});
  };

  
  setDiscoveryBlock(type,id) {
      this.clearDiscoveryBlock(type,id);
      let discoveryBlocks = this.state.discoveryBlocks;
      if (discoveryBlocks.hasOwnProperty(type) && Array.isArray(discoveryBlocks[type])) {
          discoveryBlocks[type].push(id);
      }
      this.setState({'blocks':discoveryBlocks});
      this.discoverQuestions();
  };
  
  clearDiscoveryBlock(type,id) {
      let discoveryBlocks = this.state.discoveryBlocks;
      if (discoveryBlocks.hasOwnProperty(type) && Array.isArray(discoveryBlocks[type])) {
          discoveryBlocks[type] = discoveryBlocks[type].filter(function(item) { 
              return item !== id
          })
      }
      this.setState({'blocks':discoveryBlocks});
      this.discoverQuestions();
  };
  
   clearDiscoveryBlocks() {
      let discoveryBlocks = {tag:[],topic:[],technique:[]};
      this.setState({'blocks':discoveryBlocks});
      this.discoverQuestions();
  };

  
    saveSuggestion(id,question,mnemonic,technique) {
        let that=this;
        if (this.state.user) {
           // console.log(['SAVE SUGGESTION',id,question,mnemonic,technique]);
             return fetch('/api/savemnemonic', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({_id:id,user:that.state.user._id,mnemonic:mnemonic,technique:technique,question:question._id,questionText:question.question})
            }).then(function(res) {
                return res.json();  
            }).then(function(res) {
                
            }).catch(function(err) {
                //console.log(err);
                that.setState({'warning_message':'Not Saved'});
            });
        }
    };

  // send an api request to like a question
  
  like(questionId,mnemonicId) {
      //console.log(['applike']);
    let that = this;
    let userSelections = this.state.user.selectedMnemonics ? this.state.user.selectedMnemonics : {} ;  
    userSelections[questionId] = mnemonicId;
    return fetch('/login/saveuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({'_id':this.state.user._id,avatar:this.state.user.avatar,selectedMnemonics:userSelections})
    }).then(function() {
        //console.log(['applike results']);
        let user=that.state.user;
        //console.log(['applike results user',user]);
        user.selectedMnemonics = userSelections;
        //console.log(['applike results set mn',userSelections]);
         that.setState(user:user);
        //console.log(['set user',user]);
    }).catch(function(err) {
        //that.setState({'warning_message':'Not Saved'});
    });
    //return false;
  };

  // request api import and dowload results as csv
  import() {
      let that = this;
      fetch('/api/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }).then(function(res) {
            return res.text();
        }).then(function(res) {
            var FileSaver = require('file-saver');
            var blob = new Blob([res], {type: "text/plain;charset=utf-8"});
            FileSaver.saveAs(blob, "questions.csv");
            fetch('/api/sitemap');
        }).catch(function(err) {
            that.setState({'warning_message':'Not Saved'});
        });
  };
  
 

  // SET QUIZ
  setQuiz(title,questionIds) {
      let newIds = [];
      let that = this;
     // console.log(questionIds);
      questionIds.forEach(function(questionId) {
       //   console.log(questionId,questionIds[questionId]);
        //  console.log(that.state.users.default.questions.block);
          if (!that.state.users.default.questions.block.hasOwnProperty(questionId)) newIds.push(questionId);
      });
      //console.log({'currentPage':'home','currentQuiz':newIds,'title': Utils.snakeToCamel(title)});
      this.analyticsEvent('discover')
      this.setState({'currentPage':'home','currentQuiz':newIds,'title': Utils.snakeToCamel(title)});
  };

    
    finishQuiz() {
        //console.log('root finish quiz');
        //confirmAlert({
          //title: 'Question set complete',
          //message: 'Time for review?',
          //buttons: [
            //{
              //label: 'Review',
              //onClick: () => this.setPage('review')
            //},
            //{
              //label: 'Continue',
              //onClick: () => this.discoverQuestions()
            //}
          //]
        //})
            
    };
    
     getQuestionsForReview() {
     //    console.log('getQuestionsForReview');
      let that = this;
      //console.log('get q for review');
      if (this.state.user) {
        fetch('/api/review?user='+this.state.user._id)
          .then(function(response) {
            //console.log(['got response', response])
            return response.json()
          }).then(function(json) {
            //console.log(['create indexes', json])
            //console.log(['create indexes', json])
            let currentQuiz = [];
            let indexedQuestions= {};
            for (var questionKey in json['questions']) {
                const question = json['questions'][questionKey]
                if (question) {
                    var id = question._id;
                    currentQuiz.push(id);
                    indexedQuestions[id]=questionKey;                    
                }
            }
            that.setState({'currentQuestion':0,'currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,'title': 'Review'});
           // console.log(['set state done', that.state])
          }).catch(function(ex) {
            console.log(['parsing failed', ex])
          })
      }
  };
    
       
   discoverQuestions() {
      // console.log(['discover da questions']);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      //?user='+(this.state.user ? this.state.user._id : '') + '&rand='+Math.random()
      let rand=Math.random()
      fetch('/api/discover',{ method: "POST",headers: {
    "Content-Type": "application/json"},body:JSON.stringify({user:(this.state.user ? this.state.user._id : ''),rand:rand,blocks:this.state.discoveryBlocks})})
      .then(function(response) {
        // console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        //console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
        }
        that.setState({'currentQuestion':'0','currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,'title': 'Discover'});
        //console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  }; 
  
  setQuizFromDiscovery() {
     // console.log(['Setquiz discovery']);
      this.setCurrentPage('home')
      this.discoverQuestions()
      
  };


  discoverFromQuestionId(questionId) {
      let that = this;
      // load selected question
      fetch('/api/questions?question='+questionId )
      .then(function(response) {
        return response.json()
      }).then(function(json1) {
//            console.log(['got response', json1])
          if (json1.questions && json1.questions.length > 0) {
            let question=json1.questions[0];
            if (question) {
                let id=question._id
                let currentQuiz=[id];
                let indexedQuestions={};
                indexedQuestions[id]=0;
                let questions=[question];
                let state={currentPage:"home",'currentQuestion':0,'currentQuiz':currentQuiz, 'questions':questions,'indexedQuestions':indexedQuestions,title: 'Discover'};
                that.setState(state);
            }              
          }
      });
  };
  
  reviewFromQuestionId(questionId) {
      console.log(['SQFQid',questionId]);
      let that = this;
      // load selected question
      fetch('/api/questions?question='+questionId )
      .then(function(response) {
        return response.json()
      }).then(function(json1) {
      //      console.log(['got response', json1])
          if (json1.questions && json1.questions.length > 0) {
            let question=json1.questions[0];
            if (question) {
                let id=question._id
                let currentQuiz=[id];
                let indexedQuestions={};
                indexedQuestions[id]=0;
                let questions=[question];
                let state={currentPage:"review",'currentQuestion':0,'currentQuiz':currentQuiz, 'questions':questions,'indexedQuestions':indexedQuestions,title: 'Review'};
                that.setState(state);
            }              
          }
      });
  };

  setQuizFromQuestionId(questionId) {
      console.log(['SQFQid',questionId]);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load selected question
      fetch('/api/questions?question='+questionId )
      .then(function(response) {
        //console.log(['got response', response])
        return response.json()
      }).then(function(json1) {
        let question=json1.questions[0];
        console.log(['got response', json1])
        if (question) {
            // load questions in topic
            fetch('/api/questions?topic='+question.quiz )
            
            .then(function(response) {
                //console.log(['got response', response])
                return response.json()
            }).then(function(json) {
                //console.log(['create indexes', json])
                let currentQuiz = [];
                let indexedQuestions= {};
                let currentQuestion=0;
                let j=0;
                for (var questionKey in json['questions']) {
                    const question = json['questions'][questionKey]
                    var id = question._id;
                    if (questionId && questionId===id) {
                        currentQuestion=j;
                        console.log(['ID match',id, j])
                    }
                    currentQuiz.push(id);
                    indexedQuestions[id]=questionKey;
                    j++;
                }
              //  console.log(currentQuiz);
                that.analyticsEvent('discover question')
                that.setState({currentPage:"home",'currentQuestion':currentQuestion,'currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,title: 'Discover'});
                //console.log(['set state done', that.state])    
            });
        }
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      
  };
  
  setQuizFromQuestion(question) {
      let selectedQuestion=question._id;
      //console.log(['set quiz from question',selectedQuestion]);
      let topic = question.quiz;
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      let url='/api/questions?topic='+topic ;
      if (this.state.user) {
          url=url+'&user='+this.state.user._id;
      }
      fetch(url)
      .then(function(response) {
      //  console.log(['got response', response])
        return response.json()
      }).then(function(json) {
       // console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        let currentQuestion=0;
        let j=0;
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
           // console.log(['check ID match',j,id, selectedQuestion ])
            if (selectedQuestion && selectedQuestion===id) {
                currentQuestion=j;
             //   console.log(['ID match',selectedQuestion, j])
            }
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
            j++;
        }
       // console.log(['currentQuiz',currentQuestion,currentQuiz]);
        that.analyticsEvent('discover topic')
        that.setState({currentPage:"home",'currentQuestion':currentQuestion,'currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,title: 'Discover Topic '+  decodeURI(Utils.snakeToCamel(topic))});
        //console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  };
  
  setQuizFromTopic(topic,selectedQuestion) {
      //console.log(['set quiz from topic',topic,selectedQuestion]);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      let url='/api/questions?topic='+topic ;
      if (this.state.user) {
          url=url+'&user='+this.state.user._id;
      }
      fetch(url)
      .then(function(response) {
      //  console.log(['got response', response])
        return response.json()
      }).then(function(json) {
      //  console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        let currentQuestion=0;
        let j=0;
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
         //   console.log(['check ID match',j,id, selectedQuestion ])
            if (selectedQuestion && selectedQuestion===j) {
                currentQuestion=j;
          //      console.log(['ID match',selectedQuestion, j])
            }
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
            j++;
        }
     //   console.log(['currentQuiz',currentQuestion,currentQuiz]);
        that.analyticsEvent('discover topic')
        that.setState({currentPage:"home",'currentQuestion':currentQuestion,'currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,title: 'Discover Topic '+  decodeURI(Utils.snakeToCamel(topic))});
        //console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      
  };
  
  
  discoverQuizFromTopic(topic,selectedQuestion) {
      console.log(['dissc quiz from topic',topic,selectedQuestion,this.state.user]);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      let url='/api/discover';
      let rand=Math.random()
      fetch(url,{ method: "POST",headers: {
            "Content-Type": "application/json"
            },
            body:JSON.stringify({
                topic:topic,
                user:(this.state.user ? this.state.user._id : ''),
                rand:rand
            })
        })
      .then(function(response) {
      //  console.log(['got response', response])
        return response.json()
      }).then(function(json) {
      //  console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        let currentQuestion=0;
        let j=0;
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
         //   console.log(['check ID match',j,id, selectedQuestion ])
            if (selectedQuestion && selectedQuestion===j) {
                currentQuestion=j;
          //      console.log(['ID match',selectedQuestion, j])
            }
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
            j++;
        }
     //   console.log(['currentQuiz',currentQuestion,currentQuiz]);
        that.analyticsEvent('discover topic')
        that.setState({currentPage:"home",'currentQuestion':currentQuestion,'currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,title: 'Discover Topic '+  decodeURI(Utils.snakeToCamel(topic))});
        //console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      
  };
  reviewBySuccessBand(band) {
      console.log(['set review from band',band]);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      let url='/api/review?band='+band ;
      if (this.state.user) {
          url=url+'&user='+this.state.user._id;
      }
      fetch(url)
      .then(function(response) {
      //  console.log(['got response', response])
        return response.json()
      }).then(function(json) {
      //  console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        let currentQuestion=0;
        let j=0;
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
         //   console.log(['check ID match',j,id, selectedQuestion ])
           
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
            j++;
        }
     //   console.log(['currentQuiz',currentQuestion,currentQuiz]);
        that.analyticsEvent('discover topic')
        that.setState({currentPage:"review",'currentQuestion':currentQuestion,'currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,title: 'Review Success Band  '+  band});
        //console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  };
  
  setReviewFromTopic(topic,selectedQuestion) {
      console.log(['set review from topic',topic,selectedQuestion]);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      let url='/api/review?topic='+topic ;
      if (this.state.user) {
          url=url+'&user='+this.state.user._id;
      }
      fetch(url)
      .then(function(response) {
      //  console.log(['got response', response])
        return response.json()
      }).then(function(json) {
      //  console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        let currentQuestion=0;
        let j=0;
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
         //   console.log(['check ID match',j,id, selectedQuestion ])
            if (selectedQuestion && selectedQuestion===j) {
                currentQuestion=j;
          //      console.log(['ID match',selectedQuestion, j])
            }
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
            j++;
        }
     //   console.log(['currentQuiz',currentQuestion,currentQuiz]);
        that.analyticsEvent('discover topic')
        that.setState({currentPage:"review",'currentQuestion':currentQuestion,'currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,title: 'Discover Topic '+  decodeURI(Utils.snakeToCamel(topic))});
        //console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      
  };
  
  setQuizFromTag(tag) {
     //console.log(['set quiz form tag',tag]);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      fetch('/api/questions?tag='+tag.text )
      .then(function(response) {
        //console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        //console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
        }
        //that.setCurrentPage('home');
        that.analyticsEvent('discover tag')
        that.setState({'currentPage':'home','currentQuestion':'0','currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,'title': 'Discover Tag '+ decodeURI(tag.text),'tagFilter':tag.text});
        //console.log(['set state done', that.state])
         //that.setState({});
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  };
  setQuizFromTechnique(tag) {
     let that=this;
     //console.log(['set quiz form tag',tag]);
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      fetch('/api/questions?technique='+tag )
      .then(function(response) {
       // console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        //console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
        }
        that.setCurrentPage('home');
        that.setState({'currentQuestion':'0','currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,'title': 'Discover Technique '+ decodeURI(tag)});
        //console.log(['set state done', that.state])
         //that.setState({});
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  };  
  clearTagFilter() {
      this.setState({'tagFilter':null});
  };

  // save modified user to state and localstorage
  updateProgress(user) {
        //let users = {'users':{'default':user}};
        //this.setState(users);
        //localStorage.setItem('users',JSON.stringify(users));
    };
    

    
  render() {
    const progress = this.state.users.default;
    const topics = this.state.topics;
    const tags = this.state.words;
    const showProfile = this.isCurrentPage('profile') && this.isLoggedIn();
    const showLogin = this.isCurrentPage('login') && !this.isLoggedIn();
    let title=decodeURIComponent(this.state.title);
    
    if (this.isCurrentPage('disabled')) {
        return (<div>DIS</div>);
    } else {
                
        
        return (
            <div className="mnemo">
            
                {this.state.message && <div className='page-message' ><b>{this.state.message}</b></div>}
                <Navigation shout={this.shout} user={this.state.user} isLoggedIn={this.isLoggedIn} setCurrentPage={this.setCurrentPage} login={this.login} setQuizFromDiscovery={this.setQuizFromDiscovery} title={this.state.title} />
                
                {((this.isCurrentPage('splash')) || (this.isCurrentPage('') && !this.isLoggedIn())) && <div><FindQuestions setQuizFromDiscovery={this.setQuizFromDiscovery} setCurrentPage={this.setCurrentPage} title={title}/></div>}
                
                {this.isCurrentPage('home') && <QuizCarousel 
                    isAdmin={this.isAdmin}  
                    setCurrentPage={this.setCurrentPage}  
                    setCurrentQuestion={this.setCurrentQuestion}   
                    setCurrentQuiz={this.setCurrentQuiz} 
                    saveSuggestion={this.saveSuggestion} 
                    setQuizFromTechnique={this.setQuizFromTechnique} 
                    setQuizFromTopic={this.setQuizFromTopic} 
                    setDiscoveryBlock={this.setDiscoveryBlock}  
                    setQuizFromDiscovery={this.setQuizFromDiscovery} 
                    setQuizFromTag={this.setQuizFromTag} 
                    clearDiscoveryBlock={this.clearDiscoveryBlock} 
                    blocks={this.state.discoveryBlocks}  
                    discoverQuestions={this.discoverQuestions}  
                    questions={this.state.questions} 
                    currentQuestion={this.state.currentQuestion} 
                    currentQuiz={this.state.currentQuiz} 
                    indexedQuestions={this.state.indexedQuestions} 
                    user={this.state.user} 
                    progress={progress}  
                    updateProgress={this.updateProgress} 
                    like={this.like} 
                    isLoggedIn={this.isLoggedIn} 
                    mnemonic_techniques={this.state.mnemonic_techniques} 
                    setMessage={this.setMessage} 
                    isReview={false} /> }
                
                {this.isCurrentPage('topics') && <TopicsPage topicCollections={this.state.topicCollections} topics={topics}  topicTags={this.state.topicTags} tagFilter={this.state.tagFilter}  clearTagFilter={this.clearTagFilter} setQuiz={this.setQuizFromTopic} setCurrentPage={this.setCurrentPage}/>
                }
                {this.isCurrentPage('tags') && <TagsPage  setCurrentPage={this.setCurrentPage} tags={tags} relatedTags={this.state.relatedTags} setQuiz={this.setQuizFromTag} />
                }
                {this.isCurrentPage('search') && <SearchPage mnemonic_techniques={this.state.mnemonic_techniques} setCurrentPage={this.setCurrentPage} questions={this.state.questions} setQuiz={this.setQuizFromQuestion} />
                }
                {this.isCurrentPage('review') && <ReviewPage 
                    isAdmin={this.isAdmin}  
                    saveSuggestion={this.saveSuggestion} 
                    setCurrentQuestion={this.setCurrentQuestion} 
                    setCurrentPage={this.setCurrentPage} 
                    setCurrentQuiz={this.setCurrentQuiz} 
                    setQuizFromTechnique={this.setQuizFromTechnique} 
                    setQuizFromDiscovery={this.setQuizFromDiscovery} 
                    setQuizFromTopic={this.setQuizFromTopic} 
                    setDiscoveryBlock={this.setDiscoveryBlock} 
                    setQuizFromTag={this.setQuizFromTag}  
                    clearDiscoveryBlock={this.clearDiscoveryBlock} 
                    blocks={this.state.discoveryBlocks} 
                    discoverQuestions={this.discoverQuestions}  
                    getQuestionsForReview={this.getQuestionsForReview} 
                    mnemonic_techniques={this.state.mnemonic_techniques} 
                    questions={this.state.questions} 
                    currentQuiz={this.state.currentQuiz} 
                    currentQuestion={this.state.currentQuestion} 
                    indexedQuestions={this.state.indexedQuestions} 
                    topicTags={this.state.topicTags} 
                    updateProgress={this.updateProgress} 
                    finishQuiz={this.finishReview}  
                    isReview={true} 
                    setMessage={this.setMessage} 
                    like={this.like} user={this.state.user} 
                    progress={progress} 
                    isLoggedIn={this.isLoggedIn}  
                />
                }
                {this.isCurrentPage('create') && <CreatePage  user={this.state.user} isAdmin={this.isAdmin}  mnemonic_techniques={this.state.mnemonic_techniques} saveQuestion={this.saveQuestion} setQuizFromTopic={this.setQuizFromTopic} setCurrentPage={this.setCurrentPage} />
                }
                {this.isCurrentPage('about') && <AboutPage setCurrentPage={this.setCurrentPage} />
                }
                {this.isCurrentPage('intro') && <IntroPage setCurrentPage={this.setCurrentPage} />
                }
                {this.isCurrentPage('termsofuse') && <TermsOfUse  setCurrentPage={this.setCurrentPage} />
                }
                {this.isCurrentPage('faq') && <FAQ  setCurrentPage={this.setCurrentPage} />
                }
                {this.isCurrentPage('createhelp') && <CreateHelp  />
                }
                {(this.isCurrentPage('profile') || (this.isCurrentPage('')) && this.isLoggedIn()) && <ProfilePage token={this.state.token} setCurrentPage={this.setCurrentPage} setQuizFromDiscovery={this.setQuizFromDiscovery} reviewBySuccessBand={this.reviewBySuccessBand} setReviewFromTopic={this.setReviewFromTopic} setQuizFromTopic={this.discoverQuizFromTopic} searchQuizFromTopic={this.setQuizFromTopic}  isAdmin={this.isAdmin} saveUser={this.saveUser} user={this.state.user} logout={this.logout} import={this.import} />
                }
                {(showLogin) && <LoginPage token={this.state.token} login={this.login} setCurrentPage={this.setCurrentPage}/>
                }<br/>
                <Footer/>
                
            </div>
            
        );
        
    }
  }
}

 
//<AdSense.Google
              //client='ca-pub-8152690534650306'
              //slot='5452746977'
            ///>
