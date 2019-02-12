/* eslint-disable */ 
import React, { Component } from 'react';
import Utils from './Utils';
import FaChild from 'react-icons/lib/fa/child';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
export default class QuizList extends Component {
    
    constructor( props) {
        super(props);
        this.state={description:{}}
        this.loadQuizDetails = this.loadQuizDetails.bind(this);
        this.loadMissingMnemonics = this.loadMissingMnemonics.bind(this);
    }
    
    componentDidMount() {
        this.loadQuizDetails();
        this.loadMissingMnemonics();
    };

    componentDidUpdate(props) {
       // this.loadQuizDetails();
    };
    
    loadQuizDetails() {
        let that = this;
      
        if (Utils.isObject(this.props.quizzes)) {
            let quizzes = Object.keys(this.props.quizzes).sort().map((quiz, key) => {
               // var title = Utils.snakeToCamel(quiz)
                let url='/api/topicdetails';
                fetch(url,{ method: "POST",headers: {
                    "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
                        topic:quiz
                    })
                })
                .then(function(response) {
                    return response.json()
                }).then(function(json) {
                   // console.log(['LOAD QUIZ DETAILS',json]);
                  if (json && json.length > 0 && json[0].description && json[0].description.length > 0) {
                      let descriptionState = that.state.description;
                      descriptionState[quiz] = json[0].description;
                      that.setState({description:descriptionState});
                  } else {
                      return [];
                  }

                }).catch(function(ex) {
                console.log(['parsing failed', ex])
                })
            });
        };
            
        
    };
    
    loadMissingMnemonics() {
        let that = this;
      
        if (Utils.isObject(this.props.quizzes)) {
            let quizzes = Object.keys(this.props.quizzes).sort().map((quiz, key) => {
                return quiz;
            });
            // var title = Utils.snakeToCamel(quiz)
            let url='/api/missingmnemonics?rand='+Math.random();
            fetch(url,{ method: "POST",headers: {
                "Content-Type": "application/json"
                },
                body:JSON.stringify({
                    topics:quizzes.join(",")
                })
            })
            .then(function(response) {
                return response.json()
            }).then(function(json) {
                that.setState({questionsMissingMnemonics:json});
                //console.log(['LOAD missing DETAILS',json]);
                //if (json && json.length > 0 && json[0].description && json[0].description.length > 0) {
                  //let descriptionState = that.state.description;
                  //descriptionState[quiz] = json[0].description;
                  //that.setState({description:descriptionState});
              //} else {
                  //return [];
              //}

            }).catch(function(ex) {
                console.log(['parsing failed', ex])
            })
        };
            
        
    };
    

    render() {
        if (Utils.isObject(this.props.quizzes)) {
            let quizzes = Object.keys(this.props.quizzes).sort().map((quiz, key) => {
              var title = Utils.snakeToCamel(quiz)
              let missingCount = this.state.questionsMissingMnemonics && this.state.questionsMissingMnemonics.hasOwnProperty(quiz) ? this.state.questionsMissingMnemonics[quiz] : 0;
              let linkTo="/discover/topic/"+quiz;
              if (this.props.collection && this.props.collection.restricted) {
				  linkTo="/access/topic/"+quiz;
			  }
              
              return (<span key={quiz}  className='list-group-item'>
				  <Link to={linkTo}   >
					<span>{title}</span>
				  </Link>
				  {missingCount > 0 && this.props.isLoggedIn && this.props.isLoggedIn() && <a href={"/missing/"+quiz} className='btn btn-success' style={{float:'right'}}  ><FaChild size="22" /> {missingCount}</a>}
              
				  <div>{this.state.description[quiz]}</div>
              </span>);
              
            })
            return (
              <div className="quizzes list-group">
                  { quizzes }
                
              </div>
            )

        } else {
            return null
        }
    };
}
