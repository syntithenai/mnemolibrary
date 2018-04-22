import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';

export default class TopicQuestionsList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            
        };
    };
    
    componentDidMount() {
        
    }
    
    render() {
        if (this.props.questions) {
            let list = this.props.questions.map((question,key) => {
                 return <div className='list-group-item' key={key} ><button  className='btn btn-danger' style={{float:'right'}} onClick={() => this.props.deleteQuestion(key)} >Delete</button><button  className='btn btn-info' style={{float:'right'}} onClick={() => this.props.editQuestion(key)} >Edit</button>{question.interrogative} {question.question} </div>
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
