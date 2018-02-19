import React, { Component } from 'react';

import SingleQuestion from './SingleQuestion';
import FindQuestions from './FindQuestions';

export default class ReviewPage extends Component {
    
    constructor(props) {
        super(props);
        //let questions=[]
        //Object.keys(this.props.user.questions.seen).forEach(function(e) {
            //questions.push(e);
        //});
        //this.state = {'currentQuiz':questions,'currentQuestion':0}  ;
        
    };
    
    render() {
        if (this.state.currentQuiz.length > 0) {
           let question = this.state.questions[this.state.currentQuiz[this.state.currentQuestion]] ;
            return (
            <div>
                <SingleQuestion question={this.props.question} user={this.props.user}  handleQuestionResponse={this.props.handleQuestionResponse}/> 
            </div>

            )
        } else {
            return (
            <div><b>No questions seen yet. </b><FindQuestions setCurrentPage={this.props.setCurrentPage} /></div>
            )
        }
        

        }
};
