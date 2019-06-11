/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import CommentIcon from 'react-icons/lib/fa/comment';
import ExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import StickyNoteIcon from 'react-icons/lib/fa/sticky-note';
import CloseIcon from 'react-icons/lib/fa/times-circle';


export default class CommentEditor extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        
        this.state={
            comment:this.props.commentText
        };
        
        this.change = this.change.bind(this);
        this.savePrivateNote = this.savePrivateNote.bind(this);
        this.savePublicComment = this.savePublicComment.bind(this);
        this.reportProblem = this.reportProblem.bind(this);
        this.cancelComment = this.cancelComment.bind(this);
        this.doSave = this.doSave.bind(this);
        
    };
    
		componentDidMount() {
			console.log(['ce mount',this.props.commentId,this.props.commentText])
			
			if (this.props.commentId && this.props.commentId.length > 0) {
				this.setState({comment:this.props.commentText ? this.props.commentText : ''})
			}
		}
		
		componentWillUpdate(props) {
			console.log(['ce update',this.props.commentId,this.props.commentText,this.props.commentType])
			console.log(['ce update',props.commentId,props.commentText])

			if (this.props.commentId && this.props.commentId.length > 0 && this.props.commentId != props.commentId)  {
				this.setState({comment:this.props.commentText ? this.props.commentText : ''})
			}
		}

		savePrivateNote() {
			this.doSave({type:'note'})
		}

		savePublicComment() {
			this.doSave({type:'comment'})
		}
 
		reportProblem() {
			let that = this;
			let toSave = {}
			toSave.question = this.props.question ? this.props.question._id : null;
			toSave.user = this.props.user ? this.props.user._id : null;
			toSave.problem = this.state.comment;
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
			this.setState({comment:''});
			this.props.toggleVisible();
		}

        doSave(toSave) {
			console.log('do save '+this.state.comment);
			let that = this;
			toSave.question = this.props.question ? this.props.question._id : null;
			toSave.user = this.props.user ? this.props.user._id : null
			toSave.userAvatar = this.props.user ? this.props.user.avatar : null
			
			toSave.comment = this.state.comment;
			if (toSave.question && toSave.user && toSave.comment && toSave.comment.length > 0) {
				if (this.props.commentId) {
				  toSave._id= this.props.commentId;
				  toSave.createDate = this.props.commentCreateDate;
				}
				fetch('/api/savecomment', {
				  method: 'POST',
				  headers: {
					'Content-Type': 'application/json'
				  },
				  
				  body: JSON.stringify(toSave)
				}).then(function() {
					that.setState({'comment':''});                
					that.props.toggleVisible();
					console.log(['NOW RELOAD COMMENTS',that.props.loadComments])
					that.props.loadComments(that.props.question._id,that.props.user._id)
				});
			}
      };
    
    change(e) {
       // //console.log(e.target);
//          //console.log(['CHANGE',this.props.currentQuestion,state]);
        this.setState({'comment':e.target.value});
  //      this.props.updateQuestion(state);
        return true;
    };
    
    
    render() {
		let buttons=<div style={{paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{textAlign:'right'}} onClick={this.savePrivateNote}  className="btn btn-primary" ><StickyNoteIcon size={26}   />&nbsp;<span className="d-none d-md-inline-block">Private Note</span></button>
					
					<button style={{align:'right'}}  onClick={this.savePublicComment}  className="btn btn-primary"><CommentIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Public Comment</span></button>
					<button style={{align:'right'}}  onClick={this.reportProblem}  className="btn btn-primary"><ExclamationTriangle size={26}  />&nbsp;<span className="d-none d-md-inline-block">Report Problem</span></button>
					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.cancelComment} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				</div>
		
		if (this.props.commentType && this.props.commentType === 'note') {
			buttons=<div style={{paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{textAlign:'right'}} onClick={this.savePrivateNote}  className="btn btn-primary" ><StickyNoteIcon size={26}   />&nbsp;<span className="d-none d-md-inline-block">Save Note</span></button>
					
					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.cancelComment} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				</div>
		} else if (this.props.commentType && this.props.commentType === 'comment') {		
			buttons=<div style={{paddingBottom:'1em'}} className='commentbuttons'>
					
					<button style={{align:'right'}}  onClick={this.savePublicComment}  className="btn btn-primary"><CommentIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Save Comment</span></button>

					<button style={{align:'right'}}  className="btn btn-danger" onClick={this.cancelComment} ><CloseIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Cancel</span></button>
				</div>
		}
		
		return <div className='modaldialog'  style={{display:this.props.visible ? 'block' : 'none'}}>
			<div className="modaldialog-content">
			  <div className="modaldialog-header">
				<span onClick={this.cancelComment} className="modaldialog-close">&times;</span>
				<h2>Comment</h2>
			  </div>
			  
			  <div className="modaldialog-body">
				<div><b>Question: </b> {Utils.getQuestionTitle(this.props.question)}</div>
				
				<p style={{paddingTop:'1em'}}>
					<textarea style={{height: '10em', width:'100%'}} autoComplete="false" id="comment" type='text' name='comment' onChange={this.change} value={this.state.comment} className='form-control'></textarea>
				</p>
				{buttons}
			  </div>
			  <div className="modaldialog-footer">
				<hr style={{height:'2px'}}/>
			  </div>
			</div>
		</div>
		
		//return <div style={{border: '1px solid black',zIndex:999,backgroundColor:'white'}} >
			//<div style={{color: 'red'}} >
				//<h5 >Report a Problem</h5>
				//<button style={{float:'right'}} type="button" >
				  //<span >&times;</span>
				//</button>
				
                   //AAAA
			//</div>
		//</div>
		
		
      ////  //console.log(['QE REN',this.props]);
        //if (this.props.question) {
            //return (
            
            //// TAGS https://www.npmjs.com/package/react-tag-autocomplete
                 
                            
                    //<div id="problemdialog" className='modal' tabIndex="-1" role="dialog" >    
                      //<div className="modal-dialog" role="document">
                //<div className="modal-content">
                  //<div className="modal-header">
                    //<h5 className="modal-title">Report a Problem</h5>
                    //<button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      //<span aria-hidden="true">&times;</span>
                    //</button>
                  //</div>
                  //<div className="modal-body">
                 //<label htmlFor="problem" >*&nbsp;What is the problem with this question?</label><textarea autoComplete="false" id="problem" type='text' name='problem' onChange={this.change} value={this.state.problem} className='form-control'></textarea>
                            //<br/>
                            //<button  data-toggle="modal" data-target="#problemdialog" onClick={() => this.reportProblem()} className='btn btn-info'>&nbsp;Report Problem&nbsp;</button>   
                    
                  //</div>
                //</div>
              //</div>
              
              //</div>
          
            //)
        //} else return '';
            
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
                        
              
