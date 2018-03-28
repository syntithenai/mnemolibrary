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
import ExternalLink from 'react-icons/lib/fa/external-link';
import ConnectDevelop from 'react-icons/lib/fa/connectdevelop';



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
          let header = (question.interogative ? question.interogative + ' ' : '') + (question.prefix ? question.prefix + ' ': '')  + question.question+ ' ' +( question.postfix ? question.postfix : '');
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
             }
          } else {
              link = 'https://www.google.com.au/search?q='+header;
              target='_new';
          }
          
          let tags = question.tags.split(",").map((tag, key) => {
              return <button className="col-2 btn btn-outline btn-primary" onClick={() => this.blockDiscoveryTag(tag)} ><Ban size={25} /><span className="hidden-sm-down" >{tag}</span></button>
            })
          
          
          
          let showAnswerButton = !this.isVisible('answer') && question.answer;
          let showRecallButton = this.props.successButton ;//this.props.user.questions.seen.hasOwnProperty(question._id) && 
         // let successRate = question.successRate && question.successRate.toFixed ?  question.successRate.toFixed(2) : 0;
          return (
            <div className="card question container" >
                <div className="row buttons justify-content-between" >
                    <button className="col-1 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'list')} ><Ellipsis size={25} /><span className="hidden-sm-down" ></span></button>
                    <button className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'previous')} ><ArrowLeft size={25} /><span className="hidden-sm-down" > Prev </span></button>
                    <div className='col-1'>&nbsp;</div>
                    <button className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'next')}><ArrowRight size={25} /><span className="hidden-sm-down"> Next</span></button>
                    {showRecallButton && <button className="col-3 btn btn-outline btn-success" onClick={() => this.handleQuestionResponse(question,'success')}><Check size={25} /><span className="hidden-md-up"> Recall</span></button>}
                    <div className='col-1'>&nbsp;</div>
                    {showRecallButton && <button className="col-2 btn btn-outline btn-danger" onClick={() => this.handleQuestionResponse(question,'block')} ><Trash size={25} /><span className="hidden-sm-down"> Discard</span></button>}
                    
                </div>
                <div className="">
                    <h4 className="card-title">{header}</h4>
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
                        }
                    </div>
                    {this.isVisible('mnemonic') && this.props.isLoggedIn() && <div className='col-sm-4 like_dislike' style={{float: 'right'}}>
                        <a  className='btn btn-primary'  onClick={() => this.props.like(question._id)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Like&nbsp;<span className="badge badge-pill badge-info"  >{question.score}</span></a>
                       
                    </div> }
                    &nbsp;
                    </div>
                </div>
                  <div className="row buttons tags" >
                   {tags}
                </div>

                <br/>
                {this.isVisible('answer') && question.answer && <div className="card-block answer">
                    <div className='card-text'><b>Answer</b> <span>{question.answer}</span></div>
                </div>}
                
                {this.isVisible('mnemonic') && <div className="card-block mnemonic">
                    <div className='card-text'><b>Mnemonic</b><h4>{question.mnemonic}</h4></div>
                    <div className='card-text' ><b>Type</b> <span>{question.mnemonic_technique}</span></div>
                    
                </div>}
                <div className="card-block">
                    {(this.isVisible('moreinfo') && !target) && <iframe src={link} style={{width:"98%", height: "1200px", border: "0px"}}/> }
            
                </div>
                <div className="card-block">
                    {(this.isVisible('image') && question.image) && <img alt='image' src={question.image} style={{width:"98%", height: "1200px", border: "0px"}}/> }
            
                </div>
                
            </div>
   
          
          
            )
          
        }
        return null
        
        
    };
}

//{!this.isVisible('moreinfo') && <img className="" src={image} alt={header}  style={{width:"70%"}} /> }
                    
