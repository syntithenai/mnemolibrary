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
          'questions':{'seen':{},'success':{},'seenTally':{},'successTally':{},'block':{}},
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
          relatedTags: [],
          users: users ? users : defaultUsers,
          currentQuiz: [],
          reviewQuestions: {},
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
      
      this.getQuestionsForReview = this.getQuestionsForReview.bind(this);
      this.getTopicsForReview = this.getTopicsForReview.bind(this);
      this.getTagsForReview = this.getTagsForReview.bind(this);
      
       this.finishTopic = this.finishTopic.bind(this);
       this.finishReview = this.finishReview.bind(this);
       this.clearTagFilter = this.clearTagFilter.bind(this);
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


   // return seen questionIds sorted by 'review status'
  getQuestionsForReview() {
    let questions=[];  
    for (var questionId in this.state.users.default.questions.seen) {
        if (!this.state.users.default.questions.block.hasOwnProperty(questionId)) {
            const seenTally = this.state.users.default.questions.seenTally[questionId];
            const successTally = this.state.users.default.questions.successTally.hasOwnProperty('questionId') ? this.state.users.default.questions.successTally[questionId] : 0;
            const seen = this.state.users.default.questions.seen[questionId];
            const success = this.state.users.default.questions.success.hasOwnProperty('questionId') ? this.state.users.default.questions.success[questionId] : 0;
            if (seenTally > 0) {
              const time = new Date().getTime();
              var timeDiff = 0;
              if (success > 0) {
                  timeDiff = seen - success;
              } else {
                  timeDiff = time - seen;
              }
              const orderBy = (successTally + (timeDiff)* 0.00000001)/seenTally;
              const question = {'orderBy':orderBy,'questionId':questionId};
              questions.push(question);
            }
 
        }
    }
    questions.sort(function(a,b) {
        if (a.orderBy === b.orderBy) {
            return 0;
        } else if (a.orderBy > b.orderBy) {
            return 1;
        } else {
            return -1;
        }
    });
    let questionIds = [];
    questions.forEach(function(question) {
        questionIds.push(question.questionId);
    });
    return questionIds;
  };
  
  getTopicsForReview() {
      
  };
  
  getTagsForReview() {
      
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

  updateProgress(user) {
        let users = {'users':{'default':user}};
        this.setState(users);
        localStorage.setItem('users',JSON.stringify(users));
    };
    
   // FINISH QUIZ CAROUSEL
   finishTopic(questions,success) {
       alert('finish topic');
       // TODO quick review list ?
       this.setCurrentPage('home');
       this.setState({'message':'You added '+questions.length+' questions to your knowledge base.'}) 
   }; 
   
   finishReview(questions,success) {
       alert('finish review');
       this.setCurrentPage('review');
       this.setState({'message':'Review complete. You recalled '+success.length+' out of '+questions.length+' questions.'}) 
       
   };
    
    
  render() {
    const user = this.state.users.default;
    const topics = this.state.topics;
    const tags = this.state.words  ? this.state.words : [];

    return (
        <div className="Mnemo">
            <Navigation setCurrentPage={this.setCurrentPage}  title={this.state.title} />
            <div className='page-title'><h4>{this.state.title}</h4></div>
            {this.state.message && <div className='page-message' >{this.state.message}</div>}
            {this.isCurrentPage('home') && <QuizCarousel questions={this.state.questions} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} user={user}  updateProgress={this.updateProgress} setCurrentPage={this.setCurrentPage} successButton={false} finishQuiz={this.finishTopic} /> }
            
            {this.isCurrentPage('topics') && <TopicsPage topics={topics} user={user} topicTags={this.state.topicTags} tagFilter={this.state.tagFilter}  clearTagFilter={this.clearTagFilter} setQuiz={this.setQuizFromTopic} setCurrentPage = {this.setCurrentPage}/>
            }
            {this.isCurrentPage('tags') && <TagsPage tags={tags} relatedTags={this.state.relatedTags} setQuiz={this.setQuizFromTag} />
            }
            {this.isCurrentPage('search') && <SearchPage questions={this.state.questions} setQuiz={this.setQuizFromQuestion} />
            }
            {this.isCurrentPage('review') && <ReviewPage getQuestionsForReview={this.getQuestionsForReview} questions={this.state.questions} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} topicTags={this.state.topicTags} updateProgress={this.updateProgress} setCurrentPage={this.setCurrentPage} finishQuiz={this.finishReview}/>
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
