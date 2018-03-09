import React, { Component } from 'react';



export default class FindQuestions extends Component {
    
    
    
    render() {
        return  (
            <div className='findquestions'>
            <b>Lock down those memories</b><br/> 
                <button className="btn  btn-info" href="#"  onClick={() => this.props.setCurrentPage('review')} >Review</button>
            <div><br/></div>
            <b>Find something new to learn</b><br/> 
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('topics')}>Topics</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('tags')}>Tags</button>
                <button className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('search')}>Questions</button>
               <br/> 
               <br/> 
            </div>
            
        )
    };
    
}
