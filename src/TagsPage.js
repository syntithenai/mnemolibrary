import React, { Component } from 'react';
import WordCloud from 'react-d3-cloud';


export default class TagsPage extends Component {
    
    constructor(props) {
        super(props);
        this.state={'tags':this.props.tags,'titleFilter':''};
        // debounce(500,
        this.setTitleFilter = this.setTitleFilter.bind(this);
        this.filterTags = this.filterTags.bind(this);
    };
    
    setTitleFilter(event) {
        let title = event.target.value;
        let newState={'titleFilter':title};
        this.setState(newState);
        this.filterTags(title);
    };
    
    filterTags(title) {
        let tags = [];
        let that = this;
        if (title.length > 0) {
            let that = this;        
            Object.keys(this.props.tags).forEach(function(tagKey) {
                let tag = that.props.tags[tagKey].text;
                if (tag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    tags.push(that.props.tags[tagKey]);
                }
                // check related
                Object.keys(that.props.relatedTags[tag]).forEach(function(tag) {
                    if (tag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                        tags.push(that.props.tags[tagKey]);
                    }    
                });
                   
            });
        } else {
            tags = this.props.tags;
        }
        this.setState({'tags':tags});
    };
    
    render() {
        const fontSizeMapper = word => 2* Math.log2(word.value) * 5;
        const rotate = word => 0; //word.value % 360;
        const wordCloudWidth = window.innerWidth * 0.9;
        const wordCloudHeight = window.innerHeight * 0.5;
        
        return (
        <div>
                <form className="form">
                  <input className="form-control col-sm-8" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter}  placeholder="Search" aria-label="Search" />
                </form>
                <WordCloud 
                    height={wordCloudHeight}
                    width={wordCloudWidth}
                    data={this.state.tags} 
                    fontSizeMapper={fontSizeMapper} 
                    rotate={rotate}
                    onWordClick={this.props.setQuiz} 
                >
                </WordCloud>
            </div>

        )
    }
};
