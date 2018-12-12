import React, { Component } from 'react';
import Utils from './Utils';
//import FindQuestions from './FindQuestions';
import SingleQuestion from './SingleQuestion';
import QuestionList from './QuestionList';
import Play from 'react-icons/lib/fa/play';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import { withRouter } from "react-router-dom";
    
export default withRouter( class QuizCarousel extends Component {
    constructor(props) {
        super(props);
        this.state={
            //'indexedQuestions':this.props.indexedQuestions,
            //'questions':this.props.questions,
            //'currentQuiz':this.props.currentQuiz,
            //'currentQuestion':this.props.currentQuestion,
            'quizComplete': false,
            'showList':false,
          //  'isReview': this.props.isReview,
            'success' : [],
            'logged':{seen:{},success:{}}
        };
        this.handleQuestionResponse = this.handleQuestionResponse.bind(this);
        this.currentQuestion = this.currentQuestion.bind(this);
        this.getQuestions = this.getQuestions.bind(this);
        this.setQuizQuestion = this.setQuizQuestion.bind(this);
        this.finishQuiz = this.finishQuiz.bind(this);
        this.logStatus = this.logStatus.bind(this);
        this.banQuestion = this.banQuestion.bind(this);
        this.percentageFinished = this.percentageFinished.bind(this);
        this.discoverQuestions = this.discoverQuestions.bind(this);
        this.goto = this.goto.bind(this);
        this.onClickListQuestion=this.onClickListQuestion.bind(this);
        this.initialiseFromParams = this.initialiseFromParams.bind(this);
      //  //console.log(['QUIZ carousel constr']);
    };
    
    componentDidMount() {
        if (this.props.isReview !== true) {
           this.initialiseFromParams();     
        
        }
    };
    
    
    componentDidUpdate(props) {
		console.log(['QUIZ CAR DID UPDATE',props.match,this.props.match]);
        if (this.props.isReview !== true) {
            // ensure existence old and new match.params    
			if (this.props.match && props.match && this.props.match.params && props.match.params) {
				console.log(['QUIZ CAR DID UPDATE start']);
				if (this.props.match.topic !== props.match.topic 
					|| this.props.match.searchtopic !== props.match.searchtopic 
					|| this.props.match.topicquestion !== props.match.topicquestion 
					|| this.props.match.tag !== props.match.tag
					|| this.props.match.difficulty !== props.match.difficulty
					|| this.props.match.technique !== props.match.technique
					|| this.props.match.missingtopic !== props.match.missingtopic
					|| this.props.match.topics !== props.match.topics 
					|| this.props.match.url != props.match.url
					) {
						console.log(['QUIZ CAR DID UPDATE REALLY',props.match,this.props.match]);
					  this.initialiseFromParams(); 
				}
			}
        }
    };
    
    initialiseFromParams() {
		let that = this;
			console.log(['QUIZ CAR DID MOUNT',this.props,this.props.isReview,this.props.match]); //this.state.currentQuiz,this.props.questions
            if (this.props.match && this.props.match.params && this.props.match.params.searchtopic && this.props.match.params.searchtopic.length > 0) {
                // DISCOVERY
                setTimeout(function() {
                     that.props.setQuizFromTopic(that.props.match.params.searchtopic,that.props.match.params.topicquestion);
                },1000);
            } else if (this.props.match && this.props.match.params && this.props.match.params.topic && this.props.match.params.topic.length > 0) {
                // DISCOVERY
                 setTimeout(function() {
                     that.props.discoverQuizFromTopic(that.props.match.params.topic,that.props.match.params.topicquestion);
                },1000);
            } else if (this.props.match &&  this.props.match.params && this.props.match.params.topics && this.props.match.params.topics.length > 0) {
                // DISCOVERY
                setTimeout(function() {
                     that.props.setQuizFromTopics(that.props.match.params.topics.split(","));
                },1000);
            } else if (this.props.match &&  this.props.match.params && this.props.match.params.tag && this.props.match.params.tag.length > 0) {
                // SEARCH
                console.log(['QUIZ CAR FROMTAG',that.props.match.params.tag]);
                setTimeout(function() {
                     that.props.setQuizFromTag(that.props.match.params.tag);
                },1000);
            } else if (this.props.match &&  this.props.match.params && this.props.match.params.difficulty && this.props.match.params.difficulty.length > 0) {
                // DISCOVERY
                setTimeout(function() {
                    that.props.setQuizFromDifficulty(that.props.match.params.difficulty);
                },1000);
            } else if (this.props.match &&  this.props.match.params && this.props.match.params.technique && this.props.match.params.technique.length > 0) {
                // SEARCH
                setTimeout(function() {
                    that.props.setQuizFromTechnique(that.props.match.params.technique);
                },1000);
            //}  else if (this.props.match &&  this.props.match.params && this.props.match.params.question && this.props.match.params.question.length > 0) {
                //// SEARCH PLUS TOPIC
                //this.props.setQuizFromQuestionId(this.props.match.params.question);
            } else if (this.props.match && this.props.match.params && this.props.match.params.missingtopic && this.props.match.params.missingtopic.length > 0) {
                // DISCOVERY
                setTimeout(function() {
                     that.props.setQuizFromMissingMnemonic(that.props.match.params.missingtopic);
                },1000);
            } else {
                // DISCOVER ALL
                setTimeout(function() {
                    that.props.discoverQuestions();
                },1000);
            } 
    }
    
  isQuizFinished(quiz) {
      //if (this.props.isReview) {
          //return this.state.success.length === this.props.currentQuiz.length;
      //} else {
          return this.props.currentQuestion === this.props.currentQuiz.length - 1;
      //}
      
  };  
  
  percentageFinished()  {
      return (this.props.currentQuiz.length > 0 ? (this.props.currentQuestion/this.props.currentQuiz.length) : 0)*100 + '%';
  };
  
  goto(page) {
      this.setState({exitRedirect:page});
  };
      
  logStatus(status,question,preview,topic) {
     //console.log(['log status',status,question,preview,topic,this.props.user,this.state.logged[status]]);
     if (!this.state.logged[status]) {
         let logged = this.state.logged;
         logged[status]={};
         this.setState({logged:logged})
     }
      if (this.props.user && !preview) {
          //console.log(['logging status']);
          if (!question) question = this.props.questions[this.props.indexedQuestions[this.props.currentQuestion]]._id;
          //console.log(['logging status',question]);
          if (this.state.logged[status].hasOwnProperty(question)) {
              //console.log(['ignore duplicate logs']);
          } else {
              //console.log(['REALLY log status',status,question]);
              let logged = this.state.logged;
              logged[status][question] = true;
              this.setState({logged:logged});
              let that = this;
               // central storage
                 fetch('/api/'+status, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({'user':this.props.user._id,'question':question,topic:topic})
                }).catch(function(err) {
                    that.setState({'message':'Not Saved'});
                });              
          }
        }
  };    

  banQuestion(questions,id,time,topic) {
      
      //console.log(['BAN QUESTION',this.props.currentQuiz.length,this.isQuizFinished(),questions,id,time,topic]);
      questions.block[id] = time;
       this.logStatus('block',id,false,topic);
      //console.log(['BAN QUESTION logged',this.props.currentQuiz.length,this.isQuizFinished(),questions,id,time,topic]);
      
       // quiz complete ?
          if (this.props.currentQuiz.length > 0) {
            if (this.isQuizFinished()) {
              this.finishQuiz();
            }  else {
                // move forward one question and strip blocked questions from currentQuiz 
                let currentQuestion = this.props.currentQuestion;
                ////console.log(['block',currentQuestion]);
                let currentQuiz = this.props.currentQuiz;
                currentQuiz.splice(parseInt(currentQuestion,10),1);
               // this.props.setCurrentQuestion(this.props.currentQuestion + 1);
                this.props.setCurrentQuiz(currentQuiz);
            }
          }
  };
      
  // handle user click on Remember, Forgot, Skip, Ban
  // update user questions history and remove question from current Quiz
  handleQuestionResponse(question,response) {
      this.props.setMessage('');
      const id = question._id;
      ////console.log(['handle response',response,id,question]);
      const time = new Date().getTime();
      if (response === "list") {
         this.setState({'showList':true});  
      } else if (response === "success") {
          //if (!questions.seen.hasOwnProperty(id)) 
          //questions.seen[id] = time;
          //this.logStatus('seen',id);
          //questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          //questions.review[id].push(time);
            // local collate success ids for finishQuiz function
            let success = this.state.success;
            if (!success.includes(this.props.currentQuestion)) {
                success.push(this.props.currentQuestion);
            }
            //questions.success[id]=time;
            if (this.isQuizFinished()) {
               this.logStatus('success',id,question.isPreview);
               this.finishQuiz(this.props.questions,this.state.success);
            }  else {
                //questions.successTally[id] = questions.successTally.hasOwnProperty(id) ? questions.successTally[id] + 1 : 1;
                this.setState({ 'success': success});
                ////console.log(['success',this.props.currentQuestion]);
                this.props.setCurrentQuestion(parseInt(this.props.currentQuestion,10) + 1);
                this.logStatus('success',id,question.isPreview);
            }
      } else if (response === "previous") {
          //if (!questions.seen.hasOwnProperty(id)) 
          //questions.seen[id] = time;
          //questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          this.logStatus('seen',id,question.isPreview);
          let currentId =this.props.currentQuestion - 1;
          if (this.props.currentQuestion > 0 && this.props.currentQuiz.length > 0) {
              this.props.setCurrentQuestion(currentId);
          }
          
      } else if (response === "next") {
          //if (!questions.seen.hasOwnProperty(id)) 
          //questions.seen[id] = time;
          //questions.seenTally[id] = questions.seenTally.hasOwnProperty(id) ? questions.seenTally[id] + 1 : 1;
          this.logStatus('seen',id,question.isPreview);
          if (this.props.currentQuiz.length > 0) {
            if (this.isQuizFinished()) {
              this.finishQuiz();
            }  else {
                this.props.setCurrentQuestion(this.props.currentQuestion + 1);
               //this.setState({'currentQuestion':this.state.currentQuestion + 1});
            }
              
          } 
          
      } else if (response === "block") {
          let user = this.props.progress;
          let questions = user.questions;
          // flag as blocked
      //    //console.log(['block',id]);
          if (id.length > 0) { 
              confirmAlert({
                  title: 'Block Question',
                  message: 'Are you sure?',
                  buttons: [
                    {
                      label: 'Yes',
                      onClick: () => this.banQuestion(questions,id,time,question.quiz)
                    },
                    {
                      label: 'No'
                    }
                  ]
                })
          }
          
      }
      //this.props.updateProgress(user);
  }; 
    
    currentQuestion() {
       // //console.log(['currentQuestion',this.state]);
        let question=null;
        if (this.props.currentQuestion !== null && Array.isArray(this.props.currentQuiz) && this.props.indexedQuestions && this.props.questions) {
            question = this.props.questions[this.props.indexedQuestions[this.props.currentQuiz[this.props.currentQuestion]]];
        
        }
        return question;
    };
    
       // FINISH QUIZ CAROUSEL
   finishQuiz(success,questions) {
      // //console.log(['finish quiz',this.props.finishQuiz]);
        // inject override
       // alert('finsih');
       if (this.props.finishQuiz) {
            this.props.finishQuiz(this.props.questions,this.state.success);
        } else {
            
        //this.props.setMessage('You\'ve seen '+(questions ? questions.length : 0)+' questions. Time for review ?'); 
        ////console.log('root finish quiz');
            let buttons=[
                {
                  label: 'Review',
                  onClick: () => this.reviewQuestions()
                },
                {
                  label: 'Continue',
                  onClick: () => this.initialiseFromParams()
                },
                {
                  label: 'Search',
                  onClick: () => this.goto('/search')
                }
              ]
            if (this.props.user && String(this.props.user._id).length > 0) {
                buttons.push({
                  label: 'Profile',
                  onClick: () => this.goto('/profile')
                })
            }
            
            confirmAlert({
              title: 'Question set complete',
              message: 'Time for review?',
              buttons: buttons
            })
        }    
        this.setState({'success' : []});
        
        //else {
           //this.props.setCurrentPage('home');
           //this.props.setMessage('You added '+((this.props.questions && this.props.questions.length)?this.props.questions.length:'')+' questions to your knowledge base.') ;
        //}
   }; 
   
    discoverQuestions() {
        //let that = this;
        ////this.props.setQuizFromDiscovery();
        ////let topic = this.props.getCurrentTopic();
        //console.log(['disco quiz',this.props.match.params]);
        //let query='';
        //if (this.props.match.params) {
            //Object.keys(this.props.match.params).map(function(key) {
                //let val = that.props.match.params[key];query="/"+key+"/"+val;
            //});
        //}
        ////this.props.discoverQuizFromTopic(topic);
        //query=query+'/'+Math.random();
        //console.log();
        //this.setState({exitRedirect:'/discover'+query});
    };
    
    
    reviewQuestions() {
       
       let that = this;
			 if (this.props.match && this.props.match.params.topic && this.props.match.params.topic.length > 0) {
               // setTimeout(function() {
                    //console.log(['REVIEW PAGE call ',that.props.match]); 
                    //that.props.setReviewFromTopic(that.props.match.params.topic,that.props.match.params.topicquestion);
                    that.goto("/review/"+that.props.match.params.topic);
                //},1000);
            } else if (this.props.match && this.props.match.params && this.props.match.params.band && this.props.match.params.band.length > 0) {
                //setTimeout(function() {
                    //console.log(['REV review from band',that.props.match.params.band,that.props.reviewBySuccessBand]);
                    //that.props.reviewBySuccessBand(that.props.match.params.band);
                    that.goto("/review/band/"+that.props.match.params.topic);
                //},1000);
            } else {
                //setTimeout(function() {
                    //that.props.getQuestionsForReview();
                    that.goto("/review")
                //},1000);
            }
       
        //this.setState({exitRedirect:'/review'+query});
    };
    
    
    getQuestions(questionIds) {
      //  //console.log(['get ques',questionIds]);
        let questions=[];
        let that = this;
        questionIds.forEach(function(questionId) {
            let question = that.props.questions[that.props.indexedQuestions[questionId]];
            questions.push(question);
        });
        return questions;
    };
    
    setQuizQuestion(question) {
    //    //console.log(['set quiz ques',question,this.props.currentQuiz]);
        if (Utils.isObject(question) && question._id && question._id.length > 0) {
            ////console.log(['setQuizQuestion',question]);
            let index = this.props.currentQuiz.indexOf(question._id);
            ////console.log(['index',index]);
            this.setState({'showList':false});
            this.props.setCurrentQuestion(index);
        }
    };
    
    onClickListQuestion(question) {
        this.setQuizQuestion(question)
    };
    
    render() {
        if (this.state.exitRedirect && this.state.exitRedirect.length > 0) {
            return <Redirect to={this.state.exitRedirect} />
        } else {
            //let questions = this.props.currentQuiz;
            ////console.log(['RENDER CAROUS',questions]);
            //if (Array.isArray(questions) && questions.length > 0) {
                
            //} else if (this.props.discoverQuestions) {
                //questions = this.props.discoverQuestions();
            //}
          //  //console.log(['RENDER CAROUS2',questions]);
            let content = '';
            const question = this.currentQuestion();
          //  //console.log(['RENDER CAROUS2',question,questions]);
          //  if (Array.isArray(questions) && questions.length > 0 && Utils.isObject(question)) {
                if (this.state.showList) {
                    let listQuestions = this.getQuestions(this.props.currentQuiz);
                    let label='Start' ;
                    if (parseInt(this.props.currentQuestion,10) > 0) {
                        label='Continue' ;
                    }
                    content = (<div><button className='btn btn-info' onClick={() => this.setQuizQuestion(this.currentQuestion())}   ><Play size={25} /> {label}</button><QuestionList isReview={this.props.isReview} questions={listQuestions} setQuiz={this.setQuizQuestion}  onClick={this.onClickListQuestion}></QuestionList></div>);
                } else {
                    // single question
                    content = (<SingleQuestion percentageFinished={this.percentageFinished} isAdmin={this.props.isAdmin} saveSuggestion={this.props.saveSuggestion} mnemonic_techniques={this.props.mnemonic_techniques} setQuizFromTechnique={this.props.setQuizFromTechnique} setQuizFromTopic={this.props.setQuizFromTopic}   setQuizFromTag={this.props.setQuizFromTag} question={question} user={this.props.user} successButton={this.props.successButton} handleQuestionResponse={this.handleQuestionResponse}  like={this.props.like} isLoggedIn={this.props.isLoggedIn} isReview={this.props.isReview} /> )
                }
            
            //} else {
                //////console.log(['ren',question,questions]);
               //// content = (<div>{JSON.stringify(question)} - {questions} </div>)
                //// no matching questions
                //content = (<div><FindQuestions discoverQuestions={this.props.discoverQuestions} setCurrentPage={this.props.setCurrentPage} /></div>)
            //}
                    
            return (
                <div className='quiz-carousel'>
                    {content}
                </div>
            )
            
        }
    }
});
