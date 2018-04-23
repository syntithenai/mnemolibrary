import React, { Component } from 'react';

export default class CreateHelp extends Component {

    render() {
        return (<div id='createhelp'>
        <div>Extracting key points of encyclopedic, news, or academic articles focuses your reading and we find that the challenge of making mnemonic puns and rhymes is fun and addictive. 
        </div>
        
        <h4>Guidelines</h4>
        <ul>
            <li>No obscene, abusive or discriminatory entries</li>
            <li>Original mnemonics only</li>
            <li>Normal rules for capitalization, including tags (eg Egypt, politics, etc)</li>
        </ul>
        
        <h4>Mnemonic Techniques</h4>
        <ul>
            <li>Find a homonym embedded in the word/phrase. Try saying it aloud eg 'Stephen Langton: negotiated the Magna Carta with a [long tongue]'. (http://itools.com/tool/rhymezone-words-that-sound-like)</li>
            <li>Find words that rhyme with the keyword: 'If you want to be a genius, find a teacher like Comenius' (https://www.rhymezone.com/)</li>
            <li>Make an acronym: In what order of genus did homo sapiens evolve? 'many HEs, came down from trees' Answer: habilis, erectus, sapien</li>
            <li>Use alliteration: 'Mnemosyne, mother to muses', ‘Hydrogen Henry Cavendish’</li>
            <li>Any other pithy association  'Mather Cotton wore pure puritan cotton'</li>
            <li>Visual cues (eg Chinese character for ‘one’ looks like one stick or finger: “一”</li>
            <li>Major system, where numbers are involved (https://major-system.info/en)</li>
        </ul>
    
        <h4>Question Fields</h4>
        <b>Interrogative/Question</b>
            <div className='list-group' >
                
                <div className='list-group-item' >
                Question:  No question mark required. Enter (1) a question (eg 'Who was the Prime Minister of Australia in 1994', (2) a keyword (eg 'Darwin') with suitable entries above for interrogative (eg 'who is') and prefix (eg 'Charles'), OR (3) the title of the work in double quotation marks (eg “The Asian Century”) with ‘Can you explain:’ as the interrogative.
                </div>
                <div className='list-group-item' >
                
                Mnemonic: Square brackets for homonyms, round brackets for additional explanations: eg asinine: [I see none] (worth seeing); Choose ‘homonym’ if the mnemonic combines homonyms with other techniques.
                </div>
                <div className='list-group-item' >
                
                Answer: If quoting text in the answer, use quotation marks, source info, and page number if available. Paste no substantial amount of copyrighted text. Use an ellipsis to show omissions and square brackets for insertions, e.g.: M Raff in International Comparative Jurisprudence 1 (1), 24-32 states: "...[planned economy under socialism] lacked horizontal accountability between state-owned enterprises, collectives and agencies, leading to the development of socialist civil law." (Page 31)
                </div>
            <div className='list-group-item' >
                Tags: please separate by a comma.
            </div>
        </div>

        

        </div>)
    }
}