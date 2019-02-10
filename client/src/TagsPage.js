import React, { Component } from 'react';
import WordCloud from 'react-d3-cloud';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'


export default class TagsPage extends Component {
    
    constructor(props) {
        super(props);
        this.state={'tags':this.props.tags,'titleFilter':this.props.titleFilter,searchTag:null};
        // debounce(500,
        this.setTitleFilter = this.setTitleFilter.bind(this);
        this.filterTags = this.filterTags.bind(this);
        this.setSearchTag = this.setSearchTag.bind(this);
    };
    
    componentDidMount() {
        this.filterTags(this.props.titleFilter);
    };
    
    setTitleFilter(event) {
        let title = event.target.value;
        let newState={'titleFilter':title};
        this.setState(newState);
        this.filterTags(title);
    };
    
    filterTags(title) {
        let that = this;
          fetch('/api/tags?title='+(title ? title.toLowerCase() : '') )
          .then(function(response) {
            return response.json()
          }).then(function(json) {
              ////console.log(['SET TAGS', json])
            that.setState({'tags':json});
          }).catch(function(ex) {
            //console.log(['parsing failed', ex])
          })
        
        
        //let tags = [];
        //let tagsCollation = {};
        
        
        //if (title.length > 0) {
            //let that = this;   
            ////console.log(['filter tags',this.props.tags]);     
            ////Object.keys(this.props.tags).forEach(function(tagKey) {
            //for (var w in this.props.tags) {
                //let word = this.props.tags[w];
                //let tag = word.text;
                //////console.log(word);
                //// collate on tag
                //if (tag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    //word.value *= 20;
                    //tagsCollation[tag]=word;
                //}
                //// check related
                ////Object.keys(that.props.relatedTags[tag]).forEach(function(reltag) {
                    
                    //////if (reltag.toLowerCase().indexOf(title.toLowerCase()) >= 0) {
                    //////    tagsCollation[reltag.trim().toLowerCase()]={text:reltag.trim().toLowerCase(),value:word.value /30};
                    //////}    
                ////});
                   
            //};
            ////console.log(['TAGS collation',tagsCollation]);
            //for (var theTag in tagsCollation) {
                //tags.push(tagsCollation[theTag]);
            //}
            ////console.log(['TAGS',tags]);
        //} else {
            //tags = this.props.tags;
        //}
//        this.setState({'tags':tags});
    };
    
    setSearchTag(tag) {
        this.setState({'searchTag':tag.text});
    };
    
    render() {
        const fontSizeMapper = word => 2* Math.log2(word.value+10) * 2;
        const rotate = word => 0; //word.value % 360;
        const wordCloudWidth = window.innerWidth * 0.9;
        const wordCloudHeight = window.innerHeight * 0.5;
        ////console.log(this.state.tags);
        if (this.state.searchTag) {
            return <Redirect to={"/discover/tag/"+this.state.searchTag} />
        } else {
            return (
            <div>
                    <Link className="btn btn-info" to="/search"  >Topics</Link>
                      <Link className="btn btn-info" to="/search/questions"  >Questions</Link>
                  
                    <form className="form">
                      <input className="form-control col-sm-8" type="text" value={this.state.titleFilter} onChange={this.setTitleFilter}  placeholder="Search" aria-label="Search" />
                    </form>
                    {this.state.tags && this.state.tags.length > 0 &&
                    <WordCloud 
                        height={wordCloudHeight}
                        width={wordCloudWidth}
                        data={this.state.tags} 
                        fontSizeMapper={fontSizeMapper} 
                        rotate={rotate}
                        onWordClick={this.setSearchTag} 
                    >
                    </WordCloud>}
                </div>

            )
        }
    }
};
