import React, { Component } from 'react';
import ActivityChart from './ActivityChart'
import TopicsChart from './TopicsChart'
import ProgressChart from './ProgressChart'
var config = require('../../config') 

export default class ProfilePage extends Component {
    
    constructor(props) {
        super(props);
        this.saveUser = this.saveUser.bind(this);
        this.change = this.change.bind(this);
        this.state = {
            warning_message: '',
            user : {
                _id: this.props.user._id?this.props.user._id:'',
                name:this.props.user.name?this.props.user.name:'',
                username:this.props.user.username?this.props.user.username:'',
                difficulty:this.props.user.difficulty?this.props.user.difficulty:'',
                avatar:this.props.user.avatar?this.props.user.avatar:'',
                password:this.props.user.password?this.props.user.password:'',
                password2:this.props.user.password2?this.props.user.password:'',
            },
    
        }
       // //console.log(['constr',this.state]);
    };

    
    saveUser(e) {
        e.preventDefault();
        var that = this;
        that.setState({'warning_message':''});
        ////console.log('save user ',this.state.user);
        var data = {
            '_id': this.state.user._id,
          }
          if (this.state.user.name)  data.name= this.state.user.name;
          if (this.state.user.avatar)  data.avatar= this.state.user.avatar;
          if (this.state.user.username)  data.username= this.state.user.username;  
          if (this.state.user.difficulty) data.difficulty=this.state.user.difficulty
            
          if (this.state.user.password && this.state.user.password.length > 0 && this.state.user.password2 && this.state.user.password2.length > 0) {
            data.password= this.state.user.password
            data.password2= this.state.user.password2
            if (data.password !== data.password2) {
                that.setState({'warning_message':'Passwords do not match'});
            } else {
                return;
            }
          }
          this.props.saveUser(data,this);  
            
    };
    
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
    
    allowAlexa(allow) {
        if (allow) {
            //console.log('allow');
            // redirect with auth code
            this.getCode();
            
        } else {
            //console.log('deny');
        }
        localStorage.setItem('oauth',null);
        localStorage.setItem('oauth_request',null);
        return true;
    };
    
    
    getCode() {
        //console.log('get code');
        let authRequest = localStorage.getItem('oauth_request');
        //console.log([authRequest,this.props.token,this.props.user]);
        if (this.props.token && this.props.user && authRequest) {
            let auth =JSON.parse(authRequest);
            if (!auth) auth={};
            var params={
                'response_type':'code',
                'client_id':config.clientId,
                'client_secret':config.clientSecret,
                'redirect_uri':auth.redirect_uri,
                'scope':auth.scope,
                'state':auth.state
              };
              //console.log(['pars',params]);
            fetch('/oauth/authorize', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Bearer '+this.props.token.access_token
                //Authorization: 'Basic '+btoa(config.clientId+":"+config.clientSecret) 
              },
              body: Object.keys(params).map(k => encodeURIComponent(k) + '=' + encodeURIComponent(params[k])).join('&')
            }).then(function(response) {
                //console.log('HEADERS',response.headers.location);
                
                return response.json();
                
            }).then(function(res) {
                //console.log(['getcode response',res]);
              
            })
            .catch(function(err) {
                //console.log(['ERR',err]);
            });
        }
  }
