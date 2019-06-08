/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import TrashIcon from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';


export default class CommentList extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        
       
    };
    
    componentDidMount() {
        
    }
    

     reportProblem() {
         ////console.log('REPORT PROB '+this.state.question.problem);
          let that = this;
          fetch('/api/reportproblem', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              
              body: JSON.stringify({question:this.props.question,user:this.props.user,problem:this.state.problem})
            }).then(function() {
                //console.log('reprted');
                that.props.analyticsEvent('problem reported  '+JSON.stringify({question:that.props.question,user:that.props.user,problem:that.state.problem}));
                that.setState({'problem':''});                
            });
      };
    
    
    
    render() {
		let that = this;
		if (this.props.comments && this.props.comments.length > 0) {
			let publicComments = [];
			let privateComments = [];
			this.props.comments.map(function(comment) {
				let current_datetime = new Date(comment.createDate)
				let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
				if (comment.type === 'note') {
					privateComments.push( <div key={comment._id} >
						<div style={{float:'right'}}>
							<button   className="btn btn-primary" onClick={(e) => that.props.editComment(comment)} ><EditIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Edit</span></button>
							<button   className="btn btn-danger" onClick={(e) => that.props.deleteComment(comment)} ><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Delete</span></button>
						</div>
						<span className='date' style={{fontWeight:'bold',marginRight:'2em'}} >{formatted_date}</span>
						<div className='comment' >{comment.comment}</div>
						<hr/>
					</div>)
				} else {
					publicComments.push( <div key={comment._id}>
						<div style={{float:'right'}}>
							<button   className="btn btn-primary" onClick={(e) => that.props.editComment(comment)} ><EditIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Edit</span></button>
							<button   className="btn btn-danger" onClick={(e) => that.props.deleteComment(comment)} ><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Delete</span></button>
						</div>
						<span className='date' style={{fontWeight:'bold',marginRight:'2em'}} >{formatted_date}</span>
						<span className='user' >by {comment.userAvatar}</span>
						<div className='comment' >{comment.comment}</div>
						<hr/>
					</div>)
				} 
				return;
			});
			
			return <div style={{marginTop:'1em'}}>
				{privateComments.length > 0 && <h3>Notes</h3>}
				{privateComments}
				{publicComments.length > 0 && <h3>Comments</h3>}
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
                        
              
