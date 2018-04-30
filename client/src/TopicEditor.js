import React, { Component } from 'react';
//import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';

import WikipediaSearchWizard from './WikipediaSearchWizard';
import QuestionEditor from './QuestionEditor';
import TopicQuestionsList from './TopicQuestionsList';
import TopicsList from './TopicsList';
import CreateHelp from './CreateHelp';
import {debounce} from 'throttle-debounce';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

import Plus from 'react-icons/lib/fa/plus';
import List from 'react-icons/lib/fa/list';
import ListAlt from 'react-icons/lib/fa/list-alt';
import Camera from 'react-icons/lib/fa/camera';
import Cloud from 'react-icons/lib/fa/cloud';
import WikipediaW from 'react-icons/lib/fa/wikipedia-w';
import Question from 'react-icons/lib/fa/question';



 
export default class TopicEditor extends Component {
    constructor(props) {
        super(props);
        this.state={
            _id:'',
            topic:'',
            search:'',
            questions:[],
            currentQuestion:null,
            currentResult:null,
            currentView:'search',
            showHelp: false,
            validationErrors:{}
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.setTopicEvent = this.setTopicEvent.bind(this);
        this.setTopic = this.setTopic.bind(this);
        this.addResultToQuestions = this.addResultToQuestions.bind(this);
        this.showSearch = this.showSearch.bind(this);
        this.showQuestions = this.showQuestions.bind(this);
        this.showTopics = this.showTopics.bind(this);
        this.createQuestion = this.createQuestion.bind(this);
        this.publishTopic = this.publishTopic.bind(this);
        this.editQuestion = this.editQuestion.bind(this);
        this.deleteQuestion = this.deleteQuestion.bind(this);
        this.updateQuestion = this.updateQuestion.bind(this);
        this.newTopic = this.newTopic.bind(this);
        this.loadTopic = this.loadTopic.bind(this);
        this.saveTopic = this.saveTopic.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
        this.previewTopic = this.previewTopic.bind(this);
        
    };
    
    componentDidMount() {
        let currentTopic = localStorage.getItem('currentTopic');
        if (currentTopic && currentTopic.length > 0) {
            this.loadTopic(currentTopic);
        }
    }
    
    handleSubmit() {
        //e.preventDefault();
       // console.log('SAVE TOPIC');
        return false;
    };
    
    setTopicEvent(e) {
        //console.log(e);
        this.setState({topic:e.target.value});
        this.saveTopic();
    };
    
    setTopic(topic) {
        //this.setState({topic:topic});
        //this.saveTopic();
        ////this.resetSearch();
    };
        
    addResultToQuestions(result) {
        //console.log(['addResultToQuestions',result]);
        let question = {
                _id: '',
                interrogative: '',
                question:result.title,
                mnemonic:'',
                technique:'',
                answer:result.description,
                topic:'',
                link:result.link, 
                tags:'',
                message:'',
            }
        let questions = this.state.questions;
        questions.push(question);
        this.setState({questions:questions,currentQuestion:questions.length-1,validationErrors:{},message:' '});
        this.saveTopic();
    };    
        
    newTopic() {
        this.setState({
            _id:'',
            topic:'',
            search:'',
            questions:[],
            currentQuestion:null,
            currentResult:null,
            currentView:'search',
            showHelp: false,
            validationErrors:{},
            message:' '
        });
    };    
        
    saveTopic(deleteQuestion) {
        let that=this;
        let publishedTopic=this.props.user.avatar+'\'s '+this.state.topic;
        let params = {_id:this.state._id,user:this.props.user._id,topic:this.state.topic,questions:this.state.questions,deleteQuestion:deleteQuestion,publishedTopic:publishedTopic}
        fetch("/api/saveusertopic", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(id) {
          //  console.log(['saved topic',id,id.id]);
            that.setState({_id:id.id});
            if (id.errors && Object.keys(id.errors).length > 0) {
                that.setState({validationErrors:id.errors,message:'Some of your questions are missing required information.'});
            } else {
                that.setState({validationErrors:{},message:' '});
            }
            
            
            //res.send({user:user,token:token});
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
        localStorage.setItem('currentTopic',this.state._id);
    }; 
    
    deleteTopic(key) {
        let that=this;
        let params = {_id:key}
        return fetch("/api/deleteusertopic", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(id) {
            //console.log(['deleted topic',id,id.id]);
            //this.loadTopics();
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
    };  
    

 
    
    loadTopic(topicId) {
        let that = this;
        let params={_id:topicId}
        fetch("/api/usertopic", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
        }).then(function(response) {
            return response.json();
        }).then(function(topic) {
            //console.log(['loaded topic',topic]);
            //res.send({user:user,token:token});
            localStorage.setItem('currentTopic',topic._id);
            that.setState({topic:topic.topic,_id:topic._id,questions:topic.questions,currentView:'questions',validationErrors:{},message:' '});
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
    };
        
    previewTopic(id) {
        let that=this;
        fetch("/api/publishusertopic", {
          method: 'POST',
        headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                _id: id,
                preview:true
              })
        }).then(function(response) {
            return response.json();
        }).then(function(publishResponse) {
            if (publishResponse.errors) {
                that.setState({validationErrors:publishResponse.errors,currentView:'questions',message:'Cannot preview yet because some of your questions are missing required information.'});
            } else {
              //  console.log(['PREVIEW',publishResponse]);
                that.props.setQuizFromTopic(that.props.user.avatar+'\'s '+publishResponse.topic);
                //let questions=0;
                //if (publishResponse.questions) questions =publishResponse.questions.length;
                //let message='Published '+questions+' questions.';
                that.setState({validationErrors:{}}); //,message:message
            }
            //console.log(['published topic',topic]);
            //res.send({user:user,token:token});
            //that.setState({topic:topic.topic,_id:topic._id,questions:topic.questions,currentView:'questions'});
        })
    };
    
    publishTopic(id) {
        let that=this;
        fetch("/api/publishusertopic", {
          method: 'POST',
        headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                _id: id
              })
        }).then(function(response) {
            return response.json();
        }).then(function(publishResponse) {
            if (publishResponse.errors) {
                that.setState({validationErrors:publishResponse.errors,currentView:'questions',message:'Cannot publish yet because some of your questions are missing required information.'});
            } else {
                let questions=0;
                if (publishResponse.questions) questions =publishResponse.questions.length;
                let message='Published '+questions+' questions.';
                that.setState({validationErrors:{},message:message});
            }
            //console.log(['published topic',topic]);
            //res.send({user:user,token:token});
            //that.setState({topic:topic.topic,_id:topic._id,questions:topic.questions,currentView:'questions'});
        })
    };  
    
    askPublishTopic(key) {
        if (this.state.questions.length > 0 && this.state.topic.length > 0) {
            confirmAlert({
              title: 'Publish Topic',
              message: `By publishing this topic you are agreeing to release your questions and mnemonics into the public domain. (See the help section for details)
              
              You will still be able to change or delete the topic or questions.
              
              Do you want to publish?`,
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => this.publishTopic(key)
                },
                {
                  label: 'No'
                }
              ]
            })
        }
    };  
    
