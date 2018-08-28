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
import Google from 'react-icons/lib/fa/google';
import Question from 'react-icons/lib/fa/question';

import Trash from 'react-icons/lib/fa/trash';

//import ShareAlt from 'react-icons/lib/fa/share-alt';
import ShareTopicDialog from './ShareTopicDialog';

 
export default class TopicEditor extends Component {
    constructor(props) {
        super(props);
        this.state={
            _id:'',
            topic:'',
            published:'',
            search:'',
            questions:[],
            currentQuestion:null,
            currentResult:null,
            currentView:'topics',
            showHelp: false,
            validationErrors:{},
            shareQuestion:{},
            filter:''
        };
        this.updateFilter = this.updateFilter.bind(this);
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
        this.saveTopic = debounce(500,this.saveTopic.bind(this));
        this.deleteTopic = this.deleteTopic.bind(this);
        this.askDeleteTopic = this.askDeleteTopic.bind(this);
        this.previewTopic = this.previewTopic.bind(this);
        this.updateResultToQuestion = this.updateResultToQuestion.bind(this);
        this.moveQuestion = this.moveQuestion.bind(this);
        this.shareQuestion = this.shareQuestion.bind(this);
    };
    
    componentDidMount() {
          console.log('topic editor DID mount')
        let currentTopic = localStorage.getItem('currentTopic');
        let that=this;
        console.log('topic editor update');
        console.log(currentTopic);
        if (currentTopic && currentTopic.length > 0) {
            setTimeout(function() {
                that.loadTopic(currentTopic);
            },50);
            
        }
    }
    
    componentDidUpdate() {
        
      
    };
    
    handleSubmit() {
        //e.preventDefault();
       // //console.log('SAVE TOPIC');
        return false;
    };
    
    shareQuestion(question) {
        this.setState({shareQuestion:question});
    };
    
    setTopicEvent(e) {
        console.log(['topicevent',e.target.value]);
        this.setState({topic:e.target.value});
        this.saveTopic();
    };
    
    setTopic(topic) {
        //this.setState({topic:topic});
        //this.saveTopic();
        ////this.resetSearch();
    };
        
    addResultToQuestions(result) {
        ////console.log(['addResultToQuestions',result]);
        let question = {
                _id: '',
                interrogative: '',
                question:result.title,
                mnemonic:'',
                technique:'',
                answer:result.description,
                topic:'',
                link:result.link, 
                tags:[],
                message:'',
            }
        let questions = this.state.questions;
        questions.push(question);
        this.setState({questions:questions,currentQuestion:questions.length-1,validationErrors:{},message:' ',currentView:'editor'});
        this.saveTopic();
    };    
    
    
    moveQuestion(index, delta) {
      let array = this.state.questions;
      var newIndex = index + delta;
      if (newIndex < 0  || newIndex === array.length) return; //Already at the top or bottom.
      var indexes = [index, newIndex].sort(); //Sort the indixes
      array.splice(indexes[0], 2, array[indexes[1]], array[indexes[0]]); //Replace from lowest index, two elements, reverting the order
        this.setState({questions:array});
        this.saveTopic();
    };
        
   
        

   updateResultToQuestion(result) {
       //console.log(['upateres',result,this.state.currentQuestion]);
       if (this.state.currentQuestion && this.state.questions.hasOwnProperty(this.state.currentQuestion)) {
            let question =  this.state.questions[this.state.currentQuestion];
            question.link = result.link;
            question.answer = question.answer  + "\n\n" + result.description;
            let questions = this.state.questions;
            questions[this.state.currentQuestion] = question;
            this.setState({questions:questions,validationErrors:{},message:' '});
            this.saveTopic();
            this.editQuestion(this.state.currentQuestion);
       }
       
    }; 

    newTopic() {
        this.setState({
            _id:'',
            topic:'',
            search:'',
            questions:[],
            currentQuestion:null,
            currentResult:null,
            currentView:'questions',
            showHelp: false,
            validationErrors:{},
            message:' ',
            published:null
        });
    };    
        
