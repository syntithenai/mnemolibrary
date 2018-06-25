import React, { Component } from 'react';

//import FindQuestions from './FindQuestions';
import QuizCarousel from './QuizCarousel';
import 'whatwg-fetch'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

export default class ReviewPage extends Component {

    constructor(props) {
        super(props);
        //this.state = {
            //questions : this.props.questions,
            //indexedQuestions : this.props.indexedQuestions,
            //currentQuiz : this.props.currentQuiz
        //}
        this.finishReview = this.finishReview.bind(this);
        this.getQuestionsForReview = this.getQuestionsForReview.bind(this);
        
    };

   componentDidMount() {
  //  this.getQuestionsForReview();
   }
        
   
   // return seen questionIds sorted by 'review status'
    getQuestionsForReview() {
     //  //console.log('getQuestionsForReview');
       this.props.getQuestionsForReview();
    };
    
    finishReview(questions,success) {
      // //console.log('finish review');
       //this.setCurrentPage('review');
        confirmAlert({
          title: 'Review set complete',
          message: 'You recalled '+success.length+' out of '+questions.length+' questions.',
          buttons: [
            {
              label: 'Continue Review',
              onClick: () => this.getQuestionsForReview()
            },
            {
              label: 'Discover',
              onClick: () => this.props.setQuizFromDiscovery()
            },
            {
              label: 'Profile',
              onClick: () => this.props.setCurrentPage('profile')
            }
          ]
        })
      // this.props.setMessage('Review complete. You recalled '+success.length+' out of '+questions.length+' questions.'); 
       
    };
    
    render() {
        ////console.log(['REVIEW',this.props.user]);
       if (this.props.isLoggedIn()) {
            ////console.log(['REVIEW USER',this.props.questions]);
            if (this.props.questions.length > 0) {
               //  //console.log(['REVIEW questions']);
                return (
                <div>
                    <QuizCarousel isAdmin={this.props.isAdmin}  saveSuggestion={this.props.saveSuggestion} mnemonic_techniques={this.props.mnemonic_techniques} setQuizFromTechnique={this.props.setQuizFromTechnique} setQuizFromTopic={this.props.setQuizFromTopic} setDiscoveryBlock={this.props.setDiscoveryBlock} clearDiscoveryBlock={this.props.clearDiscoveryBlock} blocks={this.props.blocks} setQuizFromTag={this.props.setQuizFromTag}  setCurrentQuestion={this.props.setCurrentQuestion} discoverQuestions={this.props.discoverQuestions}  questions={this.props.questions} currentQuiz={this.props.currentQuiz} currentQuestion={this.props.currentQuestion} finishQuiz={this.finishReview} indexedQuestions={this.props.indexedQuestions} user={this.props.user}  progress={this.props.progress} updateProgress={this.props.updateProgress} setCurrentPage={this.props.setCurrentPage} successButton={true} setMessage={this.props.setMessage}  like={this.props.like} isLoggedIn={this.props.isLoggedIn} setCurrentQuiz={this.props.setCurrentQuiz} />
                </div>
                )
            } else {
                return (
                <div><br/><b>You have no questions available for review. <br/>Note that questions that you have seen in the last half hour are excluded from review. <br/><br/>Time to discover something new ! </b> <br/><br/><button className="btn btn-info" href="#"  onClick={() => this.props.setQuizFromDiscovery()}>Discover</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('topics')}>Topics</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('tags')}>Tags</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('search')}>Questions</button>
               </div>
                )
            }
      } else {
        return (
            <div><b><a onClick={() => this.props.setCurrentPage('login')} className="btn btn-info"   >Join</a> the library to build your knowledge bank.</b></div>
        );
      }
    }
};
