import React, { Component } from 'react';

import FindQuestions from './FindQuestions';
import QuizCarousel from './QuizCarousel';
import 'whatwg-fetch'

export default class ReviewPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            questions : [],
            indexedQuestions : [],
            currentQuiz : []
        }
        this.finishReview = this.finishReview.bind(this);
        this.getQuestionsForReview = this.getQuestionsForReview.bind(this);
        
    };

   componentDidMount() {
    this.getQuestionsForReview();
   }
        
   
   // return seen questionIds sorted by 'review status'
  getQuestionsForReview() {
      let that = this;
      //console.log('get q for review');
      if (this.props.user) {
        fetch('/api/review?user='+this.props.user._id)
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
  };
    
    finishReview(questions,success) {
       console.log('finish review');
       //this.setCurrentPage('review');
       this.props.setMessage('Review complete. You recalled '+success.length+' out of '+questions.length+' questions.'); 
       
   };
    
    render() {
       // console.log(['REVIEW',this.state.questions]);
       if (this.props.user) {
            if (this.state.questions.length > 0) {
                return (
                <div>
                    <QuizCarousel questions={this.state.questions} currentQuiz={this.state.currentQuiz} indexedQuestions={this.state.indexedQuestions} user={this.props.user}  progress={this.props.progress} updateProgress={this.props.updateProgress} setCurrentPage={this.props.setCurrentPage} successButton={true} setMessage={this.props.setMessage}  like={this.props.like} isLoggedIn={this.props.isLoggedIn} setCurrentQuiz={this.setCurrentQuiz} />
                </div>
                )
            } else {
                return (
                <div><b>No questions seen yet. </b><FindQuestions setCurrentPage={this.props.setCurrentPage} /></div>
                )
            }
      } else {
        return (
            <div><b><button onClick={() => this.props.setCurrentPage('login')} className='btn btn-info'>Login</button> to track your progress</b></div>
        );
      }
    }
};
