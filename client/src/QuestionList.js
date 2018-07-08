import React, { Component } from 'react';
import Utils from './Utils';

export default class QuestionList extends Component {
    render() {
       // //console.log(['QL',this.props.questions]);
        if (Array.isArray(this.props.questions)) {
            let questions = this.props.questions.map((question, key) => {
                if (question && question._id) {
                    let title=Utils.getQuestionTitle(question);
                    let excerpt='';
                    console.log(this.props);
                    if (this.props.isReview===false) {
                        excerpt='-->' + question.answer.split(' ').slice(0,3).join(' ')+'...';
                    } 
       
                  return <div className='list-group-item' key={question._id} >
                  <a onClick={() => this.props.setQuiz(question)}  href="#"   >{title} ? {excerpt}</a>
                  
                  </div>
                }
                return '';
            })
            return (
              <div className="questions list-group">
                  {
                    questions
                  }
                
              </div>
            )
        } else {
            return null
        }
        
        
    };
}
