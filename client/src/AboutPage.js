import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';
export default class AboutPage extends Component {
    
    render() {
		this.props.analyticsEvent('help - about');
        return  (
        <div className="aboutpage" >
        
            <HelpNavigation setCurrentPage={this.props.setCurrentPage}/>
            <br/>
           <p><span>When you surf the Net, how much of it sticks?&nbsp;<a href="https://www.theatlantic.com/science/archive/2018/01/what-was-this-article-about-again/551603/" target="_new" rel="noopener noreferrer">Probably only a fraction</a>, especially in the long term.&nbsp;<br /><br />We created Mnemo's Library to combat this problem, combining memory techniques (<a href="https://en.wikipedia.org/wiki/Mnemonic" target="_new" rel="noopener noreferrer">mnemonics</a>) with an open, collaborative platform where users can curate knowledge. We especially&nbsp; like homonyms/puns and rhymes, but we use any mnemonic that works: acronyms, alliteration, association,&nbsp;<a href="https://en.wikipedia.org/wiki/List_of_visual_mnemonics" target="_new" rel="noopener noreferrer">visual</a>&nbsp;cues, the&nbsp;<a href="https://major-system.info/en/" target="_new" rel="noopener noreferrer">major system</a>, etc. You recall information by learning and recalling with mnemonics. We shuffle successful recalls to the back and in time the information starts to stick, even in the long term.<br /></span></p>
<br/><br/>
         </div>
        )
    }
}
