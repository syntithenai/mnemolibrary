/* eslint-disable */ 
import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
//import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
import FaChild from 'react-icons/lib/fa/child';
import scrollToComponent from 'react-scroll-to-component';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import RecentSingleComment from './RecentSingleComment'

export default class TopicsPage extends Component {
    constructor(props) {
        super(props);
        this.state={'topics':this.props.topics,tagFilter:this.props.tagFilter};
        // debounce(500,
        this.setTitleFilter = this.props.setTitleFilter;
        this.filterQuizzes = this.filterQuizzes.bind(this);
        this.clearTagFilter = this.clearTagFilter.bind(this);
        //this.filterQuizzes('');
        this.scrollTo={};
        
    };
    
    componentDidMount() {
		this.filterQuizzes(this.props.titleFilter) 
       scrollToComponent(this.scrollTo['topofpage'],{align:'top',offset:-230});
       // this.filterQuizzes('');
    }
    
	
	componentDidUpdate(props) {
		if (this.props.titleFilter != props.titleFilter) {
			 this.filterQuizzes(this.props.titleFilter) 
		}
		//this.setState({titleFilter:this.props.titleFilter)
	}
    
    //setTitleFilter(event) {
        //let title = event.target.value;
        //let newState={'titleFilter':title};
        //this.setState(newState);
        //this.filterQuizzes(title);
    //};
    
    clearTagFilter() {
       // //console.log('CLEAR FILTER');
        //this.props.clearTagFilter();
        this.setState({'tagFilter':null});
        this.filterQuizzes(this.props.titleFilter);
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
                <span style={{ paddingLeft:'1em',width: '60%',float:'right'}}><RecentSingleComment newCommentReply={this.props.newCommentReply} user={this.props.user}  newCommentReply={this.props.newCommentReply}  /></span>
                <form className="form-inline" style={{width:'40%'}} onSubmit={(e) => {e.preventDefault(); return false;}} >
                  <input className="form-control" type="text" value={this.props.titleFilter} onChange={this.props.setTitleFilter}  placeholder="Search" aria-label="Search" />
				  
                </form>
                {this.props.titleFilter.length>0 &&  <div style={{clear:'both'}}><span>Search for &nbsp;
                    <Link className="btn btn-info" to="/search/tags" >Tags</Link>&nbsp;or&nbsp; 
                  <Link className="btn btn-info" to="/search/questions" >Questions</Link>&nbsp;instead.</span>
                   
                    <QuizList quizzes={this.state.topics} setQuizFromMissingMnemonic={this.props.setQuizFromMissingMnemonic} setQuiz={this.props.setQuizFromTopic} questionsMissingMnemonics={this.props.questionsMissingMnemonics} isLoggedIn={this.props.isLoggedIn} ></QuizList></div>}
                    
                {this.props.titleFilter.length === 0 && <div style={{clear:'both'}}><QuizCollection topicCollections={this.props.topicCollections}  topicTags={this.props.topicTags} tagFilter={this.props.tagFilter}  clearTagFilter={this.props.clearTagFilter} setQuizFromTopic={this.props.setQuizFromTopic} setQuiz={this.props.setQuizFromTopic} questionsMissingMnemonics={this.props.questionsMissingMnemonics} setQuizFromMissingMnemonic={this.props.setQuizFromMissingMnemonic} setCurrentPage={this.props.setCurrentPage} isLoggedIn={this.props.isLoggedIn} setQuizFromDiscovery={this.props.setQuizFromDiscovery} setQuizFromDifficulty={this.props.setQuizFromDifficulty} setQuizFromTopics={this.props.setQuizFromTopics}  setQuizFromQuestionId={this.props.setQuizFromQuestionId}  user={this.props.user} showCollection={this.props.showCollection} hideCollection={this.props.hideCollection} collectionVisible={this.props.collectionVisible} collection={this.props.collection}  ></QuizCollection></div>}
            </div>
        )
    }
};
