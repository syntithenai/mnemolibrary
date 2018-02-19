import React, { Component } from 'react';

import Navigation from './Navigation';
import SingleQuestion from './SingleQuestion';

import AboutPage from './AboutPage';
import IntroPage from './IntroPage';
import ReviewPage from './ReviewPage';
import CreatePage from './CreatePage';
import TagsPage from './TagsPage';
import TopicsPage from './TopicsPage';
import SearchPage from './SearchPage';
//import SignIn from './SignIn';

import 'whatwg-fetch'
import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Utils from './Utils';
    
export default class AppLayout extends Component {

  constructor(props) {
      super(props);
      this.state = {
          title : "Mnemos Library",
          currentPage: "home",
          questions: [],
          indexedQuestions: [],
          topics: [],
          tags: [],
          relatedTags: [],
          users: {'default':{
              'seenIntro': false, 
              'questions':{'seen':{},'success':{},'fail':{},'skip':{},'block':{}}
            }},
          currentQuiz: [1,2,3,4,5],
      }
      // make 'this' available in setCurrentPage function
      this.setCurrentPage = this.setCurrentPage.bind(this);
      this.setQuiz = this.setQuiz.bind(this);
      this.setQuizFromQuestion = this.setQuizFromQuestion.bind(this);
      this.setQuizFromTopic = this.setQuizFromTopic.bind(this);
      this.setQuizFromTag = this.setQuizFromTag.bind(this);
      this.handleQuestionResponse = this.handleQuestionResponse.bind(this);
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
                    if (relatedTag != tag) {
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
  
  // handle user click on Remember, Forgot, Skip, Ban
  // update user questions history and remove question from current Quiz
  handleQuestionResponse(question,response) {
      let questions = this.state.users['default'].questions;
      const id = parseInt(question.ID);
      const time = new Date().getTime();
      if (response === "success") {
          if (id > 0) {
              questions.seen[id] = time;
              questions.success[id] = time;              
          }
      } else if (response === "fail") {
          if (id > 0) {
              questions.seen[id] = time;
              questions.fail[id] = time;
          }
      } else if (response === "skip") {
          
      } else if (response === "block") {
          if (id > 0) { 
              questions.block[id] = time;
          }
      }
      let newState = {'user': {'default' : {'questions':   questions}}}
      // next question
      newState.currentQuiz = this.state.currentQuiz.slice(1);
      
      this.setState(newState);
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
      this.setState({'currentPage':'home','currentQuiz':questionIds,'title': Utils.snakeToCamel(title)});
  };

  setQuizFromQuestion(question) {
      this.setQuiz('Mnemos Library',[question.ID])
  };
  setQuizFromTopic(topic) {
      const questions = this.getQuestionsByTopic(topic);
      this.setQuiz(topic,questions);
  };
  setQuizFromTag(tag) {
      const questions = this.getQuestionsByTag(tag.text);
      this.setQuiz('Tag - '+tag.text,questions);
  };

    
  render() {
    const user = this.state.users.default;
    const questions = this.state.questions;
    const question = this.getNextQuestion(); //state.questions[this.state.currentQuiz[0]];
    const topics = this.state.topics;
    const tags = this.state.words  ? this.state.words : [];
    const homeShowQuestion = this.isCurrentPage('home') && question; 
    const homeShowList = this.isCurrentPage('home') && !question;
    const showIntro = this.isCurrentPage('intro'); // && user.hasSeenIntro 
    return (
        <div className="Mnemo">
            <Navigation setCurrentPage={this.setCurrentPage} title={this.state.title} />
            <div className='page-title'><h4>{this.state.title}</h4></div>

            {homeShowQuestion && <SingleQuestion question={question} handleQuestionResponse={this.handleQuestionResponse}/> 
            }
            {homeShowList && <TopicsPage topics={topics} setQuiz={this.setQuizFromTopic}/>
            }
            {this.isCurrentPage('topics') && <TopicsPage topics={topics} setQuiz={this.setQuizFromTopic} />
            }
            {this.isCurrentPage('tags') && <TagsPage tags={tags} relatedTags={this.state.relatedTags} setQuiz={this.setQuizFromTag} />
            }
            {this.isCurrentPage('search') && <SearchPage questions={questions} setQuiz={this.setQuizFromQuestion} />
            }
            {this.isCurrentPage('review') && <ReviewPage questions={questions}  user={user} setQuiz={this.setQuizFromQuestion} />
            }
            {this.isCurrentPage('create') && <CreatePage/>
            }
            {this.isCurrentPage('about') && <AboutPage/>
            }
            {showIntro && <IntroPage/>
            }
        </div>
    
    );
  }
}




