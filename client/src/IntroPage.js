import React, { Component } from 'react';

export default class IntroPage extends Component {
    
    render() {
        return  (
        <div className="intropage" >
            
           
<h3>Getting Started.</h3>
<nav className='nav'    >
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('help')}>About</button>
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('terms')}>Terms of Use</button>
            </nav> 
            <br/>
            
<div>At Mnemo’s Library, the first step is to find what you want to learn. You can find entries of interest under the ‘Search’ tab. You can narrow this by typing keywords into the search field by topic or by tag. A topic is a top-down ‘parent’ grouping of entries (e.g. ‘Mnemo’s Politics’) and a tag is a bottom-up grouping (e.g. ‘politics’ brings together entries of which one tag is ‘politics’ across all topics). An entry has one topic, but multiple tags. Or you can even search by keyword across individual entries. 
</div> <br/>

<div>If you don’t yet want to narrow your search, the default entry point is to learn across all topics and tags. As you go, you can block entries individually or by tags that you are not interested in (you can also follow up tags that you are interested in).</div>
 <br/>
<div>Once you have found what you want to learn, you will find yourself in the discover phase. Read the question, the answer (if there is one) or 'more info' until you understand the connection between the mnemonic (memory aid, in red) and the answer or until you have satisfied your curiosity. The discover phase comes in sets of up to 20 entries, which can be viewed with the ‘3 dots’ drop down menu to the top left. Another 20 entries are automatically generated when you have finished, but we recommend moving to the review stage first….</div>
 <br/>
<div>You will need to log in to review entries in your knowledge base. It’s up to you when you want to start reviewing (click ‘review’ tab) and you can easily pick up where you left off (even on another device). You are prompted to recall information, with strong reinforcement of recent or unsuccessful entries to increase the chances of the information entering your long-term memory.</div>
 <br/>
<div>We have adopted an open-ended idea of a successful recall. This means that ultimately it is up to you to decide whether you are satisfied with your recall.* If so, click the green button. If not, click the arrow to the next entry (you can also return to previous entries if you want to check something). If the entry no longer interests you, you can remove it from your knowledge base using the red trash can.</div> <br/>

<div>That’s it! We hope you enjoy discovering the content on this site and hope that you consider expanding the community’s knowledge base by creating some mnemonics of your own (see create tab).</div> <br/>

<div>*As a guideline, the idea is to recall the answer or, if there is no specific answer, what the mnemonic is referring to. But you may wish to remember more detail. For example, you may be satisfied to remember that Christiaan Huygens was a Dutch astronomer who developed the wave theory of light (mnemonic: ‘the universe has [huge ends] traversed by light waves’). Or you may want to remember the additional details that Huygens studied the rings of Saturn and discovered its moon Titan and was an eminent 17th Century scientist in a range of areas.</div>

 <br/> <br/>
        </div>
        )
    }
}
