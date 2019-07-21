/* eslint-disable */ 

/**
 * This file implements a search component for the Atlas of Living Australia (ALA) data set.
 * 
The main search component provides a search and list user interface.
The search includes
- modes that can be configured to include additional search criteria when enabled
- autoselect for species
- multiple image search by pressing enter
- autoload on scroll in sets of 5

Each entry in the list can be expanded. When the item is expanded,
- an additional lookup is made to wikipedia by species to find and show description information
- a distribution map and other information including taxon tree and author.
- the image is shown unrestricted in size

 * 
 * Copyright: Steve Ryan <stever@syntithenai.com>  MIT Licence
 */
//import html2canvas from 'html2canvas';
import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import scrollToComponent from 'react-scroll-to-component';
import Autocomplete from 'react-autocomplete'
import InfiniteScroll from 'react-infinite-scroller';

export default class MashupSearch extends Component {   
	constructor(props) {
		super(props);
		this.state = {
			searchFor:'',
			searchForValue:'',
			expanded:{},
			message:'',
			moreIndex:0,
			hasMore: true,
			results:[],
			suggestions: [],
			loading : false
		}
		this.scrollTo={}
		this.sugestTimeout = null;;
		this.expandItem = this.expandItem.bind(this)
		this.contractItem = this.contractItem.bind(this)
		this.clearSearch = this.clearSearch.bind(this)
		this.renderResult = this.renderResult.bind(this)
		this.showMessage = this.showMessage.bind(this)
		this.hideMessage = this.hideMessage.bind(this)
		
		this.expandData = this.expandData.bind(this)
		this.apiSearch = this.apiSearch.bind(this)
		this.getSearchMode = this.getSearchMode.bind(this)
		this.getSearchFor = this.getSearchFor.bind(this)
		this.getLink = this.getLink.bind(this)
		this.getBase64Image = this.getBase64Image.bind(this)
		this.setSearchUrl = this.setSearchUrl.bind(this)
		this.loadMore = this.loadMore.bind(this)
		this.firstSearch = this.firstSearch.bind(this)
		this.loadSuggestions = this.loadSuggestions.bind(this)
		this.submitForm = this.submitForm.bind(this)
		
		this.startLoading =  this.startLoading.bind(this)
		this.stopLoading =  this.stopLoading.bind(this)
				
		this.images = {}
		this.searchTimout = null
		this.searchModes = {
			//'All':{subtitle:'',searchLabel:"Search All",filter:[]},
			//'Animals':{subtitle:'Animalia',searchLabel:"Search Australian Animals",filter:["rk_kingdom:ANIMALIA"],suggestFilter:["kingdom:Animalia"]},
			//'Birds':{subtitle:'',searchLabel:"Search Australian Birds",filter:["rk_class:AVES"],suggestFilter:["class:Aves"]},
			//'Reptiles':{subtitle:'',searchLabel:"Search Australian Reptiles",filter:["rk_class:REPTILIA"],suggestFilter:["class:Reptilia"]},
			//'Insects':{subtitle:'',searchLabel:"Search Australian Insects",filter:["rk_class:INSECTA"],suggestFilter:["class:Insecta"]},
			//'Plants':{subtitle:'Plantae',searchLabel:"Search Australian Plants",filter:["rk_kingdom:Plantae"],suggestFilter:["kingdom:Plantae"]},
			//'Fungi':{subtitle:'',searchLabel:"Search Australian Fungi",filter:["rk_kingdom:Fungi"],suggestFilter:["kingdom:Fungi"]},
		}
	}
	
	
	/**
	 * Base class methods
	 * This class is intended to behave as an Interface
	 */
	
	
	/**
	 * If props from URL, do search on mount
	 */
	componentDidMount() {
		let newSearchMode = this.getSearchMode()		
		let newSearchFor = this.props && this.props.match && this.props.match.params && this.props.match.params.searchFor ? this.props.match.params.searchFor :  '';
		if ((newSearchFor.length > 0) || (newSearchMode.length > 0)) {
			this.setState({searchFor:newSearchFor})	
			this.firstSearch()
		}
	}
	

