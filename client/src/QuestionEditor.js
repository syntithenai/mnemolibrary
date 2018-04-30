import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
import CreateHelp from './CreateHelp';
import Autocomplete from 'react-autocomplete';
const ReactTags = require('react-tag-autocomplete')
 

export default class QuestionEditor extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        
        this.state={
            warning_message: '',
              tags: [
              ],
              suggestions: []
            
            //question : {
                //_id: question._id ? question._id : '',
                //interrogative: question.interrogative ? question.interrogative:'What is ',
                //question:question.question?question.question:'',
                //mnemonic:question.mnemonic?question.mnemonic:'',
                //technique:question.technique?question.technique:'',
                //answer:question.answer?question.answer:'',
                //topic:question.topic?question.topic:'',
                //link:question.link?question.link:'', 
                //tags:question.tags?question.tags:''
            //},
            
        };
       // this.saveQuestion = this.saveQuestion.bind(this);
        this.change = this.change.bind(this);
        this.changeInterrogative = this.changeInterrogative.bind(this);
        this.handleDeleteTag = this.handleDeleteTag.bind(this);
        this.handleAddTag = this.handleAddTag.bind(this);
        this.updateQuestionTag = this.updateQuestionTag.bind(this);
        
    };
    
    componentDidMount() {
         let that = this;
         // set tags from question
         if (Array.isArray(this.props.question.tags)) {
             let tags=[];
             console.log(['set tags from q',this.props.question.tags]);
             this.props.question.tags.map(function(val,key) {
                 console.log(val,key);
                 tags.push({id:val,name:val});
             });
             that.setState({tags:tags});
         }
         
          fetch('/api/tags?sort=title&title=') //+(title ? title : '') )
          .then(function(response) {
            return response.json()
          }).then(function(json) {
              let suggestions=[];
              json.map(function(val,key) {
                  suggestions.push({id:val._id,name:val.text});
              });
              //console.log(['SET TAGS', json])
            that.setState({'suggestions':suggestions});
          }).catch(function(ex) {
            console.log(['parsing failed', ex])
          })
    }
   
   
   updateQuestionTag(tags) {
       console.log(['updateQuestionTag',tags]);
        let state = {...this.props.question};
        let cleanTags=[];
        tags.map(function(val,key) {
            cleanTags.push(val.name);
        });
        state.tags =  cleanTags;
        this.props.updateQuestion(state);
       
   };
    
  handleDeleteTag (i) {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
    this.updateQuestionTag(tags);
    
  }
 
  handleAddTag (tag) {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
    this.updateQuestionTag(tags);
  }
    
    //saveQuestion(e) {
        //e.preventDefault();
        //var that = this;
        //that.setState({'warning_message':''});
        ////console.log('save user ',this.state.user);
        //var data = {...this.props.question}
        //this.props.saveQuestion(data,this);  
            
    //};
    
    change(e) {
        //console.log(e.target);
        let state = {...this.props.question};
        var key = e.target.name;
        //if (key==="tags") {
            //state[key] =  e.target.value.split(",");
        //} else {
            state[key] =  e.target.value;
        //}
        
       // console.log(['CHANGE',this.props.currentQuestion,state]);
        //this.setState({'question':state});
        this.props.updateQuestion(state);
        return true;
    };
    
    changeInterrogative(e,value) {
        let state = {...this.props.question};
        state.interrogative =  value;
        this.props.updateQuestion(state);
        return true;
    };
    
    selectInterrogative(value) {
        let state = {...this.props.question};
        var key = 'interrogative';
        state[key] =  value;
        //this.setState({'question':state});
        //console.log(['sel inter',value]);
        this.props.updateQuestion(state);
        return true;
    };
    
    render() {
       // console.log(['QE REN',this.props]);
        if (this.props.question) {
          let techniques = this.props.mnemonic_techniques.map((technique, key) => {
                return <option  key={key} value={technique}  >{technique}</option>
            })
            return (
            
            // TAGS https://www.npmjs.com/package/react-tag-autocomplete
                <div className="questionform card">
                    <div className="" >
                        <div className='warning-message'>{this.state.warning_message}</div>
                            
                            
                        <div className='form-inline'>
                            <label htmlFor="interrogative">*&nbsp;Interrogative </label>
                            <Autocomplete
                              getItemValue={(item) => item.label}
                              items={[
                                { label: '' },
                                { label: 'Can you explain' },
                                { label: 'What is' },
                                { label: 'Who is' },
                              ]}
                              renderItem={(item, isHighlighted) =>
                                <div key={item.label} style={{ background: isHighlighted ? 'lightgray' : 'white' }}>
                                  {item.label}
                                </div>
                              }
                              value={this.props.question.interrogative}
                              onChange={this.changeInterrogative}
                              onSelect={(val) => this.selectInterrogative(val)}
                              className='col-4 form-control'  autoComplete="false" id="interrogative" type='text' name='interrogative'
                            />
                         </div>
                        <div className='form-inline'>    
                           
                            <label htmlFor="question" >*&nbsp;Question </label><input autoComplete="false" id="question" type='text' name='question' onChange={this.change} value={this.props.question.question} className='form-control' />
                        </div>
                        <div className='form-group'>    
                           <label htmlFor="mnemonic" >*&nbsp;Mnemonic </label><textarea autoComplete="false" id="mnemonic" type='text' name='mnemonic' onChange={this.change} value={this.props.question.mnemonic} className='form-control'></textarea>
                            <br/>
                        </div>
                        
                        <div className='form-inline'>    
                          
                             <label htmlFor="technique" >Technique</label><select autoComplete="false" id="technique" type='text' name='technique' onChange={this.change} value={this.props.question.technique} className='col-5 form-control' ><option/>{techniques}</select>
                        </div>
                        
                        <div className='form-group'>    
                            <label htmlFor="tags" >*&nbsp;Tags</label>
                            <ReactTags
                            autoresize={false} 
                            tags={this.state.tags}
                            suggestions={this.state.suggestions}
                            handleDelete={this.handleDeleteTag.bind(this)}
                            handleAddition={this.handleAddTag.bind(this)} 
                            id="tags"  
                            name='tags'
                            className='form-control'
                            />
                        </div>
                        
                        <div className='form-group'>     
                                <label htmlFor="link" >Link </label><input autoComplete="false" id="link" type='text' name='link' onChange={this.change} value={this.props.question.link}  className='form-control' />
                        </div>
                        
                         <div className='form-group'>     
                                <label htmlFor="link" >Image URL</label><input autoComplete="false" id="image" type='text' name='image' onChange={this.change} value={this.props.question.image}  className='form-control' />
                        </div>
                        
                        <div className='form-group'>    
                            <label htmlFor="answer" >Answer </label><textarea autoComplete="false" id="answer" type='text' name='answer' onChange={this.change} value={this.props.question.answer} className='form-control' ></textarea>
                        </div>
                        
                    </div>
                     
                    <br/>
            </div>
            )
        } else return '';
            
    }
};

  //<form method="POST" onSubmit={this.saveUser} className="form-group" autoComplete="false" >
                     //</form>
