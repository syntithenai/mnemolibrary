/* eslint-disable */ 
import React, { Component } from 'react';
import Github from 'react-icons/lib/fa/github';
import Twitter from 'react-icons/lib/fa/twitter';
import Facebook from 'react-icons/lib/fa/facebook-official';
import Envelope from 'react-icons/lib/fa/envelope';
import Instagram from 'react-icons/lib/fa/instagram';

//style={{border: '1px solid black', paddingTop:'0.1em', paddingBottom:'0.1em',borderRadius:'10px',paddingLeft:'0.1em',paddingRight:'0.1em',float:'right',clear:'both' ,marginTop:'1em'}}
export default class Footer extends Component {
    render() {
        return <div className='footer'>
        <nav className="nav">
          <a className="nav-link active" target='_new' href="https://twitter.com/MnemosLibrary"><Twitter/>&nbsp;Twitter</a>
          <a className="nav-link" target='_new' href="https://www.facebook.com/Mnemos-Library-258728258000790"><Facebook/>&nbsp;Facebook</a>
          <iframe src='https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fmnemolibrary.com%2F&width=121&layout=button_count&action=like&size=large&show_faces=false&share=false&height=65&appId=704362873350885' width="121" height="25" style={{marginTop:'7px', paddingTop:'0px',border:'none',overflow:'visible'}} scrolling="no" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
          <a className="nav-link" target='_new' href="https://www.instagram.com/captainmnemo"><Instagram/>&nbsp;Instagram</a>
          <a className="nav-link" target='_new' href="https://github.com/syntithenai/mnemolibrary"><Github/>&nbsp;Github</a>
          <a className="nav-link"  target='_new' href="mailto:mnemoslibrary@gmail.com"><Envelope/>&nbsp;Email</a>
         	 
			  
        </nav>
        </div>
    };
}
