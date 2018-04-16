import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';

export default class IntroPage extends Component {
    
    render() {
        return  (
        <div className="intropage" >
            
           
<h3>Getting Started</h3>
<HelpNavigation setCurrentPage={this.props.setCurrentPage} />            
<br/>
<p><span>What do you want to&nbsp;learn?&nbsp;</span><span> A&nbsp;<strong>topic</strong>&nbsp;is a top-down &lsquo;parent&rsquo; grouping of <strong>questions</strong>&nbsp;and a&nbsp;<strong>tag</strong>&nbsp;is a bottom-up grouping of&nbsp;questions across all topics.&nbsp;The default entry point is a list of questions&nbsp;across all topics and tags. But you</span><span>&nbsp;can narrow this&nbsp;under the <strong>search</strong> tab with keywords, topics, or tags. As you go, you can filter or block&nbsp;out questions individually,&nbsp;by tag, or by topic.<br /><br />All sorted? The&nbsp;<strong>discover</strong>&nbsp;phase is where you learn. Read the&nbsp;question, the&nbsp;<strong>answer</strong>&nbsp;(if there is one) or '<strong>more info</strong>' until you understand the connection between the&nbsp;<strong>mnemonic</strong>&nbsp;(memory aid, in red) and the answer.&nbsp;When you move on, the question will be&nbsp;transferred to your&nbsp;<strong>knowledge base, </strong>unless you&nbsp;block it (red button).<br /><br />The <strong>review</strong> phase is where you lock in information over the longer term. You recall information, with strong reinforcement of recent or unsuccessful entries. It is up to you whether you are satisfied with your recall. If so, click the green button. If not, click the arrow to the next entry.&nbsp; If the entry no longer interests you, block it. Good to go?<br /><br /></span></p> 
 <br/> <br/>
        </div>  
        )
    }
}