    createQuestion() {
        let question = {
            _id: '',
            interrogative: 'Can you explain ',
            question:'',
            mnemonic:'',
            technique:'',
            answer:'',
            topic:'',
            link:'', 
            tags:''
        }
        let questions = this.state.questions;
        questions.push(question);
        this.setState({questions:questions,currentQuestion:questions.length-1,currentView:'editor'});
        this.saveTopic();
    };
    
    editQuestion(key) {
        //console.log(['editQuestion',key]);
        this.setState({currentQuestion:key,currentView:'editor',validationErrors:{},message:' '});
    };
        
    showTopics() {
        this.setState({currentView:'topics'});
    };    

    showQuestions() {
        this.setState({currentView:'questions'});
    };    

    showSearch() {
        this.setState({currentView:'search'});
    };  
    
    deleteQuestion(key) {
        let questions = this.state.questions;
        let questionId = questions[key]._id;
        questions.splice(key,1);
        this.setState({questions:questions});
        this.saveTopic(questionId);
    };  

    updateQuestion(question)  {
       // console.log(['update que',question,this.state.currentQuestion]);
        let questions = this.state.questions;
        //question.tags = question.tags.trim().toLowerCase().split(',');
        questions.splice(this.state.currentQuestion,1,question);
        this.setState({questions:questions});
        this.saveTopic();
    };
    
