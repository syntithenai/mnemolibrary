/* eslint-disable */ 
import React, { Component } from 'react';

export default class NotesList extends Component {
    constructor(props) {
        super(props);
        //let question = this.props.question ? this.props.question : {};
        this.state={notes:[]}
       this.loadNotes = this.loadNotes.bind(this)
    };
    
    componentDidMount() {
        this.loadNotes()
    }
    

     loadNotes() {
         ////console.log('REPORT PROB '+this.state.question.problem);
		let that = this;
		if (this.props.user && this.props.question) {
		  fetch('/api/notes?user='+this.props.user+'&question='+this.props.question).then(function(response) {
				console.log(['got response'])
				return response.json()
			}).then(function(json) {
				that.setState({notes:json});
			}).catch(function(ex) {
				console.log(['parsing failed', ex])
			})
		}
	};
    
    
    render() {
		let that = this;
		let renderedNotes = [];
		if (this.state.notes && this.state.notes.length > 0) {
			this.state.notes.map(function(note) {
				let current_datetime = new Date(note.createDate)
				let formatted_date = current_datetime.getDate() + "-" + (current_datetime.getMonth() + 1) + "-" + current_datetime.getFullYear()
				
				renderedNotes.push( <div key={note._id} >
					<span className='date' style={{fontWeight:'bold',marginRight:'2em'}} >{formatted_date}</span>
					{note.type === "comment" && note.userAvatar && note.userAvatar.length > 0 &&  <span className='user' >by {note.userAvatar}</span>}
					<div className='comment' >{note.comment}</div>
					<hr/>
				</div>)
				return;
			});
			
			return <div style={{marginTop:'1em'}}>				
				{renderedNotes.length > 0 && <div><b>Notes</b></div>}
				{renderedNotes}
			</div>
			
		} else {
			return null;
		}
	}
};
