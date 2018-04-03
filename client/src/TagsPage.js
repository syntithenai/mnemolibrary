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
        let tagsCollation = {};
        if (title.length > 0) {
            let that = this;   
            console.log(['filter tags',this.props.tags]);     
            //Object.keys(this.props.tags).forEach(function(tagKey) {
            for (var w in this.props.tags) {
                let word = this.props.tags[w];
                let tag = word.text;
                //console.log(word);
                // collate on tag
                if (tag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    word.value *= 20;
                    tagsCollation[tag]=word;
                }
                // check related
                Object.keys(that.props.relatedTags[tag]).forEach(function(reltag) {
                    
                    //if (reltag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    //    tagsCollation[reltag.trim().toLowerCase()]={text:reltag.trim().toLowerCase(),value:word.value /30};
                    //}    
                });
                   
            };
            console.log(['TAGS collation',tagsCollation]);
            for (var theTag in tagsCollation) {
                tags.push(tagsCollation[theTag]);
            }
            console.log(['TAGS',tags]);
        } else {
            tags = this.props.tags;
        }
        this.setState({'tags':tags});
    };
    
    render() {
        const fontSizeMapper = word => 2* Math.log2(word.value+10) * 2;
        const rotate = word => 0; //word.value % 360;
        const wordCloudWidth = window.innerWidth * 0.9;
        const wordCloudHeight = window.innerHeight * 0.5;
        console.log(this.state.tags);
        
        return (
        <div>
                <a className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('topics')}>Topics</a>
                  <a className="btn btn-info" href="#"  onClick={() => this.props.setCurrentPage('search')}>Questions</a>
              
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
