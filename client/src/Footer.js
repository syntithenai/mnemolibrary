import React, { Component } from 'react';
import Github from 'react-icons/lib/fa/github';
import Twitter from 'react-icons/lib/fa/twitter';
import Facebook from 'react-icons/lib/fa/facebook-official';
import Envelope from 'react-icons/lib/fa/envelope';
import Instagram from 'react-icons/lib/fa/instagram';

export default class Footer extends Component {
    render() {
        return <div className='footer'>
        <nav className="nav">
          <a className="nav-link active" target='_new' href="https://twitter.com/MnemosLibrary"><Twitter/>&nbsp;Twitter</a>
          <a className="nav-link" target='_new' href="https://www.facebook.com/Mnemos-Library-258728258000790"><Facebook/>&nbsp;Facebook</a>
          <a className="nav-link" target='_new' href="https://www.instagram.com/captainmnemo"><Instagram/>&nbsp;Instragram</a>
          <a className="nav-link" target='_new' href="https://github.com/syntithenai/mnemolibrary"><Github/>&nbsp;Github</a>
          <a className="nav-link" target='_new' href="mailto:mnemoslibrary@gmail.com"><Envelope/>&nbsp;Email</a>
          
        </nav>
        </div>
    };
}
