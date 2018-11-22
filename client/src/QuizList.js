import React, { Component } from 'react';
import Utils from './Utils';
import FaChild from 'react-icons/lib/fa/child';

export default class QuizList extends Component {
    
    constructor( props) {
        super(props);
        this.state={description:{}}
        this.loadQuizDetails = this.loadQuizDetails.bind(this);
    }
    
    componentDidMount() {
        this.loadQuizDetails();
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
                    console.log(['LOAD QUIZ DETAILS',json]);
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

    render() {
        if (Utils.isObject(this.props.quizzes)) {
            let quizzes = Object.keys(this.props.quizzes).sort().map((quiz, key) => {
              var title = Utils.snakeToCamel(quiz)
              let missingCount = this.props.questionsMissingMnemonics && this.props.questionsMissingMnemonics.hasOwnProperty(quiz) ? this.props.questionsMissingMnemonics[quiz] : 0;
              return <div onClick={() => this.props.setQuiz(quiz)} className='list-group-item' key={quiz} >
              
              <a href='#'>{title}</a>
              <div>{this.state.description[quiz]}</div>
              {missingCount > 0 && this.props.isLoggedIn && this.props.isLoggedIn() && <button className='btn btn-success' style={{float:'right'}} onClick={() => this.props.setQuizFromMissingMnemonic(quiz)} ><FaChild size="22" /> {missingCount}</button>}</div>
              
            })
            return (
              <div className="quizzes list-group">
                  {
                    quizzes
                  }
                
              </div>
            )

        } else {
            return null
        }
    };
}
