import React, { Component } from 'react';

// icons
import Check from 'react-icons/lib/fa/check';
import ArrowRight from 'react-icons/lib/fa/arrow-right';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Trash from 'react-icons/lib/fa/trash';
import Info from 'react-icons/lib/fa/info';
import Ellipsis from 'react-icons/lib/fa/ellipsis-v';
import ThumbsUp from 'react-icons/lib/fa/thumbs-up';
import Image from 'react-icons/lib/fa/image';
import Ban from 'react-icons/lib/fa/ban';
import Search from 'react-icons/lib/fa/search';
import Tags from 'react-icons/lib/fa/tags';
import ExternalLink from 'react-icons/lib/fa/external-link';
import ConnectDevelop from 'react-icons/lib/fa/connectdevelop';
import Close from 'react-icons/lib/fa/close';
import Book from 'react-icons/lib/fa/book';
import ShareAlt from 'react-icons/lib/fa/share-alt';
import scrollToComponent from 'react-scroll-to-component';

import ShareDialog from './ShareDialog';
import Utils from './Utils';
import Swipe from 'react-swipe-component';

//import ThumbsDown from 'react-icons/lib/fa/thumbs-down';

export default class SingleQuestion extends Component {
    
    constructor(props) {
        super(props);
        this.state = {'visible':[]}
        this.setVisible = this.setVisible.bind(this);
        this.isVisible = this.isVisible.bind(this);
        this.hideAll = this.hideAll.bind(this);
        this.handleQuestionResponse = this.handleQuestionResponse.bind(this);
        this.scrollTo={};
    };
    // which question parts are visible - mnemonic, answer, moreinfo
    setVisible(toShow) {
        let visible = this.state.visible;
        visible.push(toShow);
        this.setState({'visible':visible});
        console.log(['scroll to ',toShow,this.scrollTo[toShow],this.scrollTo]);
        //setTimeout(function(toShow) {
            scrollToComponent(this.scrollTo[toShow],{align:'top',offset:-200});
        //},1000) 
    };
    
    isVisible(toShow) {
        return (this.state.visible.includes(toShow));
    };
    
    hideAll() {
        this.setState({'visible':[]});
    };
    
    handleQuestionResponse(question,response) {
        this.hideAll();
        this.props.handleQuestionResponse(question,response);
    };
    
    setDiscoveryBlock(type,id) {
        this.hideAll();
        this.props.setDiscoveryBlock(type,id)
    };
    
    clearDiscoveryBlock(type,id) {
        this.hideAll();
        this.props.clearDiscoveryBlock(type,id)
    };
    
