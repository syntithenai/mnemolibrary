import React, { Component } from 'react';
import Utils from './Utils';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

export default class QuestionList extends Component {
    render() {
       // //console.log(['QL',this.props.questions]);
        if (Array.isArray(this.props.questions)) {
            let questions = this.props.questions.map((question, key) => {
                if (question && question._id) {
                    let title=Utils.getQuestionTitle(question);
                    let excerpt='';
                    //console.log(this.props);
                    if (this.props.isReview===false) {
                        excerpt='-->' + question.answer.split(' ').slice(0,3).join(' ')+'...';
                    } 
                    if (this.props.onClick) {
                       return <div className='list-group-item' key={question._id} >
                        <span onClick={(e) => this.props.onClick(question)}  >{title} ? {excerpt}</span>
                        </div>
                    } else {
                         return <div className='list-group-item' key={question._id} >
                        <Link to={"/discover/topic/"+question.quiz+"/"+question._id}  >{title} ? {excerpt}</Link>
                        </div>
                    }
                  
                  
                }
                return '';
            })
            return (
              <div className="questions list-group">
                  {
                    questions
                  }
                
              </div>
            )
        } else {
            return null
        }
        
        
    };
}