	/**
	 * If props from url have changed, renew search
	 */
	componentDidUpdate(props,state) {
		let oldSearchMode = props && props.match && props.match.params && props.match.params.searchMode ? props.match.params.searchMode :  null;
		let newSearchMode = this.getSearchMode()		
		let oldSearchFor = props && props.match && props.match.params && props.match.params.searchFor ? props.match.params.searchFor :  null;
		let newSearchFor = this.props && this.props.match && this.props.match.params && this.props.match.params.searchFor ? this.props.match.params.searchFor :  '';
		if ((oldSearchFor != newSearchFor && newSearchFor.length > 0) || (oldSearchMode != newSearchMode && newSearchMode.length > 0)) {
			this.setState({searchFor:newSearchFor})
			this.firstSearch()
		} 
		
	}
	
	
	startLoading() {
		this.setState({loading:true})
	}
	stopLoading() {
		this.setState({loading:false})
	}
	
	/**
	 * Get text search criteria from url
	 */
	getSearchFor() {
		if (this.state.searchFor && this.state.searchFor.length) return this.state.searchFor 
		return this.props && this.props.match && this.props.match.params && this.props.match.params.searchFor ? this.props.match.params.searchFor :  '';	
	}
	
	/**
	 * Get  search mode criteria from url
	 */
	getSearchMode() {
		return this.props && this.props.match && this.props.match.params && this.props.match.params.searchMode ? this.props.match.params.searchMode :  '';
	}
	
    /**
	 * Reset search criteria, results and suggestions
	 */
    clearSearch() {
		this.setState({results:[],searchFor:'',searchForValue:'',searchMode:null,suggestions:[]})
	}
	
	/**
	 * Catch keypress return on search form and trigger search
	 */
	submitForm(e) {
		this.setState({rawSearch:true,searchFor:this.state.searchForValue,suggestions:[]});
		if (this.searchTimeout) clearTimeout(this.searchTimeout)
		this.searchTimeout = setTimeout(this.setSearchUrl,500)
		if (e) {
			e.preventDefault()
			e.nativeEvent.stopImmediatePropagation()
		}
		return false;
	}
	
	/**
	 * Catch select event in autoselect on search form and trigger search
	 */
	submitFormOnSelect(e) {
		this.setState({rawSearch:false});
		if (this.searchTimeout) clearTimeout(this.searchTimeout)
		this.searchTimeout = setTimeout(this.setSearchUrl,500)
		if (e) e.preventDefault()
		return false;
	}

	/**
	* Push search criteria into url
	*/
	setSearchUrl() {
		let searchFor = this.getSearchFor()
		let modeKey = this.getSearchMode()
		if (searchFor && searchFor.length > 0) { 	
			if (modeKey && modeKey.length > 0) {
				this.props.history.push(this.props.routerBaseUrl+"/"+(this.state.rawSearch ? 'search/' : '')+encodeURIComponent(searchFor)+"/mode/"+encodeURIComponent(modeKey)); 
			} else {
				this.props.history.push(this.props.routerBaseUrl+"/"+(this.state.rawSearch ? 'search/' : '')+encodeURIComponent(searchFor)); 
			}
		} else {
			if (modeKey && modeKey.length > 0) {
				this.props.history.push(this.props.routerBaseUrl+"/mode/"+encodeURIComponent(modeKey)); 
			}
		}
	}
	
	/**
	 * Auto load more records on scroll
	 */
	loadMore(key) {
		// disable
		return;
		
		let that = this;
		if (this.loading) return;
		if (!this.state.hasMore) return;
		this.apiSearch(this.state.moreIndex+1).then(function(results) {
			that.setState({moreIndex: that.state.moreIndex + 1})
			if (results && results.length == 0) {
				that.setState({hasMore:false})
			} else {
				that.setState({hasMore:true})
			}
		})
	}
    
    /**
	 * Search page 1, expand first if single result
	 */
	firstSearch() {
		let that = this;
		this.setState({results:[],hasMore:true,moreIndex:0})
		this.apiSearch().then(function(res) {
			if (res && res.length === 1) {
				that.expandData(0)
			}
		});
	}
   
    
    /**
	 * Request data from the api
	 */
	apiSearch(skip) {
		
		let that = this;
		that.startLoading()
		this.loading = true;
		let searchMode = this.getSearchMode();
		let searchFor = this.getSearchFor()
		//return new Promise(function(resolve,reject) { resolve() })
		//console.log(['ALA SEARCH',searchMode,searchFor])
		let p = new Promise(function(resolve,reject) {
			that.apiFetch(searchFor,that.state.searchForValues,searchMode,5,skip).then(function(newRes) {
				// merge with prior results (autoscroll)
				var prior = that.state.results ? that.state.results : []
				let final = null
				final = prior.concat(newRes);
				that.setState({results:final,expanded:{}});
				that.loading = false;
				// auto expand first item
				if (newRes.length === 1 ) {
					that.expandItem(0);
				}
				that.stopLoading()
		
				resolve(newRes)
			})
			
		})
		return p;
	}
	