    showHelp(e) {
        this.setState({showHelp:true});
        return false;
    };
    hideHelp(e) {
        this.setState({showHelp:false});
        return false;
    };
    
        
    render() {
        if (this.state.showHelp)    {
             return (<div className="row">
                    <div className="col-12  card">
                    <form>
                    <a  href='#' onClick={() => this.hideHelp()} className='btn btn-info ' style={{'float':'right'}}>
                       Close
                      </a>
                       <h3 className="card-title">Help</h3>
                   
                    <CreateHelp/>
                    </form>
                    </div>
                </div>)
        } else {
            let question = this.state.questions.hasOwnProperty(this.state.currentQuestion) ? this.state.questions[this.state.currentQuestion] : {};
            return (
                <div id='topiceditor' className={this.state.topic}>
                        <div id='topiceditorheader' className='row'>
                        <div className='col-12 col-lg-6'>
                             <button  className='btn btn-info' style={{float:'left'}} onClick={this.showTopics} ><ListAlt size={28}/>&nbsp;<span className="d-none d-sm-inline" >Topics</span></button>
                            <label>&nbsp;<b>Topic&nbsp;</b><input name="topic" onChange={this.setTopicEvent}  value={this.state.topic} /></label>
                        </div>
                        <div className='col-12 col-lg-6'>
                        
                            <button  className='btn btn-info'  onClick={this.showQuestions} ><List size={28}/>&nbsp;<span className="d-none d-sm-inline" >Questions</span> <span className="badge badge-light">{this.state.questions.length}</span></button>
                            <button  className='btn btn-success' onClick={this.createQuestion} ><Plus size={28}/>&nbsp;<span className="d-none d-sm-inline" >Create Question</span></button>
                        
                             <button  className='btn btn-danger' style={{float:'right'}} onClick={() => this.askPublishTopic(this.state._id)} ><Cloud size={28}/>&nbsp;<span className="d-none d-sm-inline" >Publish</span></button>
                            <button  className='btn btn-warning' style={{float:'right'}} onClick={() => this.previewTopic(this.state._id)} ><Camera size={28}/>&nbsp;<span className="d-none d-sm-inline" >Preview</span></button>

                        </div>
                        <div className='col-12 col-lg-6'>
                            <button  href='#' onClick={() => this.showHelp()} className='btn btn-info ' ><Question size={28}/>&nbsp;<span className="d-none d-sm-inline" >Help</span></button>
                            <b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Sources&nbsp;&nbsp;</b>
                            <button  className='btn btn-info'  onClick={this.showSearch} ><WikipediaW size={28}/>&nbsp;<span className="d-none d-sm-inline" >Wikpedia</span></button>
                                                     
                        </div>
                        
                         
                         
                        </div>
                        <div className="hidden-xs-up" ><br/><br/><br/><br/><br/></div>
                        <br/><br/>
                        {this.state.message && <div id="warningmessage" >{this.state.message}</div>}
                        {this.state.currentView==='search' &&
                            <WikipediaSearchWizard topic={this.state.topic}  addResultToQuestions={this.addResultToQuestions} />
                        }
                        {this.state.currentView==='topics' && 
                            <TopicsList user={this.props.user._id} loadTopic={this.loadTopic} newTopic={this.newTopic} setTopic={this.setTopic} deleteTopic={this.deleteTopic} />
                        }
                        {this.state.currentView==='questions' &&
                            <TopicQuestionsList validationErrors={this.state.validationErrors} deleteQuestion={this.deleteQuestion} editQuestion={this.editQuestion} questions={this.state.questions} currentQuestion={this.state.currentQuestion} />
                        }
                        {this.state.currentView==='editor' &&
                            <QuestionEditor  updateQuestion={this.updateQuestion} mnemonic_techniques={this.props.mnemonic_techniques}  question={question} questions={this.state.questions} currentQuestion={this.state.currentQuestion} />
                        }
                        
                   
                </div>
            )
        }
    }
};

