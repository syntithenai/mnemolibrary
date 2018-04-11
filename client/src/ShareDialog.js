import React, { Component } from 'react';

import Email from 'react-icons/lib/fa/envelope-o';
import Twitter from 'react-icons/lib/fa/twitter';

export default class ShareDialog extends Component {
    
    render() {
        let mailTo='mailto:?subject=Mnemos Library - '+this.props.header+'&body='+this.props.shareLink;
        let twitterLink="https://twitter.com/intent/tweet?text="+this.props.header+'&url='+this.props.shareLink   ;
        return  (
            <div id="sharedialog" className="modal" tabIndex="-1" role="dialog">
              <div className="modal-dialog" role="document">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">Share using</h5>
                    <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div className="modal-body">
                     
                     
                     <a  target='_new'  href={mailTo} className='btn btn-primary'  ><Email size={26}  />&nbsp;<span >&nbsp;Email</span></a>
                      &nbsp;&nbsp;
                     
                     
                      <a target="_new"  className="btn btn-primary twitter-share-button"
                      href={twitterLink}
                      data-size="large"><Twitter size={26}  />&nbsp;<span >&nbsp;Tweet</span></a>  
                      &nbsp;&nbsp;
                     <div  className="fb-share-button" 
                        data-href={this.props.shareLink}
                        data-size="large" data-mobile-iframe="true"
                        data-layout="button_count" > </div>
                      &nbsp;&nbsp;   
                      
                  </div>
                </div>
              </div>
            </div>
            
        )
    };
    
}
