import React, { Component } from 'react';
import QuizList from './QuizList';


export default class TopicsPage extends Component {
    
    render() {

        return (
            <div>
                <h3>Search</h3>
                <form className="form-inline">
                  <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
                </form>
                <QuizList quizzes={this.props.topics} setQuiz={this.props.setQuiz} ></QuizList>                
            </div>

        )
    }
};
