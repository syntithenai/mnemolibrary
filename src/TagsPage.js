import React, { Component } from 'react';
import WordCloud from 'react-d3-cloud';


export default class TagsPage extends Component {

    
    render() {
        const fontSizeMapper = word => 2* Math.log2(word.value) * 5;
        const rotate = word => 0; //word.value % 360;
        const wordCloudWidth = window.innerWidth * 0.9;
        const wordCloudHeight = window.innerHeight * 0.5;
        
        return (
        <div>
                <h3>Tags</h3>
                <form className="form">
                  <input className="form-control col-sm-8" type="text" placeholder="Search" aria-label="Search" />
                </form>
                <WordCloud 
                    height={wordCloudHeight}
                    width={wordCloudWidth}
                    data={this.props.tags} 
                    fontSizeMapper={fontSizeMapper} 
                    rotate={rotate}
                    onWordClick={() => this.props.setQuiz} 
                >
                </WordCloud>
            </div>

        )
    }
};
