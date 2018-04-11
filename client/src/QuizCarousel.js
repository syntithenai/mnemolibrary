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
            //'indexedQuestions':this.props.indexedQuestions,
            //'questions':this.props.questions,
            //'currentQuiz':this.props.currentQuiz,
            //'currentQuestion':this.props.currentQuestion,
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
        console.log(['QUIZ carousel constr']);
    };
    
    componentDidMount() {
       // console.log(['QUIZ CAR DID MOUNT',this.state.currentQuiz,this.props.questions]);
              
    };
    
    
  isQuizFinished(quiz) {
      //if (this.props.isReview) {
          //return this.state.success.length === this.props.currentQuiz.length;
      //} else {
          return this.props.currentQuestion === this.props.currentQuiz.length - 1;
      //}
      
  };  
      
  logStatus(status,question) {
     // console.log(['log status',status,question]);
      if (this.props.user) {
          if (!question) question = this.props.questions[this.props.indexedQuestions[this.props.currentQuestion]]._id;
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
      this.props.setMessage('');
      const id = question._id;
      //console.log(['handle response',response,id,question]);
      const time = new Date().getTime();
      if (response === "list") {
         this.setState({'showList':true});  
      } else if (response === "success") {
          //if (!questions.seen.hasOwnProperty(id)) 
          //questions.seen[id] = time;
          //this.logStatus('seen',id);
          //questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          //questions.review[id].push(time);
            // local collate success ids for finishQuiz function
            const time = new Date().getTime();
            let success = this.state.success;
            if (!success.includes(this.props.currentQuestion)) {
                success.push(this.props.currentQuestion);
            }
            //questions.success[id]=time;
            if (this.isQuizFinished()) {
               this.logStatus('success',id);
               this.finishQuiz(this.props.questions,this.state.success);
            }  else {
                //questions.successTally[id] = questions.successTally.hasOwnProperty(id) ? questions.successTally[id] + 1 : 1;
                this.setState({ 'success': success});
                //console.log(['success',this.props.currentQuestion]);
                this.props.setCurrentQuestion(parseInt(this.props.currentQuestion,10) + 1);
                this.logStatus('success',id);
            }
      } else if (response === "previous") {
          //if (!questions.seen.hasOwnProperty(id)) 
          //questions.seen[id] = time;
          //questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          this.logStatus('seen',id);
          let currentId =this.props.currentQuestion - 1;
          if (this.props.currentQuestion > 0 && this.props.currentQuiz.length > 0) {
              this.props.setCurrentQuestion(currentId);
          }
          
      } else if (response === "next") {
          //if (!questions.seen.hasOwnProperty(id)) 
          //questions.seen[id] = time;
          //questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          this.logStatus('seen',id);
          if (this.props.currentQuiz.length > 0) {
            if (this.isQuizFinished()) {
              this.finishQuiz();
            }  else {
                this.props.setCurrentQuestion(this.props.currentQuestion + 1);
               //this.setState({'currentQuestion':this.state.currentQuestion + 1});
            }
              
          } 
          
      } else if (response === "block") {
          let user = this.props.progress;
          let questions = user.questions;
          // flag as blocked
      //    console.log(['block',id]);
          if (id.length > 0) { 
              questions.block[id] = time;
               console.log(['block logged a']);
               this.logStatus('block',id);
               console.log(['block logged']);
          }
          // quiz complete ?
          if (this.props.currentQuiz.length > 0) {
            if (this.isQuizFinished()) {
              this.finishQuiz();
            }  else {
                // move forward one question and strip blocked questions from currentQuiz 
                let currentQuestion = this.props.currentQuestion;
                console.log(['block',currentQuestion]);
                let currentQuiz = this.props.currentQuiz;
                currentQuiz.splice(parseInt(currentQuestion,10),1);
               // this.props.setCurrentQuestion(this.props.currentQuestion + 1);
                this.props.setCurrentQuiz(currentQuiz);
            }
          }
      }
      //this.props.updateProgress(user);
  }; 
    
    currentQuestion() {
        console.log(['currentQuestion',this.state]);
        let question=null;
        if (this.props.currentQuestion !== null && Array.isArray(this.props.currentQuiz) && this.props.indexedQuestions && this.props.questions) {
            question = this.props.questions[this.props.indexedQuestions[this.props.currentQuiz[this.props.currentQuestion]]];
        
        }
        return question;
    };
    
       // FINISH QUIZ CAROUSEL
   finishQuiz() {
       console.log(['finish quiz',this.props.finishQuiz]);
        // inject override
        
       if (this.props.finishQuiz) {
            this.props.finishQuiz(this.props.questions,this.state.success);
        } 
        this.setState({'success' : []});
        //else {
           //this.props.setCurrentPage('home');
           //this.props.setMessage('You added '+((this.props.questions && this.props.questions.length)?this.props.questions.length:'')+' questions to your knowledge base.') ;
        //}
   }; 
   
    
    getQuestions(questionIds) {
        console.log(['get ques',questionIds]);
        let questions=[];
        let that = this;
        questionIds.forEach(function(questionId) {
            let question = that.props.questions[that.props.indexedQuestions[questionId]];
            questions.push(question);
        });
        return questions;
    };
    
    setQuizQuestion(question) {
        console.log(['set quiz ques',question,this.props.currentQuiz]);
        if (Utils.isObject(question) && question._id && question._id.length > 0) {
            console.log(['setQuizQuestion',question]);
            let index = this.props.currentQuiz.indexOf(question._id);
            console.log(['index',index]);
            this.setState({'showList':false});
            this.props.setCurrentQuestion(index);
        }
    };
    
    render() {
        let questions = this.props.currentQuiz;
        //console.log(['RENDER CAROUS',questions]);
        //if (Array.isArray(questions) && questions.length > 0) {
            
        //} else if (this.props.discoverQuestions) {
            //questions = this.props.discoverQuestions();
        //}
      //  console.log(['RENDER CAROUS2',questions]);
        let content = '';
        const question = this.currentQuestion();
        console.log(['RENDER CAROUS2',question,questions]);
      //  if (Array.isArray(questions) && questions.length > 0 && Utils.isObject(question)) {
            if (this.state.showList) {
                let listQuestions = this.getQuestions(this.props.currentQuiz);
                let label='Start' ;
                if (parseInt(this.props.currentQuestion,10) > 0) {
                    label='Continue' ;
                }
                content = (<div><button className='btn btn-info' onClick={() => this.setQuizQuestion(this.currentQuestion())}   ><Play size={25} /> {label}</button><QuestionList questions={listQuestions} setQuiz={this.setQuizQuestion}  ></QuestionList></div>);
            } else {
                // single question
                content = (<SingleQuestion setQuizFromTechnique={this.props.setQuizFromTechnique} setQuizFromTopic={this.props.setQuizFromTopic} setDiscoveryBlock={this.props.setDiscoveryBlock} clearDiscoveryBlock={this.props.clearDiscoveryBlock} blocks={this.props.blocks}  setQuizFromTag={this.props.setQuizFromTag} question={question} user={this.props.user} successButton={this.props.successButton} handleQuestionResponse={this.handleQuestionResponse}  like={this.props.like} isLoggedIn={this.props.isLoggedIn}/> )
            }
        
        //} else {
            ////console.log(['ren',question,questions]);
           //// content = (<div>{JSON.stringify(question)} - {questions} </div>)
            //// no matching questions
            //content = (<div><FindQuestions discoverQuestions={this.props.discoverQuestions} setCurrentPage={this.props.setCurrentPage} /></div>)
        //}
                
        return (
            <div className='quiz-carousel'>
                {content}
            </div>
        )
    }
};
