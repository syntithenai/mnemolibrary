import React, { Component } from 'react';

export default class AboutPage extends Component {
    
    render() {
        return  (
        <div className="aboutpage" >
        
            <nav className='nav'    >
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('intro')}>Getting Started</button>
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('termsofuse')}>Terms Of Use</button>
            </nav>
            
            <br/>
            <div>When you surf the Net, how much of it sticks? <a target='_new' href='https://www.theatlantic.com/science/archive/2018/01/what-was-this-article-about-again/551603/' >Probably only a fraction</a>, especially in the long term. We created Mnemo's Library to combat this problem, combining memory techniques (mnemonics) with an open, collaborative platform. You recall information by learning and then recalling information with mnemonics. We shuffle successful recalls to the back and eventually the information is lodged in your long-term memory with no need for the mnemonic.</div>

<div>Can’t we just externalise these memories now that everything is accessible on the Net? First, there are <a href='https://www.theatlantic.com/science/archive/2018/01/what-was-this-article-about-again/551603/'  target='_new' >dangers</a> in this reliance. But more importantly, we see mnemonics as the gateway to new learning and ‘recognition memory’ too: to lay down a path to a new destination that you may not have even known about.</div>

<div>Mnemonics do not replace the knowledge and associations they unlock so you will usually have to follow the links to understand their full significance. Nor are the mnemonics here designed to displace the usual processes of critique to which you should subject all sources of information.</div>

<div>We specialise in pithy mnemonics that are ideally embedded in the question and range from simple facts to complex ideas. For example:
Who is Galahad? [Gala had] success finding the grail
Who is Jurgen Habermas? [Harbour mass] grudge against the system that makes us passive</div>

<div>In addition to these homonyms/puns, we also use other techniques such as rhymes, acronyms, alliteration, association, <a href='https://en.wikipedia.org/wiki/List_of_visual_mnemonics'  target='_new' >visual</a> cues, the <a href='https://major-system.info/en/'  target='_new' >major system</a>, and other tricks.</div>

<div>We are committed to open source and equitable access. All the content here is original and free for you to use if attributed to ‘mnemolibrary.com’. The code is open source too.</div>

<div>P.S. Before he was an adorable fish, [M]nemo ('fish' and 'nobody' in Latin) was an enigmatic polymath who explored the unknown depths in exile. Oh, and he had a well-stocked library and a long memory ('avenger' in Greek). Mnemo is also a play on '[mnemo]nic' and [Mnemo]syne, the goddess of memory.</div>

         

         </div>
        )
    }
}
