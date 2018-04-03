import React, { Component } from 'react';
import QuizList from './QuizList';

export default class QuizCollection extends Component {
    render() {
        if (Array.isArray(this.props.collection)) {
            
            let collections = this.props.collection.map((collection, key) => {
                console.log([collection,key]);
              if (collection.topics) {
                  let collatedTopics={};
                  collection.topics.forEach(function(topic) {
                      collatedTopics[topic]=1;
                  });
                  return <div className='col-6' key={key} >
                          <div className="joe">
                          <h4>{collection.name}</h4>
                            <QuizList quizzes={collatedTopics} setQuiz={this.props.setQuiz} ></QuizList>
                          </div>  
                      </div>
              }
              return
              
            })
            //<a onClick={() => this.props.setQuiz()}  href="#"  className="btn btn-info" style={{float:'right'}}  >More</a>
            return (
              <div className="quiz-collection-questions row">
                  {
                    collections
                  }
                
              </div>
            )
        } else {
            return null
        }
        
        
    };
}
