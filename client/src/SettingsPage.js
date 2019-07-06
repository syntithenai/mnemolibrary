import React, { Component } from 'react';
import 'whatwg-fetch'
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

export default class SettingsPage extends Component {

    constructor(props) {
        super(props);
        this.saveUser = this.saveUser.bind(this)
        this.change = this.change.bind(this)
        this.state = {
			warning_message : '',
			user:{}
		}
    };
    
    componentDidMount() {
		if (this.props.user) this.setState({user:this.props.user})
	}   

    componentDidUpdate(props,state) {
		if (props.user !== this.props.user) {
			if (this.props.user) this.setState({user:this.props.user})
		}
	}   
      
    change(e) {
        let state = {...this.state.user};
        var key = e.target.name;
        if (e.target.name.startsWith('fake_')) {
            key = e.target.name.slice(5);
        }
        state[key] =  e.target.value;
       // //console.log(['CHANGE',state]);
        this.setState({'user':state});
        return true;
    };
    
	 
    saveUser(e) {
        if (e) e.preventDefault();
        var that = this;
        that.setState({'warning_message':''});
        ////console.log('save user ',this.state.user);
        var data = {
            '_id': this.state.user._id,
          }
          if (this.state.user.name)  data.name= this.state.user.name;
          if (this.state.user.avatar)  data.avatar= this.state.user.avatar;
          if (this.state.user.username)  data.username= this.state.user.username;  
          //if (this.state.user.difficulty) data.difficulty=this.state.user.difficulty
            
          if (this.state.user.password && this.state.user.password.length > 0 && this.state.user.password2 && this.state.user.password2.length > 0) {
            data.password= this.state.user.password
            data.password2= this.state.user.password2
            if (data.password !== data.password2) {
                that.setState({'warning_message':'Passwords do not match'});
                return;
            }
          }
          if (this.state.user.email_me) {
              data.email_me=this.state.user.email_me;
          }
          //if (this.state.streak) {
              //data.streak=this.state.streak;
          //}
          //if (this.state.recall) {
              //data.recall=this.state.recall;
          //}          
          return this.props.saveUser(data,this);  
            
    };
  
  
	render() {
		this.props.analyticsEvent('user settings');

		return (
			<div className="col-12">
			 <form method="POST" onSubmit={this.saveUser} className="form-group" autoComplete="false" >
				<div className='col-12 warning-message'>{this.state.warning_message}</div>
			
				  <a id="edit"></a>
				   <label htmlFor="name" className='row'>Name </label><input autoComplete="falsename" id="name" type='text' name='name' onChange={this.change} value={this.state.user.name} />
					<label htmlFor="avatar" className='row'>Avatar </label><input autoComplete="falseavatar" id="avatar" type='text' name='avatar' onChange={this.change} value={this.state.user.avatar} />
				
					<label htmlFor="username" className='row'>Email </label><input autoComplete="falseusername" id="username"  type='email' name='username' onChange={this.change} value={this.state.user.username}  />
					<label htmlFor="password" className='row'>Password</label> <input  autoComplete="falsepassword" id="password" type='password' name='fake_password' onChange={this.change}  value={this.state.user.password}  />
					<label htmlFor="password2" className='row'>Repeat Password</label><input  autoComplete="falsepassword2" id="password2" type='password' name='fake_password2' onChange={this.change} value={this.state.user.password2} />
					<input id="id" type='hidden' name='_id' value={this.state.user._id} />
					
					<label htmlFor="avatar" className='row'>Email Me </label><select autoComplete="email_me" id="email_me" type='text' name='email_me' onChange={this.change} value={this.state.user.email_me} >
						<option value="" >Newsletters AND Replies to my comments</option>
						<option value="comments" >Replies to my comments</option>
						<option value="none" >Never</option>
					</select>
						
					<br/>
					<br/>
					<button  className='btn btn-info'>Save</button>
				</form>
			</div>
			)
	}
}
