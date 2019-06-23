/* eslint-disable */ 
import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import RecentSingleComment from './RecentSingleComment'
import 'whatwg-fetch'
import getIcon from './collectionIcons';

export default class MultipleChoiceTopics extends Component {
    
    constructor(props) {
		super(props);
		this.state={
			filter:''
		}
		this.loadTopics = this.loadTopics.bind(this)
		this.setFilter = this.setFilter.bind(this)
		this.findTopicCollection = this.findTopicCollection.bind(this)
		this.colors = [
			{color:'white',backgroundColor:'#fe0000'},
			{color:'white',backgroundColor:'#f60'},
			{color:'black',backgroundColor:'#fe9900'},
			{color:'black',backgroundColor:'#fc0'},
			{color:'black',backgroundColor:'#ff0'},
			{color:'black',backgroundColor:'#98cb00'},
			{color:'black',backgroundColor:'#090'},
			{color:'black',backgroundColor:'#0099cb'},
			{color:'white',backgroundColor:'#0066cb'},
			{color:'white',backgroundColor:'#000098'},
			{color:'white',backgroundColor:'#670099'},
			{color:'white',backgroundColor:'#cd0067'},
		];
    };
    
    componentDidMount() {
      let that=this;
        console.log(['MCT dmount',this.props.match.params.topicCollection])
        let userParam = [];
        if (this.props.user) {
			userParam.push('user='+this.props.user._id);
		}
		//if (this.state.filter && this.state.filter.length > 0) {
			 //userParam.push('filter='+this.state.filter)
		 //}
		 let paramString=userParam.length > 0 ? '?'+userParam.join('&') : '';
		 this.loadTopics(paramString)
	};
    
    componentWillUpdate(props) {
		let that=this;
        console.log(['MCT update',this.props.match.params.topicCollection,props.user,this.props.user])
        let currentId = this.props.user ? this.props.user._id : null;
        if (props.user && currentId != props.user._id) {
		 
		 let userParam = [];
		 if (props.user) {
			userParam.push('user='+props.user._id);
		 }
		 //if (this.state.filter && this.state.filter.length > 0) {
			 //userParam.push('filter='+this.state.filter)
		 //}
		 let paramString=userParam.length > 0 ? '?'+userParam.join('&') : '';
		 this.loadTopics(paramString)
		}
	}
	
	loadTopics(queryParams) {
		let that = this;
		let collated = {}
		fetch('/api/mctopics'+queryParams)
		  .then(function(response) {
			console.log(['got response'])
			return response.json()
		  }).then(function(json) {
			console.log(['got json',json])
			let collated = {}
			if (json) {
				json.map(function(mcTopic) {
					if (that.props.topicCollections) {
						that.props.topicCollections.map(function(topicCollection) {
							if (topicCollection && topicCollection.topics) {
								if (topicCollection.topics.indexOf(mcTopic.topic) !== -1 ) { //&& topicCollection.topics.hideInMultipleChoiceTopics !== true
									console.log(topicCollection)
									collated[topicCollection._id]=topicCollection;
								}
							}
						})
					}
				})
			}
			that.setState({topicCollections: Object.values(collated), topics:json});
		  }).catch(function(ex) {
			console.log(['parsing failed', ex])
		  })
	}
	
	
	
	setFilter(e) {
		console.log(['SET FILTER',e.target.value])
		let filter = e.target.value;
        this.setState({filter:filter});
    }
    
    		////if (this.state.filter && this.state.filter.length > 0) {
			//if (this.state.topics) {
				//topics = Object.keys(this.state.topics).map(function(topicCollectionKey) {
					//let topicCollection = this.state.topics[topicCollectionKey]
					//if (topicCollection) {
						//topicCollection.map(function(topic) {
							
						//})
					//}
					  
	findTopicCollection(id) {
		console.log(['FTC',id])
		let found = null;
		if (this.props.topicCollections && id) {
			this.props.topicCollections.map(function(topicCollection) {
				console.log(['FTCd',topicCollection.name])
				if (topicCollection.name === decodeURI(id)) {
					found = topicCollection
					console.log(['FTC found',topicCollection.name])
				}
			});
		}
		return found;
	}				  
					  
