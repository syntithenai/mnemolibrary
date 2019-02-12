/* eslint-disable */ 

import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

export default class HelpNavigation extends Component {
    
    render() {
		
        return  (
            <nav className='nav'    >
                <Link to="/help/about" className='btn btn-info' >About</Link>
                <Link to="/help/intro" className='btn btn-info' >Getting Started</Link>
                <Link to="/help/faq" className='btn btn-info' >Frequently Asked Questions</Link>
                <Link to="/help/termsofuse" className='btn btn-info' >Terms Of Use</Link>
            </nav>
            )

}


}
            
