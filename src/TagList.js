import React, { Component } from 'react';

import Utils from './Utils';

export default class TagList extends Component {

    
    render() {
        if (Utils.isObject(this.props.tags)) {
            let tags = Object.keys(this.props.tags).map((tag, key) => {
              return <div className='columns large-3' key={tag} >
              <a href='#'  >{tag}</a></div>
            })
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
