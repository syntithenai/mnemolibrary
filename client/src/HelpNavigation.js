
import React, { Component } from 'react';

export default class HelpNavigation extends Component {
    
    render() {
        return  (
            <nav className='nav'    >
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('about')}>About</button>
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('intro')}>Getting Started</button>
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('faq')}>Frequently Asked Questions</button>
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('termsofuse')}>Terms Of Use</button>
            </nav>
            )

}


}
            
