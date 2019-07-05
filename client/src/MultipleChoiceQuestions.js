/* eslint-disable */ 
import React, { Component } from 'react';
	import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

import 'whatwg-fetch'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import scrollToComponent from 'react-scroll-to-component';
import NextIcon from 'react-icons/lib/fa/arrow-right';
//import ResetIcon from 'react-icons/lib/fa/redo-alt';
import ShareIcon from 'react-icons/lib/fa/share-alt';
import CompleteIcon from 'react-icons/lib/fa/check';
//import MoreInfoIcon from 'react-icons/lib/fa/external-link-alt';
import ShareDialog from './ShareDialog';
import "video-react/dist/video-react.css"; // import css
import { Player } from 'video-react';

let resetIcon = <svg style={{marginTop:'0.2em',height:'1.1em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M256.455 8c66.269.119 126.437 26.233 170.859 68.685l35.715-35.715C478.149 25.851 504 36.559 504 57.941V192c0 13.255-10.745 24-24 24H345.941c-21.382 0-32.09-25.851-16.971-40.971l41.75-41.75c-30.864-28.899-70.801-44.907-113.23-45.273-92.398-.798-170.283 73.977-169.484 169.442C88.764 348.009 162.184 424 256 424c41.127 0 79.997-14.678 110.629-41.556 4.743-4.161 11.906-3.908 16.368.553l39.662 39.662c4.872 4.872 4.631 12.815-.482 17.433C378.202 479.813 319.926 504 256 504 119.034 504 8.001 392.967 8 256.002 7.999 119.193 119.646 7.755 256.455 8z"></path></svg>

let upIcon = <svg style={{marginTop:'0.2em',height:'1.1em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M313.553 119.669L209.587 7.666c-9.485-10.214-25.676-10.229-35.174 0L70.438 119.669C56.232 134.969 67.062 160 88.025 160H152v272H68.024a11.996 11.996 0 0 0-8.485 3.515l-56 56C-4.021 499.074 1.333 512 12.024 512H208c13.255 0 24-10.745 24-24V160h63.966c20.878 0 31.851-24.969 17.587-40.331z"></path></svg>


const reviewIcon = 
<svg style={{height:'1.2em'}}  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M336 448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm208-320V80c0-8.84-7.16-16-16-16s-16 7.16-16 16v48h-32V80c0-8.84-7.16-16-16-16s-16 7.16-16 16v48h-16c-8.84 0-16 7.16-16 16v32c0 35.76 23.62 65.69 56 75.93v118.49c0 13.95-9.5 26.92-23.26 29.19C431.22 402.5 416 388.99 416 372v-28c0-48.6-39.4-88-88-88h-8V64c0-35.35-28.65-64-64-64H96C60.65 0 32 28.65 32 64v352h288V304h8c22.09 0 40 17.91 40 40v24.61c0 39.67 28.92 75.16 68.41 79.01C481.71 452.05 520 416.41 520 372V251.93c32.38-10.24 56-40.17 56-75.93v-32c0-8.84-7.16-16-16-16h-16zm-283.91 47.76l-93.7 139c-2.2 3.33-6.21 5.24-10.39 5.24-7.67 0-13.47-6.28-11.67-12.92L167.35 224H108c-7.25 0-12.85-5.59-11.89-11.89l16-107C112.9 99.9 117.98 96 124 96h68c7.88 0 13.62 6.54 11.6 13.21L192 160h57.7c9.24 0 15.01 8.78 10.39 15.76z"></path></svg>


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
			currentQuestion : null,
			showShareDialog : false,
			showQuizOptionsDialog: false,
		}
		this.questionsIndex = {};
		this.scrollTo={};
        
		this.clickResetQuiz = this.clickResetQuiz.bind(this)
		this.resetQuiz = this.resetQuiz.bind(this)
		this.loadQuestions = this.loadQuestions.bind(this)
		this.refreshQuestions = this.refreshQuestions.bind(this)
		this.nextQuestion = this.nextQuestion.bind(this)
		this.setCurrentQuestion = this.setCurrentQuestion.bind(this)
		this.setShareDialog = this.setShareDialog.bind(this)
		this.showQuizOptionsDialog = this.showQuizOptionsDialog.bind(this)
		this.hideQuizOptionsDialog = this.hideQuizOptionsDialog.bind(this)
		this.sendAllQuestionsForReview = this.sendAllQuestionsForReview.bind(this)
		this.loadMyTopics = this.loadMyTopics.bind(this)
		this.loadMyQuestions = this.loadMyQuestions.bind(this)
		this.dumpRefs = this.dumpRefs.bind(this)
		this.createMedia = this.createMedia.bind(this)
		this.startPlayer = this.startPlayer.bind(this)
		this.handleStateChange = this.handleStateChange.bind(this)
		this.stopAllPlayers = this.stopAllPlayersExcept.bind(this)
		this.stopAllPlayersExcept = this.stopAllPlayersExcept.bind(this)
		this.playerRefs = {}
		let that = this;
		this.setPlayerRef = (key,element) => {
			console.log(['SET PLAYER REF',key,element])
			if (key && element) {
				element.subscribeToStateChange((state,prevState) => that.handleStateChange(key,state,prevState));
				that.playerRefs[key] = element;
			}
        };
       
	};

    componentDidMount() {
      let that=this;
        console.log(['MCQ dmount'])
        this.loadQuestions();
       	this.nextQuestion()
		//	scrollToComponent(this.scrollTo['top'],{align:'top',offset:0});
    	//scrollToComponent(this.scrollTo['top'],{align:'top',offset:-160});
	
    };
    
    componentDidUpdate(props,state) {
		let that = this;
		console.log(['MCQ update',this.props.user,props.user,state.currentQuestion ,this.state.currentQuestion])
        if (this.props.user && !props.user) {
			console.log(['MCQ have user CHANGE'])
			this.loadQuestions().then(function() {
				console.log(['MCQ have loaded'])
				that.nextQuestion()
			})
		} else if (this.props.question !== props.question) {
			// single question view
			console.log(['MCQ have soingel view'])
			that.loadQuestions().then(function() {
				
			})
		} else if (this.props.topic !== props.topic) {
			console.log(['MCQ have TOPIC CANNGE'])
			this.loadQuestions().then(function() {
				console.log(['MCQ have TOPIC LOADED'])
				that.nextQuestion();
				if (state.currentQuestion != that.state.currentQuestion) {
					console.log(['scroll to','question_'+that.state.currentQuestion,that.scrollTo['question_'+that.state.currentQuestion]])
					scrollToComponent(that.scrollTo['question_'+that.state.currentQuestion],{align:'top',offset:-180});
					let thisQuestion = that.state.questions && that.state.questions.length > that.state.currentQuestion ? that.state.questions[that.state.currentQuestion] : {};
					that.startPlayer(thisQuestion._id)
				}
			})
			
		}
		if (state.currentQuestion != that.state.currentQuestion || this.props.questions != props.questions) {
			console.log(['scroll to','question_'+that.state.currentQuestion,that.scrollTo['question_'+that.state.currentQuestion]])
			scrollToComponent(that.scrollTo['question_'+that.state.currentQuestion],{align:'top',offset:-140});
			let thisQuestion = that.state.questions && that.state.questions.length > that.state.currentQuestion ? that.state.questions[that.state.currentQuestion] : {};
			that.startPlayer(thisQuestion._id)
		}
	}
	
	startPlayer(questionId) {
		let that = this;
		console.log(['START PLAYER',questionId,that.playerRefs])
		Object.keys(this.playerRefs).map(function(playerKey) {
			let player = that.playerRefs[playerKey]
			console.log(['test PLAYER',questionId,playerKey])
			if (player && player.pause && questionId == playerKey) {
				console.log(['PLAY',player])
				setTimeout(function() {
					console.log(['PLAY real'])
					try {
						 player.play();
					} catch (e) {
						console.log(['FAILED TO PLAY',e])
					}
				},500)
			}
		})
	}
	
	stopAllPlayers() {
		Object.values(this.playerRefs).map(function(player) {
			if (player) player.pause();
		})
	}
		
	stopAllPlayersExcept(questionId) {
		let that = this;
		Object.keys(this.playerRefs).map(function(playerKey) {
			let player = that.playerRefs[playerKey]
			try {
				if (player && player.pause && questionId !== playerKey) player.pause();
			} catch (e) {
				
			}
		})		
	}
	
	handleStateChange(key,state, prevState) {
	  // copy player state to this component's state
		if (state && state.paused !== true) {
			this.stopAllPlayersExcept(key)
		}
	}
	
	dumpRefs() {
		console.log('REFS',this.playerRefs);
	}
        
    setShareDialog(val) {
		this.setState({showShareDialog:val});
	}
	
	loadMyTopics() {
		let that = this;
		console.log(['load my topics',this.props])
		this.stopAllPlayers();
		return new Promise(function(resolve,reject) {
			if (that.props.user) {
				let topic = that.props.match && that.props.match.params && that.props.match.params.topic && that.props.match.params.topic.length > 0 ? that.props.match.params.topic : that.props.topic;
				let topicQuery='';
				if (topic && topic.length > 0 ) {
					topicQuery='&topic='+topic;
				}
				console.log(['FETCH','/api/mymctopics?user='+that.props.user._id + topicQuery])
				fetch('/api/mymctopics?user='+that.props.user._id + topicQuery)
				.then(function(response) {
					console.log(['got response'])
					return response.json()
				}).then(function(json) {
					console.log(['got mount json',json])
					let filteredQuestions = json.map(function(question,key) {
						let a = {}
						that.questionsIndex[question._id] = key;
						let possibleAnswers = question.multiple_choices ? question.multiple_choices.split("|||") : [];
						possibleAnswers.push(question.answer);
						possibleAnswers = shuffle(possibleAnswers);
						question.possibleAnswers = possibleAnswers;
						return question;
					});
					if (that.props.notifyQuestionsLoaded) that.props.notifyQuestionsLoaded(filteredQuestions.length)
					that.setState({questions:filteredQuestions});
					resolve()
				}).catch(function(ex) {
					console.log(['parsing failed', ex])
					reject()
				})
				
			}
		})
    }
    
    loadMyQuestions() {
		let that = this;
		this.stopAllPlayers();
		return new Promise(function(resolve,reject) {
			if (that.props.user) {
				let topic = that.props.match && that.props.match.params && that.props.match.params.topic && that.props.match.params.topic.length > 0 ? that.props.match.params.topic : that.props.topic;
				let topicQuery='';
				if (topic && topic.length > 0 ) {
					topicQuery='&topic='+topic;
				}
				fetch('/api/mymcquestions?user='+that.props.user._id + topicQuery)
				.then(function(response) {
					console.log(['got response'])
					return response.json()
				}).then(function(json) {
					console.log(['got mount json',json])
					let filteredQuestions = json.map(function(question,key) {
						let a = {}
						that.questionsIndex[question._id] = key;
						let possibleAnswers = question.multiple_choices ? question.multiple_choices.split("|||") : [];
						possibleAnswers.push(question.answer);
						possibleAnswers = shuffle(possibleAnswers);
						question.possibleAnswers = possibleAnswers;
						return question;
					});
					if (that.props.notifyQuestionsLoaded) that.props.notifyQuestionsLoaded(filteredQuestions.length)
					that.setState({questions:filteredQuestions});
					resolve()
				}).catch(function(ex) {
					console.log(['parsing failed', ex])
					reject()
				})
			}
			
		})
    }
    
    refreshQuestions() {
		let that = this;
		this.loadQuestions().then(function() {
			scrollToComponent(that.scrollTo['question_'+that.state.currentQuestion],{align:'top',offset:-180});
		})		
	}
    
    loadQuestions() {
		console.log(['LOAD Q',this.props.mode])
		this.stopAllPlayers();
		if (this.props.mode && this.props.mode === "myquestions") {
			return this.loadMyQuestions();
		} else if (this.props.mode && this.props.mode === "mytopics") {
			return this.loadMyTopics();
		} else {
			let that = this;
			return new Promise(function(resolve,reject) {
				let topic = that.props.match && that.props.match.params && that.props.match.params.topic && that.props.match.params.topic.length > 0 ? that.props.match.params.topic : that.props.topic;
				if (topic && topic.length > 0 ) {
					let questionQuery='';
					if (that.props.question) {
						questionQuery='&questionId='+that.props.question;
					}
					// single view page needs all but quiz list page needs not answered
					if (that.props.user) {
						questionQuery+=that.props.user ? '&user='+that.props.user._id : '';
					}
					fetch('/api/mcquestions?topic='+topic+questionQuery)
					.then(function(response) {
						console.log(['got response'])
						return response.json()
					}).then(function(json) {
						console.log(['got mount json',json])
						let filteredQuestions = json.map(function(question,key) {
							//let a = {}
							that.questionsIndex[question._id] = key;
							let possibleAnswers = question.multiple_choices ? question.multiple_choices.split("|||") : [];
							possibleAnswers.push(question.answer);
							// uniquify
							possibleAnswers = [...new Set(possibleAnswers)];
							possibleAnswers = shuffle(possibleAnswers);
							let finalPossible = [];
							possibleAnswers.map(function(answer) {
								if (answer && answer.trim().length > 0) finalPossible.push(answer); 
								return null; 
							});
							question.possibleAnswers = finalPossible;
							return question;
						});
						if (that.props.notifyQuestionsLoaded) that.props.notifyQuestionsLoaded(filteredQuestions.length)
						that.setState({questions:filteredQuestions});
						resolve();
					}).catch(function(ex) {
						console.log(['parsing failed', ex])
						reject();
					})
					
				}
			})
		}
	}
    
    resetQuiz() {
		let that = this;
		this.stopAllPlayers();
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
				that.setState({currentQuestion:0})
			})
		}
	}
    
    clickResetQuiz() {
		this.stopAllPlayers();
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
		this.stopAllPlayers();
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
						this.startPlayer(question._id);
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
							this.startPlayer(question._id);
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
    
    showQuizOptionsDialog() {
		this.setState({showQuizOptionsDialog:true})
	}
    
    hideQuizOptionsDialog() {
		this.setState({showQuizOptionsDialog:false})
	}
    
    clickAnswer(id,answer) {
		this.stopAllPlayers();
		//if (that.props.viewOnly) {
			let that = this;
			console.log('answered '+answer +'||' + id)
			var params={
				'_id':id,
				'user':this.props.user ? this.props.user._id : null,
				'answer':answer,
			  };
			  
			// view only mode, don't send save request  
			if (this.props.viewOnly || !this.props.user) {
				let questionKey = that.questionsIndex && that.questionsIndex.hasOwnProperty(id) ? that.questionsIndex[id] : null;
				console.log(['Q KEY',questionKey]);
				if (questionKey !== null) {
					let questions = that.state.questions;
					let question = questions && questions.hasOwnProperty(questionKey) ? questions[questionKey] : null;
					console.log(['have key',questionKey])
					if (question) {
					console.log(['have question',question])
						// update question with stats
						//if (res.error) {
							//question.error = res.error;
						//} else {
							question.error = '';
							question.seenBy = typeof question.seenBy === 'object' ? question.seenBy : {};
							question.seenBy[that.props.user ? that.props.user._id : 'unknownuser'] = answer;
							//question.seen = res.seen;
							//question.overallPercentCorrect = res.overallPercentCorrect;
						//}
						
						questions[questionKey] = question;
						console.log(['SET MC STATE',question,questions])
						that.setState({questions: questions});
					} 
				} 
			// quiz mode, save first then update question state	
			} else {
				
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
		//}
	}
	
	createMedia(mcquestion) {
        let sources=[]
       	let that = this;
       	let question = mcquestion.relatedQuestion;
		if (question) {
			if (question.media && question.media.length > 0) sources.push(<source key={1} src={question.media} />)
			if (question.media_ogg && question.media_ogg.length > 0) sources.push(<source key={2} src={question.media_ogg} />)
			if (question.media_webm && question.media_webm.length > 0) sources.push(<source  key={3} src={question.media_webm} />)
			if (question.media_mp4 && question.media_mp4.length > 0) sources.push(<source  key={4} src={question.media_mp4} />)
				
			if (question.media_mp3 && question.media_mp3.length > 0) sources.push(<source  key={5} src={question.media_mp3} />)
			if (question.media_mp4 && question.media_mp4.length > 0) sources.push(<source  key={6} src={question.media_mp4} />)
			if (question.media_webmvideo && question.media_webmvideo.length > 0) sources.push(<source  key={7} src={question.media_webmvideo} />)
			if (question.media_webmaudio && question.media_webmaudio.length > 0) sources.push(<source  key={8} src={question.media_webmaudio} />)
			let dimensions = {x:400,y:50}
			if (this.isVideo(question)) {
				dimensions = {x:400,y:400}
			}
			let autoPlay = question && question.relatedQuestion && question.relatedQuestion.autoplay_media==="YES" ? true : false
			//console.log(['SINGLE VIEW CREATE MEDIA from q',this.props.question]);
				let media=<Player
				  ref={(element) => this.setPlayerRef(mcquestion._id,element)}
				  playsInline
				  autoPlay={autoPlay}
				   height={dimensions.y}
				  width={'100%'}
				  fluid={false}
				>
				{sources}
				</Player>
				//console.log(['SINGLE VIEW CREATE MEDIA',media]);
				//setTimeout(function() {
					////console.log(['SINGLE VIEW UPDATE MEDIA',media,question.media]);
						//that.setState({media:media});
						//if (that.player) that.player.load();
				//},100);
				return media;
				//this.setState({media:media});
		}
    };
	
	   hasMedia(question) {
         // console.log(['HASMEDIA',question]);
          if (question.media ||
            question.media_ogg ||
            question.media_webm ||
            question.media_mp4 ||
            
            question.media_mp3 ||
            question.media_mp4 ||
            question.media_webmvideo ||
            question.media_webmaudio
            )  {
                return true;
            } else {
                return false;
            }
      };
      
       isVideo(question) {
          //console.log(['isvideo',question]);
          if (question.media_mp4 ||question.media_webmvideo)  {
        //  console.log(['isvideo YES']);
                return true;
            } else {
          //console.log(['isvideo NO']);
                return false;
            }
      };
      
	
	sendAllQuestionsForReview(questions) {
		this.nextQuestion();
		this.props.sendAllQuestionsForReview(questions) //[{_id:question.questionId}]
	}
    
    render() { 
		let that = this;
		let questions = null;
		let userAnsweredTally = 0;
		let userCorrectTally = 0;
		
		let userId = this.props.user ? this.props.user._id : 'unknownuser';
		let isQuestionPage = this.props.viewOnly ? true : false; 
		//this.props.match && this.props.match.params && this.props.match.params.topic && this.props.match.params.topic.length > 0 ? false : true;
		let topic = this.props.match && this.props.match.params && this.props.match.params.topic && this.props.match.params.topic.length > 0 ? this.props.match.params.topic : this.props.topic;
		//if (topic && topic.length > 0) {
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
						let tagsRendered = null;
						if (question.relatedQuestion && question.relatedQuestion.tags && question.relatedQuestion.tags.length > 0 ) {
							tagsRendered = question.relatedQuestion.tags.map(function(tag,key) {
								let linkTo="/discover/tag/"+tag
								return <Link to={linkTo} className='btn btn-info' key={key} style={{marginRight:'0.8em'}}>{tag}</Link>
							});
						}

						//{answered && <div>
							//You  {userAnswerCorrect? ' correctly ' : ' incorrectly '} answered {userAnswer}. {!userAnswerCorrect ? ' The correct answer is '+question.answer+".":''}
						//</div>}
						let possibleAnswers = question.possibleAnswers;
						
						let answerButtons = possibleAnswers.map(function(sampleAnswer,key) {
							// determine button color from answer status
							let answerLetter=String.fromCharCode(key+65);
							if (false && that.props.viewOnly) {
								if (sampleAnswer === question.answer) {
									return <div style={{fontWeight:'bold',border:'2px solid black'}} key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} style={{color: 'white', backgroundColor:'green',d:'#007bff', border: '1px solid black', borderRadius:'10px', padding: '0.3em', paddingLeft: '1em', paddingRight: '1em', marginBottom:'0.3em', fontWeight:'bold', fontSize:'1.4em'}} ><span className='answerletter' >{answerLetter}</span>{sampleAnswer}</div>
								} else {
									return <div style={{fontWeight:'bold',border:'2px solid black'}} key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} style={{color: 'white', backgroundColor:'red',d:'#007bff', border: '1px solid black', borderRadius:'10px', padding: '0.3em', paddingLeft: '1em', paddingRight: '1em', marginBottom:'0.3em'}} ><span className='answerletter' >{answerLetter}</span>{sampleAnswer}</div>
								}
							} else {
								if (answered) {
									// is this answer the user answer
									if (sampleAnswer === userAnswer) {
										if (userAnswerCorrect)  {
											return <div style={{fontWeight:'bold',border:'2px solid black'}} key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} style={{color: 'white', backgroundColor:'green',d:'#007bff', border: '1px solid black', borderRadius:'10px', padding: '0.3em', paddingLeft: '1em', paddingRight: '1em', marginBottom:'0.3em', fontWeight:'bold', fontSize:'1.4em'}} ><span className='answerletter' >{answerLetter}</span>{sampleAnswer}</div>
										} else {
											return <div key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} style={{color: 'white', backgroundColor:'red',d:'#dc3545', border: '1px solid black', borderRadius:'10px', padding: '0.3em', paddingLeft: '1em', paddingRight: '1em', marginBottom:'0.3em', textDecoration: 'line-through'}} ><span className='answerletter' >{answerLetter}</span>{sampleAnswer}</div>
										}
									// is this button the correct answer
									} else if (sampleAnswer === question.answer) {
										return <div style={{fontWeight:'bold',border:'2px solid black'}} key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} style={{color: 'white', backgroundColor:'green', d:'#28a745', border: '1px solid black', borderRadius:'10px', padding: '0.3em', paddingLeft: '1em', paddingRight: '1em', marginBottom:'0.3em', fontWeight:'bold', fontSize:'1.4em'}} ><span className='answerletter' >{answerLetter}</span>{sampleAnswer}</div>
									} else {
											return <div key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)} style={{color: 'white', backgroundColor:'blue', d:'#007bff', border: '1px solid black', borderRadius:'10px', padding: '0.3em', paddingLeft: '1em', paddingRight: '1em', marginBottom:'0.3em'}} ><span className='answerletter' >{answerLetter}</span>{sampleAnswer}</div>
									}
									
								} else {
									return <div key={key} onClick={() => that.clickAnswer(question._id,sampleAnswer)}  style={{color: 'white', backgroundColor:'blue', d:'#007bff', border: '1px solid black', borderRadius:'10px', padding: '0.3em', paddingLeft: '1em', paddingRight: '1em', marginBottom:'0.3em'}} ><span className='answerletter' >{answerLetter}</span>{sampleAnswer}</div>
								}
							}
						})
						let image = question && question.relatedQuestion && question.relatedQuestion.image_png ? question.relatedQuestion.image_png : (question && question.relatedQuestion && question.relatedQuestion.image ? question.relatedQuestion.image : '') 
						if (!image) image = question  && question.image_png ? question.image_png : (question  && question.image ? question.image : '')  
						let moreInfoLink = '/discover/topic/'+question.topic+'/'+question.questionId;
						let mcByTopicLink = '/multiplechoicequestions/'+encodeURIComponent(question.topic);
						let questionKeyId ='question_'+questionKey;
						return <div ref={(section) => { that.scrollTo['question_'+(questionKey)] = section; }}   key={question._id} style={{minHeight:'300px' ,paddingLeft:'1em',width:'100%',borderTop:'1px solid black', marginBottom: '1em'}} > 
						

						
						
						<div style={{fontWeight:'bold',paddingTop: '1em'}}>{question.question}</div>
						
						{!answered && !that.props.viewOnly && question.relatedQuestion && (question.relatedQuestion.autoshow_image==="YES" || question.autoshow_image==="YES")  && <img src={image}  style={{ height:'200px'}} />}
						

						{!that.props.viewOnly && <div style={{color: 'red', fontWeight:'bold', paddingTop: '1em',}}>{question.error}</div> }

						
						{!that.props.viewOnly && answered  && <i style={{paddingTop: '2em'}}>{question.overallPercentCorrect ? question.overallPercentCorrect : 0} percent of {question.seen > 0 ? question.seen : 1} people answered correctly.</i> }
	
							
						{!that.props.viewOnly && <div className='questionbuttons' style={{minWidth:'50%', minHeight: '2em'}} >
							
							
							{that.props.user && question.questionId && <button style={{float:'right'}} className='btn btn-success' onClick={(e) => that.sendAllQuestionsForReview([{_id:question.questionId}])} >{reviewIcon} <span className="d-none d-sm-inline" >Add to Review List</span></button>}
							
							{!that.props.user && question.questionId && <Link to="/login" style={{float:'right'}} className='btn btn-success'  >{reviewIcon} <span className="d-none d-sm-inline" >Add to Review List</span></Link>}

							
							{<a style={{float:'right',color:'white'}} onClick={that.nextQuestion} className='btn btn-success' ><NextIcon size={26} /> <span className="d-none d-sm-inline" >Next Question</span></a>}
									
						</div>}	
						
						<div style={{ width:'', marginTop: '1em',padding: '0.5em', border: '1px solid black' , backgroundColor:'#eee',borderRadius:'30px',marginRight:'1em'}}>{answerButtons}</div> 
						
						<div id={questionKeyId}></div>
						
						
 
						{answered && !that.props.carousel && question.feedback && <div style={{paddingTop: '2em',}}>{question.feedback}</div>} 

						{!that.props.viewOnly && !isQuestionPage && question.relatedQuestion&& question.relatedQuestion.interrogative && question.relatedQuestion.question && answered && <div>
								<div style={{marginTop:'1em',marginBottom:'1em'}} ><b>Root Question</b> <a target="_new" href={moreInfoLink} >{moreInfoIcon} <span className="d-none d-sm-inline" >{question.relatedQuestion.interrogative} {question.relatedQuestion.question}</span></a></div> 
							</div> }

						{answered && !that.props.viewOnly && question.relatedQuestion && question.relatedQuestion.mnemonic && question.relatedQuestion.mnemonic.length > 0 && <div id='relatedmnemonic' style={{marginTop:'1em',marginBottom:'1em'}} ><b>Memory Aid</b><pre> {question.relatedQuestion.mnemonic}</pre></div>}

						{answered && !that.props.viewOnly && image && <img src={image}  style={{maxHeight:'400px',marginTop:'1em',marginBottom:'1em'}} />}

						{(that.props.mode==='myquestions' ||that.props.mode==='mytopics') && answered && question.relatedQuestion && question.relatedQuestion.quiz && question.relatedQuestion.quiz.length > 0 && <div id='relatedtopic' style={{marginTop:'1em'}}><b>Topic</b> <Link className='btn btn-info' to={mcByTopicLink} > {question.relatedQuestion.quiz}</Link></div>}
					
						{!that.props.viewOnly && answered && question.relatedQuestion && question.relatedQuestion.tags && question.relatedQuestion.tags.length > 0 && <div id='relatedtags' style={{marginTop:'1em'}}><b>Tags</b> {tagsRendered}</div>}
						
						{question.relatedQuestion && that.hasMedia(question.relatedQuestion) && <div id='media' style={{marginTop:'1em'}}><b>Media</b> {that.createMedia(question)}</div>}
						
						</div>
					} else {
						return null;
					}
				})
			} else {
				let message = null;
				if (this.props.mode && this.props.mode === "myquestions" ) {
					message=<b>You have answered all the multiple choice questions that are on your review list.</b>
					return message ? <div style={{paddingLeft:'1em'}}>{message}<br/><br/><br/><Link className='btn btn-info' to='/' >Discover Something New</Link></div> : null;
				} else if (this.props.mode && this.props.mode === "mytopics" ) {
					message=<b>You have answered all the multiple choice questions for all the topics you have explored.</b>
					return message ? <div style={{paddingLeft:'1em'}}>{message}<br/><br/><br/><Link className='btn btn-info' to='/' >Discover Something New</Link></div> : null;
				} else if (!this.props.carousel) {
					message=<b>You have answered all the multiple choice questions for this topic.</b>
					return message ? <div style={{paddingLeft:'1em'}}>{message}<br/><br/><br/><a className='btn btn-danger' onClick={this.resetQuiz} >Reset My Answers</a></div> : null;
					
				}
				
			}
		//} else {
			//questions=<b>Missing required topic</b>
		//}
		let quizLength = this.state.questions ? this.state.questions.length : 0;
		let successRate = userAnsweredTally > 0 ? parseInt(userCorrectTally/userAnsweredTally*100,10) : 0;
		let totalMessage=<span style={{float:'left'}}><div><b>Answered</b> {userAnsweredTally}/{this.state.questions ? this.state.questions.length : 0}  <b>Success</b> {successRate}%</div></span>
		
		let theStyle={ position:'fixed',width:'100%', backgroundColor:'rgb(240, 249, 150)', border :'2px solid black',padding:'0.2em',top:'6.4em'}
		if (isQuestionPage) theStyle.marginLeft='-1em';
		//if (isQuestionPage) offset='16.4em'



		return (
		<div  ref={(section) => { that.scrollTo.top = section; }}  className="row card-block" style={{width:'100%',marginBottom:'5em'}}>
			  {!isQuestionPage && <div style={theStyle} >
				{this.state.showQuizOptionsDialog && <div onClick={that.hideQuizOptionsDialog} style={{marginTop:'8em'}} className='modaldialog'  >
				<div className="modaldialog-content">
					  <div className="modaldialog-header">
						<span onClick={this.hideQuizOptionsDialog} className="modaldialog-close">&times;</span>
						<h2>Quiz Options</h2>
					  </div>
					  
					  <div className="modaldialog-body">
							<div>
								<button  onClick={(e) => that.setShareDialog(!that.state.showShareDialog)} className='btn btn-info' ><ShareIcon size={26} /> <span  className="d-none d-sm-inline" >Share Quiz</span></button>
								<button style={{}} onClick={that.clickResetQuiz} className='btn btn-danger' >{resetIcon} <span className="d-none d-sm-inline" >Reset Answers</span></button>
								
							</div>
					  </div>
					  <div className="modaldialog-footer">
						<hr style={{height:'2px'}}/>
					  </div>
					</div>
				</div>}
				
				<span>{totalMessage}</span>
				
				

				<button style={{paddingTop: '0',height:'1.4em',float:'right'}} onClick={this.showQuizOptionsDialog} className='btn btn-info' > ...</button>
				
				{(userAnsweredTally === quizLength) && <div style={{marginRight:'3em',float:'right'}}>
					 
					<Link to="/multiplechoicetopics" style={{marginRight:'1em',float:'right'}} className='btn btn-success' >{upIcon}</Link>
					<div onClick={this.refreshQuestions}   className='btn btn-success' style={{marginRight:'1em',float:'right'}} ><CompleteIcon size={26} /> 
					<span className="d-none d-sm-inline" > Quiz Complete - Load More Questions</span></div>&nbsp;
					
					</div>}
				
			</div>}
			
			{questions && questions.length > 0 && <b style={{display:'block',width:'100%'}}>Quiz Questions</b>}
			<div style={{border: '1px solid black',width:'100%',marginTop:'1.4em'}}>
			{this.state.showShareDialog && <ShareDialog setShareDialog={this.setShareDialog} dialogTitle={'Share Quiz using'} />}
			{questions}
			</div>
		</div>
		)
    }


}
