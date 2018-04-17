import React, { Component } from 'react';



export default class FindQuestions extends Component {
    
    
    
    render() {
        return  (
            <div className='findquestions'>
                <br/>
                <div>For teachers and students, news junkies, academics, language learners, trivia buffs, and punsters.</div>
                <div>A community of lifelong learners who use mnemonics.</div>
                
                <br/> <br/> 
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
                   <br/> 
            </div>
            
        )
    };
    
}
