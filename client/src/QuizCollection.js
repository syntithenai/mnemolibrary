import React, { Component } from 'react';
import QuizList from './QuizList';

export default class QuizCollection extends Component {
    render() {
        if (Array.isArray(this.props.collection)) {
            
            let collectionsCol1 = this.props.collection.sort(function(a,b) {
                if (a.sort < b.sort) return -1;
                else if (a.sort > b.sort) return 1;
                else return 0;
            }).map((collection, key) => {
                //console.log([collection,key]);
              if (collection.topics && collection.column==="1") {
                  let collatedTopics={};
                  collection.topics.forEach(function(topic) {
                      collatedTopics[topic]=1;
                  });
                  return <div   key={key} >
                          <h4>{collection.name}</h4>
                          <QuizList quizzes={collatedTopics} setQuiz={this.props.setQuiz} ></QuizList>
                        </div>
              }
              return '';
              
            })
            
             let collectionsCol2 = this.props.collection.map((collection, key) => {
                //console.log([collection,key]);
              if (collection.topics&& collection.column!=="1") {
                  let collatedTopics={};
                  collection.topics.forEach(function(topic) {
                      collatedTopics[topic]=1;
                  });
                  return <div   key={key} >
                          <h4>{collection.name}</h4>
                          <QuizList quizzes={collatedTopics} setQuiz={this.props.setQuiz}  questionsMissingMnemonics={this.props.questionsMissingMnemonics}   setQuizFromMissingMnemonic={this.props.setQuizFromMissingMnemonic}></QuizList>
                        </div>
              }
              return '';
            })
            
            //<a onClick={() => this.props.setQuiz()}  href="#"  className="btn btn-info" style={{float:'right'}}  >More</a>
            return (
              <div className="quiz-collection-questions row">
                <div className="col-6" >
                  {
                    collectionsCol1
                  }
                </div>
                <div className="col-6" >
                  {
                    collectionsCol2
                  }
                </div>
              </div>
            )
        } else {
            return null
        }
        
        
    };
}
