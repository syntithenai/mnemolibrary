/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import CommentIcon from 'react-icons/lib/fa/comment';
import CloseIcon from 'react-icons/lib/fa/times-circle';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

let saveIcon = 
<svg style={{height:'1.4em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg>

export default class CommentReplyEditor extends Component {
    constructor(props) {
        super(props);
        this.state = {text: ''}
        //let question = this.props.question ? this.props.question : {};
        this.change = this.change.bind(this);
     };

	
	componentDidMount() {
		let comment = this.props.comment;
		let replyIndex = this.props.replyIndex;
		this.setState({'text': (comment && comment.replies && comment.replies.length > replyIndex && comment.replies[replyIndex] != null  ? comment.replies[replyIndex] : '')});
	}
	
	componentDidUpdate(prevProps,prevState) {
		let comment = this.props.comment;
		let replyIndex = this.props.replyIndex;
		if (comment !== prevProps.comment || replyIndex !== prevProps.replyIndex) {
			this.setState({'text': (comment && comment.replies && comment.replies.length > replyIndex && comment.replies[replyIndex] != null  ? comment.replies[replyIndex] : '')});		
		}
	}

    
    change(e) {
        this.setState({'text':e.target.value});
        return true;
    };
    
    
    render() {
		let comment = this.props.comment ? this.props.comment : {} 
		let buttons=<div style={{paddingLeft:'0',marginLeft:'-1em',paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{align:'right'}}  onClick={(e) => this.props.saveCommentReply(this.state.text)}  className="btn btn-primary"><CommentIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Reply</span></button>
					
					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.props.cancelCommentReply} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				
				</div>
		let joinWord = comment.type==="question" ? 'asks' : 'says'
		let titleWord = comment.type==="question" ? 'Question' : 'Comment'
		let questionLink = '/discover/topic/'+comment.questionTopic+"/"+comment.question;
		return <div className='modaldialog'  >
			<div className="modaldialog-content">
			  <div className="modaldialog-header">
				<span onClick={this.props.cancelCommentReply} className="modaldialog-close">&times;</span>
				<h2>Reply to {titleWord}</h2>
			  </div>
			  
			  <div className="modaldialog-body">
				<div style={{fontSize:'1.2em', backgroundColor:'#eee', paddingLeft:'0.2em'}}> <span ><b>{comment.userAvatar}</b> {joinWord} <i>"{comment.comment}"</i></span></div>
				{comment.questionText && <div><div><b>Topic: </b> {comment.questionTopic}</div>
				<div><b>Related Question: </b> <Link to={questionLink} >{comment.questionText}</Link></div></div>}
				
				
				<p style={{paddingTop:'1em'}}>
					<textarea style={{height: '10em', width:'100%'}} autoComplete="false" id="comment" type='text' name='comment' onChange={this.change} value={this.state.text} className='form-control'></textarea>
				</p>
				{buttons}
			  </div>
			  <div className="modaldialog-footer">
				<hr style={{height:'2px'}}/>
			  </div>
			</div>
		</div>
		
            
    }
};

