/* eslint-disable */ 
import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import scrollToComponent from 'react-scroll-to-component';
       


// 	Animalia/Arthropoda - insects
// favorite:iconic

export default class AtlasLivingAustraliaSearch extends Component {
    
    
    constructor(props) {
		super(props);
		this.state = {
			searchFor:'',
			expanded:{},
			message:''
		}
		this.scrollTo={}
		this.change = this.change.bind(this)
		this.expandItem = this.expandItem.bind(this)
		this.contractItem = this.contractItem.bind(this)
		this.clearSearch = this.clearSearch.bind(this)
		//this.setSearchMode = this.setSearchMode.bind(this)
		this.renderResult = this.renderResult.bind(this)
		this.showMessage = this.showMessage.bind(this)
		this.hideMessage = this.hideMessage.bind(this)
		
		this.alaExpandData = this.alaExpandData.bind(this)
		this.alaSearch = this.alaSearch.bind(this)
		this.getSearchMode = this.getSearchMode.bind(this)
		this.getSearchFor = this.getSearchFor.bind(this)
		this.getLink = this.getLink.bind(this)
		
		this.setAlaSearch = this.setAlaSearch.bind(this)
		
		
		this.searchTimout = null
		this.searchModes = {
			'All':{subtitle:'',searchLabel:"Search Australian Life",filter:null},
			'Iconic Species':{subtitle:'',searchLabel:"Search Australian Iconic Species",filter:["favourite:iconic"]},
			'Animals':{subtitle:'Animalia',searchLabel:"Search Australian Animals",filter:["rk_kingdom:ANIMALIA"]},
			'Birds':{subtitle:'',searchLabel:"Search Australian Birds",filter:["rk_class:AVES"]},
			'Reptiles':{subtitle:'',searchLabel:"Search Australian Reptiles",filter:["rk_class:REPTILIA"]},
			'Insects':{subtitle:'',searchLabel:"Search Australian Insects",filter:["rk_class:INSECTA"]},
			'Plants':{subtitle:'Plantae',searchLabel:"Search Australian Plants",filter:["rk_kingdom:Plantae"]},
			'Fungi':{subtitle:'',searchLabel:"Search Australian Fungi",filter:["rk_kingdom:Fungi"]},
		}
	}
	
	componentDidMount() {
		let newSearchMode = this.getSearchMode()		
		let newSearchFor = this.props && this.props.match && this.props.match.params && this.props.match.params.searchFor ? this.props.match.params.searchFor :  '';
		if ((newSearchFor.length > 0) || (newSearchMode.length > 0)) {
		
		//if (this.props.match && this.props.match.params && (this.props.match.params.searchMode && this.props.match.params.searchMode.length > 0)) {
			//if (this.searchModes.hasOwnProperty(this.props.match.params.searchMode)) {
				//this.setState({searchMode:this.searchModes[this.props.match.params.searchMode]})
			//}
			////if ((this.props.match.params.species && this.props.match.params.species.length > 0)) {
			let newSearchFor = this.getSearchFor()	
			this.setState({searchFor:newSearchFor})	
			this.alaSearch()
			////}
			////this.alaSearch(this.props.match.params.species)
		}
	}
	
	componentDidUpdate(props) {
		let oldSearchMode = props && props.match && props.match.params && props.match.params.searchMode ? props.match.params.searchMode :  null;
		let newSearchMode = this.getSearchMode()		
		let oldSearchFor = props && props.match && props.match.params && props.match.params.searchFor ? props.match.params.searchFor :  null;
		let newSearchFor = this.props && this.props.match && this.props.match.params && this.props.match.params.searchFor ? this.props.match.params.searchFor :  '';
			
		if ((oldSearchFor != newSearchFor && newSearchFor.length > 0) || (oldSearchMode != newSearchMode && newSearchMode.length > 0)) {
			this.setState({searchFor:newSearchFor})
			this.alaSearch()
			//if (this.searchModes.hasOwnProperty(this.props.match.params.searchMode)) {
			//	this.setState({searchMode:this.searchModes[this.props.match.params.searchMode]})
			//}
		}
	}
	
	getSearchFor() {
		if (this.state.searchFor && this.state.searchFor.length) return this.state.searchFor 
		return this.props && this.props.match && this.props.match.params && this.props.match.params.searchFor ? this.props.match.params.searchFor :  '';	
	}
	
