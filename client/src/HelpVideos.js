
import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';            
export default class HelpVideos extends Component {
    
    render() {
        return  (
        <div className='videotutorials' >
        <HelpNavigation setCurrentPage={this.props.setCurrentPage}/>
         <iframe width="560" height="315" src="https://www.youtube.com/embed/qXh6hkzy-8k" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
        <iframe width="560" height="315" src="https://www.youtube.com/embed/vHGdwGZvNFE" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
        </div>
)}}
