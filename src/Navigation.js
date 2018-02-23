import React, { Component } from 'react';



export default class Navigation extends Component {
    
    
    
    render() {
        return  (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark" >
          <a className="navbar-brand" href="#" onClick={() => this.props.setCurrentPage('home')}><img alt="Mnemonikas" src="mnemoicon.jpg" height="100%" data-toggle="collapse" data-target="#navbarCollapse"/></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto" data-toggle="collapse" data-target="#navbarCollapse" >
              <li className="nav-item active" >
                <a className="nav-link"  href="#"  onClick={() => this.props.setCurrentPage('home')}>Learn</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"  onClick={() => this.props.setCurrentPage('topics')}>Topics</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#"  onClick={() => this.props.setCurrentPage('review')} >Review</a>
              </li>
              <li className="nav-item">
                <a className="nav-link"  href="#" onClick={() => this.props.setCurrentPage('create')}>Create</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#" onClick={() => this.props.setCurrentPage('about')}>Help</a>
                
              </li>
            </ul>
          </div>
          
        </nav>
        )
    };
    
}
Navigation.pageTitles= {'home':'Mnemos Library','topics':'Topic Search','tags':'Tag Search','search':'Question Search','review':'Review','create':'Create Mnemonics','about':'About Nemo','info':'Getting Started'}
