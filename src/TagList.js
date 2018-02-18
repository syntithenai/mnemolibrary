import React, { Component } from 'react';


export default class TagList extends Component {

    isObject (value) {
      return value && typeof value === 'object' && value.constructor === Object;
    };
    
    render() {
        console.log(['tags',this.props]);
        if (this.isObject(this.props.tags)) {
            let tags = Object.keys(this.props.tags).map((tag, key) => {
              return <div className='columns large-3' key={tag} >
              <a href='#'  >{tag}</a></div>
            })
            console.log(['tags',tags]);
            return (
              <div className="tags row">
                  {
                    tags
                  }
                
              </div>
            )
        } else {
            return null
        }
    };
}
