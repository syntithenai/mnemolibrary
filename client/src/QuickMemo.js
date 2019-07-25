/* eslint-disable */ 
import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

export default class QuickMemo extends Component {
    
    constructor(props) {
		super(props)
		this.state = {
			redirect :null,
			saveForReview:{question:'',answer:'',mnemonic:''}
		}
		this.showMessage = this.showMessage.bind(this)
		this.hideMessage = this.hideMessage.bind(this)
		this.change = this.change.bind(this)
		this.saveQuickMemo = this.saveQuickMemo.bind(this)

		this.messageTimeout = null;
	}
    
    saveQuickMemo() {
		//return 
		let that = this;
		let record = this.state ? this.state.saveForReview : null
		if (record && this.props.user && this.props.user._id) {
			let quiz = 'QuickMemo'
			let d = new Date();
			let interrogative = 'QuickMemo '+ (d.getDate() > 9 ? '' : '0') + d.getDate()+"/"+(d.getMonth() > 8 ? '' : '0')+(d.getMonth()+1)+'/'+d.getUTCFullYear();
			let headlineFacts = {};
			if (record && record.question && record.question.length > 0 && record.answer && record.answer.length > 0) {
				console.log(['send review',that.state.saveForReview])
					fetch('/api/importquestion', {
					  method: 'POST',
					  headers: {
						'Content-Type': 'application/json'
					  },
					  body: JSON.stringify({quiz:quiz,user:(that.props.user ? that.props.user._id : null),access:(that.props.user ? that.props.user._id : null),prefix:interrogative,question:record.question,answer:record.answer,mnemonic:record.mnemonic, importtype:'quickmemo',importId:'quickmemo', difficulty:1,link:record.link})
					}).then(function() {
						that.showMessage('Saved for review',1000,'/sitemap')
						
					});
				
			} else {
				console.log(['sendmnem q mis'])
				that.showMessage('You must enter a question and answer for this memo.')
			}
		}
	}
    
    
    /**
	 * Set a message to flash to the user, then hide it after 3s
	 */
	showMessage(message,timeout,redirect) {
		let that = this;
		if (this.messageTimeout) clearTimeout(this.messageTimeout)
		setTimeout(function() {
			that.hideMessage()
			if (redirect && redirect.length > 0) {
				that.setState({redirect:redirect})
			}
		},(timeout > 0 ? timeout : 3000))
		this.setState({message:message}) 
	}
	
	/**
	 * Hide user flash message
	 */
	hideMessage() {
		this.setState({message:null})
		
	}
	
    change(e) {
        let state = this.state.saveForReview;
        var key = e.target.name;
        state[key] =  e.target.value;
        this.setState({saveForReview:state});
        return false;
    };
    
    render() {
    	let that = this;
    	let taStyle={minHeight:'10em'};
		
		if (this.state.redirect && this.state.redirect.length > 0) {
			return <Redirect to={this.state.redirect} />
		}
		
		return <div style={{marginLeft:'1em'}} id="quickmemo" >
			{this.state.message && <b style={{position:'fixed',top:'7em',left:'50%',backgroundColor:'pink',border:'1px solid black',color:'black',padding:'0.8em'}}>{this.state.message}</b>}
			
			<div style={{float:'right'}} >
				<button onClick={that.saveQuickMemo} className='btn btn-success'>Save</button>
				<Link to="/sitemap" className='btn btn-danger' >Cancel</Link>
			</div>
			
			<h3>Add a Private Memo</h3>
			<form onSubmit={this.saveQuickMemo} >
			<b>* Required</b>
			<div className="form-group row">
				<label  className="col-12" >Question * <input onChange={this.change} name="question" className="form-control form-control-lg" type='text' value={this.state.saveForReview.question} /></label>
			</div>
			
			<div className="form-group row">
				<label  className="col-12" >Answer * <textarea style={taStyle} onChange={this.change} name="answer"  type='text' className="form-control form-control-lg" value={this.state.saveForReview.answer}></textarea></label>
			</div>
				
			<div className="form-group row">
				 <label  className="col-12" >
				 &nbsp;&nbsp;&nbsp; Memory Aid 
					
				<textarea style={taStyle}   onChange={this.change} name="mnemonic"  type='text' className="form-control form-control-lg" value={this.state.saveForReview.mnemonic} ></textarea></label>
			</div>
			
			<div className="form-group row">
				<label  className="col-12" >Link <input onChange={this.change} name="link" className="form-control form-control-lg" type='text' value={this.state.saveForReview.link} /></label>
			</div>
			</form>
		</div>
    }
}
