/* eslint-disable */ 
import React, { Component } from 'react';
import 'whatwg-fetch'
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import Speechify from './Speechify'
let style={height:'1.2em'}
const userIcon = 
<svg style={style}  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path fill="currentColor" d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48v-41.6c0-74.2-60.2-134.4-134.4-134.4z"></path></svg>

const quizIcon = 
<svg style={style}  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg>



const reviewIcon = 
<svg style={style}  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M336 448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm208-320V80c0-8.84-7.16-16-16-16s-16 7.16-16 16v48h-32V80c0-8.84-7.16-16-16-16s-16 7.16-16 16v48h-16c-8.84 0-16 7.16-16 16v32c0 35.76 23.62 65.69 56 75.93v118.49c0 13.95-9.5 26.92-23.26 29.19C431.22 402.5 416 388.99 416 372v-28c0-48.6-39.4-88-88-88h-8V64c0-35.35-28.65-64-64-64H96C60.65 0 32 28.65 32 64v352h288V304h8c22.09 0 40 17.91 40 40v24.61c0 39.67 28.92 75.16 68.41 79.01C481.71 452.05 520 416.41 520 372V251.93c32.38-10.24 56-40.17 56-75.93v-32c0-8.84-7.16-16-16-16h-16zm-283.91 47.76l-93.7 139c-2.2 3.33-6.21 5.24-10.39 5.24-7.67 0-13.47-6.28-11.67-12.92L167.35 224H108c-7.25 0-12.85-5.59-11.89-11.89l16-107C112.9 99.9 117.98 96 124 96h68c7.88 0 13.62 6.54 11.6 13.21L192 160h57.7c9.24 0 15.01 8.78 10.39 15.76z"></path></svg>


const helpIcon = 
<svg style={style}  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><path fill="currentColor" d="M202.021 0C122.202 0 70.503 32.703 29.914 91.026c-7.363 10.58-5.093 25.086 5.178 32.874l43.138 32.709c10.373 7.865 25.132 6.026 33.253-4.148 25.049-31.381 43.63-49.449 82.757-49.449 30.764 0 68.816 19.799 68.816 49.631 0 22.552-18.617 34.134-48.993 51.164-35.423 19.86-82.299 44.576-82.299 106.405V320c0 13.255 10.745 24 24 24h72.471c13.255 0 24-10.745 24-24v-5.773c0-42.86 125.268-44.645 125.268-160.627C377.504 66.256 286.902 0 202.021 0zM192 373.459c-38.196 0-69.271 31.075-69.271 69.271 0 38.195 31.075 69.27 69.271 69.27s69.271-31.075 69.271-69.271-31.075-69.27-69.271-69.27z"></path></svg>


const createIcon = 
<svg style={style}   role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zm-96 168c0 8.84-7.16 16-16 16h-72v72c0 8.84-7.16 16-16 16h-16c-8.84 0-16-7.16-16-16v-72h-72c-8.84 0-16-7.16-16-16v-16c0-8.84 7.16-16 16-16h72v-72c0-8.84 7.16-16 16-16h16c8.84 0 16 7.16 16 16v72h72c8.84 0 16 7.16 16 16v16z"></path></svg>

export default class Navigation extends Component {

    constructor(props) {
        super(props);
        this.goHome = this.goHome.bind(this);
        //this.isAdmin = this.isAdmin.bind(this);
    };
    
    //authorize() {
     ////   //console.log(['AUTHORIZE'])
        ////fetch('/oauth/token',{method: 'POST',headers: {
    ////'Content-Type': 'application/x-www-form-urlencoded'
  ////}})
       //fetch('/oauth/authorize',{method: 'GET',headers: {
    //'Content-Type': 'application/x-www-form-urlencoded'
  //}})
      //.then(function(response) {
       //// //console.log(['got response', response.text()])
      ////  return response.json()
      //})
      ////.then(function(json) {
          //////console.log(['create indexes', json])
        ////that.createIndexes(json);
      ////})
      //.catch(function(ex) {
        ////console.log(['parsing failed', ex])
      //})
 
    //};
    

    
    goHome() {
        this.props.hideCollection();
        this.props.setCurrentPage('/')
    };
    
    import(e) {
        this.props.import();
    };
  
