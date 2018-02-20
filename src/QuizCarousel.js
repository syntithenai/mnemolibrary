import React, { Component } from 'react';
import QuizList from './QuizList';
import Utils from './Utils';

export default class QuizCarousel extends Component {
    constructor(props) {
        // props - questions, indexedQuestions, title, progress, updateProgress
        super(props);
        this.state={
            'questions':[],
            'aa':''
        };
        //this.filterQuizzes = this.filterQuizzes.bind(this);
    };
    
    
    render() {
        return (
            <div className='quiz-carousel'>
                <form className="form-inline">
                  <input className="form-control" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter}  placeholder="Search" aria-label="Search" />
                </form>
                <QuizList quizzes={this.state.topics} setQuiz={this.props.setQuiz} ></QuizList>                
            </div>
        )
    }
};
