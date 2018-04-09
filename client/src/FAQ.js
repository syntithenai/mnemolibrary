import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';

export default class FAQ extends Component {
    
    render() {
        return  (
        <div className="faq" >
            <h3>Frequently Asked Questions</h3>
           <HelpNavigation setCurrentPage={this.props.setCurrentPage}/> 
            <br/>

            <p><strong>Who is this site for?</strong></p>
            <p>Anyone! But these users come to mind: teachers and students, lifelong learners, news junkies, academics, language learners, trivia buffs, and punsters.</p>
            <p>&nbsp;</p>
            <p><strong>Why do I need to remember this stuff? It's all easily accessible on the Internet anyway.</strong></p>
            <p><span style={{fontWeight: "400"}}>It's tempting to externalise knowledge, 'okay Google'? But&nbsp;there are </span><a href="https://www.theatlantic.com/science/archive/2018/01/what-was-this-article-about-again/551603/"><span style={{fontWeight: 400}}>dangers</span></a><span style={{fontWeight: "400"}}> in over-reliance. And you need to remember what knowledge is out there in the first place.</span></p>
            <p><strong>Is that&nbsp;mnemonic really useful? It seems pretty cryptic</strong></p>
            <p>Yes, some puns are cryptic, which is why they often feature in cryptic crosswords, which aren't everyone's cup of tea. Some of the mnemonics won't be meaningful without understand the information. For example Leon Foucault ('Pendulum search [for coal], Showed the Earth's roll') requires a bit of work to associate coal with pendulums and with Foucault's use of this do demonstrate the rotation of the Earth (actually coal had nothing to do with it). And some people don't have an ear for puns: we might readily hear 'for coal' in 'Foucault', but we understand if you don't. But give it a go and see if it works. If not, you might want to limit your learning to questions that use other mnemonics, for example rhyme, which features heavily in the news and academic questions.</p>
            <p><strong>When should I start and stop reviewing?</strong></p>
            <p><span>It's up to you, but if you are consistently getting answers right in review, you should probably go back to the learn/discover phase.</span></p>
            <p><strong>How do I know my answer is right?</strong></p>
            <p><span>As a guideline, the idea is to recall the answer or, if there is no specific answer, what the mnemonic is referring to. But you may wish to remember more detail. For example, you may be satisfied to remember that Christiaan Huygens was a Dutch astronomer who developed the wave theory of light (mnemonic: &lsquo;the universe has [huge ends] traversed by light waves&rsquo;). Or you may want to remember the additional details that Huygens studied the rings of Saturn and discovered its moon Titan and was an eminent 17th Century scientist in a range of areas.</span></p>
            <p>&nbsp;</p>
            <p><span><strong>Why do I need to review the news? By then it's old news.</strong></span></p>
            <p><span>Many of our questions relate to news. And some of the information becomes redundant. But we try to extract information of enduring value (eg concepts, people, places). And these questions can be a useful historical document into what people were thinking at the time. Not to mention that we forget or misremember much of the news we read, especially the details.&nbsp;</span></p>
            <p><strong>How can I see what content is coming up?</strong></p>
            <p>The discover phase comes in sets of up to 20 entries, which can be viewed with the &lsquo;3 dots&rsquo; drop down menu to the top left. Another 20 entries are automatically generated when you have finished, but we recommend reviewing entries in your knowledge base until you are consistently making successful recalls before you discover more content.</p>
            <p><strong>Can I borrow your content?</strong></p>
            <p>All the content here is original and free for you to use if attributed to &lsquo;mnemolibrary.com&rsquo; or 'Mnemo's Library'. The code is open source too. See the terms of use.</p>
            <p><strong>Who created this site?</strong></p>
            <p>Two Australians: a&nbsp;<span>programmer and&nbsp;</span>an academic</p>
            <p>&nbsp;</p>
            <p><strong>What do you get out of it? Are you selling my data?</strong></p>
            <p><span>No, we are not selling data (see terms of use). We might put some&nbsp;up some ads or&nbsp;charge for some 'premium' features to cover our costs. Otherwise, we have&nbsp;no commercial or ideological agenda other than wanting to&nbsp;make something that is useful to people and that makes knowledge more accessible as the inherently valuable heritage of&nbsp;the world.</span></p>
            <p><strong>Why should I help create mnemonics?</strong></p>
            <p><span> There are a few good reasons to join us. Like a mini blog entry, you can curate content that you think is important or valuable and worthy of sharing, including your own work as a journalist, academic, or artist. And extracting key points of encyclopedic, news, or academic articles focuses your reading. You will also find that the challenge of making mnemonic puns and rhymes is fun and addictive. Finally, you earn gratitude and respect on this site, which will be conveyed through badges, rankings, statistics etc.</span></p>
            <p><strong>What does the name mean?</strong></p>
            <p>Before he was an adorable fish, [M]nemo ('fish' and 'nobody' in Latin) was an enigmatic polymath who explored the unknown depths in exile. Oh, and he had a well-stocked library and a long memory ('avenger' in Greek). Mnemo is also a play on '[mnemo]nic' and [Mnemo]syne, the goddess of memory.</p>
        </div>
)

}


}


