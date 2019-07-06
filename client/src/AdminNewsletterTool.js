import React, { Component } from 'react';
import 'whatwg-fetch'
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
//import RichTextEditor from 'react-rte';
import {debounce} from 'throttle-debounce';

import ReactQuill from 'react-quill'; // ES6
import 'react-quill/dist/quill.snow.css'; // ES6

// RTE FORMAT
let modules = {
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
       
        this.saveTimer = null;
        this.initialContent = '<div>'+initialContent+'</div>'

		this.state = {
			value: initialContent,
			showPreview:false,
			isFinished: false,
			totalSubscribers: 0,
			publishKey:'',
			newsletters:[],
			goto: null,  // redirect
			currentNewsletter:{content:initialContent},
			waiting: false,
			sending: false
		}
		this.onChange = this.onChange.bind(this)
		this.startWaiting = this.startWaiting.bind(this)
		this.stopWaiting = this.stopWaiting.bind(this)
		
		this.showPreview = this.showPreview.bind(this)
		this.hidePreview = this.hidePreview.bind(this)
		this.sendNewsletter = this.sendNewsletter.bind(this)
		this.reallySendNewsletter = this.reallySendNewsletter.bind(this)
		//this.loadSubscribers = this.loadSubscribers.bind(this)
		this.finishNewsletter = this.finishNewsletter.bind(this)
		this.newNewsletter = this.newNewsletter.bind(this)
		this.saveNewsletter = this.saveNewsletter.bind(this)
		this.deleteNewsletter = this.deleteNewsletter.bind(this)
		this.loadNewsletters = this.loadNewsletters.bind(this)
		this.startSending = this.startSending.bind(this)
		this.stopSending = this.stopSending.bind(this)
	
	};
	
	
	componentDidMount() {
		this.loadNewsletters();
	//	this.loadSubscribers();
	}
	
	componentDidUpdate(props,state) {
		console.log(['ATUPDATE'])
		if (props.user != this.props.user || (this.props.match && this.props.match.params && props.params && props.params.match && this.props.match.params.id != props.params.match.id)) {
		//	this.loadSubscribers();
			this.loadNewsletters();
		}
		
	}
	
    
	loadNewsletters() {
		let that = this;
	//	console.log(['ATLOADNS',this.props.match])
		//this.startWaiting()
		fetch("/api/newsletters").then(function(response) {
			return response.json()
		}).then(function(json) {
			console.log(['LOADED news',json,that.props.match && that.props.match.params ? that.props.match.params : 'no id' ])
			//that.startWaiting()
			that.setState({newsletters: json});
			
			if (that.props.match && that.props.match.params && that.props.match.params.id && that.props.match.params.id.length > 0  ) {
			console.log(['find single news',json,that.props.match && that.props.match.params ? that.props.match.params.id : '' ])
				json.map(function(newsletter) {
					if (newsletter._id === that.props.match.params.id) {
						that.setState({currentNewsletter: newsletter});
						console.log(['found single news'])
			
					}
				})
			}
			
		})
	}

	//loadSubscribers() {
		//let that = this;
		//fetch("/api/newslettersubscribers).then(function(response) {
			//return response.json()
		//}).then(function(json) {
			//console.log(['LOADED SUBS',json])
			//that.setState({publishKey:json.publishKey ,subscribers: json.subscribers});
		//})
			
			//;
	//}

	  onChange(value) {
		let that = this;
		//this.setState({isTested:false})
		let currentNewsletter = this.state.currentNewsletter
		currentNewsletter = currentNewsletter;
		currentNewsletter.content = value;
		this.setState({currentNewsletter:currentNewsletter});
		if (this.saveTimer) clearTimeout(this.saveTimer)
		this.saveTimer = setTimeout(that.saveNewsletter,1000);
	  };
	  
	  
	  showPreview() {
		  this.setState({showPreview:true})		  
	  }
	  
	  hidePreview() {
		  this.setState({showPreview:false})
	  }
	  
	  startSending() {
		  let that = this;
		  console.log('START SENDING')
		  if (this.sendInterval) clearInterval(this.sendInterval);
		  this.sendInterval = setInterval(function() {
		  console.log('STATUS UPDATES START')
			fetch("/api/newslettersend",{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({})}).then(function(response) {
				return response.json()
			}).then(function(json) {
				console.log('STATUS UPDATES DONE',json)
				if (json.newsletters) {
					that.setState({newsletters:json.newsletters});
				}
				if (json.finished) {
					that.stopSending()
				}
				console.log(['newsletter send request complete ',json])
			})
		  
		  },1000);
		  this.setState({sending:true})		  
	  }
	  
	  stopSending() {
		  if (this.sendInterval) clearInterval(this.sendInterval);
		  this.setState({sending:false})
	  }
	  
	  
	  editNewsletter(newsletter) {
		  this.setState({currentNewsletter:newsletter})
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
	
	startWaiting() {
		this.setState({waiting:true})
	}
	stopWaiting() {
		this.setState({waiting:false})
	}

	sendTestNewsletter() {
		let that = this;
		this.startWaiting();
		fetch('/api/sendtestnewsletter', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({userEmail:(this.props.user ? this.props.user.username : ''),user:(this.props.user ? this.props.user._id : ''),content:this.state.currentNewsletter ? this.state.currentNewsletter.content : null,publishKey : this.state.currentNewsletter ? this.state.currentNewsletter.publishKey : null,id: this.state.currentNewsletter ? this.state.currentNewsletter._id : null})
		}).then(function(response) {
				return response.json()
		}).then(function(json) {
			that.stopWaiting();
			 fetch('/api/newslettersubscribers').then(function(response) {
				return response.json()
			  }).then(function(results) {
				console.log('sub res')
				console.log(results)
				if (results) {
					that.setState({totalSubscribers:results.total > 0 ? results.total : 0})
					that.setState({isTested:true})
					console.log(['test newsletter sent',json])
				}
			})
		
		});
	}

	reallySendNewsletter(isTest,content) {
		let that = this;
		this.startWaiting()
		fetch('/api/publishnewsletter', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify({isTest:isTest,userEmail:(this.props.user ? this.props.user.username : ''),user:(this.props.user ? this.props.user._id : ''),publishKey : this.state.currentNewsletter ? this.state.currentNewsletter.publishKey : null,id: this.state.currentNewsletter ? this.state.currentNewsletter._id : null})
		}).then(function(response) {
				return response.json()
		}).then(function(json) {
			that.stopWaiting()
			console.log(['newsletter sent',json])
			if (!isTest && json.ok === true) that.finishNewsletter(json.sentTo)
		});
		
		
	}
	
	finishNewsletter(tally) {
		this.goto('/newslettertool')
		//this.setState({isFinished:true, sentTo:tally});
	}
	
	newNewsletter() {
		let that = this;
		
		fetch("/api/savenewsletter",{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify({content:that.initialContent})
         }).then(function(response) {
			return response.json()
		}).then(function(json) {
			console.log(['LOADED SUBS',json])
			if (json && json._id) that.goto('/newslettertool/'+json._id);
		})
	}
	
	goto(link) {
		this.setState({goto:link})
	}
	
	saveNewsletter(newsletter) {
		let that = this;
		if (!newsletter) newsletter = that.state.currentNewsletter;
		fetch("/api/savenewsletter",{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify(newsletter)}).then(function(response) {
			return response.json()
		}).then(function(json) {
			console.log(['saved newsletter',json])
		})
	}
	
	deleteNewsletter(newsletter) {
		confirmAlert({
		  title: 'Delete Newsletter',
		  message: 'Are you sure you want to to delete this newsletter ?',
		  buttons: [
			{
			  label: 'Yes',
			  onClick: () => {this.reallyDeleteNewsletter(newsletter)}
			},
			{
			  label: 'No',
			  onClick: () => {}
			}
		  ]
		})
	
	}
	reallyDeleteNewsletter(newsletter) {
		let that = this;
		fetch("/api/savenewsletter",{method: 'POST',headers: {'Content-Type': 'application/json'},body: JSON.stringify(Object.assign(newsletter,{deleted:"TRUE"}))}).then(function(response) {
			return response.json()
		}).then(function(json) {
			console.log(['saved newsletter',json])
			that.loadNewsletters();
		})
	}
	
	
	render () {
		let that = this;
		if (this.props.isAdmin()) {
			if (this.state.goto && this.state.goto.length > 0) {
				return <Redirect to={this.state.goto} />
			} 
			
			let buttonBlockStyle={float:'right', marginLeft: '0.2em'}
			// RENDER ONE OF - NEWSLETTER LIST, NEWSLETTER EDITOR, NEWSLETTER PREVIEW
			if (this.state.currentNewsletter && this.state.currentNewsletter._id) {
			//	if (this.state.isFinished) {
					//return <div>
					//<h3>Newsletter Sent</h3>
					//<div>Woohoo !!  Your newsletter was queued for {this.state.sentTo} people.</div>
					//<Link to="/newslettertool" className='btn btn-success' style={{marginRight:'1em'}} >Start the Queue </Link>
					//</div>
				//} else 
				if (this.state.showPreview) {
					let replaceString = this.state.currentNewsletter.content;
					if (this.props.user) {
						replaceString = this.state.currentNewsletter.content.replace(':::USER:::',(this.props.user && this.props.user.name ? this.props.user.name : this.props.user.avatar))
					}
					let preview = <div dangerouslySetInnerHTML={{__html:replaceString}} ></div>
					
					return (
						<div>
							<div style={buttonBlockStyle}>
								<button onClick={this.hidePreview} className='btn btn-info' >Edit</button>
								<button onClick={(e) => this.sendTestNewsletter()} className='btn btn-warning' >Test</button>
								{this.state.waiting && <img src='/loading.gif' style={{height: '3em'}}/>}
								{this.state.isTested && <span><button onClick={(e) => this.sendNewsletter(false)} className='btn btn-success' >Send to {this.state.totalSubscribers} Subscribers </button></span>}
							</div>
							<h3><Link to="/newslettertool" className='btn btn-danger' style={{marginRight:'1em'}} >Close </Link>Newsletter Preview</h3>
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
							<h3><Link to="/newslettertool" className='btn btn-danger'  style={{marginRight:'1em'}}  >Close </Link> Write Your Newsletter</h3>
							<ReactQuill modules={modules} formats={formats} theme="snow" style={{marginBottom:'3em', border:'1px solid black'}} value={this.state.currentNewsletter.content}
							onChange={this.onChange} />
							
							
						</div>
					
					);
				}
			// 	LIST NEWSLETTERS	
			} else {
				let rendered = this.state.newsletters ? this.state.newsletters.map(function(newsletter,newsletterKey) {
					let editLink = "/newslettertool/"+newsletter._id;
					function formatDate(date) { 
						let current_datetime = new Date(date)
						let formatted = date ? current_datetime.getDate() + "/" + (current_datetime.getMonth() + 1) + "/" + current_datetime.getFullYear() + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes() + ":" + current_datetime.getSeconds() : '' 
						return <span style={{marginRight:'1em'}}>{formatted}</span>
					}
					return <tr key={newsletterKey}>
						<td>{formatDate(newsletter.createDate)}</td>
						<td>{formatDate(newsletter.updatedDate)}</td>
						<td>{formatDate(newsletter.sentDate)}</td>
						<td>{newsletter.status}</td>
						<td>{newsletter.subscribers ? newsletter.subscribers.length : 0}</td>
						<td>{newsletter.toSend ? newsletter.toSend.length : 0}</td>
						<td>{newsletter.sentTo ? newsletter.sentTo.length : 0}</td>
						<td>{newsletter.pingedBy ? newsletter.pingedBy.length : 0}</td>
						
						<td>{newsletter.status === "new" && <Link to={editLink} className='btn btn-info' >Edit</Link>}</td>
						<td>{newsletter.status !== "active" && <button onClick={(e) => that.deleteNewsletter(newsletter)} className='btn btn-danger' >Delete</button>}</td>
					
					
					</tr>
					
				}) : null;
				
				let startStopButtons = <span style={{float:'right'}}>{!this.state.sending && <button onClick={this.startSending} className="btn btn-success"   >Start</button>}{this.state.sending && <button onClick={this.stopSending} className="btn btn-danger"   >Stop</button>}{this.state.waiting && <img src='/loading.gif' style={{height: '3em'}}/>}
								</span>
				
				return <div><h3>Recent Newsletters</h3><button onClick={this.newNewsletter} className="btn btn-success"   >New</button>{startStopButtons}<table><tbody>{this.state.newsletters.length > 0 && <tr key='headerrow' ><th>Created</th><th>Updated</th><th>Sent Date</th><th>Status</th><th>Subscribers</th><th>Pending</th><th>Sent</th><th>Sent</th><th></th></tr>}{rendered}</tbody></table></div>
			}
			
			
			
			
		} else {
			return <b>No Access</b>
		}
	}

}
          
       
