import React, { Component } from 'react';
import QuizList from './QuizList';
import Utils from './Utils';
import FaClose from 'react-icons/lib/fa/close';

export default class TopicsPage extends Component {
    constructor(props) {
        super(props);
        this.state={'topics':this.props.topics,'titleFilter':'',tagFilter:this.props.tagFilter};
        // debounce(500,
        this.setTitleFilter = this.setTitleFilter.bind(this);
        this.filterQuizzes = this.filterQuizzes.bind(this);
        this.clearTagFilter = this.clearTagFilter.bind(this);
        //this.filterQuizzes('');
    };
    
    componentDidMount() {
        this.filterQuizzes('');
    }
    
    setTitleFilter(event) {
        let title = event.target.value;
        let newState={'titleFilter':title};
        this.setState(newState);
        this.filterQuizzes(title);
    };
    
    clearTagFilter() {
        console.log('CLEAR FILTER');
        //this.props.clearTagFilter();
        this.setState({'tagFilter':null});
        this.filterQuizzes(this.state.titleFilter);
    };
    
    filterQuizzes(title) {
        console.log(' FILTER TOPICS '+title);
        let topics = {};
        //if (title.length > 0) {
        let that = this;        
        Object.keys(this.props.topics).forEach(function(key) {
            let allowTitle = true;
            let allowTag = true;
            let topic = Utils.snakeToCamel(key);
            if (title && title.length > 0 && topic.toLowerCase().indexOf(title.toLowerCase()) === -1) {
                allowTitle = false;
            }
            if (that.state.tagFilter && that.state.tagFilter.length > 0 && that.props.topicTags.hasOwnProperty(key) && !that.props.topicTags[key].includes(that.props.tagFilter)) {
                allowTag = false
            }
            if (allowTitle && allowTag) {
                topics[key] = that.props.topics[key];
            }
        });
        //} else {
            //topics = this.props.topics;
        //}
        this.setState({'topics':topics});
    };
    
    render() {
        return (
            <div>
                <form className="form-inline">
                  <input className="form-control" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter}  placeholder="Search" aria-label="Search" />
                  {this.state.tagFilter && <button className='btn btn-warning' onClick={this.clearTagFilter}> Tag: {this.state.tagFilter} <FaClose/></button>}
                  <a className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('tags')}>Tags</a>
                  <a className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('search')}>Questions</a>
              
                  
                </form>
                <QuizList quizzes={this.state.topics} setQuiz={this.props.setQuiz} ></QuizList>                
            </div>

        )
    }
};
