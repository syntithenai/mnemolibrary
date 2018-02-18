import React, { Component } from 'react';

import QuestionList from './QuestionList';

// icons
import Search from 'react-icons/lib/fa/search';


export default class SearchPage extends Component {
    
    render() {

        return (
        <div>
                <h3>Search</h3>
                <form className="form-inline">
                  <input className="form-control" type="text" placeholder="Search" aria-label="Search" />
                  <select className="form-control"  ><option></option><option>Rhyme</option><option>Association</option><option>Homonym</option><option>Acronym</option><option>Alliteration</option><option>Association</option></select>
                  <button className="btn btn-outline-success" type="submit"><Search/></button>
                </form>
                <QuestionList questions={this.props.questions} setQuiz={() => this.props.setQuiz} ></QuestionList>
            </div>
        )
    }
};
