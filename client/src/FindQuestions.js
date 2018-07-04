import React, { Component } from 'react';

import HomeCarousel from './HomeCarousel';

export default class FindQuestions extends Component {
    
    
                  //<div>For teachers and students, news junkies, academics, language learners, trivia buffs, and punsters.</div>
                //<div>An encyclopedia. A memorization tool. A community.</div>  
                //<iframe width="560" height="315" src="https://www.youtube.com/embed/qXh6hkzy-8k" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                //<iframe width="560" height="315" src="https://www.youtube.com/embed/vHGdwGZvNFE" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                
    render() {
        return  (
            <div className='findquestions'>
                <span id="firstvideo" ></span>
                <br/> 

                <h5>&nbsp;&nbsp;&nbsp;Learn about the world through adaptive review of rhymes and other creative memory devices.</h5>
                <HomeCarousel/>
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
