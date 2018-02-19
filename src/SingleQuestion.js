import React, { Component } from 'react';

// icons
import Check from 'react-icons/lib/fa/check';
import Times from 'react-icons/lib/fa/times-circle';
import ArrowRight from 'react-icons/lib/fa/arrow-right';
import Trash from 'react-icons/lib/fa/trash';
import Info from 'react-icons/lib/fa/info';

export default class SingleQuestion extends Component {
    
    constructor(props) {
        super(props);
        this.state = {'visible':[]}
        this.setVisible = this.setVisible.bind(this);
        this.handleQuestionResponse = this.handleQuestionResponse.bind(this);
    };
    
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
          let header = question.interogative + ' ' + question.question;
          let image =   question.image ?  question.image : '/clear.gif';
          let link = question.link + '?printable=yes';
          let showAnswerButton = !this.isVisible('answer') && question.answer;
          return (
            <div className="card question container" >
                <div className="row buttons" >
                    <button className="col-4 btn btn-outline btn-success" onClick={() => this.handleQuestionResponse(question,'success')}><Check size={25} /><span className="hidden-md-up"> Remembered</span></button>
                    <button className="col-3 btn btn-outline btn-warning" onClick={() => this.handleQuestionResponse(question,'fail')} ><Times size={25} /><span className="hidden-sm-down" > Forgot</span></button>
                    <div className='col-1'>&nbsp;</div>
                    <button className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'skip')}><ArrowRight size={25} /><span className="hidden-sm-down"> Skip</span></button>
                    <button className="col-2 btn btn-outline btn-danger" onClick={() => this.handleQuestionResponse(question,'block')} ><Trash size={25} /><span className="hidden-sm-down"> Ban</span></button>
                    
                </div>
                <div className="card-block">
                    <h4 className="card-title">{header}</h4>
                    <form className="form" style={{float: 'left'}} >
                        {!this.isVisible('mnemonic') && <button className='btn btn-primary' onClick={() => this.setVisible('mnemonic')} ><Info size={26} style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Mnemonic</button>
                        }&nbsp;
                        {showAnswerButton && <button className='btn btn-primary' onClick={() => this.setVisible('answer')}><Info size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Answer</button>
                        }&nbsp;
                        {!this.isVisible('moreinfo') && <button  className='btn btn-primary' onClick={() => this.setVisible('moreinfo')}><Info size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;More Info</button>
                        }&nbsp;
                    </form>
                </div>
                {this.isVisible('mnemonic') && <div className="card-block">
                    <div className='card-text'><b>Mnemonic Type</b> <span>{question.mnemonic_technique}</span></div>
                    <div className='card-text'><b>Mnemonic</b> <span>{question.mnemonic}</span></div>
                </div>}
                {this.isVisible('answer') && question.answer && <div className="card-block">
                    <div className='card-text'><b>Answer</b> <span>{question.answer}</span></div>
                </div>}
                <div className="card-block">
                    {!this.isVisible('moreinfo') && <img className="" src={image} alt={header}  style={{width:"70%"}} /> }
                    {this.isVisible('moreinfo') && <iframe src={link} style={{width:"98%", height: "1200px", border: "0px"}}/> }
            
                </div>
                
            </div>
   
          
          
            )
          
        }
        return null
        
        
    };
}

