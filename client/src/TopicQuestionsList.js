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
       
    };
    
    componentDidMount() {
        
    }


    
    render() {
       // console.log(['VAL ERR',this.props.validationErrors]);
        if (this.props.questions) {
            let list = this.props.questions.map((question,key) => {
                let errors='';
                if (this.props.validationErrors && this.props.validationErrors.hasOwnProperty(key) && this.props.validationErrors[key].length > 0) {
                    errors="Missing required information for "+this.props.validationErrors[key].join(" and ");
                }
                return <div className='list-group-item'  onClick={() => this.props.editQuestion(key)} key={key} ><span >{key+1}. {question.interrogative} {question.question} </span><div className="questionErrors">{errors}</div></div>
            });
            return (
                <div className='list-group' >
                
                {list}
                </div>
            )
        } else {
            return '';
        }
        
    }
};
