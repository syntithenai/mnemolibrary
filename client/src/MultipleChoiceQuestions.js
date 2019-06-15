/* eslint-disable */ 
import React, { Component } from 'react';
//import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import 'whatwg-fetch'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import scrollToComponent from 'react-scroll-to-component';
import NextIcon from 'react-icons/lib/fa/arrow-right';
//import ResetIcon from 'react-icons/lib/fa/redo-alt';
import ShareIcon from 'react-icons/lib/fa/share-alt';
import CompleteIcon from 'react-icons/lib/fa/check';
//import MoreInfoIcon from 'react-icons/lib/fa/external-link-alt';

let resetIcon = <svg style={{marginTop:'0.2em',height:'1.1em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>


let moreInfoIcon = <svg style={{marginTop:'0.2em',height:'1.1em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M576 24v127.984c0 21.461-25.96 31.98-40.971 16.971l-35.707-35.709-243.523 243.523c-9.373 9.373-24.568 9.373-33.941 0l-22.627-22.627c-9.373-9.373-9.373-24.569 0-33.941L442.756 76.676l-35.703-35.705C391.982 25.9 402.656 0 424.024 0H552c13.255 0 24 10.745 24 24zM407.029 270.794l-16 16A23.999 23.999 0 0 0 384 303.765V448H64V128h264a24.003 24.003 0 0 0 16.97-7.029l16-16C376.089 89.851 365.381 64 344 64H48C21.49 64 0 85.49 0 112v352c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48V287.764c0-21.382-25.852-32.09-40.971-16.97z"></path></svg>

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
        if ((this.props.question !== props.question) || (this.props.topic !== props.topic)) {
			this.loadQuestions()
		}
		if (this.props.user && !props.user) {
			this.nextQuestion()
		}
		if (state.currentQuestion != this.state.currentQuestion) {
			scrollToComponent(this.scrollTo['question_'+this.state.currentQuestion],{align:'top',offset:-180});
		}
	}
    
    
    loadQuestions() {
		let that = this;
		let topic = this.props.match && this.props.match.params && this.props.match.params.topic && this.props.match.params.topic.length > 0 ? this.props.match.params.topic : this.props.topic;
		if (topic && topic.length > 0 ) {
			let questionQuery='';
			if (this.props.question) {
				questionQuery='&questionId='+this.props.question;
			}
			fetch('/api/mcquestions?topic='+topic+questionQuery)
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
				if (that.props.notifyQuestionsLoaded) that.props.notifyQuestionsLoaded(filteredQuestions.length)
				that.setState({questions:filteredQuestions});
			
			}).catch(function(ex) {
				console.log(['parsing failed', ex])
			})
		}
	}
    
    resetQuiz() {
		let that = this;
		console.log('reset  ')
		let topic = this.props.match && this.props.match.params && this.props.match.params.topic && this.props.match.params.topic.length > 0 ? this.props.match.params.topic : this.props.topic;
		if (topic && topic.length > 0 ) {
			console.log('really reset  ')
			var params={
				'user':this.props.user ? this.props.user._id : null,
				'topic':topic,
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
			let currentQuestion = this.state.currentQuestion != null ? this.state.currentQuestion : -1;
			let counter = 0;
			let found = false;
			
			for (var questionKey in this.state.questions) {
				let question = this.state.questions[questionKey]
				if (question) {
					console.log(['NEXT QUESTION A',question.seenBy,userId,questionKey])
					
					if (questionKey > currentQuestion && (!question.seenBy || !question.seenBy[userId])) {
						this.setState({currentQuestion:questionKey})
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
		let isQuestionPage = this.props.match && this.props.match.params && this.props.match.params.topic && this.props.match.params.topic.length > 0 ? false : true;
		let topic = this.props.match && this.props.match.params && this.props.match.params.topic && this.props.match.params.topic.length > 0 ? this.props.match.params.topic : this.props.topic;
		if (topic && topic.length > 0) {
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
						let moreInfoLink = '/discover/topic/'+question.topic+'/'+question.questionId;
						
						return <div ref={(section) => { that.scrollTo['question_'+(questionKey)] = section; }}  onClick={(e) => that.setCurrentQuestion(questionKey)} key={question._id} style={{minHeight:'300px' ,paddingLeft:'1em',width:'100%',borderTop:'1px solid black'}} > 
						
						{question.image && question.image.length > 0 && <img src={question.image}  style={{float:'right',width:'200px'}} />}
						
						{!isQuestionPage && question.questionId && question.topic && <div>
							<div style={{float:'right'}}><a target='_new' href={moreInfoLink} className='btn btn-info'>{moreInfoIcon} <span className="d-none d-sm-inline" >More Information</span></a></div> 
						</div> }
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
		
		let theStyle={ position:'fixed',width:'100%', backgroundColor:'rgb(240, 249, 150)', border :'2px solid black',padding:'0.2em',top:'6.4em'}
		if (isQuestionPage) theStyle.marginLeft='-1em';
		//if (isQuestionPage) offset='16.4em'

		return (
		<div  ref={(section) => { that.scrollTo.top = section; }}  className="row card-block" style={{marginBottom:'5em'}}>
			  {!isQuestionPage && <div style={theStyle} >
				<span>{totalMessage}</span>
				<button style={{float:'right'}} onClick={that.shareQuiz} className='btn btn-info' ><ShareIcon size={26} /> <span  className="d-none d-sm-inline" >Share Quiz</span></button>
				<button style={{float:'right'}} onClick={that.clickResetQuiz} className='btn btn-danger' >{resetIcon} <span className="d-none d-sm-inline" >Reset Answers</span></button>
				{userAnsweredTally < quizLength && <a style={{color:'white',marginRight:'3em',float:'right'}} onClick={that.nextQuestion} className='btn btn-success' ><NextIcon size={26} /> <span className="d-none d-sm-inline" >Next Question</span></a>}
				{userAnsweredTally === quizLength && <a href="/multiplechoicetopics" style={{marginRight:'3em',float:'right'}} className='btn btn-success' ><CompleteIcon size={26} /> <span className="d-none d-sm-inline" >Quiz Complete</span></a>}
			</div>}
			{questions.length > 0 && <b style={{display:'block',width:'100%'}}>Quiz Questions</b>}
			<div style={{border: '1px solid black',width:'100%',marginTop:'3.4em'}}>
			{questions}
			</div>
		</div>
		)
    }


}
