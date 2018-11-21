import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';

export default class IntroPage extends Component {
    
    render() {
        return  (
        <div className="intropage" >
            
           
<HelpNavigation setCurrentPage={this.props.setCurrentPage} />            
<br/>
<p><span><p>Choose or search your category of interest and start learning through questions, answers, and mnemonics (memory aids).&nbsp;When you move on, the question will be&nbsp;transferred to your&nbsp;knowledge base.&nbsp;As&nbsp;you go, you can filter or block&nbsp;out questions individually,&nbsp;by tag, or by topic. <br /><br />You will be prompted at times to review&nbsp;questions using an algorithm optimized for retaining the information. You can select images or mnemonics to help you remember. If you are satisfied with your recall, click the green button. If not, click the arrow to the right.</p>
<br /><br /></span></p> 
 <br/> <br/>
        </div>  
        )
    }
}
