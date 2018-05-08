import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
import CreateHelp from './CreateHelp';
import Autocomplete from 'react-autocomplete';
const ReactTags = require('react-tag-autocomplete')
import ReactS3Uploader  from 'react-s3-uploader';
import "video-react/dist/video-react.css"; // import css
import { Player } from 'video-react';

export default class QuestionEditor extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        
        this.state={
            warning_message: '',
              tags: [
              ],
              suggestions: [],
              imageProgress: null,
              mediaProgress: null
             // imageURL:this.props.question.image
            
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
        this.finishUploadImage = this.finishUploadImage.bind(this);
        this.finishUploadMedia = this.finishUploadMedia.bind(this);
        this.changeMedia = this.changeMedia.bind(this);
        this.changeImage = this.changeImage.bind(this);
        this.onImageProgress = this.onImageProgress.bind(this);
        this.onMediaProgress = this.onMediaProgress.bind(this);
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
      console.log(['ADDTAG',tag]);
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
        
        console.log(['CHANGE',this.props.currentQuestion,state]);
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
    
    changeImage(e) {
        let state = {...this.props.question};
        state.image=e.target.value
        this.props.updateQuestion(state);
        //this.setState({'question':state});
        return true;
    };
    
    finishUploadImage(signResult) {
        console.log("Uppt finished: " + signResult.publicUrl)
        let state = {...this.props.question};
        //state.image='';
        //this.props.updateQuestion(state);
        //this.setState({'question':state});
        let time = new Date().getTime();
        state.image="/api"+signResult.publicUrl+'?no_cache='+time;
        this.props.updateQuestion(state);
        this.setState({imageProgress:null});
        
        //this.setState({imageURL:"/api"+signResult.publicUrl})
    };
    
    changeMedia(e) {
        let state = {...this.props.question};
        state.media=e.target.value
        this.props.updateQuestion(state);
        this.setState({'question':state});
        return true;
    };
    
    finishUploadMedia(signResult) {
        console.log("Uppt media finished: " + signResult.publicUrl)
        let state = {...this.props.question};
        let time = new Date().getTime();
        state.media="/api"+signResult.publicUrl+'?no_cache='+time;
        this.props.updateQuestion(state);
        this.setState({mediaProgress:null});
        //this.setState({imageURL:"/api"+signResult.publicUrl})
    };
    
    onMediaProgress(percent, message) {
        this.setState({'mediaProgress':percent});
        console.log('Upload media progress: ' + percent + '% ' + message);
    };
    
    onImageProgress(percent, message) {
        this.setState({'imageProgress':percent});
        console.log('Upload progress: ' + percent + '% ' + message);
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
                            <label htmlFor="interrogative">Interrogative </label>
                            <Autocomplete
                              getItemValue={(item) => item.label}
                              items={[
                                { label: ' ' },
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
                           
                            <label htmlFor="question" >*&nbsp;Question </label><input autoComplete="false" id="question" type='text' name='question' onChange={this.change} value={this.props.question.question} className='form-control' size="50"/>
                        </div>
                        <div className='form-group'>    
                           <label htmlFor="mnemonic" >*&nbsp;Mnemonic </label><textarea autoComplete="false" id="mnemonic" type='text' name='mnemonic' onChange={this.change} value={this.props.question.mnemonic} className='form-control'></textarea>
                            <br/>
                        </div>
                        
                        <div className='form-inline'>    
                          
                             <label htmlFor="technique" >Technique</label><select autoComplete="false" id="technique" type='text' name='technique' onChange={this.change} value={this.props.question.technique} className='col-5 form-control' ><option/>{techniques}</select>
                        </div>
                        
                        <div className='form-group'>    
                            <label htmlFor="tags" >Tags (press tab to add a tag)</label>
                            <ReactTags
                            autoresize={false} 
                            tags={this.state.tags}
                            suggestions={this.state.suggestions}
                            handleDelete={this.handleDeleteTag}
                            handleAddition={this.handleAddTag} 
                            allowNew={true}
                            id="tags"  
                            name='tags'
                            className='form-control'
                            />
                        </div>
                        
                        <div className='form-group'>     
                                <label htmlFor="link" >Link </label><input autoComplete="false" id="link" type='text' name='link' onChange={this.change} value={this.props.question.link}  className='form-control' />
                        </div>
                        
                        <div className='form-group'>    
                            <label htmlFor="answer" >Answer </label><textarea autoComplete="false" id="answer" type='text' name='answer' onChange={this.change} value={this.props.question.answer} className='form-control' ></textarea>
                        </div>
                        
                        <div className='form-group'>  
                                
                                <label htmlFor="link" >Image URL</label> <ReactS3Uploader
                                    signingUrl="/api/s3/sign"
                                    signingUrlMethod="GET"
                                    accept="image/*"
                                    s3path="uploads/"
                                    inputRef={cmp => this.uploadInput = cmp}
                                    autoUpload={true}
                                    signingUrlWithCredentials={ true }      // in case when need to pass authentication credentials via CORS
                                    uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                                    contentDisposition="auto"
                                    scrubFilename={(filename) => this.props.question._id}
                                    onFinish={this.finishUploadImage}
                                    onProgress={this.onImageProgress}
                                    /><input autoComplete="false" id="image" type='text' name='image' onChange={this.changeImage} value={this.props.question.image}  className='form-control' />
                                {this.state.imageProgress && <div className='progressbar' style={{backgroundColor: 'blue',width: '100%'}}><div className='progressbarinner' style={{backgroundColor: 'red', width:String(this.state.imageProgress)+'%'}} >&nbsp;</div></div>}
                                {this.props.question.image && !this.state.imageProgress &&  <img src={this.props.question.image} style={{width: 200}}/>}
                                
                        </div>
                        
                         <div className='form-group'>  
                                    <label htmlFor="link" >Media URL</label> <ReactS3Uploader
                                    signingUrl="/api/s3/sign"
                                    signingUrlMethod="GET"
                                    accept="*"
                                    s3path="uploads/"
                                    inputRef={cmp => this.uploadInput = cmp}
                                    autoUpload={true}
                                    signingUrlWithCredentials={ true }      // in case when need to pass authentication credentials via CORS
                                    uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                                    contentDisposition="auto"
                                    scrubFilename={(filename) => "media_"+String(this.props.question._id)}
                                    onFinish={this.finishUploadMedia}
                                    onProgress={this.onMediaProgress}
                                    /><input autoComplete="false" id="image" type='text' name='media' onChange={this.changeMedia} value={this.props.question.media}  className='form-control' />
                            {this.state.mediaProgress && <div className='progressbar' style={{backgroundColor: 'blue',width: '100%'}}><div className='progressbarinner' style={{backgroundColor: 'red', width:String(this.state.mediaProgress)+'%'}} >&nbsp;</div></div>}
                                
                            {this.props.question.media && !this.state.mediaProgress &&  <span><Player
                                      playsInline
                                      autoPlay={false}
                                      fluid={true}
                                      src={this.props.question.media}
                                    /></span> }
                                        
                        </div>
                        
                    </div>
                     
                    <br/>
            </div>
            )
        } else return '';
            
    }
};
//filename.replace(/[^\w\d_\-.]+/ig, '')
  //<form method="POST" onSubmit={this.saveUser} className="form-group" autoComplete="false" >
                     //</form>
//preprocess={this.onUploadStart}
                                    //onSignedUrl={this.onSignedUrl}
                                    //onProgress={this.onUploadProgress}
                                    //onError={this.onUploadError}
                                    //onFinish={this.onUploadFinish}
                                    //signingUrlHeaders={{ additional: headers }}
                                    //signingUrlQueryParams={{ additional: query-params }}
                                    //signingUrlWithCredentials={ true }      // in case when need to pass authentication credentials via CORS
                                    //uploadRequestHeaders={{ 'x-amz-acl': 'public-read' }}  // this is the default
                                    //contentDisposition="auto"
                                    //scrubFilename={(filename) => filename.replace(/[^\w\d_\-.]+/ig, '')}
                                    //server="http://cross-origin-server.com"
                                    
