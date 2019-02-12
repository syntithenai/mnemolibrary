/* eslint-disable */ 
import React, { Component } from 'react';

import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'


export default  class TopicPassword extends Component {
	
	constructor(props) {
        super(props);
        this.state={
			topicpassword:''
        };  
        this.props = props;
        this.saveUser = this.saveUser.bind(this)
        this.continueToTopic = this.continueToTopic.bind(this) 
        this.setTopicPasswordEvent = this.setTopicPasswordEvent.bind(this)
    };
    
    componentDidMount() {
		let that = this;
		 console.log(['topic pw DID mount',that.props.match.params.topic,that.props.user])
        
        if (that.props.match.params.topic && that.props.user && that.props.user.topicPasswords && that.props.user.topicPasswords.hasOwnProperty(that.props.match.params.topic)  && that.props.user.topicPasswords[that.props.match.params.topic].length > 0) {
			// already entered password
			that.setState({'exitRedirect':'/discover/topic/'+that.props.match.params.topic+(that.props.match.params.topicquestion ? '/'+that.props.match.params.topicquestion : '')})
		}
    }
    componentDidUpdate() {
		let that = this;
		 console.log(['topic pw DID update',that.props.match.params.topic,that.props.user])
        
        if (that.props.match.params.topic && that.props.user && that.props.user.topicPasswords && that.props.user.topicPasswords.hasOwnProperty(that.props.match.params.topic)  && that.props.user.topicPasswords[that.props.match.params.topic].length > 0) {
			// already entered password
			that.setState({'exitRedirect':'/discover/topic/'+that.props.match.params.topic+(that.props.match.params.topicquestion ? '/'+that.props.match.params.topicquestion : '')})
		}
    }
    continueToTopic(e) {
		let that = this;
		if (e) e.preventDefault();
		console.log(['CONTINUE TO TOPIC',that.props.match.params.topic,this.props.user.topicPasswords])
		// save password to user record
		this.checkPassword(that.props.match.params.topic,this.state.topicpassword).then(function() {
			that.saveUser().then(function() {
				// redirect
				that.setState({'exitRedirect':'/discover/topic/'+that.props.match.params.topic+(that.props.match.params.topicquestion ? '/'+that.props.match.params.topicquestion : '')})
			});			
		}).catch(function(e) {
			that.setState({'warning_message':"Sorry, that's not the password I'm looking for."})
		});			
	
		
	}
	
	 saveUser() {
        var that = this;
        that.setState({'warning_message':''});
        console.log('save user ',this.props.match,this.props.user);
        var user = this.props.user;
        if (this.props.match.params.topic) {
			if (!user.topicPasswords) user.topicPasswords = {};
            user.topicPasswords[this.props.match.params.topic] = this.state.topicpassword; 
		}
		let newUser={_id:user._id,topicPasswords:user.topicPasswords}
        return this.props.saveUser(newUser,this);  
            
    };
    
    checkPassword(topic,password) {
		return new Promise(function(resolve,reject) { 
			
			fetch("/api/checktopicpassword", {
			   method: "POST",
			   headers: {
				"Content-Type": "application/json"
				},
			  body: JSON.stringify({topic:topic,password:password})
			}).then(function(response) {
				return response.json();
			}).then(function(result) {
console.log('CHECKPW');
console.log(result);				
				if (result.passwordOK) {
					resolve()
				} else {
					reject();
				}
			})
			.catch(function(err) {
				console.log(['ERR',err]);
				reject();
			});
		});
	}
    
	setTopicPasswordEvent(e) {
		let pw = e.target.value ? e.target.value : '';
		this.setState({'topicpassword':pw})
	}
	
    render() {
		if (this.props.user) {
		   if (this.state.exitRedirect && this.state.exitRedirect.length > 0) {
				return <Redirect to={this.state.exitRedirect} />
			} else {
				
			   return  <form className="form-access">
			  <h1 className="h3 mb-3 font-weight-normal">Access Restricted</h1>
			 {(this.state.warning_message && this.state.warning_message.length  > 0) && <div style={{color:'red'}}>{this.state.warning_message}</div>}
			  <div>To access the topic {this.props.match.params.topic}, enter a password below.
			  </div>
			  <label htmlFor="inputPassword" className="sr-only">Password</label>
			  <input  autoComplete='off' type="password" value={this.state.topicpassword} onChange={this.setTopicPasswordEvent} id="inputPassword" className="form-control" placeholder="Password" required />
			  
			  <button className="btn  btn-primary btn-inline" onClick={this.continueToTopic} >Continue</button>
			  
			  <Link to="/"><button className="btn btn-primary btn-inline" type="submit">Cancel</button></Link>
			  
			</form>
		   }
		} else {
			return <a href="/login" className="btn btn-primary">Please login</a>
		}
    };
}