    render() {

		//console.log(['RENDER NAV',window.locationpathname])
		let pathName = window.location.pathname ? window.location.pathname.replace('/',' ').trim() : '';
		let parts = pathName.split('/').slice(0,3);
		if (parts[0]==="discover" && parts[1]==="searchtopic") {
			let newParts = parts.slice(2);
			newParts.unshift('topic')
			newParts.unshift('search')
			parts=newParts;
		}
		let capitalisedParts = parts.map(function(part) {
			//console.log(['CAPS',part.slice(0,1),part.slice(1)]);
			return [part.slice(0,1).toUpperCase(),decodeURI(part.slice(1))].join('');
		})
		//console.log(['CAPSp',capitalisedParts]);
		let pageTitle = capitalisedParts.join(' ').trim().length > 0 ? capitalisedParts.join(' ') : " Mnemo's Library"
        if (parts[0] === "help") {
			pageTitle = "Help";
		} else if (parts[0] === 'multiplechoicetopics') {
			pageTitle = 'Quizzes by Topic'
		} else if (parts[0] === 'multiplechoicequestions') {
			pageTitle = decodeURI(parts[1]) + ' Quiz'
		} else if (parts[0] === 'mymultiplechoicequestions') {
			pageTitle = 'Review Quiz '+ (parts[1] ? ' - '+decodeURI(parts[1]) : '') 
		} else if (parts[0] === 'mymultiplechoicetopics') {
			pageTitle = 'My Topics Quiz '+ (parts[1] ? ' - '+decodeURI(parts[1]) : '')
		} else if (parts[0] === 'recentcomments') {
			pageTitle = 'Recent Comments'
		} else if (parts[0] === 'sitemap') {
			pageTitle = 'Site Map'
		} else if (parts[0] === 'newslettertool') {
			pageTitle = 'Newsletter Tool'
		} else if (parts[0] === 'ala') {
			pageTitle = 'Atlas of Living Australia'
		} else if (parts[0] === 'musicbrainz') {
			pageTitle = 'Search Musicians'
		}
        
        
        
        
        return  (
        <div className="navbar-dark fixed-top bg-dark" >
            
        <nav className="navbar navbar-expand-md" >
       <div className="navbar-brand" >
          <Link  to="/" onClick={this.goHome}><img alt="Mnemos' Library" src="/mnemoicon-100.png"  data-toggle="collapse" data-target="#navbarCollapse" style={{float:'left',clear:'right' ,height:'4em'}}  /></Link>
       
       <div className='page-title' style={{textTransform:'capitalize',color:'yellow',fontSize:'0.9em',  zIndex:99, marginTop: '0.1em'}} >&nbsp;&nbsp;{pageTitle}&nbsp;&nbsp;&nbsp;</div>
          
              <span style={{marginLeft:'1em'}} className="dcol-4">
                <Link className="btn btn-secondary" to="/multiplechoicetopics"  >{quizIcon} <span  className="d-none d-sm-inline">Quizzes</span></Link>
              </span>
              
              <span  className="dcol-4">
                <Link className="btn btn-secondary" to="/review"  >{reviewIcon} <span  className="d-none d-sm-inline">Review</span></Link>
              </span>
              
              <span className="dcol-4">
                
                {this.props.isLoggedIn() && <Link to='/profile' className='btn btn-secondary'>
                   {userIcon} <span  className="d-none d-sm-inline">Profile</span>
                  </Link>}
                  {!this.props.isLoggedIn() && <Link  to='/login'  className='btn btn-outline btn-warning' style={{marginLeft: '1em'}}>
                   {userIcon} <span  className="d-none d-sm-inline">Login</span>
                  </Link>}
              </span>
           
              <span className="dcol-4">
                <Link className="btn btn-secondary" to="/sitemap" >...</Link>
                
              </span>
          </div>
            
        </nav>
          
        </div>
        )
    };
    
}
Navigation.pageTitles= {'splash':'Mnemo\'s Library', 'home':'Mnemo\'s Library','topics':'Topic Search','tags':'Tag Search','search':'Question Search','review':'Review','create':'Create','createhelp':'Create','about':'About Mnemo','info':'Getting Started','login':'','profile':'Profile','intro':'Getting Started','termsofuse':'Terms of Use','faq':'Frequently Asked Questions','multiplechoicetopics':'Quizzes by Topic'}

    //<button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation" >
            //<span className="navbar-toggler-icon"></span>
          //</button>
//<div className="col-4" >
                //<a className="btn btn-secondary"  href="#"  onClick={() => this.props.setQuizFromDiscovery()}>Discover</a>
              //</div>
              //<div className="col-4">
                //<a className="btn btn-secondary" href="#"  onClick={() => this.props.setCurrentPage('topics')}>Search</a>
              //</div>
