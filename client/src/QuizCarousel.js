import React, { Component } from 'react';
import Utils from './Utils';
import FindQuestions from './FindQuestions';
import SingleQuestion from './SingleQuestion';
import QuestionList from './QuestionList';
import Play from 'react-icons/lib/fa/play';

export default class QuizCarousel extends Component {
    constructor(props) {
        super(props);
        this.state={
            'currentQuiz':this.props.currentQuiz ? this.props.currentQuiz : [] ,
            'currentQuestion':this.props.question ? this.props.question : 0,
            'quizComplete': false,
            'showList':false,
            'isReview': (this.props.isReview ? true : false),
            'success' : []
        };
        this.handleQuestionResponse = this.handleQuestionResponse.bind(this);
        this.currentQuestion = this.currentQuestion.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.setQuizQuestion = this.setQuizQuestion.bind(this);
        this.finishQuiz = this.finishQuiz.bind(this);
        this.logStatus = this.logStatus.bind(this);
    };
    
    
  isQuizFinished(quiz) {
      if (this.props.isReview) {
          return this.state.success.length === this.state.currentQuiz.length;
      } else {
          return this.state.currentQuestion === this.state.currentQuiz.length - 1;
      }
      
  };  
      
  logStatus(status,question) {
      if (this.props.user) {
          if (!question) question = this.props.questions[this.props.indexedQuestions[this.state.currentQuestion]]._id;
          let that = this;
           // central storage
             fetch('/api/'+status, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({'user':this.props.user._id,'question':question})
            }).catch(function(err) {
                that.setState({'message':'Not Saved'});
            });
        }
  };    
      
  // handle user click on Remember, Forgot, Skip, Ban
  // update user questions history and remove question from current Quiz
  handleQuestionResponse(question,response) {
      let user = this.props.progress;
      let questions = user.questions;
      this.props.setMessage('');
      const id = parseInt(question.ID,10);
      const time = new Date().getTime();
      if (response === "list") {
         this.setState({'showList':true});  
      } else if (response === "success") {
          //if (!questions.seen.hasOwnProperty(id)) 
          questions.seen[id] = time;
          this.logStatus('seen',id);
          questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          //questions.review[id].push(time);
          if (this.isQuizFinished()) {
              this.finishQuiz(this.state.questions,this.state.success);
            }  else {
                // local collate success ids for finishQuiz function
                //const time = new Date().getTime();
                let success = this.state.success;
                if (!success.includes(this.state.currentQuestion)) {
                    success.push(this.state.currentQuestion);
                }
                this.setState({ 'success': success, 'currentQuestion':this.state.currentQuestion + 1});
                this.logStatus('success',id);
            }
      } else if (response === "previous") {
          //if (!questions.seen.hasOwnProperty(id)) 
          questions.seen[id] = time;
           this.logStatus('seen',id);
          questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          let currentId =this.state.currentQuestion - 1;
          if (this.state.currentQuestion > 0 && this.state.currentQuiz.length > 0) {
              this.setState({'currentQuestion':currentId});
          }
          
      } else if (response === "next") {
          //if (!questions.seen.hasOwnProperty(id)) 
          questions.seen[id] = time;
          this.logStatus('seen',id);
          questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          if (this.state.currentQuiz.length > 0) {
            if (this.isQuizFinished()) {
              this.finishQuiz();
            }  else {
               this.setState({'currentQuestion':this.state.currentQuestion + 1});
            }
              
          } 
          
      } else if (response === "block") {
          // flag as blocked
          if (id > 0) { 
              questions.block[id] = time;
               this.logStatus('block',id);
          }
          // quiz complete ?
          if (this.state.currentQuiz.length > 0) {
            if (this.isQuizFinished()) {
              this.finishQuiz();
            }  else {
                // move forward one question and strip blocked questions from currentQuiz 
                let currentQuestion = this.state.currentQuestion;
                let currentQuiz = this.state.currentQuiz;
                currentQuiz.splice(currentQuestion,1);
                this.setState({'currentQuestion':this.state.currentQuestion + 1,'currentQuiz' : currentQuiz});
            }
          }
      }
      this.props.updateProgress(user);
  }; 
    
    currentQuestion() {
        let question=null;
        if (this.state.currentQuestion !== null && Array.isArray(this.state.currentQuiz) && this.props.indexedQuestions && this.props.questions) {
            question = this.props.questions[this.props.indexedQuestions[this.state.currentQuiz[this.state.currentQuestion]]];
        
        }
        return question;
    };
    
       // FINISH QUIZ CAROUSEL
   finishQuiz() {
       console.log(['finish quiz',this.props.finishQuiz]);
        // inject override
       if (this.props.finishQuiz) {
            this.props.finishQuiz(this.state.questions,this.state.success);
        } else {
           this.props.setCurrentPage('home');
           this.props.setMessage('You added '+((this.state.questions && this.state.questions.length)?this.state.questions.length:'')+' questions to your knowledge base.') ;
        }
   }; 
   
    
    getQuestions(questionIds) {
        let questions=[];
        let that = this;
        questionIds.forEach(function(questionId) {
            let question = that.props.questions[that.props.indexedQuestions[questionId]];
            questions.push(question);
        });
        return questions;
    };
    
    setQuizQuestion(question) {
        if (Utils.isObject(question) && question.ID > 0) {
            console.log(['setQuizQuestion',question]);
            let index = this.state.currentQuiz.indexOf(question.ID);
            this.setState({'showList':false,'currentQuestion':index});
        }
    };
    
    render() {
        let questions = this.state.currentQuiz;
        if (Array.isArray(questions) && questions.length > 0) {
            
        } else if (this.props.discoverQuestions) {
            questions = this.props.discoverQuestions();
        }
        
        let content = '';
        const question = this.currentQuestion();
        
        if (Array.isArray(questions) && questions.length > 0 && Utils.isObject(question)) {
            if (this.state.showList) {
                let listQuestions = this.getQuestions(this.state.currentQuiz);
                let label='Start' ;
                if (this.state.currentQuestion > 0) {
                    label='Continue' ;
                }
                content = (<div><button className='btn btn-info' onClick={() => this.setQuizQuestion(this.currentQuestion())}   ><Play size={25} /> {label}</button><QuestionList questions={listQuestions} setQuiz={this.setQuizQuestion}  ></QuestionList></div>);
            } else {
                // single question
                content = (<SingleQuestion question={question} user={this.props.user} successButton={this.props.successButton} handleQuestionResponse={this.handleQuestionResponse}  like={this.props.like} isLoggedIn={this.props.isLoggedIn}/> )
            }
        
        } else {
            // no matching questions
            content = (<div><FindQuestions setCurrentPage={this.props.setCurrentPage} /></div>)
        }
                
        return (
            <div className='quiz-carousel'>
                {content}
            </div>
        )
    }
};
