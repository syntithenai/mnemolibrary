/* eslint-disable */ 
import React, { Component } from 'react';
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import 'whatwg-fetch'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import scrollToComponent from 'react-scroll-to-component';


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
			questions : [],
			currentQuestion : null
		}
		this.questionsIndex = {};
		this.scrollTo={};
        
		this.clickResetQuiz = this.clickResetQuiz.bind(this)
		this.resetQuiz = this.resetQuiz.bind(this)
		this.loadQuestions = this.loadQuestions.bind(this)
		this.nextQuestion = this.nextQuestion.bind(this)
		this.setCurrentQuestion = this.setCurrentQuestion.bind(this)
		
    };
    
    componentDidMount() {
      let that=this;
        console.log(['MCQ dmount'])
        this.loadQuestions();
       //	scrollToComponent(this.scrollTo['top'],{align:'top',offset:0});
    	//scrollToComponent(this.scrollTo['top'],{align:'top',offset:-160});
		
    };
    
    componentDidUpdate(props,state) {
		console.log(['MCQ update',this.props.user,props.user])
        
		if (this.props.user && !props.user) {
			this.nextQuestion()
		}
		if (state.currentQuestion != this.state.currentQuestion) {
			scrollToComponent(this.scrollTo['question_'+this.state.currentQuestion],{align:'top',offset:-160});
		}
	}
    
    
    loadQuestions() {
		let that = this;
		if (this.props.match.params.topic && this.props.match.params.topic.length > 0 ) {
			fetch('/api/mcquestions?topic='+this.props.match.params.topic)
			.then(function(response) {
				console.log(['got response'])
				return response.json()
			}).then(function(json) {
				console.log(['got mount json',json])
				let filteredQuestions = json.map(function(question,key) {
					let a = {}
					that.questionsIndex[question._id] = key;
					let possibleAnswers = question.multiple_choices.split("|||");
					possibleAnswers.push(question.answer);
					possibleAnswers = shuffle(possibleAnswers);
					question.possibleAnswers = possibleAnswers;
					return question;
				});
				
				that.setState({questions:filteredQuestions});
			
			}).catch(function(ex) {
				console.log(['parsing failed', ex])
			})
		}
	}
    
    resetQuiz() {
		let that = this;
		console.log('reset  ')
		if (this.props.match.params.topic && this.props.match.params.topic.length > 0 ) {
			console.log('really reset  ')
			var params={
				'user':this.props.user ? this.props.user._id : null,
				'topic':this.props.match.params.topic,
			};
			fetch('/api/resetmcquiz', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			  },
			  body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
			}).then(function(response) {
				return response.json();
			}).then(function(res) {
				console.log('done reset quiz')
				that.loadQuestions();
				this.setState({currentQuestion:0})
			})
		}
	}
    
    clickResetQuiz() {
		
		confirmAlert({
		  title: 'Reset Quiz',
		  message: 'Are you sure you want to clear all your answers for this quiz ?',
		  buttons: [
			{
			  label: 'Reset',
			  onClick: () => this.resetQuiz()
			},
			{
			  label: 'Cancel',
			  onClick: () => {}
			}
		  ]
		})
	
	}
    
    // scroll to next unanswered question
    nextQuestion() {
		console.log(['NEXT QUESTION',this.state.questions,this.props.user,this.state.currentQuestion])
		
		if (this.state.questions && this.state.questions.length > 0) {
			console.log(['NEXT QUESTION f',this.state.currentQuestion])
			let userId = this.props.user ? this.props.user._id : 'unknownuser'
			let counter = 0;
			let found = false;
			for (var questionKey in this.state.questions) {
				let question = this.state.questions[questionKey]
				if (question) {
					console.log(['NEXT QUESTION A',question.seenBy,userId,questionKey])
					
					if (counter >= this.state.currentQuestion && (!question.seenBy || !question.seenBy[userId])) {
						this.setState({currentQuestion:counter})
						found = true;
						console.log(['NEXT QUESTION A found',counter])
				
						break;
					}
					counter++;
				}
			}
			// try again from the beginning
			counter = 0;
			
			if (!found) {
				for (var questionKey in this.state.questions) {
					let question = this.state.questions[questionKey]
					if (question) {
						console.log(['NEXT QUESTION B',question.seenBy])
						if ((!question.seenBy || !question.seenBy[userId])) {
							this.setState({currentQuestion:counter})
							console.log(['NEXT QUESTION B found',counter])
							break;
						}
						counter++;
					}
				}
			}
		}
        
	}
	
	setCurrentQuestion(key) {
		console.log(['set QUESTION',key])
		this.setState({currentQuestion : key})
	}
    
    clickAnswer(id,answer) {
		let that = this;
		console.log('answered '+answer +'||' + id)
		var params={
            '_id':id,
            'user':this.props.user ? this.props.user._id : null,
            'answer':answer,
          };
        fetch('/api/submitmcquestion', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
        }).then(function(response) {
            return response.json();
            
        }).then(function(res) {
			console.log(['ANSWERdd RESPONSE',id,that.questionsIndex[id],that.questionsIndex])
				let questionKey = that.questionsIndex && that.questionsIndex.hasOwnProperty(id) ? that.questionsIndex[id] : null;
				console.log(['Q KEY',questionKey]);
				if (questionKey !== null) {
					let questions = that.state.questions;
					let question = questions && questions.hasOwnProperty(questionKey) ? questions[questionKey] : null;
					console.log(['have key',questionKey])
					if (question) {
					console.log(['have question',question])
						// update question with stats
						if (res.error) {
							question.error = res.error;
						} else {
							question.error = '';
							question.seenBy = typeof question.seenBy === 'object' ? question.seenBy : {};
							question.seenBy[that.props.user ? that.props.user._id : 'unknownuser'] = answer;
							question.seen = res.seen;
							question.overallPercentCorrect = res.overallPercentCorrect;
						}
						
						questions[questionKey] = question;
						console.log(['SET MC STATE',question,questions])
						that.setState({questions: questions});
					} 
				} 
		});
	}
    
    render() { 
		let that = this;
		let questions = null;
		let userAnsweredTally = 0;
		let userCorrectTally = 0;
		
		let userId = this.props.user ? this.props.user._id : 'unknownuser';
		if (this.props.match.params.topic && this.props.match.params.topic.length > 0) {
			if (this.state.questions && this.state.questions.length > 0) { 
				questions = this.state.questions.map(function(question,questionKey) {
					
					if (question && question.question && question.question.length > 0 && question.answer && question.answer.length > 0 && question.multiple_choices && question.multiple_choices.length > 0) { 
						let answered = (question.seenBy && question.seenBy[userId] && question.seenBy[userId].length > 0) ? true : false;
						let userAnswer = question.seenBy ? question.seenBy[userId] : null;
						let userAnswerCorrect = question.answer === userAnswer ? true : false;
						if (answered) {
							userAnsweredTally++;
							if (userAnswerCorrect) userCorrectTally++;
						}
						
						let possibleAnswers = question.possibleAnswers;
						let answerButtons = possibleAnswers.map(function(sampleAnswer,key) {
							// determine button color from answer status
							if (answered) {
								// is this answer the user answer
								if (sampleAnswer === userAnswer) {
									if (userAnswerCorrect)  {
										return <button style={{fontWeight:'bold',border:'2px solid black'}} key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} className='btn btn-success' >{sampleAnswer}</button>
									} else {
										return <button key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} className='btn btn-danger' >{sampleAnswer}</button>
									}
								// is this button the correct answer
								} else if (sampleAnswer === question.answer) {
									return <button style={{fontWeight:'bold',border:'2px solid black'}} key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} className='btn btn-success' >{sampleAnswer}</button>
								} else {
										return <button key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} className='btn btn-primary' >{sampleAnswer}</button>
								}
								
							} else {
								return <button key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} className='btn btn-primary' >{sampleAnswer}</button>
							}
						})
						let moreInfoLink = '/discover/topic/'+question.topic+'/'+question._id;
						
						return <div ref={(section) => { that.scrollTo['question_'+(questionKey)] = section; }}  onClick={(e) => that.setCurrentQuestion(questionKey)} key={question._id} style={{minHeight:'300px' ,paddingLeft:'1em',width:'100%',borderTop:'1px solid black'}} > 
						
						{question.image && question.image.length > 0 && <img src={question.image}  style={{float:'right',width:'200px'}} />}
						
						<div>
							<div style={{float:'right'}}><a href={moreInfoLink} className='btn btn-info'>More Information</a></div> 
						</div> 
						<b style={{paddingTop: '1em'}}>{question.question}</b>
						
						<div style={{color: 'red', fontWeight:'bold', paddingTop: '1em',}}>{question.error}</div> 

						{answered && <div>
							You  {userAnswerCorrect?'' : ' incorrectly '} answered {userAnswer}. {!userAnswerCorrect ? ' The correct answer is '+question.answer+".":''}
						</div>}
						{answered  && <i style={{paddingTop: '2em'}}>{question.overallPercentCorrect ? question.overallPercentCorrect : 0} percent of {question.seen > 0 ? question.seen : 1} people answered correctly.</i> }
	
						<div style={{ width:'', marginTop: '1em',padding: '0.5em', border: '1px solid black' , backgroundColor:'#eee',borderRadius:'30px',marginRight:'1em'}}>{answerButtons}</div> 
						<div id={'question_'+questionKey}></div>
						
						{answered && question.feedback && <div style={{paddingTop: '2em',}}>{question.feedback}</div>} 
						
						
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
		let quizLength = this.state.questions ? this.state.questions.length : 0;
		let successRate = userAnsweredTally > 0 ? parseInt(userCorrectTally/userAnsweredTally*100,10) : 0;
		let totalMessage=<span><b>Questions Answered</b> {userAnsweredTally}/{this.state.questions ? this.state.questions.length : 0} <b>Success Rate</b> {successRate}%</span>


		return (
		<div  ref={(section) => { that.scrollTo.top = section; }}  className="row" style={{marginBottom:'5em'}}>
			  <div style={{ position:'fixed',top:"6.4em",width:'100%', backgroundColor:'rgb(240, 249, 150)', border :'2px solid black',padding:'0.2em'}} >
				<span>{totalMessage}</span>
				<button style={{float:'right'}} onClick={that.clickResetQuiz} className='btn btn-info' >Reset Answers</button>
				{userAnsweredTally < quizLength && <a style={{color:'white',marginRight:'3em',float:'right'}} onClick={that.nextQuestion} className='btn btn-success' >Next Question</a>}
				{userAnsweredTally === quizLength && <button style={{marginRight:'3em',float:'right'}} className='btn btn-success' >Quiz Complete</button>}
			</div>
			<div style={{width:'100%',marginTop:'2.8em'}}>
			{questions}
			</div>
		</div>
		)
    }


}
