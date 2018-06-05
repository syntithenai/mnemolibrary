import React, { Component } from 'react';
import ActivityChart from './ActivityChart'
import TopicsChart from './TopicsChart'
import ProgressChart from './ProgressChart'
 

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
                avatar:this.props.user.avatar?this.props.user.avatar:'',
                password:this.props.user.password?this.props.user.password:'',
                password2:this.props.user.password2?this.props.user.password:'',
            },
    
        }
       // console.log(['constr',this.state]);
    };

    
    saveUser(e) {
        e.preventDefault();
        var that = this;
        that.setState({'warning_message':''});
        //console.log('save user ',this.state.user);
        var data = {
            '_id': this.state.user._id,
          }
          if (this.state.user.name)  data.name= this.state.user.name;
          if (this.state.user.avatar)  data.avatar= this.state.user.avatar;
          if (this.state.user.username)  data.username= this.state.user.username;  
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
       // console.log(['CHANGE',state]);
        this.setState({'user':state});
        return true;
    };
    
    render() { //req,vars/
        
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
                          <a  href='#' onClick={() => this.props.import()} className='btn btn-info btn-warning' >
                           Import
                          </a>
                         }
                        
                        </div>
            <div className="row">
                    <div className='col-12 warning-message'>{this.state.warning_message}</div>
                          
                    <br/><br/>
                    <div className="col-12">
                          <TopicsChart setCurrentPage={this.props.setCurrentPage} setQuizFromDiscovery={this.props.setQuizFromDiscovery} setReviewFromTopic={this.props.setReviewFromTopic} setQuizFromTopic={this.props.setQuizFromTopic} searchQuizFromTopic={this.props.searchQuizFromTopic}  user={this.props.user} />
                          <br/><br/>
                            <br/><br/>
                            <br/><br/>
                    </div>
                    <div className="col-12">
                          <ProgressChart reviewBySuccessBand={this.props.reviewBySuccessBand} user={this.props.user} />
                            <br/><br/>
                    </div>
                    <div className="col-12">
                          <ActivityChart user={this.props.user} />
                            <br/><br/>
                            <br/><br/>
                            <br/><br/>
                            <br/><br/>
                    </div>
                    <div className="col-12">
                          <h3  className="card-title">Profile</h3>
                          <a id="edit"></a>
                           <label htmlFor="name" className='row'>Name </label><input autoComplete="false" id="name" type='text' name='name' onChange={this.change} value={this.state.user.name} />
                            <label htmlFor="avatar" className='row'>Avatar </label><input autoComplete="false" id="avatar" type='text' name='avatar' onChange={this.change} value={this.state.user.avatar} />
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
//<a id="edit" style={{position:'relative',x:'-40em',y:'-40em'}}></a>
                    
