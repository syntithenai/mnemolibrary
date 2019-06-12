/* eslint-disable */ 
import React, { Component } from 'react';
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import 'whatwg-fetch'


function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export default class MultipleChoiceQuestions extends Component {
    
    constructor(props) {
		super(props);
		this.state={
			questions : []
		}
		
    };
    
    componentDidMount() {
      let that=this;
        console.log(['MCQ dmount'])
        if (this.props.match.params.topic && this.props.match.params.topic.length > 0 ) {
			fetch('/api/mcquestions?topic='+this.props.match.params.topic)
			.then(function(response) {
				console.log(['got response'])
				return response.json()
			}).then(function(json) {
				console.log(['got mount json',json])
				that.setState({questions:json});
			}).catch(function(ex) {
				console.log(['parsing failed', ex])
			})
		}
	};
    
    
    render() { 
		let questions = null;
		let userId = this.props.user ? this.props.user._id : 'unknownuser';
		if (this.props.match.params.topic && this.props.match.params.topic.length > 0) {
			if (this.state.questions && this.state.questions.length > 0) { 
				questions = this.state.questions.map(function(question) {
					if (question && question.question && question.question.length > 0 && question.answer && question.answer.length > 0 && question.multiple_choices && question.multiple_choices.length > 0) { 
						let answered = (question.seenBy && question.seenBy.hasOwnProperty(userId) && question.seenBy[userId].length > 0) ? true : false;
						let userAnswer = question.seenBy ? question.seenBy[userId] : null;
						let userAnswerCorrect = question.answer === userAnswer ? true : false;
						let possibleAnswers = question.multiple_choices.split("|||");
						possibleAnswers.push(question.answer);
						possibleAnswers = shuffle(possibleAnswers);
						let answerButtons = possibleAnswers.map(function(sampleAnswer,key) {
							if (sampleAnswer === userAnswer) {
								if (userAnswerCorrect)  {
									return <button key={key} className='btn btn-success' >{sampleAnswer}</button>
								} else {
									return <button key={key} className='btn btn-danger' >{sampleAnswer}</button>
								}
							} else {
									return <button key={key} className='btn btn-info' >{sampleAnswer}</button>
							}
						})
						
						return <div style={{minHeight:'300px' ,paddingLeft:'1em',width:'100%',borderTop:'1px solid black'}} > 
						{question.image && question.image.length > 0 && <img src={question.image}  style={{float:'right',width:'200px'}} />}
						<div style={{paddingTop: '1em',}}>{question.question}</div> 
						<div style={{paddingTop: '1em',}}>{answerButtons}</div> 
						{answered && <div>
							You answered
						</div>}
						</div>
					} else {
						return null;
					}
				})
			} else {
				return <b>No quiz questions for this topic</b>
			}
		} else {
			questions=<b>Missing required topic</b>
		}
		return (
		<div className="row" style={{marginBottom:'5em'}}>
			{questions}
		</div>
		)
    }


}
