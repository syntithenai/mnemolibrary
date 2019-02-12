/* eslint-disable */ 
import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import HomeCarousel from './HomeCarousel';
import HelpNavigation from './HelpNavigation';

export default class FindQuestions extends Component {
    
    
                  //<div>For teachers and students, news junkies, academics, language learners, trivia buffs, and punsters.</div>
                //<div>An encyclopedia. A memorization tool. A community.</div>  
                //<iframe width="560" height="315" src="https://www.youtube.com/embed/qXh6hkzy-8k" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                //<iframe width="560" height="315" src="https://www.youtube.com/embed/vHGdwGZvNFE" frameBorder="0" allow="autoplay; encrypted-media" allowFullScreen></iframe>
                
    render() {
        return  (
            <div className='findquestions'>
                <HelpNavigation />
                <span id="firstvideo" ></span>
                <br/> 

                <h5>&nbsp;&nbsp;&nbsp;Learn about the world through adaptive review of rhymes and other creative memory devices.</h5>
                <HomeCarousel/>
                <br/>
                <br/>
                 <b>To save and review your progress across devices<br/><Link className="btn btn-info" to="/login"    >Join The Library</Link> </b>
                
                 <br/> 
                <b>Learn something new</b>
                <br/> 
                <Link className="btn btn-info" to="/discover" >Discover</Link>
                <Link className="btn btn-info" to="/search" >Topics</Link>
                <Link className="btn btn-info" to="/search/tags" >Tags</Link>
                <Link className="btn btn-info" to="/search/questions" >Questions</Link>
                <br/> 
                <br/>
                <b>Lock down those memories</b>
                <br/> 
                    <Link className="btn  btn-info" to="/review" >Review</Link>
                   <br/>  <br/>  <br/> 
                   
            </div>
            
        )
    };
    
}
