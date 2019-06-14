/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import CommentIcon from 'react-icons/lib/fa/comment';

export default class RecentComments extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        this.state= {
			comments:[]
		}
       this.loadComments = this.loadComments.bind(this)
    };
    
    componentDidMount() {
        this.loadComments()
    }
    
    loadComments() {
		let that=this;
		  fetch('/api/comments?limit=50')
		  .then(function(response) {
			return response.json()
		  }).then(function(json) {
			console.log(['loaded comments', json])
			that.setState({comments:json});
		  }).catch(function(ex) {
			console.log(['error loading comments', ex])
		  })
	}

    
    render() {
		let that = this;
		if (this.state.comments && this.state.comments.length > 0) {
			let renderedComments = this.state.comments.map(function(comment) {
				let current_datetime = new Date(comment.createDate)
				let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
				let questionLink = '/discover/topic/'+comment.questionTopic+'/'+comment.question
				return  <span key={comment._id}>
						<div className='question' ><a href={questionLink} >{comment.questionText}</a></div>
						
						<span className='date' style={{fontWeight:'bold',marginRight:'2em'}} >{formatted_date}</span>
						<span className='user' >by {comment.userAvatar}</span>
						<div className='comment' >{comment.comment}</div>
						<hr/>
					</span>
			});
			
			return <div style={{marginTop:'1em'}}>				
				{renderedComments}
			</div>
			
		} else {
			return null;
		}
	}
};

