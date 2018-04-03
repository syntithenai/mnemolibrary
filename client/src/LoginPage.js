import React, { Component } from 'react';
//import 'whatwg-fetch'
import GoogleLogin from './GoogleLogin'
//import mustache  from 'mustache';
const config=require('../../config');
//const utils=require('../../auth_utils');

export default class LoginPage extends Component {
    
    //render() {
        //return <iframe src="http://localhost:4000/login" style={{height: "40em", border: 0,  paddingLeft: '1em'}} />
    //};
    constructor(props) {
        super(props);
        this.state={
            warning_message:'',
            signin_warning_message:'',
            signup_warning_message:'',
            email_login:'',
            password_login:'',
            name:'',
            email:'',
            password:'',
            password2:'',
            justSignedUp: false,
            forgotPassword: false
        }
        this.change = this.change.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
        this.submitSignIn = this.submitSignIn.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.recoverPassword = this.recoverPassword.bind(this);
        
    };
    
    checkStatus(response) {
      if (response.status >= 200 && response.status < 300) {
        return response
      } else {
        var error = new Error(response.statusText)
        error.response = response
        throw error
      }
    }

    recoverPassword(e) {
        let that = this;
        e.preventDefault();
       // console.log(['recover',this.state.email]);
        fetch('/login/recover', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
            code: Math.random().toString(36).replace(/[^a-z]+/g, '')
          })
        }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(function(data) {
       //console.log(['recover request with JSON response', data])
        that.setState(data); 
      }).catch(function(error) {
        console.log(['request failed', error])
      });
        return false;
    };

    forgotPassword(e) {
        e.preventDefault();
        this.setState({forgotPassword: true});
        return false;
    };

    parseJSON(response) {
      return response.json()
    }
    googleLogin(user) {
        console.log(['glogin ',user]);
        fetch('/login/googlesignin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name
          })
        }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(function(data) {
        //    console.log(['gsignin request with JSON response', data])
           if (data.code && data.code.length > 0) {
              window.location='/?code='+data.code;
           }
        });
    };
    
    submitSignIn(e) {
        var that=this;
        e.preventDefault();
        this.setState({'warning_message':''});
       
        //console.log(this.state);
       fetch('/login/signin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username: this.state.email_login,
            password: this.state.password_login,
          })
        }).then(this.checkStatus)
      .then(this.parseJSON)
      .then(function(data) {
       //console.log(['signin request with JSON response', data])
       
       if (data.code && data.code.length > 0) {
          window.location='/?code='+data.code;
       } else if (data._id && data._id.length > 0) {
         //   console.log(['login at signin',data]);
            that.setState(data); 
            that.props.login(data);
            
        }
        
      }).catch(function(error) {
        //console.log(['request failed', error])
      });
    };
    
    submitSignUp(e) {
       var that=this;
       e.preventDefault();
       this.setState({'warning_message':''});
       fetch('/login/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            name: this.state.name,
            username: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
          })
        })
        .then(this.checkStatus)
      .then(this.parseJSON)
      .then(function(data) {
       // console.log(['signup  request with JSON response', data])
        if (data._id && data._id.length > 0) {
            that.setState({justSignedUp: true, warning_message:data.warning_message});            
        }
      }).catch(function(error) {
        console.log(['request failed', error]);
      });
    };
    
    change(e) {
        var state = {};
        state[e.target.name] =  e.target.value;
        this.setState(state);
        return true;
    };
    
    render() { //req,vars/
        if (this.state.justSignedUp) {
             return (
                <div className="row">
                     <h3 className="col-12 card-title">Signed Up</h3>
                     
                    <div className='col-12 warning-message'>Check your email for a link to confirm your registration.</div>
                </div>
                )
        } else if (this.state.forgotPassword) {
             return (
                <div className="row">
                     <form method="POST" onSubmit={this.recoverPassword} className="form-group" >
                        <h3 className="col-12 card-title">Password Recovery</h3>
                        <div className='col-12 warning-message'>{this.state.warning_message}</div>
                    
                        <div className='col-12'>Type your new password below and we will send an email to help you login.</div>
                        <fieldset className='col-12' >
                            <label htmlFor="email" className='row'>Email </label><input autoComplete="false" id="email" type='text' name='email' onChange={this.change} />
                            <label htmlFor="password" className='row'>Password</label> <input  autoComplete="false"  id="password" type='password' name='password' onChange={this.change} />
                            <label htmlFor="password2" className='row'>Repeat Password</label><input  autoComplete="false"  id="password2" type='password' name='password2' onChange={this.change} />
                            <br/>
                            <br/>
                            <button  className='btn btn-info'>Send</button>
                        </fieldset>
                    </form>
                </div>
                )
        } else {
            
            return (
                <div className="row">
                    <div className='col-12 warning-message'>{this.state.warning_message}</div>
                    <div className="col-6 card">
                        <form method="POST" onSubmit={this.submitSignIn} className="form-group">
                          <h3 className="card-title">Sign In</h3>
                          <GoogleLogin 
                                clientId={config.googleClientId}
                                onSuccess={this.googleLogin}
                           />
                          <div className='col-12 warning-message'>{this.state.signin_warning_message}</div>
                    
                            <label htmlFor="email_login" className="row">Email </label><input id="email_login" type='text' name='email_login'   onChange={this.change} value={this.state.email_login}  autoComplete="false"  />
                            <label htmlFor="password_login" className="row">Password </label><input id="password_login" type='password' name='password_login'  onChange={this.change} value={this.state.password_login}  autoComplete="false"  />
                            <br/><br/>
                           <button  className='btn btn-info'>Sign In</button>
                           <button onClick={this.forgotPassword} className='btn btn-info'>Forgot</button>
                           
                        </form>
                    </div>
                    <div className="col-6  card">
                        <form method="POST" onSubmit={this.submitSignUp} className="form-group" >
                          <h3 className="card-title">Sign Up</h3>
                          <div className='col-12 warning-message'>{this.state.signup_warning_message}</div>
                    
                            <label htmlFor="name" className='row'>Name </label><input autoComplete="false" id="name" type='text' name='name' onChange={this.change} />
                            <label htmlFor="email" className='row'>Email </label><input autoComplete="false" id="email" type='text' name='email' onChange={this.change} />
                            <label htmlFor="password" className='row'>Password</label> <input  autoComplete="false"  id="password" type='password' name='password' onChange={this.change} />
                            <label htmlFor="password2" className='row'>Repeat Password</label><input  autoComplete="false"  id="password2" type='password' name='password2' onChange={this.change} />
                            <br/>
                            <br/>
                            <button  className='btn btn-info'>Sign Up</button>
                        </form>
                        <br/>
                    </div>
                </div>
            )
        }
    }
    

}
