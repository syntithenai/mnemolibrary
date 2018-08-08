import React, { Component } from 'react';
//import QuizList from './QuizList';
//import QuizCollection from './QuizCollection';
//import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
//import { confirmAlert } from 'react-confirm-alert'; // Import
//import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
//import Edit from 'react-icons/lib/fa/edit';
//import Trash from 'react-icons/lib/fa/trash';
import AngleUp from 'react-icons/lib/fa/angle-up';
import AngleDown from 'react-icons/lib/fa/angle-down';

export default class TopicQuestionsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
       
    };
    
    componentDidMount() {
        
    }

    moveDown(key,e) {
        //console.log(['down',key,e]);
        this.props.moveQuestion(key,1);
        e.preventDefault();
        e.stopPropagation()
        return false;
    };

    moveUp(key,e) {
        //console.log(['up',key,e]);
        this.props.moveQuestion(key,-1);
        e.preventDefault();
        e.stopPropagation()
        return false;
    };

    
    render() {
       // //console.log(['VAL ERR',this.props.validationErrors]);
        if (this.props.questions) {
            let list = this.props.questions.map((question,key) => {
                let errors='';
                if (this.props.validationErrors && this.props.validationErrors.hasOwnProperty(key) && this.props.validationErrors[key].length > 0) {
                    errors="Missing required information for "+this.props.validationErrors[key].join(" and ");
                }
                let excerpt='-->' + question.answer.split(' ').slice(0,3).join(' ')+'...';
                if (!this.props.filter || (question.question.indexOf(this.props.filter)>=0 || question.interrogative.indexOf(this.props.filter)>=0 || question.mnemonic.indexOf(this.props.filter)>=0 || question.answer.indexOf(this.props.filter)>=0))
                return <div className='list-group-item'  onClick={() => this.props.editQuestion(key)} key={key} >
                <button className='btn btn-light'  onClick={(e) => this.moveUp(key,e)} ><AngleUp size={28} /></button>
                <button className='btn btn-light'   onClick={(e) =>this.moveDown(key,e)} ><AngleDown size={28}  /></button>
                &nbsp;&nbsp;<span >{key+1}. {question.interrogative} {question.question} {excerpt}</span><div className="questionErrors">{errors}</div></div>
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
