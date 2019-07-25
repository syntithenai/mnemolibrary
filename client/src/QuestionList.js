/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import NotesList from './NotesList'

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
                    let details=null;
                    if (this.props.showQuestionListDetails) {
						title = <b>{title}</b>
						details=<div>
							<div style={{marginTop:'0.2em'}}>
								<b>Memory Aid: </b><span>{question.mnemonic}</span>
							</div>
							<div style={{marginTop:'0.2em'}}>
								<b>Answer: </b><span>{question.answer}</span>
							</div>
							{this.props.user && <NotesList user={this.props.user._id} question={question._id} />}
						</div>
					}
                    
                    if (this.props.onClick) {
                       return <div className='list-group-item' key={question._id} onClick={(e) => this.props.onClick(question)}  >
                        <span  >{title} ? {excerpt}</span>
                        {details}
                        </div>
                    } else {
                         return <Link to={"/discover/topic/"+question.quiz+"/"+question._id}  ><div className='list-group-item' key={question._id} >
                        {title} ? {excerpt}
                        {details}
                        </div>
                        </Link>
                    }
                  
                  
                }
                return '';
            })
            return (
              <div style={{fontSize:'1.2em'}} className="questions list-group">
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
