/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import CommentIcon from 'react-icons/lib/fa/comment';

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
    
    loadComments() {
		let that=this;
		  fetch('/api/comments?limit=1')
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
				let shortComment = comment.comment.split(' ').slice(0,10).join(' ')
				return  <span key={comment._id}>{comment.userAvatar} says <i>"{shortComment}"</i>&nbsp;&nbsp;&nbsp;<a href='/recentcomments' className='btn btn-info'>...</a></span>
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
                        
              
