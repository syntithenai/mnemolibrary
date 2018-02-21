import React, { Component } from 'react';

import Navigation from './Navigation';
//import SingleQuestion from './SingleQuestion';

import AboutPage from './AboutPage';
import TermsOfUse from './TermsOfUse';
import IntroPage from './IntroPage';
//import ReviewPage from './ReviewPage';
import CreatePage from './CreatePage';
import TagsPage from './TagsPage';
import TopicsPage from './TopicsPage';
import SearchPage from './SearchPage';
import QuizCarousel from './QuizCarousel';
//import SignIn from './SignIn';
//import FindQuestions from './FindQuestions';

import 'whatwg-fetch'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Utils from './Utils';
    
export default class AppLayout extends Component {

  constructor(props) {
      super(props);
      let defaultUsers={'default':{
          'seenIntro': false, 
          'questions':{'seen':{},'success':{},'seenTally':{},'successTally':{},'block':{}},
          'topics':{},
          'tags':{}
        }};
        let users = null;
      let userString = localStorage.getItem('users');
      if (userString) {
          let data = JSON.parse(userString);
          users = data['users'];
      }
      this.state = {
          title : "Mnemos Library",
          currentPage: "home",
          currentQuestion: 0,
          questions: [],
          indexedQuestions: [],
          topics: [],
          tags: [],
          relatedTags: [],
          users: users ? users : defaultUsers,
          currentQuiz: [],
          reviewQuestions: {}
      }
      // make 'this' available in setCurrentPage function
      this.setCurrentPage = this.setCurrentPage.bind(this);
      this.setQuiz = this.setQuiz.bind(this);
      this.setQuizFromQuestion = this.setQuizFromQuestion.bind(this);
      this.setQuizFromTopic = this.setQuizFromTopic.bind(this);
      this.setQuizFromTag = this.setQuizFromTag.bind(this);
      this.updateProgress = this.updateProgress.bind(this);
      this.componentDidMount = this.componentDidMount.bind(this);
      this.createIndexes = this.createIndexes.bind(this);
      
      this.getTagsByTitle = this.getTagsByTitle.bind(this);
      this.getTopicsByTitle = this.getTopicsByTitle.bind(this);
      this.getQuestionsByTag = this.getQuestionsByTag.bind(this);
      this.getQuestionsByTopic = this.getQuestionsByTopic.bind(this);
  };
  


