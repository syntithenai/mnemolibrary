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
          'questions':{'seen':{},'seenTally':{},'successTally':{},'block':{}},
          'topics':{},
          'tags':{},
          'review':[]
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
          users: users ? users : defaultUsers,
          currentQuiz: [],
          tagFilter : null
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
       this.discoverQuestions = this.discoverQuestions.bind(this);
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
        var tagTopics = {};
        var topicTags = {};
        // collate quizzes and tags
        let indexedQuestions= {};
        for (var questionKey in json['questions']) {
            const question = json['questions'][questionKey]
            var id = question.ID
            var tagList = question.tags.split(',')
            var quiz = question.quiz;
            if (! (Array.isArray(quizzes[quiz]))) {
                quizzes[quiz] = []
            }
            quizzes[quiz].push(id);
        
            for (var tagKey in tagList) {
                
                var tag = tagList[tagKey].trim().toLowerCase();
                if (tag.length > 0) {
                    if (! (Array.isArray(tags[tag]))) {
                        tags[tag] = []
                    }
                    if (! (Array.isArray(relatedTags[tag]))) {
                        relatedTags[tag] = {}
                    }
                    if (!(Array.isArray(tagTopics[tag]))) {
                        tagTopics[tag] = []
                    }
                    if (! (Array.isArray(topicTags[quiz]))) {
                        topicTags[quiz] = []
                    }
                    tags[tag].push(id);
                    if (!tagTopics[tag].includes(quiz)) {
                        tagTopics[tag].push(quiz)
                    }
                    if (!topicTags[quiz].includes(tag)) {
                        topicTags[quiz].push(tag)
                    }
                    tagList.forEach(function(relatedTag) {
                        if (relatedTag !== tag) {
                            relatedTags[tag][relatedTag]=true;
                        }
                    });
                    
                }
                
            }
            indexedQuestions[id]=questionKey;
        }
        let words = [];
        for (let tag in tags) {
            words.push({text:tag, value: tags[tag].length});
        }
        this.setState({'questions':json['questions'], 'indexedQuestions':indexedQuestions,'topics':quizzes,'words':words,'tags':tags,'relatedTags':relatedTags,'topicTags':topicTags,'tagTopics':tagTopics});
  };
  
  setCurrentPage(page) {
      this.setState({'message':null,'currentPage': page,title: Navigation.pageTitles[page]});
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
     console.log(['like',questionId]); 
  };

  dislike(questionId) {
     console.log(['dislike',questionId]);  
  };

  // SET QUIZ
  setQuiz(title,questionIds) {
      let newIds = [];
      let that = this;
      console.log(questionIds);
      questionIds.forEach(function(questionId) {
          console.log(questionId,questionIds[questionId]);
          console.log(that.state.users.default.questions.block);
          if (!that.state.users.default.questions.block.hasOwnProperty(questionId)) newIds.push(questionId);
      });
      console.log({'currentPage':'home','currentQuiz':newIds,'title': Utils.snakeToCamel(title)});
      this.setState({'currentPage':'home','currentQuiz':newIds,'title': Utils.snakeToCamel(title)});
  };

  discoverQuestions() {
      console.log(['discover questions']);
      //this.setState({'currentQuiz':'1,2,3,4,5'});
  };
  setQuizFromDiscovery() {
      console.log(['Setquiz discovery']);
      this.setCurrentPage('home')
      this.discoverQuestions()
      
  };
  setQuizFromQuestion(question) {
      console.log(['SQFQ',question,question.ID]);
      this.setQuizFromTopic(question.quiz)
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
      //const questions = this.getQuestionsByTag(tag.text);
      ////questions.filter(e => !this.state.users.default.questions.blocked.hasOwnProperty(e));
      //this.setQuiz('Tag - '+tag.text,questions);
      //const time = new Date().getTime();
      //let user = this.state.users.default;
      //user.tags[tag] = time;
      //this.updateProgress(user);
      this.setCurrentPage('topics');
      this.setState({'tagFilter':tag.text});
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
    const user = this.state.users.default;
    const topics = this.state.topics;
    const tags = this.state.words  ? this.state.words : [];

    return (
        <div className="mnemo">
            <Navigation setCurrentPage={this.setCurrentPage} setQuizFromDiscovery={this.setQuizFromDiscovery} title={this.state.title} />
            <div className='page-title'><h4>{this.state.title}</h4></div>
            {this.state.message && <div className='page-message' >{this.state.message}</div>}
            
            {this.isCurrentPage('home') && <QuizCarousel discoverQuestions={this.discoverQuestions} questions={this.state.questions} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} user={user}  updateProgress={this.updateProgress} setCurrentPage={this.setCurrentPage}  setMessage={this.setMessage}  like={this.props.like} dislike={this.props.dislike} /> }
            
            {this.isCurrentPage('topics') && <TopicsPage topics={topics} user={user} topicTags={this.state.topicTags} tagFilter={this.state.tagFilter}  clearTagFilter={this.clearTagFilter} setQuiz={this.setQuizFromTopic} setCurrentPage={this.setCurrentPage}/>
            }
            {this.isCurrentPage('tags') && <TagsPage tags={tags} relatedTags={this.state.relatedTags} setQuiz={this.setQuizFromTag} />
            }
            {this.isCurrentPage('search') && <SearchPage questions={this.state.questions} setQuiz={this.setQuizFromQuestion} />
            }
            {this.isCurrentPage('review') && <ReviewPage getQuestionsForReview={this.getQuestionsForReview} questions={this.state.questions} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} topicTags={this.state.topicTags} updateProgress={this.updateProgress} setCurrentPage={this.setCurrentPage} finishQuiz={this.finishReview} user={user} isReview={true} setMessage={this.setMessage} like={this.like} dislike={this.dislike} />
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
