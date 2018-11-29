import React, { Component } from 'react';
import 'whatwg-fetch'
import QuestionList from './QuestionList';
//import {debounce} from 'throttle-debounce';
import DebounceInput from 'react-debounce-input';
// icons
import Search from 'react-icons/lib/fa/search';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'

export default class SearchPage extends Component {
    
    constructor(props) {
        super(props);
        this.state={'titleFilter':'','techniqueFilter':''};
        // debounce(500,
        this.setTitleFilter = this.setTitleFilter.bind(this);
        this.setTechniqueFilter = this.setTechniqueFilter.bind(this);
        this.filterQuestions = this.filterQuestions.bind(this);
    };
    
    setTitleFilter(event) {
        let title = event.target.value;
        let newState={'titleFilter':title,'techniqueFilter':this.state.techniqueFilter};
        this.setState(newState);
        this.filterQuestions(newState);
    };
    
    setTechniqueFilter(event) {
        let technique    = event.target.value;
        let newState={'titleFilter':this.state.titleFilter,'techniqueFilter':technique};
        this.setState(newState);
        this.filterQuestions(newState);
    };
    
    
    filterQuestions(filters) {
      let that = this;
      // load mnemonics and collate tags, topics
      fetch('/api/questions?search='+filters.titleFilter+'&technique='+filters.techniqueFilter.toLowerCase())
      .then(function(response) {
        //  //console.log(['got response', response])
        return response.json()
        }).then(function(json) {
          ////console.log(['set state', json])
          if (json.questions) {
            //  //console.log(['set state', json])
            that.setState({'questions':json.questions});
          }
      }).catch(function(ex) {
        //console.log(['parsing failed', ex])
      })
  }
    
    //filterQuestions(filters) {
        //let questions = [];
        //this.props.questions.forEach(function(question) {
            //const title = filters.titleFilter;
            //const technique = filters.techniqueFilter;
            //let passTitle = false;
            //let passTechnique = false;
            //if (title.length > 0) {
                //if (question.question.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    //passTitle = true;
                //}
            //} else {
                //passTitle = true;
            //}
            //if (technique.length > 0) {
                //if (question.mnemonic_technique.toLowerCase().indexOf(technique.toLowerCase()) >= 0) {
                    //passTechnique = true;
                //}
            //} else {
                //passTechnique = true;
            //}
            //if (passTitle && passTechnique) {
                //questions.push(question);
            //}
            
        //});
        //this.setState({'questions':questions});
        
    //};
    
    render() {
         let techniques = this.props.mnemonic_techniques.map((technique, key) => {
              
              return <option  key={key} value={technique}  >{technique}</option>
            })
        return (
        <div>
                <Link className="btn btn-info" to="/search/topics" >Topics</Link>
                  <Link className="btn btn-info"  to="/search/tags"  >Tags</Link>
              
            
              
                <form className="form-inline" onSubmit={(e) => e.preventDefault()}>
                  <DebounceInput className="form-control" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter} placeholder="Search" aria-label="Search" debounceTimeout={300} />
                  <select className="form-control" value={this.state.techniqueFilter}  onChange={this.setTechniqueFilter} ><option></option>{techniques}</select>
                  <button className="btn btn-outline-success" type="submit" ><Search/></button>
                </form>
                <QuestionList questions={this.state.questions} setQuiz={this.props.setQuiz} ></QuestionList>
            </div>
        )
    }
};