  componentDidMount() {
      let that = this;
      // load mnemonics and collate tags, topics
      fetch('/mnemonics.json')
      .then(function(response) {
        return response.json()
      }).then(function(json) {
        that.createIndexes(json);
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      
  }
  
  createIndexes(json) {
        var quizzes = {};
        var tags = {};
        var relatedTags = {};
        // collate quizzes and tags
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question.ID
            var quizList = question.quiz.split(',');
            var tagList = question.tags.split(',')
            //console.log(["COLLATE",id,quizList,tagList]);
            for (var quizKey in quizList) {
                var quiz = quizList[quizKey];
                if (! (Array.isArray(quizzes[quiz]))) {
                    console.log('setup quiz ' + quiz);
                    quizzes[quiz] = []
                }
                quizzes[quiz].push(id);
            }
            for (var tagKey in tagList) {
                var tag = tagList[tagKey];
                if (! (Array.isArray(tags[tag]))) {
                    tags[tag] = []
                }
                if (! (Array.isArray(relatedTags[tag]))) {
                    relatedTags[tag] = {}
                }
                tags[tag].push(id);
                tagList.forEach(function(relatedTag) {
                    if (relatedTag !== tag) {
                        relatedTags[tag][relatedTag]=true;
                    }
                });
                
            }
            indexedQuestions[id]=questionKey;
        }
        let words = [];
        for (let tag in tags) {
            words.push({text:tag, value: tags[tag].length});
        }
        this.setState({'questions':json['questions'], 'indexedQuestions':indexedQuestions,'topics':quizzes,'words':words,'tags':tags,'relatedTags':relatedTags});
  };
  
  setCurrentPage(page) {
      this.setState({'currentPage': page,title: Navigation.pageTitles[page]});
  };  
    
  isCurrentPage(page) {
      return (this.state.currentPage === page);
  }; 
 
   
  // NEXT QUESTION
  // question must not be blocked
  getNextQuestion() {
    if (this.state.indexedQuestions) {
        return this.state.questions[this.state.indexedQuestions[this.state.currentQuiz[0]]];
    }
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


  
  // SET QUIZ
  setQuiz(title,questionIds) {
      let newIds = [];
      let that = this;
      questionIds.forEach(function(questionId) {
          if (!that.state.users.default.questions.block.hasOwnProperty(questionId)) newIds.push(questionId);
      });
      this.setState({'currentPage':'home','currentQuiz':newIds,'title': Utils.snakeToCamel(title)});
  };

  setQuizFromQuestion(question) {
      this.setQuiz('Mnemos Library',[question.ID])
  };
  setQuizFromTopic(topic) {
      const questions = this.getQuestionsByTopic(topic);
      //questions.filter(e => !this.state.users.default.questions.blocked.hasOwnProperty(e));
      this.setQuiz(topic,questions);
      const time = new Date().getTime();
      let user = this.state.users.default;
      user.topics[topic] = time;
      this.updateProgress(user);
  };
  setQuizFromTag(tag) {
      const questions = this.getQuestionsByTag(tag.text);
      //questions.filter(e => !this.state.users.default.questions.blocked.hasOwnProperty(e));
      this.setQuiz('Tag - '+tag.text,questions);
      const time = new Date().getTime();
      let user = this.state.users.default;
      user.tags[tag] = time;
      this.updateProgress(user);
  };

  updateProgress(user) {
        let users = {'users':{'default':user}};
        this.setState(users);
        localStorage.setItem('users',JSON.stringify(users));
    };
    
  render() {
    const user = this.state.users.default;
    const topics = this.state.topics;
    const tags = this.state.words  ? this.state.words : [];

    return (
        <div className="Mnemo">
            <Navigation setCurrentPage={this.setCurrentPage}  title={this.state.title} />
            <div className='page-title'><h4>{this.state.title}</h4></div>
            
            {this.isCurrentPage('home') && <QuizCarousel questions={this.state.questions} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} user={user}  updateProgress={this.updateProgress} setCurrentPage={this.setCurrentPage} successButton={true}/> }
            
            {this.isCurrentPage('topics') && <TopicsPage topics={topics} setQuiz={this.setQuizFromTopic} />
            }
            {this.isCurrentPage('tags') && <TagsPage tags={tags} relatedTags={this.state.relatedTags} setQuiz={this.setQuizFromTag} />
            }
            {this.isCurrentPage('search') && <SearchPage questions={this.state.questions} setQuiz={this.setQuizFromQuestion} />
            }
            
            {this.isCurrentPage('create') && <CreatePage/>
            }
            {this.isCurrentPage('about') && <AboutPage setCurrentPage={this.setCurrentPage} />
            }
            {this.isCurrentPage('intro') && <IntroPage/>
            }
            {this.isCurrentPage('termsofuse') && <TermsOfUse/>
            }
        </div>
    
    );
  }
}
//{homeShowQuestion && <SingleQuestion question={question} user={user}  handleQuestionResponse={this.handleQuestionResponse}/> }
      //}
                  
//{this.isCurrentPage('review') && <ReviewPage questions={this.state.questions}  user={user} setQuiz={this.setQuizFromQuestion} handleQuestionResponse={this.handleQuestionResponse} setCurrentPage={this.setCurrentPage} />
            //}

//const question = (this.state.currentQuiz.length > 0) ? this.state.questions[this.state.currentQuiz[this.state.currentQuestion]] : null;
    
