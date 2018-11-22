import React, { Component } from 'react';
import Utils from './Utils';
import FaChild from 'react-icons/lib/fa/child';

export default class QuizList extends Component {

    render() {
        if (Utils.isObject(this.props.quizzes)) {
            let quizzes = Object.keys(this.props.quizzes).sort().map((quiz, key) => {
              var title = Utils.snakeToCamel(quiz)
              let missingCount = this.props.questionsMissingMnemonics && this.props.questionsMissingMnemonics.hasOwnProperty(quiz) ? this.props.questionsMissingMnemonics[quiz] : 0;
              return <div className='list-group-item' key={quiz} >
              <a onClick={() => this.props.setQuiz(quiz)} href="#" >{title}</a>{missingCount > 0 && this.props.isLoggedIn && this.props.isLoggedIn() && <button className='btn btn-success' style={{float:'right'}} onClick={() => this.props.setQuizFromMissingMnemonic(quiz)} ><FaChild size="22" /> {missingCount}</button>}</div>
              
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
