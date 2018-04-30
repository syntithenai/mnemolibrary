import React, { Component } from 'react';
import 'whatwg-fetch'

export default class Navigation extends Component {

    //constructor(props) {
        //super(props);
        //this.isAdmin = this.isAdmin.bind(this);
    //};
    
    authorize() {
     //   console.log(['AUTHORIZE'])
        //fetch('/oauth/token',{method: 'POST',headers: {
    //'Content-Type': 'application/x-www-form-urlencoded'
  //}})
       fetch('/oauth/authorize',{method: 'GET',headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }})
      .then(function(response) {
       // console.log(['got response', response.text()])
      //  return response.json()
      })
      //.then(function(json) {
          //console.log(['create indexes', json])
        //that.createIndexes(json);
      //})
      .catch(function(ex) {
        console.log(['parsing failed', ex])
      })
 
    };
    

    
    import(e) {
        this.props.import();
    };
    
    render() {
        return  (
        <div className="navbar-dark fixed-top bg-dark" >
        <div className='page-title' style={{float:'right',color:'yellow',fontSize:'1.2em', position: 'fixed', left: '6.1em',  zIndex:99, marginTop: '0.4em'}} >&nbsp;&nbsp;{this.props.title} &nbsp;&nbsp;&nbsp;{!this.props.isLoggedIn() && <a  href='#' onClick={() => this.props.setCurrentPage('splash')} className='btn btn-outline btn-warning' style={{display:'inline'}}>
                   Tutorial
                  </a>}</div>
        
              
       
        <nav className="navbar navbar-expand-md" >
       <div className="navbar-brand" >
          
          <a  href="#" onClick={() => this.props.setCurrentPage('splash')}><img alt="Mnemonikas" src="/mnemoicon.jpg" height="80%" data-toggle="collapse" data-target="#navbarCollapse" style={{clear:'right'}}/></a>
             

            {!this.props.isLoggedIn() && <a  href='#' onClick={() => this.props.setCurrentPage('login')} className='loginbutton btn btn-outline btn-warning' style={{verticalAlign: 'top',marginLeft: '1em'}}>
                   Login
                  </a>}
      
          </div>
          
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" >
            <span className="navbar-toggler-icon"></span>
          </button>
       
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto" data-toggle="collapse" data-target="#navbarCollapse" >
              <li className="nav-item" >
                <a className="nav-link"  href="#"  onClick={() => this.props.setQuizFromDiscovery()}>Discover</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"  onClick={() => this.props.setCurrentPage('topics')}>Search</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"  onClick={() => this.props.setCurrentPage('review')} >Review</a>
              </li>
              {this.props.isLoggedIn() && 
              <li className="nav-item">
                <a className="nav-link"  href="#" onClick={() => this.props.setCurrentPage('create')}>Create</a>
              </li>}
            
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => this.props.setCurrentPage('about')}>Help</a>
                
              </li>
              <li className="nav-item">
                
                {this.props.isLoggedIn() && <a href='#' onClick={() => this.props.setCurrentPage('login')} className='nav-link'>
                   Profile
                  </a>}
              </li>
            </ul>
          </div>
            
        </nav>
          
        </div>
        )
    };
    
}
Navigation.pageTitles= {'splash':'Mnemo\'s Library', 'home':'Mnemo\'s Library','topics':'Topic Search','tags':'Tag Search','search':'Question Search','review':'Review','create':'Create','about':'About Mnemo','info':'Getting Started','login':'','intro':'Getting Started','termsofuse':'Terms of Use','faq':'Frequently Asked Questions'}
