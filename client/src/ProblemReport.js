import React, { Component } from 'react';
//import CreateHelp from './CreateHelp';
 

export default class ProblemReport extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        
        this.state={
            problem:''
        };
        this.change = this.change.bind(this);
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
                that.setState({'problem':''});                
            });
      };
    
    change(e) {
       // //console.log(e.target);
//          //console.log(['CHANGE',this.props.currentQuestion,state]);
        this.setState({'problem':e.target.value});
  //      this.props.updateQuestion(state);
        return true;
    };
    
    
    render() {
      //  //console.log(['QE REN',this.props]);
        if (this.props.question) {
            return (
            
            // TAGS https://www.npmjs.com/package/react-tag-autocomplete
                            
                    <div id="problemdialog" className='modal' tabIndex="-1" role="dialog" >    
                      <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Report a Problem</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                 <label htmlFor="problem" >*&nbsp;What is the problem with this question?</label><textarea autoComplete="false" id="problem" type='text' name='problem' onChange={this.change} value={this.state.problem} className='form-control'></textarea>
                            <br/>
                            <button  data-toggle="modal" data-target="#problemdialog" onClick={() => this.reportProblem()} className='btn btn-info'>&nbsp;Report Problem&nbsp;</button>   
                    
                  </div>
                </div>
              </div>
              
              </div>
          
            )
        } else return '';
            
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
                        
              
