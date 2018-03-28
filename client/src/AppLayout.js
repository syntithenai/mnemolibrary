import React, { Component } from 'react';

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

//import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//import SignIn from './SignIn';
//import FindQuestions from './FindQuestions';

import 'whatwg-fetch'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

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
      let userString = localStorage.getItem('users');
      if (userString) {
          let data = JSON.parse(userString);
          users = data['users'];
      }
      this.state = {
          title : "Mnemos Library",
          message: null,
          currentPage: "home",
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
          token:null
      }
      // make 'this' available in setCurrentPage function
      this.setCurrentPage = this.setCurrentPage.bind(this);
      this.setQuiz = this.setQuiz.bind(this);
      this.setQuizFromQuestion = this.setQuizFromQuestion.bind(this);
      this.setQuizFromTopic = this.setQuizFromTopic.bind(this);
      this.setQuizFromTag = this.setQuizFromTag.bind(this);
      this.updateProgress = this.updateProgress.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      
      this.getTagsByTitle = this.getTagsByTitle.bind(this);
      this.getTopicsByTitle = this.getTopicsByTitle.bind(this);
      this.getQuestionsByTag = this.getQuestionsByTag.bind(this);
      this.getQuestionsByTopic = this.getQuestionsByTopic.bind(this);
      
      //this.getQuestionsForReview = this.getQuestionsForReview.bind(this);
      //this.getTopicsForReview = this.getTopicsForReview.bind(this);
      //this.getTagsForReview = this.getTagsForReview.bind(this);
      this.getTagsByTitle = this.getTagsByTitle.bind(this);
      this.getTopicsByTitle = this.getTopicsByTitle.bind(this);
      this.getQuestionsByTag = this.getQuestionsByTag.bind(this);
      this.getQuestionsByTopic = this.getQuestionsByTopic.bind(this);
         
      // this.finishTopic = this.finishTopic.bind(this);
       //this.finishReview = this.finishReview.bind(this);
       this.clearTagFilter = this.clearTagFilter.bind(this);
       this.setMessage = this.setMessage.bind(this);
       this.setQuizFromDiscovery = this.setQuizFromDiscovery.bind(this);
       
       this.login = this.login.bind(this);
       this.loginByToken = this.loginByToken.bind(this);
       this.logout = this.logout.bind(this);
       this.isLoggedIn = this.isLoggedIn.bind(this);
       this.saveUser = this.saveUser.bind(this);
       
       this.like = this.like.bind(this);
       this.import = this.import.bind(this);
        this.discoverQuestions = this.discoverQuestions.bind(this);
        
        // listen to messages from child iframe
        //window.addEventListener('message', function(e) {
        //// check message origin
        ////if ( e.origin === 'http://www.dyn-web.com' ) {
            //console.log(['WINDOW MESSAGE',e]);
            //this.setState({token:e.data['token']} ); // task received in postMessage
        ////}
       
        //});
  };
  

  componentDidMount() {
      if (window.location.search && window.location.search.startsWith('?code=')) {
          this.loginByToken(window.location.search.slice(6));
      }
      let that = this;
      // load tags and quizzes and indexes
      fetch('/api/lookups')
      .then(function(response) {
        //console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        //console.log(['create indexes', json])
        that.setState(json);
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  }
  
  login (user) {
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
          //  console.log(['ddtoken response',res]);
            state.token = res;
            // load progress
            fetch('/api/progress')
              .then(function(response) {
            //    console.log(['got response', response])
                return response.json()
              }).then(function(json) {
              //  console.log(['set progress', json])
                that.setState(state);
                that.updateProgress(json);
              }).catch(function(ex) {
                console.log(['parsing failed', ex])
              })
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });

  }
  
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
            that.setState(state);
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
  };
  
  logout() {
      var state={};
      state.user = '';
      state.token = '';
      state.currentPage = 'home';
      this.setState(state);
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
        fetch('/login/saveuser', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(user)
        }).then(function(res) {
            return res.json();  
        }).then(function(res) {
            //console.log('saved user');
            //console.log(res);
            child.setState(res);
        }).catch(function(err) {
            //console.log(err);
            child.setState({'warning_message':'Not Saved'});
        });
    };
   
   
   saveQuestion(data) {
       console.log(['save quesgtions',data]);
   } 
  
  setCurrentPage(page) {
      this.setState({'message':null,'currentPage': page,title: Navigation.pageTitles[page]});
  };  
 
  
  setCurrentQuiz(quiz) {
      this.setState({'currentQuiz':quiz});
  };  
    
  isCurrentPage(page) {
      return (this.state.currentPage === page);
  }; 
 
  setMessage(message) {
      //this.setState({'message':message});
  };

  getTagsByTitle(title) {
      return this.state.words.filter(e => e.text.indexOf(title) >= 0);
  };

  getTopicsByTitle(title) {
      return this.state.topics.filter(e => e.text.indexOf(title) >= 0);
  }; 
  
  getQuestionsByTag(tag) {
      return this.state.tags[tag];
  }; 

  getQuestionsByTopic(topic) {
      return this.state.topics[topic];
  }; 

  like(questionId) {
     let user = this.state.users.default;
    //console.log(['like',questionId,this.state,user]); 
     if (!user.questions.likes) user.questions.likes = {};
     if (questionId in user.questions.likes) {
        // console.log('already voted');
     } else {
         user.questions.likes[questionId] = 1;
      //   console.log(['setstate',user]); 
         this.setState({'users':{'default':user}});
         let questions = this.state.questions;
         questions[this.state.indexedQuestions[questionId]].score = parseInt(questions[this.state.indexedQuestions[questionId]].score,10) + 1; 
         this.setState({'questions':questions});
         // central storage
         fetch('/api/like', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({'user':this.state.user._id,'question':questionId})
        }).catch(function(err) {
            this.setState({'warning_message':'Not Saved'});
        });
         
     }
     return false;
  };

  import() {
      let that = this;
      fetch('/api/import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({})
        }).then(function(res) {
            return res.json();  
        }).then(function(res) {
            //console.log('saved user');
            //console.log(res);
            that.setState(res);
        }).catch(function(err) {
            that.setState({'warning_message':'Not Saved'});
        });
  };


  // SET QUIZ
  setQuiz(title,questionIds) {
      let newIds = [];
      let that = this;
      console.log(questionIds);
      questionIds.forEach(function(questionId) {
       //   console.log(questionId,questionIds[questionId]);
        //  console.log(that.state.users.default.questions.block);
          if (!that.state.users.default.questions.block.hasOwnProperty(questionId)) newIds.push(questionId);
      });
      //console.log({'currentPage':'home','currentQuiz':newIds,'title': Utils.snakeToCamel(title)});
      this.setState({'currentPage':'home','currentQuiz':newIds,'title': Utils.snakeToCamel(title)});
  };

       
   discoverQuestions() {
      console.log(['discover questions']);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      fetch('/api/discover?user='+(this.state.user != null ? this.state.user._id : ''))
      .then(function(response) {
        console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        console.log(['create indexes', json])
        let currentQuiz = [];
      let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
        }
        that.setState({'currentQuestion':'0','currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,'title': 'Discover'});
        console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
  }; 
  
  setQuizFromDiscovery() {
      console.log(['Setquiz discovery']);
      this.setCurrentPage('home')
      this.discoverQuestions()
      
  };
  setQuizFromQuestion(question) {
      //console.log(['SQFQ',question,question._id]);
      this.setQuizFromTopic(question.quiz)
  };
  setQuizFromTopic(topic) {
       console.log(['set quiz from topic']);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      fetch('/api/questions?topic='+topic )
      .then(function(response) {
        console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
        }
        that.setCurrentPage('home');
        that.setState({'currentQuestion':'0','currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,title: 'Discover Topic '+  Utils.snakeToCamel(topic)});
        console.log(['set state done', that.state])
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      
      
      //const questions = this.getQuestionsByTopic(topic);
      ////questions.filter(e => !this.state.users.default.questions.blocked.hasOwnProperty(e));
      //this.setQuiz(topic,questions);
      //// ensure topic key exists
      //let user = this.state.users.default;
      //user.topics[topic] = new Date().getTime();
      //this.updateProgress(user);
  };
  setQuizFromTag(tag) {
     console.log(['set quiz form tag',tag]);
      let that = this;
      //this.setState({'currentQuiz':'1,2,3,4,5'});
      // load initial questions
      fetch('/api/questions?tag='+tag.text )
      .then(function(response) {
        console.log(['got response', response])
        return response.json()
      }).then(function(json) {
        console.log(['create indexes', json])
        let currentQuiz = [];
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question._id;
            currentQuiz.push(id);
            indexedQuestions[id]=questionKey;
        }
        that.setCurrentPage('home');
        that.setState({'currentQuestion':'0','currentQuiz':currentQuiz, 'questions':json['questions'],'indexedQuestions':indexedQuestions,'title': 'Discover Tag '+ Utils.snakeToCamel(tag.text),'tagFilter':tag.text});
        console.log(['set state done', that.state])
         //that.setState({});
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      //const questions = this.getQuestionsByTag(tag.text);
      ////questions.filter(e => !this.state.users.default.questions.blocked.hasOwnProperty(e));
      //this.setQuiz('Tag - '+tag.text,questions);
      //const time = new Date().getTime();
      //let user = this.state.users.default;
      //user.tags[tag] = time;
      //this.updateProgress(user);
     
  };
  
  clearTagFilter() {
      this.setState({'tagFilter':null});
  };

  // save modified user to state and localstorage
  updateProgress(user) {
        let users = {'users':{'default':user}};
        this.setState(users);
        localStorage.setItem('users',JSON.stringify(users));
    };
    
  render() {
    const progress = this.state.users.default;
    const topics = this.state.topics;
    const tags = this.state.words  ? this.state.words : [];
    const showProfile = this.isCurrentPage('login') && this.isLoggedIn();
    const showLogin = this.isCurrentPage('login') && !this.isLoggedIn();
    return (
        <div className="mnemo">
            <Navigation user={this.state.user} isLoggedIn={this.isLoggedIn} setCurrentPage={this.setCurrentPage} login={this.login} setQuizFromDiscovery={this.setQuizFromDiscovery} title={this.state.title} />
            <div className='page-title'><h4>{this.state.title}</h4></div>
            {this.state.message && <div className='page-message' >{this.state.message}</div>}
            
            {this.isCurrentPage('home') && <QuizCarousel questions={this.state.questions} currentQuestion={this.state.currentQuestion} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} user={this.state.user} progress={progress}  updateProgress={this.updateProgress} setCurrentPage={this.setCurrentPage}  setMessage={this.setMessage}  like={this.like} isLoggedIn={this.isLoggedIn} setCurrentQuiz={this.setCurrentQuiz}  /> }
            
            {this.isCurrentPage('topics') && <TopicsPage topics={topics}  topicTags={this.state.topicTags} tagFilter={this.state.tagFilter}  clearTagFilter={this.clearTagFilter} setQuiz={this.setQuizFromTopic} setCurrentPage={this.setCurrentPage}/>
            }
            {this.isCurrentPage('tags') && <TagsPage tags={tags} relatedTags={this.state.relatedTags} setQuiz={this.setQuizFromTag} />
            }
            {this.isCurrentPage('search') && <SearchPage questions={this.state.questions} setQuiz={this.setQuizFromQuestion} />
            }
            {this.isCurrentPage('review') && <ReviewPage getQuestionsForReview={this.getQuestionsForReview} questions={this.state.questions} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} topicTags={this.state.topicTags} updateProgress={this.updateProgress} setCurrentPage={this.setCurrentPage} finishQuiz={this.finishReview}  isReview={true} setMessage={this.setMessage} like={this.like} user={this.state.user} progress={progress} isLoggedIn={this.isLoggedIn}  setCurrentQuiz={this.setCurrentQuiz} />
            }
            {this.isCurrentPage('create') && <CreatePage saveQuestion={this.saveQuestion}  />
            }
            {this.isCurrentPage('about') && <AboutPage setCurrentPage={this.setCurrentPage} />
            }
            {this.isCurrentPage('intro') && <IntroPage/>
            }
            {this.isCurrentPage('termsofuse') && <TermsOfUse/>
            }
            {showProfile && <ProfilePage saveUser={this.saveUser} user={this.state.user} logout={this.logout} import={this.import} />
            }
            {(showLogin) && <LoginPage token={this.state.token} login={this.login}/>
            }<br/>
            <Footer/>
        </div>
        
    );
  }
}
