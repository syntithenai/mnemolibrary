import React, { Component } from 'react';
import QuizList from './QuizList';
import Utils from './Utils';

export default class TopicsPage extends Component {
    constructor(props) {
        super(props);
        this.state={'topics':this.props.topics,'titleFilter':''};
        // debounce(500,
        this.setTitleFilter = this.setTitleFilter.bind(this);
        this.filterQuizzes = this.filterQuizzes.bind(this);
    };
    
    setTitleFilter(event) {
        let title = event.target.value;
        let newState={'titleFilter':title};
        this.setState(newState);
        this.filterQuizzes(title);
    };
    
    filterQuizzes(title) {
        let topics = {};
        if (title.length > 0) {
            let that = this;        
            Object.keys(this.props.topics).forEach(function(key) {
                let topic = Utils.snakeToCamel(key);
                if (topic.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    topics[key] = that.props.topics[key];
                }
                   
            });
        } else {
            topics = this.props.topics;
        }
        this.setState({'topics':topics});
    };
    
    render() {
        return (
            <div>
                <form className="form-inline">
                  <input className="form-control" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter}  placeholder="Search" aria-label="Search" />
                </form>
                <QuizList quizzes={this.state.topics} setQuiz={this.props.setQuiz} ></QuizList>                
            </div>

        )
    }
};