	/**
	 * Set this item as expanded
	 */
	expandItem(key) {
		let expanded= {};
		expanded[key] = true
		this.setState({expanded:expanded,lastExpanded:key})
		this.expandData(key)
	}
	
	/**
	 * Set this item as contracted
	 */
	contractItem(key) {
		let expanded= {};
		//expanded[key] = false
		if (this.state.lastExpanded !== null) {
			this.setState({lastExpanded:null})
		}
		this.setState({expanded:expanded})
	}
	
	
	
	// Code taken from MatthewCrumley (https://stackoverflow.com/a/934925/298479)
	getBase64Image(imageRef) {
		let img = this.images[imageRef]  
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		var dataURL = canvas.toDataURL("image/png");
		//let a = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		//console.log(dataURL);
		return dataURL;
	}
		
	
	/**
	 * Set a message to flash to the user, then hide it after 3s
	 */
	showMessage(message) {
		let that = this;
		if (this.messageTimeout) clearTimeout(this.messageTimeout)
		setTimeout(function() {
			that.hideMessage()
		},3000)
		this.setState({message:message}) 
		
	}
	
	/**
	 * Hide user flash message
	 */
	hideMessage() {
		this.setState({message:null})
	}
	
	
	/**
	 * Extract the common name from the result or fallback to name
	 */
	getName(result) {
		return result.commonName ? result.commonName : (result.name ? result.name : '')
	}
	
	/**
	 * Extract the scientific name from the result or fallback to concept name
	 */
	getCanonicalName(result) {
		return result.canonicalName ? result.canonicalName : (result.acceptedConceptName ? result.acceptedConceptName : '')
	}
	
	
	/**
	 * Generate a link to ALA or wikipedia based on available information.
	 */
	getLink(result) {
		if (result.wikipediaPageId) {
			return 'http://en.wikipedia.org/?curid='+result.wikipediaPageId;
		}
	}
	
	getSecondaryLink(result) {
		return;
		//if (result && result.wikipediaPageId && result.wikipediaPageId) {
			//let link = result && result.wikipediaPageId ? 'http://en.wikipedia.org/?curid='+result.wikipediaPageId : null;
			//return <a target="_blank" href={link} className='btn btn-info' >Wikipedia</a>
		//} else {
			//return null;
		//}
	}
	
	getSendButton(result,resultKey,user) {
		 return <button className='btn btn-success' onClick={(e) => this.sendResult(result,resultKey,user._id)} >Add To My Review List</button>
	}
	
	// after header
	renderFacts(result,resultKey,user) {
		return <div>.
				
			</div>
		
	} 
	// at end
	renderExtras(result,resultKey,user) {
		<div></div>
	}
	
    
    apiFetch(searchFor,searchForValue,searchMode,limit,skip) {
		let that = this;
		return new Promise(function(resolve,reject) {
			resolve([{message:'search not implemented'}])
			
		}) 
	}
    	
	
	
