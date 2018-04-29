import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
import CreateHelp from './CreateHelp';
import Autocomplete from 'react-autocomplete';


export default class ProblemReport extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        
        this.state={
        };
        this.change = this.change.bind(this);
    };
    
    componentDidMount() {
        
    }
    
     reportProblem() {
          let that = this;
          fetch('/api/reportproblem', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              
              body: JSON.stringify({question:this.props.question,user:this.props.user,problem:this.state.question.problem})
            });
            this.setState({});
      };
    
    change(e) {
        console.log(e.target);
        let state = {...this.props.question};
        var key = e.target.name;
        state[key] =  e.target.value;
//        console.log(['CHANGE',this.props.currentQuestion,state]);
        this.setState({'question':state});
  //      this.props.updateQuestion(state);
        return true;
    };
    
    
    render() {
        console.log(['QE REN',this.props]);
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
                 <label htmlFor="problem" >*&nbsp;What is the problem with this question?</label><textarea autoComplete="false" id="problem" type='text' name='problem' onChange={this.change} value={this.props.question.problem} className='form-control'></textarea>
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
                        
              
