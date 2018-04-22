import React, { Component } from 'react';
//import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';

import WikipediaSearchWizard from './WikipediaSearchWizard';
import QuestionEditor from './QuestionEditor';
import TopicQuestionsList from './TopicQuestionsList';
import TopicsList from './TopicsList';
import CreateHelp from './CreateHelp';
import {debounce} from 'throttle-debounce';

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
            showHelp: false
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
        this.saveTopic = debounce(1000,this.saveTopic.bind(this));
        
    };
    
    componentDidMount() {
        
    }
    
    handleSubmit() {
        //e.preventDefault();
        console.log('SAVE TOPIC');
        return false;
    };
    
    setTopicEvent(e) {
        console.log(e);
        this.setState({topic:e.target.value});
        this.saveTopic();
    };
    
    setTopic(topic) {
        //this.setState({topic:topic});
        //this.saveTopic();
        ////this.resetSearch();
    };
        
    addResultToQuestions(result) {
        console.log(['addResultToQuestions',result]);
        let question = {
                _id: '',
                interrogative: 'What is ',
                question:result.title,
                mnemonic:'',
                technique:'',
                answer:result.description,
                topic:'',
                link:result.link, 
                tags:''
            }
        let questions = this.state.questions;
        questions.push(question);
        this.setState({questions:questions,currentQuestion:questions.length-1});
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
            showHelp: false
        });
    };    
        
    saveTopic() {
        let that=this;
        let params = {_id:this.state._id,user:this.props.user,topic:this.state.topic,questions:this.state.questions}
        fetch("/api/saveusertopic", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(id) {
            console.log(['saved topic',id,id.id]);
            that.setState({_id:id.id});
            //res.send({user:user,token:token});
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
            console.log(['loaded topic',topic]);
            //res.send({user:user,token:token});
            that.setState({topic:topic.topic,_id:topic._id,questions:topic.questions,currentView:'questions'});
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
    };
        
    publishTopic() {
        
    };    
    
    createQuestion() {
        let question = {
            _id: '',
            interrogative: 'What is ',
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
    };
    
    editQuestion(key) {
        console.log(['editQuestion',key]);
        this.setState({currentQuestion:key,currentView:'editor'});
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
        questions.splice(key,1);
        this.setState({questions:questions});
        this.saveTopic();
    };  

    updateQuestion(question)  {
        console.log(['update que',question,this.state.currentQuestion]);
        let questions = this.state.questions;
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
                        <div id='topiceditorheader'>
                        <button  className='btn btn-danger' style={{float:'right'}} onClick={this.publishTopic} >Publish</button>
                         <button  className='btn btn-success' style={{float:'right'}} onClick={this.createQuestion} >Create Question</button>
                         <button  className='btn btn-info' style={{float:'left'}} onClick={this.showTopics} >Topics</button>
                        <button  className='btn btn-info' style={{float:'right'}} onClick={this.showQuestions} >Questions <span className="badge badge-light">{this.state.questions.length}</span></button>
                        <button  className='btn btn-info' style={{float:'right'}} onClick={this.showSearch} >Wikipedia</button>
                         <button  href='#' onClick={() => this.showHelp()} className='btn btn-info ' style={{'float':'right'}}>Help</button>
                        &nbsp;&nbsp;<label><b>Topic&nbsp;</b><input name="topic" onChange={this.setTopicEvent}  value={this.state.topic} /></label>
                        </div>
                        <div className="hidden-xs-up" ><br/><br/><br/></div>
                        <br/><br/>
                        {this.state.currentView==='search' &&
                            <WikipediaSearchWizard topic={this.state.topic}  addResultToQuestions={this.addResultToQuestions} />
                        }
                        {this.state.currentView==='topics' && 
                            <TopicsList user={this.props.user} loadTopic={this.loadTopic} newTopic={this.newTopic} setTopic={this.setTopic} />
                        }
                        {this.state.currentView==='questions' &&
                            <TopicQuestionsList deleteQuestion={this.deleteQuestion} editQuestion={this.editQuestion} questions={this.state.questions} currentQuestion={this.state.currentQuestion} />
                        }
                        {this.state.currentView==='editor' &&
                            <QuestionEditor  updateQuestion={this.updateQuestion} mnemonic_techniques={this.props.mnemonic_techniques}  question={question} questions={this.state.questions} currentQuestion={this.state.currentQuestion} />
                        }
                        
                   
                </div>
            )
        }
    }
};

