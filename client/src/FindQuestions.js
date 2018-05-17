import React, { Component } from 'react';



export default class FindQuestions extends Component {
    
    
    
    render() {
        return  (
            <div className='findquestions'>
                <br/> 
                <div>For teachers and students, news junkies, academics, language learners, trivia buffs, and punsters.</div>
                <div>An encyclopedia. A memorization tool. A community.</div>
                <br/>
                
               <iframe width="560" height="315" src="https://www.youtube.com/embed/qXh6hkzy-8k" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                <iframe width="560" height="315" src="https://www.youtube.com/embed/vHGdwGZvNFE" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                
                
                <br/>
                <br/>
                 <b>To save and review your progress across devices<br/><button className="btn btn-info" onClick={() => this.props.setCurrentPage('login')}    >Join The Library</button> </b>
                
                 <br/> 
                <b>Learn something new</b>
                <br/> 
                <button className="btn btn-info" href="#"  onClick={() => this.props.setQuizFromDiscovery()}>Discover</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('topics')}>Topics</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('tags')}>Tags</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('search')}>Questions</button>
                <br/> 
                <br/>
                <b>Lock down those memories</b>
                <br/> 
                    <button className="btn  btn-info" href="#"  onClick={() => this.props.setCurrentPage('review')} >Review</button>
                   <br/>  <br/>  <br/> 
                   
            </div>
            
        )
    };
    
}
