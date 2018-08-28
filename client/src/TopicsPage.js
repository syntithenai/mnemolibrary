import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
//import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
import scrollToComponent from 'react-scroll-to-component';

export default class TopicsPage extends Component {
    constructor(props) {
        super(props);
        this.state={'topics':this.props.topics,'titleFilter':'',tagFilter:this.props.tagFilter};
        // debounce(500,
        this.setTitleFilter = this.setTitleFilter.bind(this);
        this.filterQuizzes = this.filterQuizzes.bind(this);
        this.clearTagFilter = this.clearTagFilter.bind(this);
        //this.filterQuizzes('');
        this.scrollTo={};
        
    };
    
    componentDidMount() {
       scrollToComponent(this.scrollTo['topofpage'],{align:'top',offset:-230});
       // this.filterQuizzes('');
    }
    
    setTitleFilter(event) {
        let title = event.target.value;
        let newState={'titleFilter':title};
        this.setState(newState);
        this.filterQuizzes(title);
    };
    
    clearTagFilter() {
       // //console.log('CLEAR FILTER');
        //this.props.clearTagFilter();
        this.setState({'tagFilter':null});
        this.filterQuizzes(this.state.titleFilter);
    };
    
    filterQuizzes(title) {
         let that = this;
          fetch('/api/topics?title='+title )
          .then(function(response) {
            ////console.log(['got response', response])
            return response.json()
          }).then(function(json) {
            that.setState({'topics':json});
          }).catch(function(ex) {
            //console.log(['parsing failed', ex])
          })
          
        ////console.log(' FILTER TOPICS '+title);
        ////console.log(this.props.topics);
        //let topics = {};
        ////if (title.length > 0) {
        //let that = this;        
        //Object.keys(this.props.topics).forEach(function(key) {
            //let allowTitle = true;
            //let allowTag = true;
            //let topic = Utils.snakeToCamel(key);
            //if (title && title.length > 0 && topic.toLowerCase().indexOf(title.toLowerCase()) === -1) {
                //allowTitle = false;
            //}
            ////if (that.state.tagFilter && that.state.tagFilter.length > 0 && that.props.topicTags.hasOwnProperty(key) && !that.props.topicTags[key].includes(that.props.tagFilter)) {
                ////allowTag = false
            ////}
            //if (allowTitle && allowTag) {
                //topics[key] = that.props.topics[key];
            //}
        //});
        ////} else {
            ////topics = this.props.topics;
        ////}
        ////console.log(['FILTERED TO ',topics]);
        //this.setState({'topics':topics});
    };
    // {this.state.tagFilter && <button className='btn btn-warning' onClick={this.clearTagFilter}> Tag: {this.state.tagFilter} <FaClose/></button>}
    render() {
        return (
            <div>
                <div  ref={(section) => { this.scrollTo.topofpage = section; }} ></div>
                <form className="form-inline">
                  <input className="form-control" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter}  placeholder="Search" aria-label="Search" />
                  
                  <a className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('tags')}>Tags</a>
                  <a className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('search')}>Questions</a>
              
                </form>
                {this.state.titleFilter.length>0 && <QuizList quizzes={this.state.topics} setQuiz={this.props.setQuiz} ></QuizList>}
                {this.state.titleFilter.length === 0 && <QuizCollection collection={this.props.topicCollections} quizzes={this.state.topics} setQuiz={this.props.setQuiz} ></QuizCollection>}
            </div>
        )
    }
};
