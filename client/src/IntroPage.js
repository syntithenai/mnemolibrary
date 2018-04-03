import React, { Component } from 'react';

export default class IntroPage extends Component {
    
    render() {
        return  (
        <div className="intropage" >
            
           
<h3>Getting Started.</h3>
<nav className='nav'    >
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('help')}>Help</button>
                <button className='btn btn-info' onClick={() => this.props.setCurrentPage('terms')}>Terms and Conditions</button>
            </nav> 
            
<h4>Learn</h4>

During the learn phase, you view entries for the first time. If the information is unfamiliar to you, you can read the answer (if there is one) or 'more info'. Then read the mnemonic to help you retain the information. To help you decide what to learn, there are three entry points: topics, tags, and search.

<h4>Topics</h4>

Topics are searchable lists of questions that the creator has grouped together around a theme. For example, 'Politics 1' is a group of 20 questions loosely grouped around this theme.

<h4>Tags</h4>

Every entry has one or more tags, which also indicate themes. For example, 'Who is Marcus Aurelius?' has the tags 'history', 'Rome', and 'philosophy'. The tag cloud displays tags for all entries: the more entries a tag is attached to, the larger that tag will appear. Click on the tag to display all entries with that tag.

<h4>Search</h4>

You can also search for individual questions, and delimit this search by the type of mnemonic. For example, if you were looking for a mnemonic for St Paul, you could type ‘Paul’. If you prefer mnemonics that use visual cues, use the drop down menu to select 'visual' and so on. You can combine this with keyword searches or just leave that field blank.

<h4>Review</h4>

We have adopted an open-ended definition of a successful recall. This means that ultimately it is up to users to decide whether they are satisfied with their recall. As a guideline, the idea is to recall the answer or, if there is no specific answer, what the mnemonic is alluding to. Recalling the mnemonic itself is not necessary or sufficient. 

<br/><br/>
            
            
            <i>Nautilus Crew</i>
        </div>
        )
    }
}
