import React, { Component } from 'react';
//import { render } from 'react-dom';
//import Pagination from './Pagination';
import WordCloud from 'react-d3-cloud';
import SignIn from './SignIn';
import QuestionList from './QuestionList';
import QuizList from './QuizList';

//import logo from './logo.svg';
//import './App.css';
import 'whatwg-fetch'

import 'bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
// icons
import Search from 'react-icons/lib/fa/search';



class Navigation extends Component {
    render() {
        return  (
        <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
          <a className="navbar-brand" href="#"><img src="mnemoicon.jpg" height="100%" /></a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarCollapse">
            <ul className="navbar-nav mr-auto" onClick={(e) => console.log(this)} data-view="home">
              <li className="nav-item active dropdown">
                <a className="nav-link dropdown-toggle expanded" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true" href="#">Learn <span className="sr-only">(current)</span></a>
                <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
                  <a class="dropdown-item" href="#">Random</a>
                  <a class="dropdown-item" href="#">Topics</a>
                  <a class="dropdown-item" href="#">Search</a>
                  <a class="dropdown-item" href="#">Featured</a>
                </div>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Review</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">Create</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="#">About</a>
              </li>
            </ul>
          </div>
        </nav>
        )
    };
    
}


class App extends Component {
  constructor(props) {
      console.log('APP CONSTRUCT')
      super(props);
      this.state = {
          title : "Mnemo Learning",
          //questions: [{a:"aaaaa",b:"bbbbbb", c:"cccccccccc", d:"ddddddddddd"}]
          questions: [],
          quizzes: [],
          words: [],
          currentPage: 'random'
      }
  }; 
  
  componentDidMount() {
      const that = this
      console.log('APP DID MOUNT')
      fetch('/mnemonics.json')
      .then(function(response) {
          console.log(['fetched',response])
        return response.json()
      }).then(function(json) {
        console.log(['parsed json',json])
        var quizzes = {}
        var tags = {}
        // collate quizzes and tags
        for (var question in json['questions']) {
            var id = json['questions'][question].ID
            var quizList = json['questions'][question].quiz.split(',');
            var tagList = json['questions'][question].tags; //.split(',')
            //console.log(["COLLATE",id,quizList,tagList]);
            for (var quizKey in quizList) {
                var quiz = quizList[quizKey];
                if (! (Array.isArray(quizzes[quiz]))) {
                    console.log('setup quiz ' + quiz);
                    quizzes[quiz] = []
                }
                quizzes[quiz].push(id);
            }
            for (var tagKey in tagList) {
                var tag = tagList[tagKey];
                if (! (Array.isArray(tags[tag]))) {
                    tags[tag] = []
                }
                tags[tag].push(id);
            }
        }
        let words = [];
        for (let tag in tags) {
            words.push({text:tag, value: tags[tag].length});
        }
    
        
        
        console.log(['SETSTATE',{'questions':json['questions'],'quizzes':quizzes,'tags':words}]);
        that.setState({'questions':json['questions'],'quizzes':quizzes,'tags':words});
      }).catch(function(ex) {
        console.log(['parsing failed', ex])
      })
      
  }
  
  componentDidUpdate() {
      console.log('APP DID UPDATE')
      
  };
    
  render() {
      console.log('APP RENDER')
    const questions = this.state.questions
    //const tags = this.state.tags
    const quizzes = this.state.quizzes
    const words = this.state.words  ? this.state.words : [];
    const fontSizeMapper = word => 2* Math.log2(word.value) * 5;
    const rotate = word => 0; //word.value % 360;
    const width = window.innerWidth * 0.9;
    const height = window.innerHeight * 0.9;
    return (
      <div className="Mnemo">
        
        <Navigation/>
        
            <div className='row'>
                <div className='col-sm-6' >
                <form className="form-inline mt-2 mt-md-0">
              <input className="form-control mr-sm-2" type="text" placeholder="Search" aria-label="Search" />
              <button className="btn btn-outline-success my-2 my-sm-0" type="submit"><Search/></button>
            </form>
            
            </div>
            <div className='col-sm-2' >
                
            </div>
        </div>
        
        <div className='row'>
            <div className='col-sm-6'>
            <QuizList quizzes={quizzes} ></QuizList>
            </div>
            <hr/>
            <div className='col-sm-6'>
                AA<WordCloud 
                    height="{height}"
                    width="{width}"
                    data={tags} 
                    fontSizeMapper={fontSizeMapper} 
                    rotate={rotate}
                >
                </WordCloud>BBS
            </div>
        </div>
        <hr/>
        <QuestionList questions={questions} ></QuestionList>
      </div>
    );
  }
}




export default App;
