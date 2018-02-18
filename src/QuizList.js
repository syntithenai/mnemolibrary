import React, { Component } from 'react';

export default class QuizList extends Component {

    //constructor() {
        //super();

        //this.state = {
            //items: this.props.quizzes,
            //pageOfItems: []
        //};

        //// bind function in constructor instead of render (https://github.com/yannickcr/eslint-plugin-react/blob/master/docs/rules/jsx-no-bind.md)
        //this.onChangePage = this.onChangePage.bind(this);
    //}

    //onChangePage(pageOfItems) {
        //// update state with new page of items
        //this.setState({ pageOfItems: pageOfItems });
    //}

    isObject (value) {
      return value && typeof value === 'object' && value.constructor === Object;
    };

    snakeToCamel(s){
        var c = s.replace(/(_\w)/g, function(m){return ' ' + m[1].toUpperCase() ;});
        c = c.charAt(0).toUpperCase() + c.slice(1)
        return c
    }

    render() {
        //console.log(['quizzes',this.props]);
        if (this.isObject(this.props.quizzes)) {
            let quizzes = Object.keys(this.props.quizzes).map((quiz, key) => {
              var title = this.snakeToCamel(quiz)
              return <div className='list-group-item' key={quiz} >
              <a onClick={() => this.props.setQuiz(quiz)} href="#" >{title}</a></div>
              
            })
            //console.log(['quizzes',quizzes]);
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
