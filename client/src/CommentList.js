/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import CommentIcon from 'react-icons/lib/fa/comment';


let replyIcon=
<svg style={{height:'1.2em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M8.309 189.836L184.313 37.851C199.719 24.546 224 35.347 224 56.015v80.053c160.629 1.839 288 34.032 288 186.258 0 61.441-39.581 122.309-83.333 154.132-13.653 9.931-33.111-2.533-28.077-18.631 45.344-145.012-21.507-183.51-176.59-185.742V360c0 20.7-24.3 31.453-39.687 18.164l-176.004-152c-11.071-9.562-11.086-26.753 0-36.328z"></path></svg>


export default class CommentList extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        this.state={showReplies:{},showButtons:null}
        this.showReplies = this.showReplies.bind(this)
        this.showButtons = this.showButtons.bind(this)
		this.hideButtons = this.hideButtons.bind(this)
		this.editComment = this.editComment.bind(this)
		this.deleteComment = this.deleteComment.bind(this)
		this.newCommentReply = this.newCommentReply.bind(this)
		
    };
    
    
    
    //componentDidMount() {
        
    //}
    
    //componentDidUpdate() {
		//this.setState({showButtons:commentKey});
	//}
    
    
    showReplies(commentKey) {
		let showReplies = this.state.showReplies;
		showReplies[commentKey]=1;
		this.setState({showReplies:showReplies});
	}

  
    showButtons(commentKey) {
		console.log('show buttons '+commentKey)
		this.setState({showButtons:commentKey});
	}

	hideButtons() {
		this.setState({showButtons:null});
	}
	
	editComment(e) {
		this.hideButtons();
		this.props.editComment(e)
	}

	deleteComment(e) {
		this.hideButtons();
		this.props.deleteComment(e)
	}

	newCommentReply(e) {
		this.hideButtons();
		this.props.newCommentReply(e)
	}


	
     //reportProblem() {
         //////console.log('REPORT PROB '+this.state.question.problem);
          //let that = this;
          //fetch('/api/reportproblem', {
              //method: 'POST',
              //headers: {
                //'Content-Type': 'application/json'
              //},
              
              //body: JSON.stringify({question:this.props.question,user:this.props.user,problem:this.state.problem})
            //}).then(function() {
                ////console.log('reprted');
                //that.props.analyticsEvent('problem reported  '+JSON.stringify({question:that.props.question,user:that.props.user,problem:that.state.problem}));
                //that.setState({'problem':''});                
            //});
      //};
    
    //deleteComment(comment) {

            //confirmAlert({
              //title: 'Delete Comment',
              //message: 'Are you sure you want to delete this comment?',
              //buttons: [
                //{
                  //label: 'Yes',
                  //onClick: () => {this.props.deleteComment(comment)}
                //},
                //{
                  //label: 'No',
                  //onClick: () => {}
                //}
              //]
            //})
	//} 
    
    render() {
		let that = this;
		if (this.props.comments && this.props.comments.length > 0) {
			let publicComments = [];
			let privateComments = [];
			let questionComments = [];
			
			this.props.comments.map(function(comment,commentKey) {
				let buttons = 	(<div style={{float:'right'}}>
							<button   className="btn btn-success" onClick={(e) => that.props.newCommentReply(comment)} >{replyIcon}&nbsp;<span className="d-none d-md-inline-block">Reply</span></button>
							<button   className="btn btn-primary" onClick={(e) => that.showButtons(commentKey)} >...</button>
						</div>)
				if (that.state.showButtons === commentKey) {
					buttons=(<div className='modaldialog'  >
						<div className="modaldialog-content">
						  <div className="modaldialog-header">
							<span onClick={that.hideButtons} className="modaldialog-close">&times;</span>
							<h2>Comment Options</h2>
						  </div>
						  
						  <div className="modaldialog-body">
							<div style={{marginTop:'1em'}}>
								<button   className="btn btn-success" onClick={(e) => that.newCommentReply(comment)} >{replyIcon}&nbsp;<span className="d-none d-md-inline-block">Reply</span></button>
								<button   className="btn btn-primary" onClick={(e) => that.editComment(comment)} ><EditIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Edit</span></button>
								<button   className="btn btn-danger" onClick={(e) => that.deleteComment(comment)} ><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Delete</span></button>
								<button  style={{float:'right'}} className="btn btn-danger" onClick={(e) => that.hideButtons()} >Cancel</button>
							</div>

						  </div>
						  <div className="modaldialog-footer">
							<hr style={{height:'2px'}}/>
						  </div>
						</div>
					</div>)
					
					
					
					
					
					
				}
				
						
				let current_datetime = new Date(comment.createDate)
				let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
				let joinWord = comment.type==="question" ? 'asks' : 'says'
				let titleWord = comment.type==="question" ? 'Question' : 'Comment'
				let questionLink = '/discover/topic/'+comment.questionTopic+"/"+comment.question;
				let repliesRendered = null;
				if (comment.replies && comment.replies.length > 0) {
					if (that.state.showReplies[commentKey]) {
						repliesRendered = comment.replies.map(function(reply,replyKey) {
							let reply_formatted_date = reply && reply.createDate ? new Date(reply.createDate).getDate() + "-" + (new Date(reply.createDate).getMonth() + 1) + "-" + new Date(reply.createDate).getFullYear() : null;
							
							return <div key={replyKey} style={{paddingLeft:'0em'}}> <span >
									<span className='date' style={{fontWeight:'bold',marginRight:'0em'}} > {reply_formatted_date} </span>

									<b>{reply.userAvatar}</b> replied <i>"{reply.text}"</i></span>
								</div>
						});
					} else {
						repliesRendered=<button className='btn btn-info' onClick={(e) => that.showReplies(commentKey)} >Show</button>
					}
				} 
				if (comment.type === 'note') {
					
					privateComments.push( <div key={comment._id} >
						<div>{buttons}</div>
						
							<div style={{paddingLeft:'0em'}}> <span >
								<span className='date' style={{fontWeight:'bold',marginRight:'0em'}} >{formatted_date} </span>

								<b>{comment.userAvatar}</b> {joinWord} <i>"{comment.comment}"</i></span>
							</div>
								
							{comment.questionText && <div><div><b>Topic: </b> {comment.questionTopic}</div>
							<div><b>Related Question: </b> <Link to={questionLink} >{comment.questionText}</Link></div></div>}
							{repliesRendered && <div><b>Replies:</b> {repliesRendered}	</div>}
						<hr/>
					</div>)
				} else if (comment.type === 'question') {
					questionComments.push( <div key={comment._id}>
						{(that.props.isAdmin() || (that.props.user && comment.user === that.props.user._id)) && <div>{buttons}</div>}
								<div style={{ paddingLeft:'0em'}}> <span >
								<span className='date' style={{fontWeight:'bold',marginRight:'0em'}} >{formatted_date} </span>

								<b>{comment.userAvatar}</b> {joinWord} <i>"{comment.comment}"</i></span>
							</div>
								
							{comment.questionText && <div><div><b>Topic: </b> {comment.questionTopic}</div>
							<div><b>Related Question: </b> <Link to={questionLink} >{comment.questionText}</Link></div></div>}
							{repliesRendered && <div><b>Replies:</b> {repliesRendered}	</div>}
						<hr/>
					</div>)
				
				
				} else {
					publicComments.push( <div key={comment._id}>
						{(that.props.isAdmin() || (that.props.user && comment.user === that.props.user._id)) && <div>{buttons}</div>}
								<div style={{ paddingLeft:'0em'}}> <span >
								<span className='date' style={{fontWeight:'bold',marginRight:'0em'}} >{formatted_date} </span>

								<b>{comment.userAvatar}</b> {joinWord} <i>"{comment.comment}"</i></span>
							</div>
								
							{comment.questionText && <div><div><b>Topic: </b> {comment.questionTopic}</div>
							<div><b>Related Question: </b> <Link to={questionLink} >{comment.questionText}</Link></div></div>}
							{repliesRendered && <div><b>Replies:</b> {repliesRendered}	</div>}
						<hr/>
					</div>)
				} 
				return;
			});
			
			return <div  style={{marginTop:'1em'}}>
				{this.props.user && (privateComments.length > 0 ||  publicComments.length > 0||  questionComments.length > 0) &&  <button style={{float:'right'}} onClick={this.props.newComment} className='btn btn-success'><CommentIcon size={26} /><span className="d-none d-md-inline-block">&nbsp;New Comment&nbsp;</span></button>}
				<div style={{width:'100%',clear:'both'}}></div>
				{privateComments.length > 0 && <div><b className='commentsubheader' >Notes</b></div>}
				{privateComments}
				{questionComments.length > 0 && <div style={{marginTop:'0.5em',marginBottom:'0.5em'}}><b className='commentsubheader' >Questions</b></div>}
				{questionComments}
				
				{publicComments.length > 0 && <div style={{marginTop:'0.5em',marginBottom:'0.5em'}}	><b className='commentsubheader'>Comments</b></div>}
				{publicComments}			
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
                        
              