    render() {
        let showRecallButton = this.props.successButton 
        
        let blockedTags = '';
        let blockedTopics = '';
        let blockedTechniques = '';
        if (!showRecallButton)  {
            blockedTags = this.props.blocks.tag.map((tag, key) => {
              
              return <button className="btn btn-outline btn-primary" key={key}  ><Close size={28} className="badge badge-pill badge-info"  onClick={() => this.clearDiscoveryBlock('tag',tag)} /><span className="hidden-sm-down" >&nbsp;{tag}</span></button>
            })          
            blockedTopics = this.props.blocks.topic.map((topic, key) => {
              
              return <button className="btn btn-outline btn-primary" key={topic}  ><Close size={28} className="badge badge-pill badge-info"  onClick={() => this.clearDiscoveryBlock('topic',topic)} /><span className="hidden-sm-down" >&nbsp;{topic}</span></button>
            }) 
            blockedTechniques = this.props.blocks.technique.map((technique, key) => {
              
              return <button className="btn btn-outline btn-primary" key={technique}  ><Close size={28} className="badge badge-pill badge-info"  onClick={() => this.clearDiscoveryBlock('technique',technique)} /><span className="hidden-sm-down" >&nbsp;{technique}</span></button>
            }) 
        }
      
        if (this.props.question) {
          
          let question = this.props.question;
          let showAnswerButton = !this.isVisible('answer') && question.answer;
          let header = Utils.getQuestionTitle(question);
          //let image =   question.image ?  question.image : '/clear.gif';
          let link = '';
          let target=false;
          if (question.link && question.link.length > 0) {
             if (question.link.indexOf('wikipedia.org') > 0) {
                 let parts = question.link.split('#');
                 if (parts.length>1) {
                    link = parts.slice(0,-1) + '?printable=yes#' + parts.slice(-1);
                 } else {
                     link = question.link  + '?printable=yes'
                 }
                 
             } else {
                 link = question.link;
                 target='_new';
             }
          } else {
              link = 'https://www.google.com.au/search?q='+header;
              target='_new';
          }
          let likeButton='';
          if (this.isVisible('mnemonic') && this.props.isLoggedIn())
                likeButton=<span className='like_dislike' >&nbsp;&nbsp;&nbsp;
                        <a  className='btn btn-primary'  onClick={() => this.props.like(question._id)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Like&nbsp;<span className="badge badge-pill badge-info"  >{question.score}</span></a>
                       
                    </span> 
          let tags = question.tags.map((tag, key) => {
              tag=tag.trim().toLowerCase();
              return <button className="btn btn-outline btn-primary" key={key}  ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.setDiscoveryBlock('tag',tag)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTag({text:tag})} style={{float:'right'}}/><span className="hidden-sm-down" >&nbsp;{tag}&nbsp;</span></button>
            })
            //
        
          let tagsClean = question.tags.map((tag, key) => {
              
              return <button className="btn btn-outline btn-primary" key={key}  ><span className="hidden-sm-down" >{tag}</span></button>
            })
             //!this.isVisible('mnemonic') && 
                      //(!this.isVisible('image')) && 
                      //(!this.isVisible('image')) && 
                      //!this.isVisible('moreinfo') 
                      // !this.isVisible('topic')) && 
                      // (!this.isVisible('tags')) && 
            
                     
           return (
            <div className="card question container" >
              <Swipe onSwipedLeft={() => this.handleQuestionResponse(question,'next')} onSwipedRight={() => this.handleQuestionResponse(question,'previous')} mouseSwipe={false} >
                <div className="row buttons justify-content-between" >
                    <button className="col-1 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'list')} ><Ellipsis size={25} />&nbsp;</button>
                    <button className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'previous')} ><ArrowLeft size={25} /><span className="d-none d-md-inline-block" >&nbsp;Prev&nbsp;</span></button>
                    <div className='col-1'>&nbsp;</div>
                    <button className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'next')}><ArrowRight size={25} /><span className="d-none d-md-inline-block"> Next</span></button>
                    {showRecallButton && <button className="col-3 btn btn-outline btn-success" onClick={() => this.handleQuestionResponse(question,'success')}><Check size={25} /><span className="d-none d-md-inline-block"> Recall</span></button>}
                    <div className='col-1'>&nbsp;</div>
                    {<button className="col-2 btn btn-outline btn-danger" onClick={() => this.handleQuestionResponse(question,'block')} ><Trash size={25} /><span className="d-none d-md-inline-block"> Bin</span></button>}
                    
                </div>
                <div className='blocked-tags' style={{float:'right'}}>
                    {((blockedTags && blockedTags.length > 0) || (blockedTopics && blockedTopics.length > 0) || (blockedTechniques && blockedTechniques.length > 0)) && <b>Filter </b>}
                    {blockedTags && blockedTags.length>0 && <span>Tags </span>} {blockedTags}
                    {blockedTopics && blockedTopics.length>0 && <span>Topics </span>} {blockedTopics}
                    {blockedTechniques && blockedTechniques.length>0 && <span>Techniques </span>} {blockedTechniques}
                </div>
                <div className="">
                   
                    <h4 className="card-title">{header}?</h4>
                    
                    <div className="row form" >
                      <div className="col-sm-8" >
                        {<button className='btn btn-primary' onClick={() => this.setVisible('mnemonic')} ><ConnectDevelop size={26}  />&nbsp;<span className="d-none d-md-inline-block">Mnemonic</span></button>
                        }&nbsp;
                        {showAnswerButton && <button className='btn btn-primary' onClick={() => this.setVisible('answer')}><Info size={26}  />&nbsp;<span className="d-none d-md-inline-block">Answer</span></button>
                        }&nbsp;
                        {question.image && <button  className='btn btn-primary' onClick={() => this.setVisible('image')}><Image size={26} />&nbsp;<span className="d-none d-md-inline-block">Image</span></button>
                        }&nbsp;
                        
                        {(!target) && <button  className='btn btn-primary' onClick={() => this.setVisible('moreinfo')}><ExternalLink size={26}  />&nbsp;<span className="d-none d-md-inline-block">More Info</span></button>
                        }
                        {(target) && <a  className='btn btn-primary' target={target} href={link}><ExternalLink size={26}  />&nbsp;<span className="d-none d-md-inline-block">More Info</span></a>
                        }&nbsp;
                        {showRecallButton && question.quiz && <button  className='btn btn-primary' onClick={() => this.setVisible('topic')}><Book size={26}  />&nbsp;<span className="d-none d-md-inline-block">Topic</span></button>
                        }&nbsp;
                        {showRecallButton && <button  className='btn btn-primary' onClick={() => this.setVisible('tags')}><Tags size={26}  />&nbsp;<span className="d-none d-md-inline-block">Tags</span></button>
                        }
                      </div>
                    <div className="col-sm-4">
                       <button style={{float:'right'}} target='_new' data-toggle="modal" data-target="#sharedialog" className='btn btn-primary'  ><ShareAlt size={26}  />&nbsp;<span className="d-none d-md-inline-block">Share</span></button>
                      <ShareDialog id="sharedialog"  header={header}  question={question}/>
                    </div>
                      </div>
                   
                    &nbsp;
                    </div>
                <br/>
                {this.isVisible('answer') && question.answer && <div className="card-block answer">
                    <div ref={(section) => { this.scrollTo.answer = section; }} className='card-text'><b>Answer</b> <span><pre>{question.answer}</pre></span></div>
                </div>}
                {this.isVisible('mnemonic') && showRecallButton && <div  ref={(section) => { this.scrollTo.mnemonic = section; }}  className="card-block mnemonic">
                    <div className='card-text'><b>Mnemonic</b><pre className='mnemonic' >{question.mnemonic}</pre></div>
                    <div className='card-text' ><b>Technique</b><button className="btn btn-outline btn-primary"   > <span className="hidden-sm-down" >{question.mnemonic_technique}</span></button>{likeButton}</div>
                </div>}
                {this.isVisible('mnemonic') && !showRecallButton && <div  ref={(section) => { this.scrollTo.mnemonic = section; }}  className="card-block mnemonic">
                    <div className='card-text'><b>Mnemonic</b><pre  className='mnemonic' >{question.mnemonic}</pre></div>
                    <div className='card-text' ><b>Technique</b> <span><button className="btn btn-outline btn-primary"   ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.setDiscoveryBlock('technique',question.mnemonic_technique)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTechnique(question.mnemonic_technique)} style={{float:'right'}}/><span className="hidden-sm-down" >{question.mnemonic_technique}</span></button></span>{likeButton}</div>
                </div>}
                <br/>
                 {(!showRecallButton) && question.quiz && <div  ref={(section) => { this.scrollTo.topic = section; }} className="card-block answer">
                    <div className='card-text'><b>Topic&nbsp;&nbsp;&nbsp;</b> <span><button className="btn btn-outline btn-primary"   ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.setDiscoveryBlock('topic',question.quiz)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTopic(question.quiz)} style={{float:'right'}}/><span className="hidden-sm-down" >&nbsp;{question.quiz}&nbsp;</span></button></span></div><br/>
                </div>}
                {(this.isVisible('topic') && question.quiz && showRecallButton) && <div  ref={(section) => { this.scrollTo.topic = section; }} className="card-block answer">
                    <div className='card-text'><b>Topic&nbsp;&nbsp;&nbsp;</b> <span><button className="btn btn-outline btn-primary"   ><span className="hidden-sm-down" >{question.quiz}</span></button></span></div><br/>
                </div>}
                
                {!showRecallButton && <div  ref={(section) => { this.scrollTo.tags = section; }}  className="card-block tags" >
                  <b>Tags&nbsp;&nbsp;&nbsp;</b>
                   {tags}
                </div>}
                {this.isVisible('tags') && showRecallButton && <div  ref={(section) => { this.scrollTo.tags = section; }}  className="card-block tags" >
                  <b>Tags&nbsp;&nbsp;&nbsp;</b>
                   {tagsClean}
                </div>}
                <br/>
                <div className="card-block">
                    <div ref={(section) => { this.scrollTo.moreinfo = section; }} ></div>
                    {(this.isVisible('moreinfo') && !target) && <iframe   src={link} style={{width:"98%", height: "1200px", border: "0px"}}/> }
            
                </div>
                <div className="card-block">
                    <div ref={(section) => { this.scrollTo.image = section; }} ></div>
                    {(this.isVisible('image') && question.image) && <span><img  className="d-lg-none" ref={(section) => { this.scrollTo.image = section; }}  alt={question.question} src={question.image} style={{width:"98%",  border: "0px"}}/><img  className="d-none d-lg-block"   alt={question.question} src={question.image} style={{width:"50%",  border: "0px"}}/></span> }
                </div>
              </Swipe>  
            </div>
   
          
          
            )
          
        } else {
            return <div className="card question container" >
                <div className='blocked-tags' style={{float:'right'}}>
                    {((blockedTags && blockedTags.length > 0) || (blockedTopics && blockedTopics.length > 0) || (blockedTechniques && blockedTechniques.length > 0)) && <b>Filter </b>}
                    {blockedTags && blockedTags.length>0 && <span>Tags </span>} {blockedTags}
                    {blockedTopics && blockedTopics.length>0 && <span>Topics </span>} {blockedTopics}
                    {blockedTechniques && blockedTechniques.length>0 && <span>Techniques </span>} {blockedTechniques}
                </div>
                <div>No matching questions</div>
            </div>
        }
        
    };
}

//{!this.isVisible('moreinfo') && <img className="" src={image} alt={header}  style={{width:"70%"}} /> }
                    
