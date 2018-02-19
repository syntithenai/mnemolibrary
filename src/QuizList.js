import React, { Component } from 'react';
import Utils from './Utils';
export default class QuizList extends Component {

    render() {
        if (Utils.isObject(this.props.quizzes)) {
            let quizzes = Object.keys(this.props.quizzes).map((quiz, key) => {
              var title = Utils.snakeToCamel(quiz)
              return <div className='list-group-item' key={quiz} >
              <a onClick={() => this.props.setQuiz(quiz)} href="#" >{title}</a></div>
              
            })
            return (
              <div className="quizzes list-group">
                  {
                    quizzes
                  }
                
              </div>
            )

        } else {
            return null
        }
    };
}
