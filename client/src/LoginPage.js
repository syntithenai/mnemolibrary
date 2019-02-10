import React, { Component } from 'react';
//import 'whatwg-fetch'
import GoogleLogin from './GoogleLogin'
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import mustache  from 'mustache';
const config=require('../../config');
//const utils=require('../../auth_utils');
var faker = require('faker');
            

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
            forgotPassword: false,
            avatar: faker.commerce.productAdjective()+faker.name.firstName()
            
        }
        this.change = this.change.bind(this);
        this.submitSignUp = this.submitSignUp.bind(this);
        this.submitSignIn = this.submitSignIn.bind(this);
        this.googleLogin = this.googleLogin.bind(this);
        this.forgotPassword = this.forgotPassword.bind(this);
        this.unforgotPassword = this.unforgotPassword.bind(this);
        this.recoverPassword = this.recoverPassword.bind(this);
        this.props.analyticsEvent('login page');
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
       // //console.log(['recover',this.state.email]);
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
       ////console.log(['recover request with JSON response', data])
        that.setState(data); 
      }).catch(function(error) {
        //console.log(['request failed', error])
      });
        return false;
    };

    forgotPassword(e) {
        e.preventDefault();
        this.setState({forgotPassword: true});
        return false;
    };
    unforgotPassword(e) {
        e.preventDefault();
        this.setState({forgotPassword: false});
        return false;
    };

    parseJSON(response) {
      return response.json()
    }
    googleLogin(user) {
     //   let that=this;
        ////console.log(['glogin ',user]);
        fetch('/login/googlesignin', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: user.email,
            name: user.name
          })
        })
        //.then(this.checkStatus)
      .then(this.parseJSON)
      .then(function(data) {
        //    //console.log(['gsignin request with JSON response', data])
           if (data.code && data.code.length > 0) {
              window.location='/?code='+data.code;
             // that.postToUrl('/',{code:data.code},'POST');
           }
        });
    };
    
    postToUrl(path, params, method) {
        method = method || "post";

        var form = document.createElement("form");
        form.setAttribute("method", method);
        form.setAttribute("action", path);

        for(var key in params) {
            if(params.hasOwnProperty(key)) {
                var hiddenField = document.createElement("input");
                hiddenField.setAttribute("type", "hidden");
                hiddenField.setAttribute("name", key);
                hiddenField.setAttribute("value", params[key]);

                form.appendChild(hiddenField);
             }
        }

        document.body.appendChild(form);
        form.submit();
    }
    
    submitSignIn(e) {
        var that=this;
        e.preventDefault();
        this.setState({'warning_message':''});
       
        ////console.log(this.state);
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
       ////console.log(['signin request with JSON response', data])
       
       if (data.code && data.code.length > 0) {
         // that.postToUrl('/',{code:data.code},'POST');
          window.location='/?code='+data.code;
       } else if (data._id && data._id.length > 0) {
         //   //console.log(['login at signin',data]);
            that.setState(data); 
            that.props.login(data);
            
        } else {
            that.setState(data); 
        }
        
      }).catch(function(error) {
        ////console.log(['request failed', error])
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
            avatar: this.state.avatar,
            username: this.state.email,
            password: this.state.password,
            password2: this.state.password2,
          })
        })
        .then(this.checkStatus)
      .then(this.parseJSON)
      .then(function(data) {
       // //console.log(['signup  request with JSON response', data])
        if (data._id && data._id.length > 0) {
            that.setState({justSignedUp: true, warning_message:data.warning_message});            
        } else {
            that.setState({warning_message:data.warning_message});            
        }
      }).catch(function(error) {
        //console.log(['request failed', error]);
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
                    <br/>
                    <b>! If the message doesn't arrive, check your spam folder</b>
                                    
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
                            <label htmlFor="email" className='row'>Email </label><input  autocomplete='off'  id="email" type='email' name='email' onChange={this.change} />
                            <label htmlFor="password" className='row'>Password</label> <input  autoComplete="off"  id="password" type='password' name='password' onChange={this.change} />
                            <label htmlFor="password2" className='row'>Repeat Password</label><input  autoComplete="off"  id="password2" type='password' name='password2' onChange={this.change} />
                            <br/>
                            <br/>
                            <button  className='btn btn-info'>Send</button>
                            <button onClick={this.unforgotPassword} className='btn btn-info'>Cancel</button>
                        </fieldset>
                    </form>
                </div>
                )
        } else {
            if (this.props.isLoggedIn()) {
                 return <Redirect to="/profile" />
            } else {
                return (
                    <div  style={{width: '100%'}}>
                        <div className='warning-message'>{this.state.warning_message}</div>
                        <div style={{paddingLeft:'1em'}} >
                        
                            <h3 className="card-title">Login</h3> 
                            <a className="btn btn-info" style={{float:'right' }} href="#register_form" >I'm a new user</a>
                            <div className="" style={{fontWeight:'bold',fontSize:'large'}} >To track your progress and see graphs and feedback to guide your learning, you need to sign in to the website.</div>
                            <div className="" style={{fontWeight:'bold',fontSize:'large'}} >By logging into Mnemo's Library, you are agreeing to our <a href="/help/termsofuse" style={{textDecoration:'underline',color: 'blue', paddingLeft:'0.3em'}}  > terms and conditions</a><br/><br/></div>
                           <span style={{float:'right'}}><GoogleLogin 
                                clientId={config.googleClientId}
                                onSuccess={this.googleLogin}
                           /></span>
                           <div id="register_form" style={{paddingLeft: '2em'}}>
                                <form method="POST" onSubmit={this.submitSignIn} className="form-group">
                                    <div className='warning-message'>{this.state.signin_warning_message}</div>
                            
                                    <label htmlFor="email_login" className="row">Email </label><input  autoComplete='falselogin' id="email_login" type='email' name='email_login'   onChange={this.change} value={this.state.email_login}  autoComplete="false"  />
                                    <label htmlFor="password_login" className="row">Password </label><input  autoComplete='falsepass' id="password_login" type='password' name='password_login'  onChange={this.change} value={this.state.password_login}  autoComplete="false"  />
                                    <br/><br/>
                                    <button  className='btn btn-info'>Login</button>
                                    <button onClick={this.forgotPassword} className='btn btn-info'>Forgot Password</button>
                                </form>
                            </div>
                        </div>
                        <div style={{paddingLeft:'1em'}} >
                           
                            <form method="POST"  autoComplete='false' onSubmit={this.submitSignUp}  >
                                  <h3 className="card-title">Registration</h3>
                                  <div className='col-12 warning-message'>{this.state.signup_warning_message}</div>
                                    <div className="form-group">
                                        <label htmlFor="name" >Name </label><input  className='form-control' autoComplete="falsename" id="name" type='text' name='name' onChange={this.change} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="avatar" className='row'>Avatar </label><input autoComplete="falseavatar"  className='form-control'  id="avatar" type='text' name='avatar' value={this.state.avatar} onChange={this.change} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="email" className='row'>Email </label><input  autoComplete="falseemail"  className='form-control'  id="email" type='email' name='email' onChange={this.change} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password" className='row'>Password</label> <input  autoComplete="falsepassword"  className='form-control'   id="password" type='password' name='password' onChange={this.change} />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="password2" className='row'>Repeat Password</label><input autoComplete="falsepassword2"   className='form-control'  autoComplete="false"  id="password2" type='password' name='password2' onChange={this.change} />
                                        
                                    </div>
                                    <br/>
                                    <br/>
                                    <button  className='btn btn-info'>Register</button>
                            </form>
                        </div>
                      
                    </div>
                )
                
            }
            //
                       
                          //<h3 className="card-title">Login</h3>
                        
                        //</form>
        }
    }


}