    render() { 
		let that = this;
		let topics = null;
		let selectedCollectionId = this.props.match && this.props.match.params && this.props.match.params.topicCollection ? this.props.match.params.topicCollection : null;
		let selectedCollection = selectedCollectionId ? this.findTopicCollection(selectedCollectionId) : null
		let allowedTopics = selectedCollection  ? selectedCollection.topics : null;
		console.log(['rend',selectedCollection,allowedTopics])
		let renderedTopicCollections = null;
		let searchForm = <div className='row'>
			<div className='col-12 col-sm-3' >
                <form className="form-inline" >
				<input className="form-cmctopicsontrol" type="text" value={this.state.filter} onChange={this.setFilter}  placeholder="Search" aria-label="Search" />
			</form>
			</div>
			<div className='col-1' ></div>
			<div className='col-12 col-sm-8' ><RecentSingleComment /></div>
            <div style={{clear:'both',width:'100%'}}></div>
			</div>
		if ((this.state.filter && this.state.filter.length > 0) || selectedCollection !== null) {
			if (this.state.topics) {
				topics = this.state.topics.map(function(topic,key) {
					
					if (!allowedTopics || allowedTopics.indexOf(topic.topic) !== -1) {
						let link='/multiplechoicequestions/'+topic.topic;
						// filter questions by topic collection
						//if (this.props.match && this.props.match.topicCollection) {
							//if (this.props.topicCollections.topics)
						//}
						 
						let buttons= <span style={{float:'right'}}>{topic.userTally > 0 && <button className='btn btn-success' >{topic.userTally} answered</button>} <button className='btn btn-info' >{topic.tally} questions</button>   </span>
						if (topic.tally > 0 && topic.tally === topic.userTally) {
							buttons = <span style={{float:'right'}}><button className='btn btn-danger' >Completed {topic.userTally} questions</button></span>
						}
						let theRow = <Link key={topic.topic} to={link} style={{paddingLeft:'1em', backgroundColor:(key%2 === 0 ? '#eee' : 'white'), width:'100%', borderTop:'1px solid black' }}><div  style={{}}> {topic.topic}  {buttons} </div></Link>
						if (that.state.filter && that.state.filter.length > 0) {
							if (topic.topic.toLowerCase().indexOf(that.state.filter.toLowerCase()) !== -1) {
								return theRow
							} else {
								return null;
							}
						} else {
							return theRow;
						}
					} else return null;
				})
			} else {
				return null;
			}
		// render topicCollections
		} else {
			if (this.state.topicCollections) {
						
				let topicCollections = this.state.topicCollections.map(function(topicCollection,key) {
					//return <div  className="col-lg-4 col-6" style={{}}>{topicCollection.name}
					let iconStyle={height: '3.6em', marginTop:'1em'}
					let blockStyle={float:'left',minHeight:'50px', paddingBottom:'1em',border:'2px solid white',fontSize:'1.1em',paddingTop:'0.2em'}
					let linkTo='/multiplechoicetopics/'+topicCollection.name;
					let color = that.colors[key%that.colors.length].color;
					let backgroundColor = that.colors[key%that.colors.length].backgroundColor;
					return <Link key={key} style={{display:'block'}}  to={linkTo} ><div  style={{backgroundColor:backgroundColor, color: color ? color : 'black'}} >
						<div key={key} style={Object.assign({backgroundColor:backgroundColor, color:color},blockStyle)}  className="col-6" >
							<span style={{backgroundColor:backgroundColor, color: color,sfloat:'right',marginRight:'0.8em'}} >{getIcon(topicCollection.icon,iconStyle)}</span>
							<span style={{backgroundColor:backgroundColor, color: color,fontSize:'1.4em',fontWeight:'bold'}}>{topicCollection.name}</span>
						</div>
					</div>	</Link>
				})
					let backgroundColor1 = that.colors[that.colors.length -1].backgroundColor;
					let color1 = that.colors[that.colors.length -1].color;
					let backgroundColor2 = that.colors[that.colors.length -2].backgroundColor;
					let color2 = that.colors[that.colors.length -2].color;
				let iconStyle={height: '3.6em', marginTop:'1em'}
				let blockStyle={float:'left',minHeight:'50px', paddingBottom:'1em',border:'2px solid white',fontSize:'1.1em',paddingTop:'0.2em'}
				
				return <div style={{clear:'both', width: '100%'}} >
					{searchForm}
					
					<Link key={'mytopics'} style={{display:'block'}}  to={'/mymultiplechoicetopics'} ><div  style={{backgroundColor:backgroundColor1, color: color1 ? color1 : 'black'}} >
						<div  style={Object.assign({backgroundColor:backgroundColor1, color:color1},blockStyle)}  className="col-6" >
							<span style={{backgroundColor:backgroundColor1, color: color1,marginRight:'0.8em'}} >{getIcon('mytopics',iconStyle)}</span>
							<span style={{backgroundColor:backgroundColor1, color: color1,fontSize:'1.4em',fontWeight:'bold'}}>My Topics</span>
						</div>
					</div>	</Link>
					
					<Link key={'myquestions'} style={{display:'block'}}  to={'/mymultiplechoicequestions'} ><div  style={{backgroundColor:backgroundColor2, color: color2 ? color2 : 'black'}} >
						<div  style={Object.assign({backgroundColor:backgroundColor2, color:color2},blockStyle)}  className="col-6" >
							<span style={{backgroundColor:backgroundColor2, color: color2,marginRight:'0.8em'}} >{getIcon('myquestions',iconStyle)}</span>
							<span style={{backgroundColor:backgroundColor2, color: color2,fontSize:'1.4em',fontWeight:'bold'}}>Review Quiz</span>
						</div>
					</div>	</Link>
					
					{topicCollections}
					<div style={{clear:'both', width: '100%'}} ><br/></div>
				</div>
			}
		}
		
					
			
		//} else {
			//renderedTopicCollections = this.props.topicCollections.map(function(topicCollection) {
				//return <b>{JSON.stringify(topicCollection)}</b>;
			//});
		//}
//		{JSON.stringify(this.props.topicCollections)}
		//{JSON.stringify({a:['COLL',selectedCollection,allowedTopics]})}
		
		return (
		<div className="container" >
			{searchForm}
			<div className="row">
				{topics}
				{renderedTopicCollections}
			</div>
		</div>
		)
    }





}
