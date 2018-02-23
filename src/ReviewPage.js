import React, { Component } from 'react';

import FindQuestions from './FindQuestions';
import QuizCarousel from './QuizCarousel';

export default class ReviewPage extends Component {
    
    render() {
        let questions = this.props.getQuestionsForReview();
        console.log(['REVIEW',questions]);
        if (questions.length > 0) {
            return (
            <div>
                <QuizCarousel questions={this.props.questions} currentQuiz={questions} indexedQuestions={this.props.indexedQuestions} user={this.props.user}  updateProgress={this.props.updateProgress} setCurrentPage={this.props.setCurrentPage} successButton={true}/>
            </div>
            )
        } else {
            return (
            <div><b>No questions seen yet. </b><FindQuestions setCurrentPage={this.props.setCurrentPage} /></div>
            )
        }
        

        }
};
