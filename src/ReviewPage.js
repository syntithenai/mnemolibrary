import React, { Component } from 'react';

import FindQuestions from './FindQuestions';
import QuizCarousel from './QuizCarousel';

export default class ReviewPage extends Component {

    constructor(props) {
        super(props);
        this.finishReview = this.finishReview.bind(this);
    };

   
   // return seen questionIds sorted by 'review status'
  getQuestionsForReview() {
    let user = this.props.user;
    let questions=[];  
    for (var questionId in user.questions.seen) {
        if (!user.questions.block.hasOwnProperty(questionId)) {
            const seenTally = user.questions.seenTally[questionId];
            const successTally = user.questions.successTally.hasOwnProperty('questionId') ? user.questions.successTally[questionId] : 0;
            const seen = user.questions.seen[questionId];
            const success = user.questions.success.hasOwnProperty('questionId') ? user.questions.success[questionId] : 0;
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
    
    finishReview(questions,success) {
       console.log('finish review');
       //this.setCurrentPage('review');
       this.props.setMessage('Review complete. You recalled '+success.length+' out of '+questions.length+' questions.'); 
       
   };
    
    render() {
        let questions = this.getQuestionsForReview();
        console.log(['REVIEW',questions]);
        if (questions.length > 0) {
            return (
            <div>
                <QuizCarousel questions={this.props.questions} currentQuiz={questions} indexedQuestions={this.props.indexedQuestions} user={this.props.user}  updateProgress={this.props.updateProgress} setCurrentPage={this.props.setCurrentPage} successButton={true} setMessage={this.props.setMessage}  like={this.props.like} dislike={this.props.dislike}/>
            </div>
            )
        } else {
            return (
            <div><b>No questions seen yet. </b><FindQuestions setCurrentPage={this.props.setCurrentPage} /></div>
            )
        }
        

        }
};
