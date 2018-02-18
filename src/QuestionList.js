import React, { Component } from 'react';

export default class QuestionList extends Component {
    render() {
        //console.log(['que',this.props]);
        if (Array.isArray(this.props.questions)) {
            let questions = this.props.questions.map((question, key) => {
              return <div className='list-group-item' key={question.ID} >
              <a onClick={() => this.props.setQuiz(question)}  href="#"   >{question.interogative}&nbsp;{question.question}</a>
              
              </div>
              
            })
            return (
              <div className="questions list-group">
                  {
                    questions
                  }
                
              </div>
            )
        } else {
            return null
        }
        
        
    };
}

//<div><span id={mnemonic_id} >{question.mnemonic}</span></div>
              //<div><span id={answer_id} data-toggle="collapse" href={answer_id} >{question.answer}</span><button className="btn btn-primary" type="button" data-toggle="collapse" data-target={answer_hash} aria-expanded="false" >More</button></div>
              //<div><span id="sss" >wiki page here</span><a href={question.link} target='_new' >More Info</a></div>