	/**
	 * Lookup additional information about this species from wikipedia.
	 */
	expandData(questionKey) {
		let that = this;
		
		return new Promise(function(resolve,reject) {
			resolve([{message:'search not implemented'}])
			
		}) 
	}
	
	
	/**
	 * Load autocomplete suggestions
	 */
	loadSuggestions(searchFor) {
		let that = this;
		return new Promise(function(resolve,reject) {
			resolve([{message:'search not implemented'}])
			
		}) 
		return p
	}
	
	
	/**
	 * Render a single result
	 */
	renderResult(result,resultKey,isRow) {
		let that = this;
		if (result) {
			let alaLink=result.link; //"https://bie.ala.org.au/species/"+result.guid;
			//let alaGalleryLink = alaLink + "#gallery"
			//let wikipediaLink = 'http://en.wikipedia.org/?curid='+result.wikipediaPageId;
						
			let expandedLink = that.getCanonicalName(result).length > 0 ? this.props.routerBaseUrl+"/"+encodeURIComponent(that.getCanonicalName(result))	: null;		
			let isExpanded = that.state.expanded[resultKey] ? true : false;
			let commonName = that.getName(result).length > 0 ? that.getName(result) : <br/>;
			let canonicalName = that.getCanonicalName(result)			
			// strip common name if it is just the canonical name
			if (canonicalName.indexOf(commonName) !== -1) {
				commonName=<br/>
			}
			if (!canonicalName) return null; 
			let rowClass='';
			let rowStyle = {}
			if (isRow) {
				rowClass='col-12'
			} else {
				rowStyle={width:'100%'}
			}
			return <div  key={resultKey} style={rowStyle} className={rowClass}  >
				<div style={{width:'100%', clear:'both'}} >
					{this.state.results.length > 1 && <div style={{float:'left', marginRight:'1em'}} >
						{!isExpanded && expandedLink && <span ><div  onClick={(e) => that.expandItem(resultKey)} className='btn btn-info' >+</div></span>}
						{isExpanded && expandedLink && <span ><div  onClick={(e) => that.contractItem(resultKey)} className='btn btn-info' >-</div></span>}
					</div>}
					{isExpanded && <div style={{float:'right'}}>
						{alaLink && <span ><a target="_blank" href={alaLink} className='btn btn-info' >More Info</a></span>}
						{ isExpanded && !this.state.loading && this.renderButtons && this.renderButtons(result,resultKey,this.props.user)}
						{this.props.user  && !this.state.loading && this.sendResult && <span>{this.getSendButton(result,resultKey,this.props.user)}</span>}
					</div>}
						<i>{canonicalName}</i>   
						{commonName && <div style={{fontWeight:'bold'}} >{commonName}</div>}
					
				</div>

				
				{ isExpanded && <div style={{width:'100%', clear:'both'}}>{this.renderFacts(result,resultKey,this.props.user)}</div>}
				
				  <div ref={(section) => { this.scrollTo.end = section; }} ></div>
               
				{!isExpanded &&  result.image && <img crossOrigin="anonymous" ref={(section) => { this.images[resultKey] = section; }}  style={{maxHeight:'300px' }}  src={result.image} />}   
				{isExpanded &&  result.image && <img style={{maxHeight:'300px' }}   crossOrigin="anonymous" ref={(section) => { this.images[resultKey] = section; }}    src={result.image} />}   
			<br/><br/>
				{ isExpanded && this.renderExtras(result,resultKey,this.props.user)}
				<hr/>
			</div>
		} else {
			return null;
		}
	}
	
    
    renderSuggestItem(item) {
		if (item) return <div><b>{item.commonName ? item.commonName.join(' ') : item.name}</b> <i>{item.name}</i></div>
	}
    
    getSuggestionCanonicalName(item) {
		return item && item.name
	}
    