//            <a className='btn btn-info' onClick={() => this.allowAlexa.bind(this)(true)} >Yes</a>
    
    dumpalexa() {
        fetch('/api/dumpalexa', {});
    };
    
    render() { //req,vars/
        let oauth=localStorage.getItem('oauth');
        let authRequest = localStorage.getItem('oauth_request');
        //console.log([authRequest,this.props.token,this.props.user]);
        let auth =JSON.parse(authRequest);
        if (!auth) auth={};

        if (oauth==="alexa") {
            return (
            <div className='row'>
            <div className='col-12'><h4>Allow Alexa to integrate with Mnemo's Library ?</h4></div>
            
            <div className='col-4'>&nbsp;</div>
            <div className='col-2'><form action={config.authorizeUrl} method="POST">
            <input type='hidden' name='response_type'  value='code' />
            <input type='hidden' name='client_id'  value={config.clientId}/>
            <input type='hidden' name='client_secret'  value={config.clientSecret}/>
            <input type='hidden' name='redirect_uri'  value={auth.redirect_uri} />
            <input type='hidden' name='scope'  value={auth.scope}/>
            <input type='hidden' name='state'  value={auth.state}/>
            <input type='hidden' name='access_token'  value={this.props.token.access_token}/>
            <button type='submit' className='btn btn-info' onClick={() => this.allowAlexa.bind(this)(false)} >Yes</button>
            </form></div>
            <div className='col-2'><a className='btn btn-info' href='/' onClick={() => this.allowAlexa.bind(this)(false)} >No</a></div>
            <div className='col-4'>&nbsp;</div>
            </div>
            
            );
        } else {
            return (
            <form method="POST" onSubmit={this.saveUser} className="form-group" autoComplete="false" >
                    <div style={{position: 'fixed', top: '60', right: '0', zIndex:999}} >
                              <a  href='#topics'  className='btn btn-info'>Topics</a>
                              <a  href='#progress'  className='btn btn-info'>Progress</a>
                              <a  href='#activity'  className='btn btn-info'>Activity</a>
                              <a  href='#edit'  className='btn btn-info'>Edit</a>
                              <a  href='#' onClick={() => this.props.logout()} className='btn btn-info btn-danger' >
                               Logout
                              </a>
                              {this.props.isAdmin() && 
                              <span><a  href='#' onClick={() => this.props.import()} className='btn btn-info btn-warning' >
                               Import
                              </a>
                              <a  href='#' onClick={() => this.dumpalexa.bind(this)()} className='btn btn-info btn-warning' >
                               Train
                              </a></span>
                             }
                    </div>
                    <div className="row">
                        <div className='col-12 warning-message'>{this.state.warning_message}</div>
                              
                        <br/><br/>
                        <div className="col-12" style={{minHeight: '700px'}}>
                              <TopicsChart setCurrentPage={this.props.setCurrentPage} setQuizFromDiscovery={this.props.setQuizFromDiscovery} setReviewFromTopic={this.props.setReviewFromTopic} setQuizFromTopic={this.props.setQuizFromTopic} searchQuizFromTopic={this.props.searchQuizFromTopic}  user={this.props.user} />
                        </div>
                        <div className="col-12" style={{height: '500px'}} >
                              <ProgressChart reviewBySuccessBand={this.props.reviewBySuccessBand} user={this.props.user} />
                        </div>
                        <div className="col-12" style={{height: '700px'}}>
                              <ActivityChart user={this.props.user}  />
                        </div>
                        <div className="col-12">
                              <h3  className="card-title">Profile</h3>
                              <a id="edit"></a>
                               <label htmlFor="name" className='row'>Name </label><input autoComplete="false" id="name" type='text' name='name' onChange={this.change} value={this.state.user.name} />
                                <label htmlFor="avatar" className='row'>Avatar </label><input autoComplete="false" id="avatar" type='text' name='avatar' onChange={this.change} value={this.state.user.avatar} />
                                
                                <label htmlFor="difficulty" className='row'>Difficulty </label><select autoComplete="false" id="difficulty"   name='difficulty' onChange={this.change} value={this.state.user.difficulty}  ><option value='0' ></option><option value='1' >Basic</option><option value='2' >Standard</option><option value='3' >Genius</option></select>
                                
                                <label htmlFor="username" className='row'>Email </label><input autoComplete="false" id="username" readOnly="true" type='text' name='username' onChange={this.change} value={this.state.user.username}  />
                                <label htmlFor="password" className='row'>Password</label> <input  autoComplete="false" id="password" type='password' name='fake_password' onChange={this.change}  value={this.state.user.password}  />
                                <label htmlFor="password2" className='row'>Repeat Password</label><input  autoComplete="false" id="password2" type='password' name='fake_password2' onChange={this.change} value={this.state.user.password2} />
                                <input id="id" type='hidden' name='_id' value={this.state.user._id} />
                                <br/>
                                <br/>
                                <button  className='btn btn-info'>Save</button>
                        </div>
                    <br/>
                </div>
                </form>
                    
            )
            
        }
    }
    

}
//<a id="edit" style={{position:'relative',x:'-40em',y:'-40em'}}></a>
                    
