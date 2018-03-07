import React, { Component } from 'react';

export default class QuestionList extends Component {
    render() {
        if (Array.isArray(this.props.questions)) {
            let questions = this.props.questions.map((question, key) => {
              return <div className='list-group-item' key={question.ID} >
              <a onClick={() => this.props.setQuiz(question)}  href="#"   >{question.interogative} {question.prefix} {question.question} {question.postfix}</a>
              
              </div>
              
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
