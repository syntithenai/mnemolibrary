/* eslint-disable */ 
import React, { Component } from 'react';
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import 'whatwg-fetch'

export default class MultipleChoiceTopics extends Component {
    
    constructor(props) {
		super(props);
		this.state={
			filter:''
		}
		this.loadTopics = this.loadTopics.bind(this)
		this.setFilter = this.setFilter.bind(this)
    };
    
    componentDidMount() {
      let that=this;
        console.log(['MCT dmount'])
        let userParam = [];
        if (this.props.user) {
			userParam.push('user='+this.props.user._id);
		}
		//if (this.state.filter && this.state.filter.length > 0) {
			 //userParam.push('filter='+this.state.filter)
		 //}
		 let paramString=userParam.length > 0 ? '?'+userParam.join('&') : '';
		 this.loadTopics(paramString)
	};
    
    componentWillUpdate(props) {
		let that=this;
        console.log(['MCT update',props.user,this.props.user])
        let currentId = this.props.user ? this.props.user._id : null;
        if (props.user && currentId != props.user._id) {
		 
		 let userParam = [];
		 if (props.user) {
			userParam.push('user='+props.user._id);
		 }
		 //if (this.state.filter && this.state.filter.length > 0) {
			 //userParam.push('filter='+this.state.filter)
		 //}
		 let paramString=userParam.length > 0 ? '?'+userParam.join('&') : '';
		 this.loadTopics(paramString)
		}
	}
	
	loadTopics(queryParams) {
		let that = this;
		fetch('/api/mctopics'+queryParams)
		  .then(function(response) {
			console.log(['got response'])
			return response.json()
		  }).then(function(json) {
			console.log(['got json',json])
			that.setState({topics:json});
		  }).catch(function(ex) {
			console.log(['parsing failed', ex])
		  })
	}
	
	
	
	setFilter(e) {
		console.log(['SET FILTER',e.target.value])
		let filter = e.target.value;
        this.setState({filter:filter});
    }
    
      
    render() { 
		let that = this;
		let topics = null;
		let renderedTopicCollections = null;
		
		//if (this.state.filter && this.state.filter.length > 0) {
			if (this.state.topics) {
				topics = this.state.topics.map(function(topic,key) {
					let link='/multiplechoicequestions/'+topic.topic;
					//
					let buttons= <span style={{float:'right'}}>{topic.userTally > 0 && <button className='btn btn-success' >{topic.userTally} answered</button>} <button className='btn btn-info' >{topic.tally} questions</button>   </span>
					if (topic.tally > 0 && topic.tally === topic.userTally) {
						buttons = <span style={{float:'right'}}><button className='btn btn-danger' >Completed {topic.userTally} questions</button></span>
					}
					let theRow = <a key={topic.topic} href={link} style={{paddingLeft:'1em', backgroundColor:(key%2 === 0 ? '#eee' : 'white'), width:'100%', borderTop:'1px solid black' }}><div  style={{}}> {topic.topic}  {buttons} </div></a>
					if (that.state.filter && that.state.filter.length > 0) {
						if (topic.topic.toLowerCase().indexOf(that.state.filter.toLowerCase()) !== -1) {
							return theRow
						} else {
							return null;
						}
					} else {
						return theRow;
					}
				})
			} else {
				return null;
			}
		//} else {
			//renderedTopicCollections = this.props.topicCollections.map(function(topicCollection) {
				//return <b>{JSON.stringify(topicCollection)}</b>;
			//});
		//}
		
		return (
		<div>
			<form className="form-inline" style={{width:'40%'}}>
				<input className="form-control" type="text" value={this.state.filter} onChange={this.setFilter}  placeholder="Search" aria-label="Search" />
			</form>
			<div className="row">
				{topics}
				{renderedTopicCollections}
			</div>
		</div>
		)
    }



}
