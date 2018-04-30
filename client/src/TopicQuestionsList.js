import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Edit from 'react-icons/lib/fa/edit';
import Trash from 'react-icons/lib/fa/trash';

export default class TopicQuestionsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
        this.deleteQuestion=this.deleteQuestion.bind(this);
    };
    
    componentDidMount() {
        
    }
    
    deleteQuestion(key) {
        confirmAlert({
          title: 'Delete Question',
          message: 'Are you sure?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.props.deleteQuestion(key)
            },
            {
              label: 'No'
            }
          ]
        })
            
    };
    
    render() {
       // console.log(['VAL ERR',this.props.validationErrors]);
        if (this.props.questions) {
            let list = this.props.questions.map((question,key) => {
                let errors='';
                if (this.props.validationErrors && this.props.validationErrors.hasOwnProperty(key) && this.props.validationErrors[key].length > 0) {
                    errors="Missing required information for "+this.props.validationErrors[key].join(" and ");
                }
                return <div className='list-group-item' key={key} ><button  className='btn btn-danger' style={{float:'right'}} onClick={() => this.deleteQuestion(key)} ><Trash size={28}/>&nbsp;<span className="d-none d-sm-inline" >Delete</span> </button><button  className='btn btn-info' style={{float:'right'}} onClick={() => this.props.editQuestion(key)} ><Edit size={28}/>&nbsp;<span className="d-none d-sm-inline" >Edit</span> </button>{key+1}. {question.interrogative} {question.question} <div className="questionErrors">{errors}</div></div>
            });
            return (
                <div className='list-group' >{list}
                </div>
            )
        } else {
            return '';
        }
        
    }
};
