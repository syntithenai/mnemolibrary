import React, { Component } from 'react';



export default class Navigation extends Component {
    
    render() {
        return  (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" >
          <a className="navbar-brand" href="#" onClick={() => this.props.setCurrentPage('home')}><img alt="Mnemonikas" src="mnemoicon.jpg" height="100%" data-toggle="collapse" data-target="#navbarCollapse"/></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto" data-toggle="collapse" data-target="#navbarCollapse" >
              <li className="nav-item active" >
                <a className="nav-link"  href="#"  onClick={() => this.props.setCurrentPage('home')}>Learn</a>
                <div className="navbar-nav" >
                  <a className="nav-item" href="#"  onClick={() => this.props.setCurrentPage('topics')}>&nbsp;&nbsp;Topics</a>
                  <a className="nav-item" href="#"  onClick={() => this.props.setCurrentPage('tags')}>&nbsp;&nbsp;Tags</a>
                  <a className="nav-item" href="#"  onClick={() => this.props.setCurrentPage('search')}>&nbsp;&nbsp;Search</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"  onClick={() => this.props.setCurrentPage('review')} >Review</a>
              </li>
              <li className="nav-item">
                <a className="nav-link"  href="#" onClick={() => this.props.setCurrentPage('create')}>Create</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => this.props.setCurrentPage('about')}>About</a>
                <div className="navbar-nav" >
                  <a className="nav-item" href="#"  onClick={() => this.props.setCurrentPage('info')}>&nbsp;&nbsp;Getting Started</a>
                  
                </div>
              </li>
            </ul>
          </div>
        </nav>
        )
    };
    
}
