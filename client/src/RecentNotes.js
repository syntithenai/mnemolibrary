/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';
import NewIcon from 'react-icons/lib/fa/plus';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import scrollToComponent from 'react-scroll-to-component';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {debounce} from 'throttle-debounce';

import CommentIcon from 'react-icons/lib/fa/comment';
import CommentList from './CommentList';

export default class RecentComments extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        this.state={filter:''}
		this.scrollTo={};
		this.setFilter = this.setFilter.bind(this)
        this.loadComments = this.loadComments.bind(this)
    //   this.scrollToComment = this.scrollToComment.bind(this)
    };
    
    componentDidMount() {
        this.loadComments(null,null,50,null,1)
        //if (this.props.match && this.props.match.param && this.props.match.param.comment) this.scrollToComment(this.props.match.param.comment)
    }
    
    componentDidUpdate(props,state) {
		if (this.state.filter != state.filter || this.props.user != props.user) {
			this.loadComments(null,null,50,this.state.filter,500)
        }
        //if (this.props.match && this.props.match.param && this.props.match.param.comment) this.scrollToComment(this.props.match.param.comment)
    }
    
    loadComments(a,b,c,d,timeout) {
		let that = this;
		clearTimeout(this.debounce);
		setTimeout(function() {
			that.props.loadNotes(a,that.props.user ? that.props.user._id : null,c,d)
		},timeout)
		//debounce(5000,this.props.loadComments(a,b,c,d));
	}

    //scrollToComment(id) {
		//let that = this;
		//scrollToComponent(that.scrollTo['comment_'+id],{align:'top',offset:-230});
	//}
	



	setFilter(event) {
		let val = event.target.value;
		this.setState({filter:val})
	}


    render() {
		if (this.props.analyticsEvent) this.props.analyticsEvent('recent comments');

		return <div id='recentnotes'>
			<input className="form-control" type="text" value={this.state.filter} onChange={this.setFilter}  placeholder="Search" aria-label="Search" />
				  
			<div>{this.props.comments.map(function(comment) {
				let current_datetime = new Date(comment.createDate)
				let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
				let questionLink = '/discover/topic/'+comment.questionTopic+"/"+comment.question;
				
				return (
					<div style={{paddingLeft:'0em'}}> 
						<span >
							<span className='date' style={{fontWeight:'bold',marginRight:'0em'}} >{formatted_date} </span>
							<span>"{comment.comment}"</span>
						</span>
						{comment.questionText && <div>
							<div>
								<b>Topic: </b> {comment.questionTopic}
							</div>
							<div><b>Related Question: </b> <Link to={questionLink} >{comment.questionText}</Link></div>
						</div>}
						<hr/>
					</div>)
				})}</div>
			
			</div>
		
	}
};
