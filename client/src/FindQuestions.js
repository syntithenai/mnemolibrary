import React, { Component } from 'react';



export default class FindQuestions extends Component {
    
    
    
    render() {
        return  (
            <div className='findquestions'>
                <span>Welcome to Mnemos Library.</span>
                <br/> 
                <br/> 
                <b>Find something new to learn</b>
                <br/> 
                <button className="btn btn-info" href="#"  onClick={() => this.props.discoverQuestions()}>Discover</button>
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
