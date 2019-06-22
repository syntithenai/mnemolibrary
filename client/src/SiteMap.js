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
    };
    
  
     dumpalexa() {
		this.hideTopButtons()
        fetch('/api/dumpalexa', {});
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
              label: 'Archive',
              onClick: () => this.props.import(0)
            },
            {
              label: 'Active',
              onClick: () => this.props.import(1)
            },
            {
              label: 'Test',
              onClick: () => this.props.import(2)
            },
            {
			  label: 'Multiple Choice Questions',
              onClick: () => this.props.importMultipleChoice(0)
            }
          ]
        })
    }
    
    render() {
		let that = this;
		let buttonStyle = {} //padding:'0.3em',fontSize:'1.2em',margin:'0.3em'
		let blockStyle={marginBottom:'1em', backgroundColor:'#eee', padding:'0.1em', border: '1px solid black', borderRadius:'10px'}
		return (
			<div className="container" >
				<div className="row" style={blockStyle}>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/"  >Discover</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/multiplechoicequestions"  >Quizzes</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/review"  >Review</Link></div>
				</div>

				<div className="row" style={blockStyle}>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/search/tags"  >Search Tags</Link></div>
				  <div className="col"><Link style={buttonStyle} className='btn btn-info'  to="/search/questions"  >Search Questions</Link></div>
				</div>

				<div className="row" style={blockStyle}>
				 {this.props.isLoggedIn() && <div className="col-8"><Link style={buttonStyle} className='btn btn-info'  to="/profile"  >Profile</Link></div>}
				  {this.props.isLoggedIn() && <div className="col-3"><div onClick={this.props.logout} style={buttonStyle} className='btn btn-danger'  to="/profile"  >Logout</div></div>}
				  {!this.props.isLoggedIn() && <div className="col-3"><Link style={buttonStyle} className='btn btn-info'  to="/login"  >Login</Link></div>}
				</div> 

				<div className="row" style={blockStyle}>
				  <div className="col-3"><Link style={buttonStyle} className='btn btn-success'  to="/create"  >Create</Link></div>
				  <div className="col-3"><Link style={buttonStyle} className='btn btn-info'  to="/help"  >Help</Link></div>
				</div> 

				{that.props.isAdmin() && <div className="row" style={blockStyle}>
					<div className="col-3">
						<div   style={buttonStyle}  onClick={() => that.clickImport()} className='btn btn-info btn-warning' >
					   Import
					  </div>
					</div>
				  <div className="col-3" >
				   <div style={buttonStyle}   onClick={() => that.dumpalexa.bind(this)()} className='btn btn-info btn-warning' >
				   Train
				  </div>
				  </div>
				</div>
				  }
				  
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
