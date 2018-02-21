import React, { Component } from 'react';

export default class AboutPage extends Component {
    
    render() {
        return  (
        <div className="aboutpage" >
        
            <nav className='nav' style={{float:'right'}}>
                <button class='btn btn-info' onClick={() => this.props.setCurrentPage('intro')}>Getting Started</button>
                <button class='btn btn-info' onClick={() => this.props.setCurrentPage('termsofuse')}>Terms Of Use</button>
            </nav>
            <div>Before he was an adorable fish, Nemo ('fish' and 'nobody' in Latin) was an enigmatic polymath who wandered in exile in the ocean depths. Oh, and he had a well-stocked library and a long memory ('avenger' in Greek). Nemo is also a play on 'mnemonic' and Mnemosyne, the goddess of memory.</div>
             
            <div>If you're like us, you wish you had a better memory. Whether you need to pass a test, impress your friends, or dread the dark descent into dementia, you too may have googled 'better memory'. You may have discovered the power of staggered recall and mnemonics.</div>

            <div>Staggered recall transfers short term memories into long ones. Mnemonics (memory aids) give you a candle in the darkness. They are no mere tricks to recall dates and names: think 'Christopher Columbus sailed the ocean blue in 1492'. They can be shorthand for whole concepts: 'Habermas [harbours mass] grudge against the system that makes us passive'.</div>
             
            <div>We created Nemo's Library to combine these techniques with an efficient, collaborative platform. You recall information relating to a keyword or question by learning and then recalling a mnemonic. There are ways of filtering the type of information you wish to recall. Nemo's Library shuffles successful recalls to the back and eventually the information can be remembered without the mnemonic. It is lodged in your long term memory.</div>

            <div>The best mnemonics are your own so please use our form to create entries and, if relevant to a general audience, share them. Here are some tips:
            <ul>
            <li>
            Say it aloud and see what you can associate: 'Stephen Langton: negotiated the Magna Carta with a [long tongue]'. Please use square brackets to highlight the homonym. </li>
            <li>Find words that rhyme with the keyword: 'If you want to be a genius, find a teacher like Comenius'</li>
            <li>Make an acronym: In what order of genus did homo sapiens evolve? 'many HEs came down from trees' (habilis, erectus, sapien)</li>
            <li>Use alliteration: 'Mnemosyne, mother to muses', ‘Hydrogen Henry Cavendish’</li>
            <li>Any other pithy, imaginative association that works: 'Mather Cotton wore pure puritan cotton'</li>
            </ul>
            </div>
            <div>
            Try to link the mnemonic to a central theme that connects associated information: eg in the mnemonic ‘St Mark: Left his [mark] on the pyramids’, the associated information with ‘pyramid’ is that he is said to have founded the Church of Alexandria, one of the most important sites of Early Christianity and a predecessor to the Coptic Church and Christianity in Africa.</div>
            <div>
            If you can’t think of anything, come back to it later with fresh eyes rather than waste time trying to force it.
            </div>
            <div>
            <b>Keep it nice: obscene, abusive or discriminatory entries are not suitable for sharing</b>
            </div>

            <div>
            Of course, there can be quite a lot of background research that goes into making the mnemonic. Mnemonics do not replace the knowledge and associations they unlock so you will usually have to follow the source to understand their full significance. Nor are the mnemonics here designed to displace the usual processes of critique to which you should subject all sources of information.
            </div>
            <div>
            With those caveats, thanks for sharing your memories!
            </div>

            <div>Nautilus Crew</div>
        </div>
        )
    }
}
