import React from "react";
//import List from "./List.js";
import 'whatwg-fetch'
//import { findDOMNode } from ‘react-dom’;
//import $ from ‘jquery’;

export default  class WikipediaSearchWizard extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
            search:this.props.topic,
            lists: [],
            showLoader:false
		}
         this.expandResult = this.expandResult.bind(this);
         this.search = this.search.bind(this);
         this.doSearch = this.doSearch.bind(this);
         this.setSearchEvent = this.setSearchEvent.bind(this);
         
	}
    
    componentDidMount() {
        this.doSearch(this.props.topic);
    };
    
    componentWillReceiveProps(props) {
       if (this.state.search === '') {
          this.setState({search:props.topic}); 
          this.doSearch(props.topic);
       }
       // 
         //this.setState({lists: [],showLoader:true})
        ////let query=this.refs.keyword.value.length > 0  ? this.refs.keyword.value : this.refs.topic.value;
        //this.doSearch(props.topic);
    };

	_handleSubmit(e) {
		e.preventDefault();
        this.setState({lists: [],showLoader:true})
        let query=this.refs.keyword.value.length > 0  ? this.refs.keyword.value : this.refs.topic.value;
        this.doSearch(query);
	}
    
    doSearch(query) {
        let that=this;
        //this.refs.keyword.value
        if (query && query.length>0) {
            let url="https://en.wikipedia.org/w/api.php?action=opensearch&search=" + query + "&limit=50&format=json&origin=*";
            fetch(url).then(function(response) {
               // console.log(['reponse',response]);
                return response.json();
                
            }).then(function(response) {
                   // console.log(response);
                    that.setState({lists: response,showLoader:false})

            })
            .catch(function(err) {
                that.setState({showLoader:false})
                console.log(['ERR loading wiki results',err]);
            });
        }
    };

    setSearchEvent(e) {
       // console.log(['SE',e]);
        this.setState({search:e.target.value});
         this.setState({lists: [],showLoader:true})
        let query=this.refs.keyword.value.length > 0  ? this.refs.keyword.value : this.refs.topic.value;
        this.doSearch(query);
    };
    
    search(search) {
     //   console.log(['SEA',search]);
        this.setState({search:search});
        this.doSearch(search);
    };
    
    expandResult(key) {
      //  console.log(['expand result',key]);
        this.setState({currentResult:key});
    };
    
    closeResult() {
        this.setState({currentResult:null});
    };
    
    deleteResult(key) {
        //console.log(['del res',key]);
        let lists= this.state.lists;
        
        lists[1].splice(key,1);
        lists[2].splice(key,1);
        lists[3].splice(key,1);
        //console.log(['lists',lists]);
        this.setState({'lists':lists});
        //let lists= this.state.lists;
        //let newLists = [lists[0],lists[1].splice(key,1),lists[2].splice(key,1),lists[3].splice(key,1)];
       // this.setState({'lists':lists});
    };

	render() {
         let wikiResults = [];
         if (Array.isArray(this.state.lists) && this.state.lists.length===4) {
            // console.log(['render',this.state.lists]);
             wikiResults = this.state.lists[1].map((title,key) => {
                 //console.log(['renderi',title,key]);
                    
                let result={title:this.state.lists[1][key], description:this.state.lists[2][key], link:this.state.lists[3][key]};
                let link=result.link+'?printable=yes'
                return (
                    <div key={key}>
                    <button  className='btn btn-success' style={{float:'right'}} onClick={() => this.props.addResultToQuestions(result)} >Create Question</button>
                    
                    
                    {key!==this.state.currentResult && <button  className='btn btn-info' style={{float:'right'}}  ref={key} onClick={() => this.expandResult(key)} >Expand</button>}
                    {key===this.state.currentResult && <button  className='btn btn-info' style={{float:'right'}}  ref={key} onClick={() => this.closeResult()} >Close</button>}
                    
                    
                    <h3><a href={result.link} >{result.title}</a></h3>
                    {key!==this.state.currentResult && result.description}
                    {key===this.state.currentResult && <iframe src={link} style={{width:"98%", height: "1200px", border: "0px"}} />}
                    </div>
                )
            });
         }

		return (
			<div>
            	<form onSubmit={this._handleSubmit.bind(this)}>
					<div className="input-group">
                        <label><b>Search&nbsp;Wikipedia&nbsp;&nbsp;</b></label>
						<input ref="keyword"  type="text" className="form-control input-lg" placeholder="" value={this.state.search} onChange={this.setSearchEvent}/>
						
                      
					</div>			
				</form>
				<br/>
                {wikiResults}
				{this.state.showLoader && <div id="loader">
					<img src="/loading.gif" width="70px"/>
				</div>}

			</div>
		)
	}
}
//<button  className='btn btn-danger' style={{float:'right'}} onClick={() => this.deleteResult(key)} >Delete</button>

                    //<button  className='btn btn-info' style={{float:'right'}} onClick={() => this.search(result.title)} >Search</button>

  //<span className="input-group-btn">
							//<button type="submit" className="btn btn-info">
								//Search
							//</button>
						//</span>
