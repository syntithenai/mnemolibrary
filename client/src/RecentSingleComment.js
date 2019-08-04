/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';
//import ReplyIcon from 'react-icons/lib/fa/reply-all';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import CommentIcon from 'react-icons/lib/fa/comment';

let replyIcon = 
<svg style={{height:'1em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z"></path></svg>

export default class RecentSingleComment extends Component {
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
    
    shouldComponentUpdate(newProps,newState) {
		if (this.state.comments != newState.comments || this.props.user != newProps.user) {
			return true;
		} else {	
			return false;
		}
	}
    
    loadComments() {
		let that=this;
		  fetch('/api/comments?limit=10')
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
		let max = this.state.comments.length < 10 ? this.state.comments.length : 10; 
		let random = parseInt(Math.random()*max,10)
		if (this.state.comments && this.state.comments.length > 0) {
			// single comment from last 10
			let comments = [this.state.comments[random]]; 
			console.log(['RENDERSINGLECOMMENT',this.state.comments,comments,random])
			let renderedComments = comments.map(function(comment) {
				let current_datetime = new Date(comment.createDate)
				let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
				let shortComment = comment.comment.split(' ').slice(0,10).join(' ')
				let replyLink  = '/recentcomments/'+comment.question;
				let joinWord = comment.type==="question" ? 'asks' : 'says'
				return  <span key={comment._id}>{comment.userAvatar} {joinWord} <i>"{shortComment}"</i>&nbsp;&nbsp;&nbsp;{that.props.user && <div onClick={(e) => that.props.newCommentReply(comment)} className='btn btn-success'>{replyIcon}</div>}&nbsp;<Link to={'/recentcomments/'+comment._id} className='btn btn-info'>...</Link></span>
			});
			
			return <div style={{backgroundColor:'#eee',paddingLeft:'0.8em'}}>				
				{renderedComments}
			</div>
			
		} else {
			return null;
		}
	}
};

  //<form method="POST" onSubmit={this.saveUser} className="form-group" autoComplete="false" >
                     //</form>
//<div className="modal-dialog" role="document">
                        //<div className="modal-content">
                          //<div className="modal-header">
                            //<h5 className="modal-title">Report Problem</h5>
                            //<button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              //<span aria-hidden="true">&times;</span>
                            //</button>
                          //</div>
                          //<div className="modal-body">
                       
                           //<label htmlFor="problem" >*&nbsp;What is the problem with this question?</label><textarea autoComplete="false" id="problem" type='text' name='problem' onChange={this.change} value={this.props.question.problem} className='form-control'></textarea>
                            //<br/>
                            //<button  onClick={() => this.reportProblem()} className='btn btn-info'>&nbsp;Report Problem&nbsp;</button>                            
                          //</div>
                        //</div>
                      //</div> 
                       

                    //</div>
                        
              
