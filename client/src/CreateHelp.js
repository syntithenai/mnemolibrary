import React, { Component } from 'react';

export default class CreateHelp extends Component {

    render() {
        return (<div id='createhelp'>
        <div>Extracting key points of encyclopedic, news, or academic articles focuses your reading and we find that the challenge of making mnemonic puns and rhymes is fun and addictive. 
        <br/><br/>
        <b>To add your own questions&nbsp;<button className="btn btn-info" onClick={() => this.props.setCurrentPage('login')}    >Join The Library</button> </b>
        <br/>
        </div>
        
        <iframe width="560" height="315" src="https://www.youtube.com/embed/x1K2NZyvr4g" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
        
        <h4>Guidelines</h4>
        <ul>
            <li>No obscene, abusive or discriminatory entries</li>
            <li>Original mnemonics only</li>
            <li>Normal rules for capitalization, including tags (eg Egypt, politics, etc)</li>
        </ul>
        
        <h4>Mnemonic Techniques</h4>
          <ul>
            <li><a  target="_new"  href="http://itools.com/tool/rhymezone-words-that-sound-like">Find</a> a homonym embedded in the word/phrase. Try saying it aloud eg 'Stephen Langton: negotiated the Magna Carta with a [long tongue]'.</li>
            <li><a  target="_new"  href="https://www.rhymezone.com">Find</a> words that rhyme with the keyword: 'If you want to be a genius, find a teacher like Comenius'</li>
            <li>Make an acronym: In what order of genus did homo sapiens evolve? 'many HEs, came down from trees' Answer: habilis, erectus, sapien</li>
            <li>Use alliteration: 'Mnemosyne, mother to muses', &lsquo;Hydrogen Henry Cavendish&rsquo;</li>
            <li>Any other pithy association 'Mather Cotton wore pure puritan cotton'</li>
            <li>Visual cues (eg Chinese character for &lsquo;one&rsquo; looks like one stick or finger: &ldquo;一&rdquo;</li>
            <li><a  target="_new"  href="https://major-system.info/en">Major system</a>, where numbers are involved.</li>
          </ul>

                
    
    
        <h4>Question Fields</h4>
        <b>Interrogative/Question</b>
            <div className='list-group' >
                
                <div className='list-group-item' >
                Question:  No question mark required. Enter (1) a question (eg 'Who was the Prime Minister of Australia in 1994', (2) a keyword (eg 'Darwin') with suitable entries above for interrogative (eg 'who is') and prefix (eg 'Charles')
                </div>
                
            
                <div className='list-group-item' >
                
                
                Mnemonic: Square brackets for homonyms, round brackets for additional explanations: eg asinine: [I see none] (worth seeing); Choose ‘homonym’ if the mnemonic combines homonyms with other techniques.
                </div>
                <div className='list-group-item' >
                
                Answer: If quoting text in the answer, use quotation marks, source info, and page number if available. Paste no substantial amount of copyrighted text. Use an ellipsis to show omissions and square brackets for insertions, e.g.: M Raff in International Comparative Jurisprudence 1 (1), 24-32 states: "...[planned economy under socialism] lacked horizontal accountability between state-owned enterprises, collectives and agencies, leading to the development of socialist civil law." (Page 31)
                
                </div>
                <div className='list-group-item' >
                
                    Difficult: 
                    <ul><li>young learner: content suitable for children 10+, mnemonics that don’t presume a large vocabulary or knowledge base, preference for short specific answers; additional material in answer in <a href='https://en.wikipedia.org/wiki/Simple_English' target='_new' >Simple English</a>. </li>
                    <li>adult learner: content suitable for adults that a general reader is likely to have basic familiarity with (e.g. Vladmir Putin)</li>
                    <li>sage: content suitable for adults, content that a general reader is unlikely to be familiar with (e.g. Edwin Hubble, Jainism)</li>
                    </ul>                
                </div>
            
        </div>

        

        </div>)
    }
}
