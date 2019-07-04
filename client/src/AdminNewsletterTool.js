import React, { Component } from 'react';
import 'whatwg-fetch'
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
//import RichTextEditor from 'react-rte';

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

export default class AdminNewsletterTool extends Component {

    constructor(props) {
        super(props);
        let initialContent = '';
        initialContent += '<div  ><img style="float:right" src="https://mnemolibrary.com/mnemoicon-100.png"></div>'
        initialContent += '<div style="color:red" >Dear :::USER::: </div>'
        initialContent += '<br/><br/><a href=":::LINK:::/review/:::CODE:::">Revise questions from your review list</a>'
        initialContent += '<br/><a href=":::LINK:::/multiplechoicetopics/:::CODE:::">Try a multiple choice quiz</a>'
        initialContent += '<br/><a href=":::LINK:::/recentcomments/:::CODE:::">Join the conversation</a>'
         initialContent += '<br/><br/>If you don\'t want to receive these emails.  <a href=":::LINK:::/settings/:::CODE:::">Update your settings</a>'
       
        
        initialContent = '<div>'+initialContent+'</div>'

		this.state = {
			value: initialContent,
			showPreview:false,
			isFinished: false,
			totalSubscribers: 0,
			publishKey:''
		}
		this.onChange = this.onChange.bind(this)
		
		this.showPreview = this.showPreview.bind(this)
		this.hidePreview = this.hidePreview.bind(this)
		this.sendNewsletter = this.sendNewsletter.bind(this)
		this.reallySendNewsletter = this.reallySendNewsletter.bind(this)
		this.loadSubscribers = this.loadSubscribers.bind(this)
		this.finishNewsletter = this.finishNewsletter.bind(this)
	
	};
	
	
	componentDidMount() {
		this.loadSubscribers();
	}
	
	componentDidUpdate(props,state) {
		if (props.user != this.props.user) {
			this.loadSubscribers();
		}
		
	}
	
    loadSubscribers() {
		let that = this;
		fetch("/api/subscribers?user="+(this.props.user ? this.props.user._id : '')).then(function(response) {
			return response.json()
		}).then(function(json) {
			console.log(['LOADED SUBS',json])
			that.setState({publishKey:json.publishKey ,totalSubscribers: json.total});
		})
			
			;
	}

	  onChange = (value) => {
		//this.setState({isTested:false})

		this.setState({value});
		if (this.props.onChange) {
		  // Send the changes up to the parent component as an HTML string.
		  // This is here to demonstrate using `.toString()` but in a real app it
		  // would be better to avoid generating a string on each change.
		  this.props.onChange(
			
			value.toString('html')
		  );
		}
	  };
	  
	  
	  showPreview() {
		  this.setState({showPreview:true})		  
	  }
	  
	  hidePreview() {
		  this.setState({showPreview:false})
	  }
	  

	sendNewsletter(isTest) {
		if (isTest) {
			this.setState({isTested:true})
		}
		console.log(['SEND NEWSLETTER',this.state.value])
		if (isTest) {
			this.reallySendNewsletter(isTest,this.state.value)
		} else {
			confirmAlert({
			  title: 'Send Your Newsletter',
			  message: 'Are you sure you want to to send this newsletter to '+this.state.totalSubscribers+' people ?',
			  buttons: [
				{
				  label: 'Yes',
				  onClick: () => {this.reallySendNewsletter(isTest,this.state.value)}
				},
				{
				  label: 'No',
				  onClick: () => {}
				}
			  ]
			})
		}
	}

	reallySendNewsletter(isTest,content) {
		let that = this;
		
		fetch('/api/publishnewsletter', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({isTest:isTest,userEmail:(this.props.user ? this.props.user.username : ''),user:(this.props.user ? this.props.user._id : ''),content:content,publishKey : this.state.publishKey})
		}).then(function(response) {
				return response.json()
		}).then(function(json) {
			console.log(['newsletter sent',json])
			if (!isTest && json.ok === true) that.finishNewsletter(json.sentTo)
		});
		
		
	}
	
	finishNewsletter(tally) {
		this.setState({isFinished:true, sentTo:tally});
	}
	
	render () {
		let modules = {
			 // #toolbar: '#toolbar',
			  //'history': {          // Enable with custom configurations
				  //'delay': 2500,
				  //'userOnly': true
				//},
				//'syntax': true     
			  toolbar: [
			  [{ 'header': [1, 2, false] }],
			  ['bold', 'italic', 'underline','strike', 'blockquote'],
			  [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
			  ['link', 'image'],
			  ['clean']
			],
		  }

		let  formats = [
			'header',
			'bold', 'italic', 'underline', 'strike', 'blockquote',
			'list', 'bullet', 'indent',
			'link', 'image'
		  ]
		  let buttonBlockStyle={float:'right', marginLeft: '0.2em'}
		if (this.props.isAdmin()) {
			if (this.state.isFinished) {
				return <div>
				<h3>Newsletter Sent</h3>
				<div>Woohoo !!  Your newsletter was sent to {this.state.sentTo} people.</div>
				
				</div>
			} else if (this.state.showPreview) {
				
				let replaceString = this.state.value;
				if (this.props.user) {
					replaceString = this.state.value.replace(':::USER:::',(this.props.user && this.props.user.name ? this.props.user.name : this.props.user.avatar))
				}
				let preview = <div dangerouslySetInnerHTML={{__html:replaceString}} ></div>
				
				return (
					<div>
						<div style={buttonBlockStyle}>
							<button onClick={(e) => this.sendNewsletter(true)} className='btn btn-warning' >Test</button>
							{this.state.isTested && <span><button onClick={(e) => this.sendNewsletter(false)} className='btn btn-success' >Send to {this.state.totalSubscribers} Subscribers </button></span>}
						</div>
						<button onClick={this.hidePreview} className='btn btn-info' >Back</button>
						<h3>Newsletter Preview</h3>
						<hr style={{width:'100%', border: '1px solid black'}}/>
						{preview}
						
						
					</div>
					)
			} else {
				return (
					<div>
						<div style={buttonBlockStyle}>
							<button onClick={this.showPreview} className='btn btn-info' >Preview</button>
						</div>
						<h3>Write Your Newsletter</h3>
						<ReactQuill modules={modules} formats={formats} theme="snow" style={{marginBottom:'3em', border:'1px solid black'}} value={this.state.value}
						onChange={this.onChange} />
						
						
					</div>
				
				);
			}
		} else {
			return <b>No Access</b>
		}
	}

}
          
       