    saveTopic(deleteQuestion) {
        //debounce(100,function() {
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
              //  //console.log(['saved topic',id,id.id]);
                that.setState({_id:id.id});
                if ((id.errors && Object.keys(id.errors).length > 0) || id.message) {
                    that.setState({validationErrors:id.errors,message:'Some of your questions are missing required information.'});
                } else {
                    let idsUpdate = this.state.questions;
                    idsUpdate.map(function(value,key) {
                        if (!idsUpdate[key]._id) {
                            idsUpdate[key]._id = id.questions[key]._id;
                        }
                    });
                    that.setState({validationErrors:{},message:' ',questions:idsUpdate});
                }
                
                
                //res.send({user:user,token:token});
            })
            .catch(function(err) {
                //console.log(['ERR',err]);
            });
            localStorage.setItem('currentTopic',this.state._id);
            
      //  });
    }; 
    
    deleteTopic(key) {
        let that=this;
        let params = {_id:key,user:this.props.user._id}
        return fetch("/api/deleteusertopic", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(params)
        }).then(function(response) {
            return response.json();
        }).then(function(id) {
            ////console.log(['deleted topic',id,id.id]);
            //that.loadTopics();
            that.newTopic();
            that.setState({currentView:'topics'});
        })
        .catch(function(err) {
            //console.log(['ERR',err]);
        });
    };  
    
    
    askDeleteTopic(key) {
        confirmAlert({
          title: 'Delete Topic',
          message: 'Are you sure you want to delete this topic and all associated questions?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.deleteTopic(key)
            },
            {
              label: 'No'
            }
          ]
        })
    };

 
    
    loadTopic(topicId) {
        if (topicId) {
            let that = this;
            let params={_id:topicId,user:this.props.user._id}
            fetch("/api/usertopic", {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
              },
              body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
            }).then(function(response) {
                return response.json();
            }).then(function(topic) {
                console.log(['loaded topic complete']);
                if (topic && topic._id) {
                    console.log(['loaded topic',topic]);
                    //res.send({user:user,token:token});
                    localStorage.setItem('currentTopic',topic._id);
                    that.setState({topic:topic.topic,_id:topic._id,published:topic.published,questions:topic.questions,currentView:'questions',validationErrors:{},message:' '});                
                }
            })
            .catch(function(err) {
                //console.log(['ERR',err]);
            });
            
        }
    };
        
    previewTopic(id) {
        //console.log(['preview topic',id]);
        let that=this;
        fetch("/api/publishusertopic", {
          method: 'POST',
        headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                _id: id,
                preview:true,
                user:this.props.user._id
              })
        }).then(function(response) {
            return response.json();
        }).then(function(publishResponse) {
            if (publishResponse.errors) {
                that.setState({validationErrors:publishResponse.errors,currentView:'questions',message:'Cannot preview yet because some of your questions are missing required information.'});
            } else {
                //console.log(['PUB RESP',publishResponse,that.state.currentQuestion]);
                let previewQuestion = that.state.currentQuestion;
                //if (publishResponse.questions && publishResponse.questions.length > that.state.currentQuestion && publishResponse.questions[that.state.currentQuestion] && publishResponse.questions[that.state.currentQuestion].hasOwnProperty('_id')) {
                    //previewQuestion = publishResponse.questions[that.state.currentQuestion]._id;
                //}
                that.props.setQuizFromTopic('Preview '+that.props.user.avatar+'\'s '+publishResponse.topic,previewQuestion);
                //let questions=0;
                //if (publishResponse.questions) questions =publishResponse.questions.length;
                //let message='Published '+questions+' questions.';
                that.setState({validationErrors:{}}); //,message:message
            }
            ////console.log(['published topic',topic]);
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
                _id: id,
                user:this.props.user._id
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
                that.setState({published:true,validationErrors:{},message:message,_id:publishResponse._id,topic:publishResponse.topic,questions:publishResponse.questions});
                let questionIds=[];
                publishResponse.questions.map(function(val,key) {
                    questionIds.push(val._id);
                    return null;
                });
                that.props.fetchTopicCollections();
                setTimeout(function() {
                    fetch('/api/sitemap?ids='+questionIds.join(","));
                },2000);
                
            }
            ////console.log(['published topic',topic]);
            //res.send({user:user,token:token});
            //that.setState({topic:topic.topic,_id:topic._id,questions:topic.questions,currentView:'questions'});
        })
    };  

    unpublishTopic(id) {
        let that=this;
        fetch("/api/unpublishusertopic", {
          method: 'POST',
        headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                _id: id,
                user:this.props.user._id
              })
        }).then(function(response) {
            return response.json();
        }).then(function(publishResponse) {
            that.setState({validationErrors:{},published:false});
             that.props.fetchTopicCollections();
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
            interrogative: '',
            question:'',
            mnemonic:'',
            technique:'',
            answer:'',
            topic:'',
            link:'', 
            tags:[]
        }
        let questions = this.state.questions;
        questions.push(question);
        this.setState({questions:questions,currentQuestion:questions.length-1,currentView:'editor'});
        this.saveTopic();
    };
    
    editQuestion(key) {
        ////console.log(['editQuestion',key]);
        this.setState({currentQuestion:key,currentView:'editor',validationErrors:{},message:' '});
    };
        
    showTopics() {
        this.setState({currentView:'topics'});
    };    

    showQuestions() {
        this.setState({currentView:'questions'});
    };    

    showSearch(searchFor) {
        //console.log(['showsearch',searchFor]);
        this.setState({currentView:'search',search:searchFor});
    };  
    
    deleteQuestion(key) {
        let questions = this.state.questions;
        //console.log(['DEL Q',key,questions]);
        let questionId = questions[key]._id;
        this.saveTopic(questionId);
        questions.splice(key,1);
        this.setState({questions:questions,currentView:'questions'});
        
    };  

    updateQuestion(updatedQuestion)  {
       //console.log(['update que',updatedQuestion,this.state.currentQuestion]);
       let questions = this.state.questions;
       //let currentQuestion = isNaN(this.state.currentQuestion) ? 0 : this.state.currentQuestion;
       //if (questions.length)
       if (!isNaN(this.state.currentQuestion) && (questions.length > this.state.currentQuestion)) {
            //let question.tags = question.tags.trim().toLowerCase().split(',');
            //console.log(['really update que',question,this.state.currentQuestion]);
            questions.splice(this.state.currentQuestion,1,updatedQuestion);
            this.setState({questions:questions});
            this.saveTopic();
        }
    };
     
    showHelp(e) {
        this.setState({showHelp:true});
        return false;
    };
    hideHelp(e) {
        this.setState({showHelp:false});
        return false;
    };
    
    updateFilter(e) {
        this.setState({filter:String(e.target.value).toLowerCase()});
    };
    
    
    render() {
        let currentQuestion = this.state.currentQuestion > 0 ? this.state.currentQuestion : 0;
       let question = this.state._id && String(this.state._id).length > 4 &&  this.state.questions && this.state.questions.hasOwnProperty(currentQuestion) ? this.state.questions[currentQuestion] : {};
        return (
           <div id='topiceditor' className={this.state.topic}>
                <ShareTopicDialog id="sharetopicdialog"  header="Share Topic"  question={question} shareQuestion={this.state.shareQuestion}/>
                
                <div id='topiceditorheader' className='row'>
                    
                    <div className='col-12 col-lg-6'>
                        <button  className='btn btn-info' style={{float:'left'}} onClick={this.showTopics} ><ListAlt size={28}/>&nbsp;<span className="d-none d-sm-inline" >Topics</span></button>
                        {String(this.state._id).length > 0 && <button  className='btn btn-info'  onClick={this.showQuestions} ><List size={28}/>&nbsp;<span className="d-none d-sm-inline" >Questions</span> <span className="badge badge-light">{this.state.questions ? this.state.questions.length : 0}</span></button>}
                        <button  href='#' onClick={() => this.showHelp()} className='btn btn-info ' ><Question size={28}/>&nbsp;<span className="d-none d-sm-inline" >Help</span></button>
                       
                    </div>
                    <div className='col-12  col-lg-6'>
                           
                       
                            {String(this.state._id).length > 0 && <button  className='btn btn-danger'  onClick={() => this.askDeleteTopic(this.state._id)} style={{float:'right'}} ><Trash size={28}/>&nbsp;<span className="d-none d-sm-inline" >Delete Topic</span> </button>}
                            
                              {String(this.state._id).length > 0 &&  this.state.questions && this.state.questions.length >0 && this.state.published===true && <button  className='btn btn-success' style={{float:'right'}} onClick={() => this.askPublishTopic(this.state._id)} ><Cloud size={28}/>&nbsp;<span className="d-none d-sm-inline" >Republish</span></button>}
                             
                             {String(this.state._id).length > 0 &&  this.state.questions  &&  this.state.questions.length >0 && !this.state.published && <button  className='btn btn-success' style={{float:'right'}} onClick={() => this.askPublishTopic(this.state._id)} ><Cloud size={28}/>&nbsp;<span className="d-none d-sm-inline" >Publish</span></button>}
                             {String(this.state._id).length > 0 &&  this.state.questions && this.state.questions.length >0 && this.state.published===true && <button  className='btn btn-danger' style={{float:'right'}} onClick={() => this.unpublishTopic(this.state._id)} ><Cloud size={28}/>&nbsp;<span className="d-none d-sm-inline" >Unpublish</span></button>}
                    </div>
                </div>
                <div className='row'>    
                    <div className='col-12'>
                            <br/><br/><br/><br/>
                           
                            {!this.state.showHelp &&  this.state.currentView==='search' &&
                                <WikipediaSearchWizard topic={this.state.search}  addResultToQuestions={this.addResultToQuestions} updateResultToQuestion={this.updateResultToQuestion} currentQuestion={this.state.currentQuestion} questions={this.state.questions} />
                            }
                            {!this.state.showHelp && this.state.currentView==='topics' && 
                                <TopicsList topicId={this.state._id} user={this.props.user._id} loadTopic={this.loadTopic} newTopic={this.newTopic} setTopic={this.setTopic} deleteTopic={this.deleteTopic} />
                            }
                            {!this.state.showHelp && this.state.currentView==='questions' &&
                                <span>
                                 {!this.state.showHelp && this.state.message && <div id="warningmessage" >{this.state.message}</div>}
                                  <label>&nbsp;<b>Topic&nbsp;</b><input name="topic" onChange={this.setTopicEvent}  value={this.state.topic} /></label>
                                  
                                 <button  className='btn btn-success' onClick={this.createQuestion} ><Plus size={28}/>&nbsp;<span className="d-none d-sm-inline" >New Question</span></button>
                                {this.state.topic && <button  className='btn btn-info'  onClick={()=>this.showSearch(this.state.topic)} ><WikipediaW size={28} /><span className="d-none d-sm-inline" >Wikipedia</span></button>}
                             
                                {this.state.topic && <a href={'https://www.google.com.au/search?q='+this.state.topic} target="_new"  className='btn btn-info'   ><Google size={28} /><span className="d-none d-sm-inline" >Google</span></a>}
                             
                                 {false && String(this.state._id).length > 0 && this.state.questions.length >0 && <button  className='btn btn-warning'  onClick={() => this.previewTopic(this.state._id)} ><Camera size={28}/>&nbsp;<span className="d-none d-sm-inline" >Preview</span></button>}
                              
                              
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <label>Filter <input type='text' onChange={this.updateFilter} /></label>
                              
                                <TopicQuestionsList filter={this.state.filter} validationErrors={this.state.validationErrors} editQuestion={this.editQuestion}  questions={this.state.questions} moveQuestion={this.moveQuestion} currentQuestion={this.state.currentQuestion} /></span>
                            }
                            {!this.state.showHelp && this.state.currentView==='editor' &&
                                <QuestionEditor showSearch={this.showSearch} previewTopic={this.previewTopic} createQuestion={this.createQuestion} deleteQuestion={this.deleteQuestion} updateQuestion={this.updateQuestion} mnemonic_techniques={this.props.mnemonic_techniques}  question={question} questions={this.state.questions} _id={this.state._id} currentQuestion={this.state.currentQuestion} shareQuestion={this.shareQuestion} topic={this.state.topic} published={this.state.published}/>
                            }
                            {this.state.showHelp &&
                                <div className="row">
                                    <div className="col-12  card">
                                        <form>
                                            <a  href='#' onClick={() => this.hideHelp()} className='btn btn-info ' style={{'float':'right'}}>
                                               Close
                                              </a>
                                               <h3 className="card-title">Help</h3>
                                           
                                            <CreateHelp/>
                                        </form>
                                    </div>
                                </div>
                            }
                        
                    </div>
                </div>
            </div>
        )
    }

};

