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

import Utils from './Utils';

//import ThumbsDown from 'react-icons/lib/fa/thumbs-down';

export default class SingleQuestion extends Component {
    
    constructor(props) {
        super(props);
        this.state = {'visible':[]}
        this.setVisible = this.setVisible.bind(this);
        this.handleQuestionResponse = this.handleQuestionResponse.bind(this);
    };
    // which question parts are visible - mnemonic, answer, moreinfo
    setVisible(toShow) {
        let visible = this.state.visible;
        visible.push(toShow);
        this.setState({'visible':visible});
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
    
    render() {
        if (this.props.question) {
          let question = this.props.question;
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
          let tags = question.tags.split(",").map((tag, key) => {
              tag=tag.trim().toLowerCase();
              return <button className="btn btn-outline btn-primary" key={key}  ><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTag({text:tag})} style={{float:'right'}}/><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.blockDiscoveryTag(tag)} /><span className="hidden-sm-down" >&nbsp;{tag}&nbsp;</span></button>
            })
        
        let tagsClean = question.tags.split(",").map((tag, key) => {
              
              return <button className="btn btn-outline btn-primary" key={key}  ><span className="hidden-sm-down" >{tag}</span></button>
            })
          
          
          
          let showAnswerButton = !this.isVisible('answer') && question.answer;
          let showRecallButton = this.props.successButton ;//this.props.user.questions.seen.hasOwnProperty(question._id) && 
         // let successRate = question.successRate && question.successRate.toFixed ?  question.successRate.toFixed(2) : 0;
          return (
            <div className="card question container" >
                <div className="row buttons justify-content-between" >
                    <button className="col-1 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'list')} ><Ellipsis size={25} /></button>
                    <button className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'previous')} ><ArrowLeft size={25} /><span className="d-sm-none d-md-inline-block" >&nbsp;Prev&nbsp;</span></button>
                    <div className='col-1'>&nbsp;</div>
                    <button className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'next')}><ArrowRight size={25} /><span className="d-sm-none d-md-inline-block"> Next</span></button>
                    {showRecallButton && <button className="col-3 btn btn-outline btn-success" onClick={() => this.handleQuestionResponse(question,'success')}><Check size={25} /><span className="d-sm-none d-md-inline-block"> Recall</span></button>}
                    <div className='col-1'>&nbsp;</div>
                    {<button className="col-2 btn btn-outline btn-danger" onClick={() => this.handleQuestionResponse(question,'block')} ><Trash size={25} /><span className="d-sm-none d-md-inline-block"> Bin</span></button>}
                    
                </div>
                <div className="">
                    <h4 className="card-title">{header}?</h4>
                    <div className="row form" >
                      <div className="col-sm-8" >
                        {!this.isVisible('mnemonic') && <button className='btn btn-primary' onClick={() => this.setVisible('mnemonic')} ><ConnectDevelop size={26} style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Mnemonic</button>
                        }&nbsp;
                        {showAnswerButton && <button className='btn btn-primary' onClick={() => this.setVisible('answer')}><Info size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Answer</button>
                        }&nbsp;
                        {(!this.isVisible('image')) && question.image && <button  className='btn btn-primary' onClick={() => this.setVisible('image')}><Image size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Image</button>
                        }&nbsp;
                        
                        {(!this.isVisible('moreinfo') && !target) && <button  className='btn btn-primary' onClick={() => this.setVisible('moreinfo')}><ExternalLink size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;More Info</button>
                        }
                        {(!this.isVisible('moreinfo') && target) && <a  className='btn btn-primary' target={target} href={link}><ExternalLink size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;More Info</a>
                        }&nbsp;
                        {(!this.isVisible('tags')) && <a  className='btn btn-primary' onClick={() => this.setVisible('tags')}><Tags size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Tags</a>
                        }
                    </div>
                   
                    &nbsp;
                    </div>
                </div>
                {this.isVisible('answer') && question.answer && <div className="card-block answer">
                    <div className='card-text'><b>Answer</b> <span>{question.answer}</span></div>
                </div>}
                
                {this.isVisible('mnemonic') && <div className="card-block mnemonic">
                    <div className='card-text'><b>Mnemonic</b><h4>{question.mnemonic}</h4></div>
                    <div className='card-text' ><b>Type</b> <span>{question.mnemonic_technique}</span>{likeButton}</div>
                    
                </div>}
                 
                {this.isVisible('tags') && !showRecallButton && <div className="row buttons tags" >
                  <b>&nbsp;&nbsp;Tags&nbsp;&nbsp;&nbsp;</b>
                   {tags}
                </div>}
                {this.isVisible('tags') && showRecallButton && <div className="row buttons tags" >
                  <b>&nbsp;&nbsp;Tags&nbsp;&nbsp;&nbsp;</b>
                   {tagsClean}
                </div>}
                <br/>
                <div className="card-block">
                    {(this.isVisible('moreinfo') && !target) && <iframe src={link} style={{width:"98%", height: "1200px", border: "0px"}}/> }
            
                </div>
                <div className="card-block">
                    {(this.isVisible('image') && question.image) && <img alt={question.question} src={question.image} style={{width:"98%",  border: "0px"}}/> }
            
                </div>
                
            </div>
   
          
          
            )
          
        }
        return null
        
        
    };
}

//{!this.isVisible('moreinfo') && <img className="" src={image} alt={header}  style={{width:"70%"}} /> }
                    