	getSearchMode() {
		return this.props && this.props.match && this.props.match.params && this.props.match.params.searchMode ? this.props.match.params.searchMode :  '';
	}
	
	//setSearchMode(mode) {
		//if (mode) {
			//this.props.history.push("/ala/"+encodeURIComponent(this.props.searchFor); //"/"+tag+encodeURI(val.replace(punctRE, " ")));
		////	this.setState({results:[],searchMode:mode})
		//} else {
			//this.props.history.push("/ala/"+encodeURIComponent(mode)+"/"+encodeURIComponent(this.props.searchFor)); //"/"+tag+encodeURI(val.replace(punctRE, " ")));
		//}
	//}
    
    clearSearch() {
		this.setState({results:[],searchFor:'',searchMode:null})
	}
	
	change(e) {
		this.setState({searchFor:e.target.value});
		if (this.searchTimeout) clearTimeout(this.searchTimeout)
		this.searchTimeout = setTimeout(this.setAlaSearch,500)
	};
	
	setAlaSearch() {
		let searchFor = this.getSearchFor()
		let modeKey = this.getSearchMode()
		//console.log(['SETALASEARCH',searchFor,modeKey])
		if (searchFor && searchFor.length > 0) { 	
			if (modeKey && modeKey.length > 0) {
				this.props.history.push("/ala/"+encodeURIComponent(searchFor)+"/mode/"+encodeURIComponent(modeKey)); 
			} else {
				this.props.history.push("/ala/"+encodeURIComponent(searchFor)); 
			}
		} else {
			if (modeKey && modeKey.length > 0) {
				this.props.history.push("/ala/mode/"+encodeURIComponent(modeKey)); 
			}
		}
	}
    
    alaSearch() {
		let that = this;
			
		let searchMode = this.getSearchMode();
		let searchFor = this.getSearchFor()
		console.log(['ALA SEARCH',searchMode,searchFor])
		
		if (searchFor.length > 0 ) { 
			let extra='';
			if (searchMode.length > 0) {
				if (this.searchModes.hasOwnProperty(searchMode) && this.searchModes[searchMode] && this.searchModes[searchMode].filter) {
					extra="&fq="+this.searchModes[searchMode].filter.join("&fq=");
				}
			}
			console.log(['ALA SEARCH with','https://bie-ws.ala.org.au/ws/search.json?fq=imageAvailable:true&pageSize=20&fq=idxtype:TAXON&sort=occurenceCount&dir=asc&q='+searchFor+extra])
		
			fetch('https://bie-ws.ala.org.au/ws/search.json?fq=imageAvailable:true&pageSize=20&fq=idxtype:TAXON&sort=occurenceCount&dir=asc&q='+searchFor+extra)
			//+'&facets='+facets)
			  .then(function(response) {
				return response.json()
			  }).then(function(json) {
				console.log(['SEARCH results',json && json.searchResults ? json.searchResults.results : []])
				
				that.setState({results:json && json.searchResults ? json.searchResults.results : [],expanded:{}});
			  }).catch(function(ex) {
				console.log(['error loading results', ex])
			  })
		} else {
			let filter='';
			if (searchMode.length > 0) {
				if (searchMode === "All") {
					that.setState({results:[]});
				}
				if (this.searchModes.hasOwnProperty(searchMode) && this.searchModes[searchMode] && this.searchModes[searchMode].filter) {
					filter="&fq="+this.searchModes[searchMode].filter.join("&fq=");
					console.log(['ALA SEARCH','https://bie-ws.ala.org.au/ws/search.json?fq=imageAvailable:true&pageSize=20&fq=idxtype:TAXON&dir=asc&q=favourite:iconic'+filter])
					//&sort=occurenceCount
						fetch('https://bie-ws.ala.org.au/ws/search.json?fq=imageAvailable:true&pageSize=20&fq=idxtype:TAXON&dir=asc&q=favourite:iconic'+filter)
						//+'&facets='+facets)
						  .then(function(response) {
							return response.json()
						  }).then(function(json) {
							console.log(['SEARCH results',json && json.searchResults ? json.searchResults.results : []])
							
							that.setState({results:json && json.searchResults ? json.searchResults.results : [],expanded:{}});
						  }).catch(function(ex) {
							console.log(['error loading results', ex])
						  })
					}

				}
				
			}
	}
	