    /**
	 * Render component
	 */
	render() {
		let that = this;
		let expandedKeys = Object.keys(this.state.expanded);
		let rendered = this.state.results && this.state.results.length > 0 ? this.state.results.map(function(result,resultKey) {
			return that.renderResult(result,resultKey,true)
		}) : null;
		let selectedMode = that.searchModes.hasOwnProperty(this.getSearchMode()) ? this.getSearchMode() : null 
		let searchLabel = selectedMode && that.searchModes[selectedMode] ? that.searchModes[selectedMode].searchLabel : ''
		let searchModes = Object.keys(that.searchModes).map(function(modeKey) {
			let mode = that.searchModes[modeKey]
			let modeLink = that.props.routerBaseUrl+'/mode/'+encodeURIComponent(modeKey)
			let style={}
			if (selectedMode === modeKey) {
				style={fontWeight:'bold',border:'2px solid black'}
			}
			return <Link key={modeKey} style={style} to={modeLink} className='btn btn-info'>{modeKey}</Link>
		})
		let loader = this.state.hasMore ? <div className="loader" key={0}></div> : <div className="loader"></div>;
        return  (
        <div className="search"  style={{marginLeft:'0.5em'}}>
			{this.state.loading && <div onClick={this.stopLoading} style={{position:'fixed',top:0,left:0,height:'100%',width:'100%', zIndex:99999, backgroundColor: 'grey', opacity:0.2}} ><img src='/loading.gif' style={{height:'7em'}} /></div>}
			<div  ref={(section) => { this.scrollTo.topofpage = section; }} ></div>
               
			<h3>{searchLabel}</h3>
			{this.state.message && <b style={{position:'fixed',top:'7em',left:'50%',backgroundColor:'pink',border:'1px solid black',color:'black',padding:'0.8em'}}>{this.state.message}</b>}

	  
			<div style={{padding:'0.5em',backgroundColor:'grey',border:'1px solid black',marginBottom:'1em'}}>
			
			
			<div style={{marginTop:'0.5em',marginBottom:'0.5em'}}>
			{searchModes}
			</div>
			
			<form onSubmit={(e) => this.submitForm(e)}>
			  <Autocomplete
			getItemValue={(item) => that.getSuggestionCanonicalName(item)   }
			items={that.state.suggestions}
			renderItem={(item, isHighlighted) => {
				return <div key={item.id} style={{ borderBottom: '1px solid grey',borderTop: '1px solid grey',width: '100%' ,background: isHighlighted ? 'lightgray' : 'white' }}>
				  {this.renderSuggestItem(item)}
				</div>
			}}
			value={that.state.searchForValue}
			
			onSelect={(value, item) => {
				that.setState({ searchFor:that.getSuggestionCanonicalName(item), suggestions: []})
				that.submitFormOnSelect();
			}}
			onChange={(event, value) => {
				that.setState({ searchForValue:value})
				
				if (that.suggestTimeout) clearTimeout(that.suggestTimeout)
				that.suggestTimeout = setTimeout(function() {that.loadSuggestions(value)},500)
			}}
			
          renderMenu={children => (
            <div className="menu" style={{ width:'100%'}}>
              {children}
            </div>
          )}
        />
			
			<span >
			<Link to={that.props.routerBaseUrl} className="btn btn-danger">Reset</Link>
			</span>
			

			</form>
			<b>{that.state.searchFor}</b>
			</div>
			
			<InfiniteScroll
				pageStart={0}
				loadMore={this.loadMore}
				hasMore={!!this.state.hasMore}
				loader={loader}
			>
			<div className='row'>
			{rendered}
			</div>

			</InfiniteScroll>
			
			
         </div>
        )
    }
}
///**
	 //* Capture this result and save it as a question, then add it to the review feed (create a seen record)
	 //*/
	//sendResult(result,resultKey,user) {
		//let that = this;
		//// defaults
		//let quiz = 'Australian Biota'
		//let interrogative = 'Do you recall the Australian species '
		//let tags = ['australia','biota','scientific names']

		//// split into a few specific topics
		//if (result.kingdom && result.kingdom.toLowerCase() === 'plantae') {
			//quiz = 'Australian Plants'
			//tags.push('plants');
			//interrogative = 'Do you recall the Australian plant '
		//} else if (result.kingdom && result.kingdom.toLowerCase() === 'animalia') {
			//quiz = 'Australian Animals'
			//tags.push('animals');
			//interrogative = 'Do you recall the Australian animal '
			
		//} else if (result.kingdom && result.kingdom.toLowerCase() === 'fungi') {
			//quiz = 'Australian Fungi'
			//tags.push('fungi');
			//interrogative = 'Do you recall the Australian fungi '
			 
		//}

		
		//console.log(['CANVAS RENDER',that.props.mapRef]);
		////if (that.state.mapRef ) {
			////html2canvas(that.state.mapRef, {
				////useCORS: true,
			////}).then(function(canvas) {
				//let mapImage = null //(canvas ? canvas.toDataURL('image/png'):null);
				//let link = that.getLink(result)
				
				//fetch('/api/importquestion', {
					  //method: 'POST',
					  //headers: {
						//'Content-Type': 'application/json'
					  //},
					  //body: JSON.stringify(Object.assign({user:user,tags:tags,quiz:quiz,access:'public',interrogative:interrogative,question:that.getCanonicalName(result),difficulty:3,autoshow_image:"YES",image:that.getBase64Image(resultKey),image2:mapImage,answer:result.description,facts:result,link:link},{}))
					//}).then(function() {
						//that.showMessage('Saved for review')
					//});
			////})
		////}
		
	//}
	
