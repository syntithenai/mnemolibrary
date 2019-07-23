import React, { Component } from 'react';
import 'whatwg-fetch'
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

export default class SiteMap extends Component {

    constructor(props) {
        super(props);
        this.dumpalexa = this.dumpalexa.bind(this)
        this.clickImport = this.clickImport.bind(this)
        this.backup = this.backup.bind(this)
    };
    
  
     dumpalexa() {
		this.hideTopButtons()
        fetch('/api/dumpalexa', {});
    };
    
     backup() {
        let that = this;
        function checkStatus(response) {
		  if (!response.ok) {
			throw new Error(`HTTP ${response.status} - ${response.statusText}`);
		  }
		  return response;
		}
        
        fetch('/api/backup', {})
         .then(response => checkStatus(response) && response.arrayBuffer())
		 .then(buffer => {
			var FileSaver = require('file-saver');
            var blob = new Blob([buffer], {type: "application/x-tar"});
            FileSaver.saveAs(blob, "mnemobackup.tar");
        }).catch(function(err) {
            console.log(err);
        });
    };
    
    
    clickImport() {
	     confirmAlert({
          title: 'Import Selection',
          message: 'Which sheet do you want to import?',
          buttons: [
            {
              label: 'Cancel',
              onClick: () => {}
            },
            {
              label: 'Master',
              onClick: () => this.props.import(0)
            },
            {
              label: 'Active',
              onClick: () => this.props.import(1)
            },
            {
			  label: 'MC only',
              onClick: () => this.props.importMultipleChoice(1)
            },
            {
              label: 'Steve',
              onClick: () => this.props.import(2)
            },
            {
			  label: 'MC Steve',
              onClick: () => this.props.importMultipleChoice(0)
            }
          ]
        })
    }
     //<div className="col-3">
						//<div   style={buttonStyle}  onClick={() => that.backup()} className='btn btn-info' >
					   //Backup
					  //</div>
					//</div>
    render() {
		this.props.analyticsEvent('site map');

		let that = this;
		let buttonStyle = {marginTop:'0.3em',marginBottom:'0.3em',paddingLeft:'1em',paddingRight:'1em'} //padding:'0.3em',fontSize:'1.2em',margin:'0.3em'
		let blockStyle={marginBottom:'1em', backgroundColor:'#eee', padding:'0.1em', border: '1px solid black', borderRadius:'10px'}
		return (
			<div className="container" >
				{that.props.isAdmin() && <div className="row" style={blockStyle}>
					<div className="col-3">
						<div   style={buttonStyle}  onClick={() => that.clickImport()} className='btn  btn-warning' >
					   Import
					  </div>
					</div>
				  <div className="col-3" >
				   <div style={buttonStyle}   onClick={() => that.dumpalexa.bind(this)()} className='btn  btn-warning' >
				   Train
				  </div>
				  </div>
				   <div className="col-3">
						<Link to="/newslettertool"   style={buttonStyle}   className='btn btn-info' >
					   Newsletter
					  </Link>
					</div>
				 
					
				</div>
				  }
				  
				  <div className="row" style={blockStyle}>
				 {this.props.isLoggedIn() && <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/profile"  >Profile</Link><Link style={buttonStyle} className='btn btn-info'  to="/settings"  >Settings</Link></div>}
				  {this.props.isLoggedIn() && <div className="col"><div onClick={this.props.logout} style={buttonStyle} className='btn btn-danger'  to="/profile"  >Logout</div></div>}
				  {!this.props.isLoggedIn() && <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/login"  >Login</Link></div>}
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/recentcomments"  >Recent Comments</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/leaderboard"  >Leader Board</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-success'  to="/create"  >Create</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/help"  >Help</Link></div>
					</div>
					
					

				<div className="row" style={blockStyle}>
				 <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/"  >Discover</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/multiplechoicetopics"  >Quizzes</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/review"  >Review</Link></div>
			  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/search/tags"  >Search Tags</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/search/questions"  >Search Questions</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/ala"  >Search Australian Flora and Fauna</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/musicbrainz"  >Search Musicians</Link></div>
				  {this.props.isAdmin() && <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/feedmuncher"  >ABC News</Link></div>}

				  
				</div>

				
				
				  
			</div>
			)
	}
}
          
              //<span style={{marginLeft:'1em'}} className="dcol-4">
                //<Link className="btn btn-secondary" to="/multiplechoicetopics"  >{quizIcon} <span  className="d-none d-sm-inline">Quizzes</span></Link>
              //</span>
              
              //<span  className="dcol-4">
                //<Link className="btn btn-secondary" to="/review"  >{reviewIcon} <span  className="d-none d-sm-inline">Review</span></Link>
              //</span>
              
              //<span className="dcol-4">
                
                //{this.props.isLoggedIn() && <Link to='/profile' className='btn btn-secondary'>
                   //{userIcon} <span  className="d-none d-sm-inline">Profile</span>
                  //</Link>}
                  //{!this.props.isLoggedIn() && <Link  to='/login'  className='btn btn-outline btn-warning' style={{marginLeft: '1em'}}>
                   //{userIcon} <span  className="d-none d-sm-inline">Login</span>
                  //</Link>}
              //</span>
           
              //<span className="dcol-4">
             //<Link className="btn btn-secondary" to="/help" >{helpIcon} <span  className="d-none d-sm-inline">Help</span></Link>
                   
              //</span>
          //</div>
            
        //</nav>
          
        //</div>
