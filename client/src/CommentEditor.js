/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import CommentIcon from 'react-icons/lib/fa/comment';
import ExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import StickyNoteIcon from 'react-icons/lib/fa/sticky-note';
import CloseIcon from 'react-icons/lib/fa/times-circle';
import QuestionIcon from 'react-icons/lib/fa/question';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

let saveIcon = 
<svg style={{height:'1.4em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M433.941 129.941l-83.882-83.882A48 48 0 0 0 316.118 32H48C21.49 32 0 53.49 0 80v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V163.882a48 48 0 0 0-14.059-33.941zM224 416c-35.346 0-64-28.654-64-64 0-35.346 28.654-64 64-64s64 28.654 64 64c0 35.346-28.654 64-64 64zm96-304.52V212c0 6.627-5.373 12-12 12H76c-6.627 0-12-5.373-12-12V108c0-6.627 5.373-12 12-12h228.52c3.183 0 6.235 1.264 8.485 3.515l3.48 3.48A11.996 11.996 0 0 1 320 111.48z"></path></svg>

export default class CommentEditor extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        
        this.change = this.change.bind(this);
        this.savePrivateNote = this.savePrivateNote.bind(this);
        this.savePublicComment = this.savePublicComment.bind(this);
        this.reportProblem = this.reportProblem.bind(this);
        this.cancelComment = this.cancelComment.bind(this);
        this.saveQuestionComment = this.saveQuestionComment.bind(this);
       // this.doSave = this.doSave.bind(this);
        
    };
    
		//componentDidMount() {
			//console.log(['ce mount',this.props.commentId,this.props.commentText])
			
			//if (this.props.commentId && this.props.commentId.length > 0) {
				//this.setState({comment:this.props.commentText ? this.props.commentText : ''})
			//}
		//}
		
		//componentWillUpdate(props) {
			//console.log(['ce update',this.props.commentId,this.props.commentText,this.props.commentType])
			//console.log(['ce update',props.commentId,props.commentText])

			//if (this.props.commentId && this.props.commentId.length > 0 && this.props.commentId != props.commentId)  {
				//this.setState({comment:this.props.commentText ? this.props.commentText : ''})
			//}
		//}

		savePrivateNote() {
			this.props.saveComment({type:'note'})
		}

		savePublicComment() {
			this.props.saveComment({type:'comment'})
		}
		
		saveQuestionComment() {
			this.props.saveComment({type:'question'})
		}
 
		reportProblem() {
			let that = this;
			let toSave = {}
			let question = this.props.getCurrentQuestion();
			toSave.question = question ? question._id : null;
			toSave.user = this.props.user ? this.props.user._id : null;
			toSave.problem = this.props.problem && this.props.problem.comment ? this.props.problem.comment : '';
			console.log(['REPORT PROBLEM',toSave])
			if (toSave.question && toSave.user && toSave.problem && toSave.problem.length > 0) {
				fetch('/api/reportproblem', {
				  method: 'POST',
				  headers: {
					'Content-Type': 'application/json'
				  },
				  body: JSON.stringify(toSave)
				}).then(function() {
					that.setState({'comment':''});                
					that.props.toggleVisible();
				});
			}
		}
	
		cancelComment() {
			this.props.setComment(null);
		}

    
    change(e) {
       // //console.log(e.target);
//          //console.log(['CHANGE',this.props.currentQuestion,state]);
        let comment = this.props.comment;
        comment.comment = e.target.value;
        this.props.setComment(comment);
//        this.setState({'comment':e.target.value});
  //      this.props.updateQuestion(state);
        return true;
    };
    
    
    render() {
		let buttons=<div style={{paddingLeft:'0',marginLeft:'-1em',paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{textAlign:'right'}} onClick={this.saveQuestionComment}  className="btn btn-primary" ><QuestionIcon size={26}   />&nbsp;<span className="d-none d-md-inline-block">Ask Question</span></button>
					
					<button style={{align:'right'}}  onClick={this.savePublicComment}  className="btn btn-primary"><CommentIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Public Comment</span></button>
					
					<button style={{textAlign:'right'}} onClick={this.savePrivateNote}  className="btn btn-primary" ><StickyNoteIcon size={26}   />&nbsp;<span className="d-none d-md-inline-block">Private Note</span></button>
					
					<button style={{align:'right'}}  onClick={this.reportProblem}  className="btn btn-primary"><ExclamationTriangle size={26}  />&nbsp;<span className="d-none d-md-inline-block">Report Problem</span></button>
					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.cancelComment} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				</div>
		
		if (this.props.comment && this.props.comment.type === 'note') {
			buttons=<div style={{paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{textAlign:'right'}} onClick={this.savePrivateNote}  className="btn btn-primary" >{saveIcon}&nbsp;<span className="d-none d-md-inline-block">Save Note</span></button>
					
					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.cancelComment} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				</div>
		} else if (this.props.comment && this.props.comment.type === 'comment') {		
			buttons=<div style={{paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{align:'right'}}  onClick={this.savePublicComment}  className="btn btn-primary">{saveIcon}&nbsp;<span className="d-none d-md-inline-block">Save Comment</span></button>

					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.cancelComment} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				</div>
		} else if (this.props.comment && this.props.comment.type === 'question') {		
			buttons=<div style={{paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{align:'right'}}  onClick={this.saveQuestionComment}  className="btn btn-primary">{saveIcon}&nbsp;<span className="d-none d-md-inline-block">Save Question</span></button>

					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.cancelComment} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				</div>
		}
		
		return <div className='modaldialog'  >
			<div className="modaldialog-content">
			  <div className="modaldialog-header">
				<span onClick={this.cancelComment} className="modaldialog-close">&times;</span>
				<h2>Comment</h2>
			  </div>
			  
			  <div className="modaldialog-body">
				<div><b>Question: </b> {Utils.getQuestionTitle(this.props.question)}</div>
				
				<p style={{paddingTop:'1em'}}>
					<textarea style={{height: '10em', width:'100%'}} autoComplete="false" id="comment" type='text' name='comment' onChange={this.change} value={this.props.comment ? this.props.comment.comment : ''} className='form-control'></textarea>
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