	getId(question) {
		let parts = question && question.guid ? question.guid.split("afd.taxon:") : []
		let id=parts && parts.length > 0 ? parts[1] : null;
		return id;
	}
	
	
	getName(result) {
		return result.commonName ? result.commonName : (result.name ? result.name : '')
	}
	
	getScientificName(result) {
		return result.scientificName ? result.scientificName : (result.acceptedConceptName ? result.acceptedConceptName : '')
	}
	
	
	getLink(result) {
		let id = this.getId(result);
		if (id) {
			return "https://bie.ala.org.au/species/urn:lsid:biodiversity.org.au:afd.taxon:"+id
		} else {
			return 'http://en.wikipedia.org/?curid='+result.wikipediaPageId;
		}
	}
	
	
		
	addToReview(result,user) {
		let that = this;
		let quiz = 'Australian Biota'
		let interrogative = 'Do you recall the Australian species '
		
		
		if (result.kingdom && result.kingdom.toLowerCase() === 'plantae') {
			quiz = 'Australian Plants'
			interrogative = 'Do you recall the Australian plant '
		} else if (result.kingdom && result.kingdom.toLowerCase() === 'animalia') {
			quiz = 'Australian Animals'
			interrogative = 'Do you recall the Australian animal '
			
		} else if (result.kingdom && result.kingdom.toLowerCase() === 'fungi') {
			quiz = 'Australian Fungi'
			interrogative = 'Do you recall the Australian fungi '
			 
		}

		
		
		let tags = ['australia','biota','scientific names']
		let link = this.getLink(result)
		fetch('/api/importquestion', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(Object.assign({user:user,tags:tags,quiz:quiz,access:'public',interrogative:interrogative,question:that.getScientificName(result),difficult:3,autoshow_image:"YES",image:result.imageUrl,answer:result.description,facts:result,link:link},{}))
			}).then(function() {
				console.log(['saved question'])
				that.showMessage('Saved for review')
			});
	}
	
	showMessage(message) {
		let that = this;
		if (this.messageTimeout) clearTimeout(this.messageTimeout)
		setTimeout(function() {
			that.hideMessage()
		},3000)
		this.setState({message:message}) 
		
	}
	
	hideMessage() {
		this.setState({message:null})
		
	}
	
	alaExpandData(questionKey) {
		let that=this;
       // console.log(['expand',questionKey])
		
		let question = this.state.results[questionKey];
		//console.log(['expand',question,this.state.results.length,this.state.results[0]])
		//let facets='guid,license,content,temporal,commonName,scientificName,occurenceCount,scientificNameAuthorship,acceptedConceptName,name'
		
		if (question && this.getScientificName(question).length > 0) {
		    //let url="https://en.wikipedia.org/w/api.php?action=opensearch&search=" + this.getScientificName(question) + "&limit=50&format=json&origin=*";
             var url="https://en.wikipedia.org/w/api.php?format=json&redirects=true&action=query&origin=*&prop=extracts&exintro=&explaintext=&titles="+this.getScientificName(question)
	 
            fetch(url).then(function(response) {
               // //console.log(['reponse',response]);
                return response.json();
                
            }).then(function(json) {
                  // console.log(json);
                    //let first = json[0];
                    //if (first) {
						let questions = that.state.results;
						let pages = json.query && json.query.pages ? json.query.pages : null;
						//console.log(pages);
						let questionsLoaded = pages ? Object.values(pages) : null;
						if (questionsLoaded) {
						//	console.log(questionsLoaded);
							let questionLoaded = questionsLoaded[0];
							questions[questionKey].description = questionLoaded.extract;
							questions[questionKey].wikipediaPageId = questionLoaded.pageid;
							that.setState({results:questions});
						}
						
					//}
                       /// that.setState({lists: response,showLoader:false})

            })
            .catch(function(err) {
                //that.setState({showLoader:false})
                console.log(['ERR loading wiki results',err]);
            });
        }

			
			////let alaLink='https://bie-ws.ala.org.au/ws/search.json?fq=guid:'+id+'&facets='+facets
			////let alaLink='https://bie-ws.ala.org.au/ws/species/'+question.guid
			////+'&facets='+facets
			//let alaLink = //'https://bie-ws.ala.org.au/ws/download?q=guid:question.guid&fields=guid,parentGuid,kingdom,phylum,class,bioOrder,family,genus,scientificName'
		//console.log(['expand',id,parts,alaLink])
			
			//fetch(alaLink)
			  //.then(function(response) {
				//return response.json()
			  //}).then(function(json) {
				  //let questions = that.state.results;
				//console.log(['got ',json])
		
				  //questions[questionKey].speciesData = json;
				  //that.setState({results:questions});
			  //}).catch(function(ex) {
				//console.log(['error loading comments', ex])
			  //})
		
	}
	
	expandItem(key) {
		scrollToComponent(this.scrollTo['topofpage'],{align:'top',offset:-130});

		let expanded= {};
		expanded[key] = true
		this.setState({expanded:expanded})
		this.alaExpandData(key)
	}
	
	contractItem(key) {
		let expanded= {};
		//expanded[key] = false
		this.setState({expanded:expanded})
	}
	
	testImage() {
		// try load ala image, return true or false on failure
		// ALA sometimes hides images until logged in.
		// https://images.ala.org.au/image/proxyImageThumbnailLarge?imageId=ec18ec40-e0e5-493a-b3ca-e99d6f45cfd7
	}
    
    renderResult(result,resultKey,isRow) {
		let that = this;
		
		let id = that.getId(result)
		let alaLink="https://bie.ala.org.au/species/urn:lsid:biodiversity.org.au:afd.taxon:"+id
		let alaGalleryLink = alaLink + "#gallery"
		let wikipediaLink = 'http://en.wikipedia.org/?curid='+result.wikipediaPageId;
					
		let expandedLink = that.getScientificName(result).length > 0 ? "/ala/"+encodeURIComponent(that.getScientificName(result))	: null;		
		let isExpanded = that.state.expanded[resultKey] ? true : false;
		let commonName = that.getName(result).length > 0 ? that.getName(result) : <br/>;
		let scientificName = that.getScientificName(result)			
		// strip common name if it is just the scientific name
		if (scientificName.indexOf(commonName) !== -1) {
			commonName=<br/>
		}
		if (!scientificName) return null; 
		let rowClass='';
		let rowStyle = {}
		if (isRow) {
			rowClass='col-12 col-lg-6'
		} else {
			rowStyle={width:'100%'}
		}
		return <div key={resultKey} style={rowStyle} className={rowClass}  >
			<div style={{width:'100%', clear:'both'}} >
				<div style={{float:'left', marginRight:'1em'}} >
					{!isExpanded && expandedLink && <span ><div  onClick={(e) => that.expandItem(resultKey)} className='btn btn-info' >+</div></span>}
					{isExpanded && expandedLink && <span ><div  onClick={(e) => that.contractItem(resultKey)} className='btn btn-info' >-</div></span>}
				</div>
				{isExpanded && <div style={{float:'right'}}>
					{id && <span ><a target="_blank" href={alaLink} className='btn btn-info' >Link</a></span>}
					{result.image && <span ><a target="_blank" href={alaGalleryLink} className='btn btn-info' >Gallery</a></span>}
					{result.wikipediaPageId && result.wikipediaPageId > 0 && <span ><a target="_blank" href={wikipediaLink} className='btn btn-info' >Wikipedia</a></span>}
					{this.props.user && <button className='btn btn-success' onClick={(e) => this.addToReview(result,this.props.user._id)} >Add To My Review List</button>}
				</div>}
					<div style={{fontWeight:'bold'}} >{scientificName}</div>   
				{commonName && <div>{commonName}</div>}
			</div>
			
			{ isExpanded && <div style={{width:'100%', clear:'both'}}>
				<div>{result.scientificNameAuthorship && <i>by {result.scientificNameAuthorship}</i>}</div>
				<div style={{width:'100%', clear:'both'}}>
					{result.kingdom && <div><b>Kingdom:</b> {result.kingdom}</div>}
					{result.phylum && <div><b>Phylum:</b> {result.phylum}</div>}
					{result.class && <div><b>Class:</b> {result.class}</div>}
					{result.order && <div><b>Order:</b> {result.order}</div>}
					{result.family && <div><b>Family:</b> {result.family}</div>}
					{result.genus && <div><b>Genus:</b> {result.genus}</div>}
				</div>
				<div style={{marginTop:'1em' ,marginBottom:'1em' ,width:'97%'}}>{result.description}</div>
				
				
			</div>
			}
			{!isExpanded &&  result.imageUrl && <img style={{maxHeight:'300px' }}  src={result.imageUrl} />}   
			{isExpanded &&  result.imageUrl && <img  src={result.imageUrl} />}   
			
			<hr/>
		</div>
	}
    
    render() {
		//if (searchMo)
		
		//let showDetails = false
		//if (this.props.match && this.props.match.params && this.props.match.params.species && this.props.match.params.species.length > 0) {
			//showDetails = true
		//}
		//
//		this.props.analyticsEvent('ala search');
		let that = this;
		let expandedKeys = Object.keys(this.state.expanded);
		let rendered = null;
		if (expandedKeys.length > 0) {
			let resultKey = expandedKeys[0];
			let result = this.state.results[resultKey]
			rendered = that.renderResult(result,resultKey)
		} else {
			rendered = this.state.results && this.state.results.length > 0 ? this.state.results.map(function(result,resultKey) {
				return that.renderResult(result,resultKey,true)
			}) : null;
		}
		//	{JSON.stringify(result)}
		//{isExpanded &&  result.imageUrl && <img  style={{width:'100%', clear:'both'}} src={result.imageUrl} />}   
		let selectedMode = that.searchModes.hasOwnProperty(this.getSearchMode()) ? this.getSearchMode() : 'All' 
		let searchLabel = that.searchModes[selectedMode].searchLabel
		let searchModes = Object.keys(that.searchModes).map(function(modeKey) {
			let mode = that.searchModes[modeKey]
			let modeLink = '/ala/mode/'+encodeURIComponent(modeKey)
			if (that.state.searchFor) {
				modeLink = '/ala/'+encodeURIComponent(that.state.searchFor)+'/mode/'+encodeURIComponent(modeKey)
			} 
			//if (that.state.searchFor.length > 0) {
				//modeLink = '/ala/mode/'+encodeURIComponent(modeKey)+"/"+that.state.searchFor+"/"
			//}
			let style={}
			if (selectedMode === modeKey) {
				style={fontWeight:'bold',border:'2px solid black'}
			}
			return <Link key={modeKey} style={style} to={modeLink} className='btn btn-info'>{modeKey}</Link>
		})
						
        return  (
        <div className="alasearch"  style={{marginLeft:'2em'}}>
			<div  ref={(section) => { this.scrollTo.topofpage = section; }} ></div>
               
			<h3>{searchLabel}</h3>
			{this.state.message && <b style={{color:'red'}}>{this.state.message}</b>}
			<div style={{padding:'0.5em',backgroundColor:'grey',border:'1px solid black',marginBottom:'1em'}}>
			<a  className='btn btn-warning' target="_blank" href="https://auth.ala.org.au/cas/login" style={{float:'right',marginLeft:'1em'}}>No Images ? Sign In to the ALA</a>
			<input type='text' value={this.state.searchFor} onChange={this.change}/> 
			<a  className='btn btn-info' target="_blank" href="https://biocache.ala.org.au/search#tab_simpleSearch" style={{marginLeft:'1em'}}>Advanced Search</a><Link to="/ala" className="btn btn-danger">Reset</Link>
			
			
			<div style={{marginTop:'0.5em'}}>
			{searchModes}
			</div>
			</div>
			<div className='row'>
			{rendered}
			</div>
			
         </div>
        )
    }
}
//	<span>Locality: <select  className='btn btn-info'  onChange={this.setLocality} >{this.state.locality ? " - "+this.state.locality : ''} ><option >All</option><option value="state:NSW" >NSW</option></select></span>
		
		//<div>{result.license ? <span>Licence: {result.license}</span> : null}</div>
					//<div>{id ? <span>ID: {id}</span> : null}</div>
					//<div>{result.content ? result.content : ''}</div>
					//<div>{result.temporal ? <span>Temporal: {result.temporal}</span> : null}</div>
				//<hr/>
