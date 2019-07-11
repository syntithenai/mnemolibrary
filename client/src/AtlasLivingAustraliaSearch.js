/* eslint-disable */ 
import React, { Component } from 'react';
import HelpNavigation from './HelpNavigation';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import scrollToComponent from 'react-scroll-to-component';
import Autocomplete from 'react-autocomplete'
import InfiniteScroll from 'react-infinite-scroller';



let myim = ""

export default class AtlasLivingAustraliaSearch extends Component {   
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
			suggestions: []
		}
		this.scrollTo={}
		this.sugestTimeout = null;;
		this.expandItem = this.expandItem.bind(this)
		this.contractItem = this.contractItem.bind(this)
		this.clearSearch = this.clearSearch.bind(this)
		this.renderResult = this.renderResult.bind(this)
		this.showMessage = this.showMessage.bind(this)
		this.hideMessage = this.hideMessage.bind(this)
		
		this.alaExpandData = this.alaExpandData.bind(this)
		this.alaSearch = this.alaSearch.bind(this)
		this.getSearchMode = this.getSearchMode.bind(this)
		this.getSearchFor = this.getSearchFor.bind(this)
		this.getLink = this.getLink.bind(this)
		this.getBase64Image = this.getBase64Image.bind(this)
		
		this.setAlaSearch = this.setAlaSearch.bind(this)
		this.loadMore = this.loadMore.bind(this)
		this.alaFirstSearch = this.alaFirstSearch.bind(this)
		//this.alaLoadSingle = this.alaLoadSingle.bind(this)
		this.loadSuggestions = this.loadSuggestions.bind(this)
		this.submitForm = this.submitForm.bind(this)
		
		this.images = {}
		this.searchTimout = null
		this.searchModes = {
			'All':{subtitle:'',searchLabel:"Search Australian Biota",filter:null},
			'Animals':{subtitle:'Animalia',searchLabel:"Search Australian Animals",filter:["rk_kingdom:ANIMALIA"],suggestFilter:["kingdom:Animalia"]},
			'Birds':{subtitle:'',searchLabel:"Search Australian Birds",filter:["rk_class:AVES"],suggestFilter:["class:Aves"]},
			'Reptiles':{subtitle:'',searchLabel:"Search Australian Reptiles",filter:["rk_class:REPTILIA"],suggestFilter:["class:Reptilia"]},
			'Insects':{subtitle:'',searchLabel:"Search Australian Insects",filter:["rk_class:INSECTA"],suggestFilter:["class:Insecta"]},
			'Plants':{subtitle:'Plantae',searchLabel:"Search Australian Plants",filter:["rk_kingdom:Plantae"],suggestFilter:["kingdom:Plantae"]},
			'Fungi':{subtitle:'',searchLabel:"Search Australian Fungi",filter:["rk_kingdom:Fungi"],suggestFilter:["kingdom:Fungi"]},
		}
	}
	
	/**
	 * If props from URL, do search on mount
	 */
	componentDidMount() {
		let newSearchMode = this.getSearchMode()		
		let newSearchFor = this.props && this.props.match && this.props.match.params && this.props.match.params.searchFor ? this.props.match.params.searchFor :  '';
		if ((newSearchFor.length > 0) || (newSearchMode.length > 0)) {
			this.setState({searchFor:newSearchFor})	
			this.alaFirstSearch()
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
		let oldGUID = props && props.match && props.match.params && props.match.params.speciesGUID ? props.match.params.speciesGUID :  null;
		let newGUID = this.props && this.props.match && this.props.match.params && this.props.match.params.speciesGUID ? this.props.match.params.speciesGUID :  '';
			
		if ((oldSearchFor != newSearchFor && newSearchFor.length > 0) || (oldSearchMode != newSearchMode && newSearchMode.length > 0)) {
			this.setState({searchFor:newSearchFor})
			this.alaFirstSearch()
		} else if (oldGUID != newGUID) {
		//	this.alaLoadSingle(newGUID)
		}
		
	}
//	 TODO RESTORE LAST EXPANDED
		//console.log(['up',state.lastExpanded,this.state.lastExpanded])
		
		//if (state.lastExpanded !== this.state.lastExpanded) {
			//console.log(['scroll',this.scrollTo['result_'+state.lastExpanded]])
			//scrollToComponent(this.scrollTo['result_'+state.lastExpanded],{align:'top',offset:-130});
		//}
	//}
	
	
	
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
	 * Set search mode locally and update the url
	 */
	//setSearchMode(mode) {
		//this.setState({searchMode: mode,searchFor:'',searchForValue:'',suggestions:[]})
		//this.loadSuggestions()
		//this.setAlaSearch()
		////if (mode) {
			////this.props.history.push("/ala/"+encodeURIComponent(this.props.searchFor); //"/"+tag+encodeURI(val.replace(punctRE, " ")));
		//////	this.setState({results:[],searchMode:mode})
		////} else {
			////this.props.history.push("/ala/"+encodeURIComponent(mode)+"/"+encodeURIComponent(this.props.searchFor)); //"/"+tag+encodeURI(val.replace(punctRE, " ")));
		////}
	//}
    
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
		this.searchTimeout = setTimeout(this.setAlaSearch,500)
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
		//alert('search on select')
		this.setState({rawSearch:false});
		if (this.searchTimeout) clearTimeout(this.searchTimeout)
		this.searchTimeout = setTimeout(this.setAlaSearch,500)
		if (e) e.preventDefault()
		return false;
	}

	/**
	 * Push search criteria into url
	 */
	setAlaSearch() {
		let searchFor = this.getSearchFor()
		let modeKey = this.getSearchMode()
		//console.log(['SETALASEARCH',searchFor,modeKey])
		if (searchFor && searchFor.length > 0) { 	
			if (modeKey && modeKey.length > 0) {
				this.props.history.push("/ala/"+(this.state.rawSearch ? 'search/' : '')+encodeURIComponent(searchFor)+"/mode/"+encodeURIComponent(modeKey)); 
			} else {
				this.props.history.push("/ala/"+(this.state.rawSearch ? 'search/' : '')+encodeURIComponent(searchFor)); 
			}
		} else {
			if (modeKey && modeKey.length > 0) {
				this.props.history.push("/ala/mode/"+encodeURIComponent(modeKey)); 
			}
		}
	}
	
	/**
	 * Auto load more records on scroll
	 */
	loadMore(key) {
		//return;
		console.log(['LOAD MORE',key,this.state.moreIndex,this.state.hasMore,this.loading])
		let that = this;
		if (this.loading) return;
		if (!this.state.hasMore) return;
		
		console.log(['LOAD MORE real',key])
		//this.setState({moreIndex: this.state.moreIndex + 1})
		this.alaSearch(this.state.moreIndex+1).then(function(results) {
			that.setState({moreIndex: that.state.moreIndex + 1})
			if (results && results.length == 0) {
				console.log('NO MORE RECORS')
				that.setState({hasMore:false})
			} else {
				that.setState({hasMore:true})
			
			}
		})
	}
    
    /**
	 * Catch keypress return on search form
	 */
	alaFirstSearch() {
		//return;
		console.log(['LOAD FIRRST'])
		this.setState({results:[],hasMore:true,moreIndex:0})
		this.alaSearch();
	}
    
    /**
	 * Request data from the ALA api
	 */
	alaSearch(skip) {
		
		let that = this;
		this.loading = true;
		let searchMode = this.getSearchMode();
		let searchFor = this.getSearchFor()
		//return new Promise(function(resolve,reject) { resolve() })
		console.log(['ALA SEARCH',searchMode,searchFor])
		
		let p = new Promise(function(resolve,reject) {
			// HAVE SEARCH CRITERIA
			if (searchFor.length > 0 ) { 
				let extra='';
				if (searchMode.length > 0) {
					if (that.searchModes.hasOwnProperty(searchMode) && that.searchModes[searchMode] && that.searchModes[searchMode].filter) {
						extra="&fq="+that.searchModes[searchMode].filter.join("&fq=");
					}
				}
				// if multi token search term
				//let forParts = searchFor.trim().split(' ');
				//if (forParts.length > 1) {
				
				//}
				if (that.props.rawSearch) {
					//extra += '&fq=commonNameSingle:'+searchFor+''
				} else {
					extra += '&fq=scientificName:"'+searchFor+'"'
					
				}  
				
				
				//fq=imageAvailable:true&
				console.log(['ALA SEARCH with'])
				let start = skip > 0 ? (skip * 5) : 0;//q='+searchFor+extra+'&
				//
				fetch('https://bie-ws.ala.org.au/ws/search.json?pageSize=5&fq=idxtype:TAXON&sort=scientificName&dir=asc&start='+start+extra+'&q="'+searchFor+'"')
				//+'&facets='+facets)
				  .then(function(response) {
					return response.json()
				  }).then(function(json) {
					console.log(['SEARCH results d',json && json.searchResults ? json.searchResults.results : []])
					// append results ?
					var prior = that.state.results ? that.state.results : []
					let newRes = json && json.searchResults ? json.searchResults.results : [];
					let final = null
					//if (skip > 0) {
					final = prior.concat(newRes);
					//}
					that.setState({results:final,expanded:{}});
					that.loading = false;
					if (newRes.length === 1 ) {
						that.expandItem(0);
					}
					
					resolve(newRes)
				  }).catch(function(ex) {
					console.log(['error loading results', ex])
					reject()
				})
			// NO CRITERIA, USE FAVORITES 
			} else {
				let filter='';
				if (searchMode.length > 0) {
					//if (searchMode === "All") {
						//that.setState({results:[]});
					//}
					if (that.searchModes.hasOwnProperty(searchMode) && that.searchModes[searchMode] && that.searchModes[searchMode].filter) {
						filter="&fq="+that.searchModes[searchMode].filter.join("&fq=");
						console.log(['ALA SEARCH','https://bie-ws.ala.org.au/ws/search.json?pageSize=5&fq=idxtype:TAXON&sort=imageAvailable&dir=desc&q=favourite:iconic'+filter])
						//&sort=occurenceCount
						
						let start = skip > 0 ? (skip * 5) : 0;
			
						fetch('https://bie-ws.ala.org.au/ws/search.json?pageSize=5&fq=idxtype:TAXON&sort=imageAvailable&dir=desc&q=favourite:iconic'+filter+"&start="+start)
						//+'&facets='+facets)
						  .then(function(response) {
							return response.json()
						  }).then(function(json) {
							console.log(['SEARCH results',json && json.searchResults ? json.searchResults.results : []])
							let newRes = json && json.searchResults ? json.searchResults.results : [];
							let final = null;
							let prior= that.state.results ? that.state.results : []
							//if (skip > 0) {
							final = prior.concat(newRes);
							//}
							
							that.setState({results:final,expanded:{}});
							that.loading = false;
							
							resolve(newRes)
						  }).catch(function(ex) {
							console.log(['error loading results', ex])
							reject()
						  })
					}
				}
			}
		})
		return p;
	}
	
	/**
	 * UNUSED
	 */
	alaLoadSingle(guid) {
		//let that = this;
		//this.loading = true;
		//let searchMode = this.getSearchMode();
		//let searchFor = this.getSearchFor()
		//console.log(['ALA SEARCH',searchMode,searchFor])
		//this.setState({single:null})
		//let p = new Promise(function(resolve,reject) {
			//let extra='';
			////fq=imageAvailable:true&
			//console.log(['ALA SEARCH with','https://bie-ws.ala.org.au/ws/search.json?pageSize=5&fq=idxtype:TAXON&sort=occurenceCount&dir=asc&q='+searchFor+extra])
			//fetch('https://bie-ws.ala.org.au/ws/search.json?pageSize=5&fq=idxtype:TAXON&sort=imageAvailable&dir=desc&q='+searchFor+extra)
			  //.then(function(response) {
				//return response.json()
			  //}).then(function(json) {
				//console.log(['SEARCH results d',json && json.searchResults ? json.searchResults.results : []])
				//this.setState({single:json})
	
				//resolve(newRes)
			  //}).catch(function(ex) {
				//console.log(['error loading results', ex])
				//reject()
			  //})
		//})
		//return p
	}
	
	
			
	
	
	
	/**
	 * UNUSED
	 * Get a unique id for the question from the guid field
	 */
	getId(question) {
		let parts = question && question.guid ? question.guid.split("afd.taxon:") : []
		let id=parts && parts.length > 0 ? parts[1] : null;
		return id;
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
	getScientificName(result) {
		return result.scientificName ? result.scientificName : (result.acceptedConceptName ? result.acceptedConceptName : '')
	}
	
	
	/**
	 * Generate a link to ALA or wikipedia based on available information.
	 */
	getLink(result) {
		let id = this.getId(result);
		if (result.guid) {
			return "https://bie.ala.org.au/species/"+result.guid
		} else {
			return 'http://en.wikipedia.org/?curid='+result.wikipediaPageId;
		}
	}
	
	
	// Code taken from MatthewCrumley (https://stackoverflow.com/a/934925/298479)
	getBase64Image(imageRef) {
		let img = this.images[imageRef]  
		// Create an empty canvas element
		var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;

		// Copy the image contents to the canvas
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);

		// Get the data-URL formatted image
		// Firefox supports PNG and JPEG. You could check img.src to guess the
		// original format, but be aware the using "image/jpg" will re-encode the image.
		var dataURL = canvas.toDataURL("image/png");

		//let a = dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
		console.log(dataURL);
		return dataURL;
	}
		
		
	/**
	 * Capture this result and save it as a question, then add it to the review feed (create a seen record)
	 */
	addToReview(result,resultKey,user) {
		let that = this;
		let quiz = 'Australian Biota'
		let interrogative = 'Do you recall the Australian species '
		
		let tags = ['australia','biota','scientific names']
		// split into a few specific topics
		if (result.kingdom && result.kingdom.toLowerCase() === 'plantae') {
			quiz = 'Australian Plants'
			tags.push('plants');
			interrogative = 'Do you recall the Australian plant '
		} else if (result.kingdom && result.kingdom.toLowerCase() === 'animalia') {
			quiz = 'Australian Animals'
			tags.push('animals');
			interrogative = 'Do you recall the Australian animal '
			
		} else if (result.kingdom && result.kingdom.toLowerCase() === 'fungi') {
			quiz = 'Australian Fungi'
			tags.push('fungi');
			interrogative = 'Do you recall the Australian fungi '
			 
		}

		
		
		let link = this.getLink(result)
		fetch('/api/importquestion', {
			  method: 'POST',
			  headers: {
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify(Object.assign({user:user,tags:tags,quiz:quiz,access:'public',interrogative:interrogative,question:that.getScientificName(result),difficulty:3,autoshow_image:"YES",image:this.getBase64Image(resultKey),answer:result.description,facts:result,link:link},{}))
			}).then(function() {
				console.log(['saved question'])
				that.showMessage('Saved for review')
			});
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
	 * Lookup additional information about this species from wikipedia.
	 */
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
	
	/**
	 * Set this item as expanded
	 */
	expandItem(key) {
		scrollToComponent(this.scrollTo['topofpage'],{align:'top',offset:-130});

		let expanded= {};
		expanded[key] = true
		this.setState({expanded:expanded,lastExpanded:key})
		this.alaExpandData(key)
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
	
	/**
	 * UNUSED
	 */
	testImage() {
		// try load ala image, return true or false on failure
		// ALA sometimes hides images until logged in.
		// https://images.ala.org.au/image/proxyImageThumbnailLarge?imageId=ec18ec40-e0e5-493a-b3ca-e99d6f45cfd7
	}
  
	
	
	
	
	/**
	 * Load autocomplete suggestions
	 */
	loadSuggestions(searchFor) {
		//https://biocache-ws.ala.org.au/ws/autocomplete/search  
		let that = this;
		console.log(['ALA suggest',searchFor])
		this.setState({single:null})
		let searchMode = this.getSearchMode()
		let p = new Promise(function(resolve,reject) {
			let extra='';
			if (searchMode.length > 0) {
				if (that.searchModes.hasOwnProperty(searchMode) && that.searchModes[searchMode] && that.searchModes[searchMode].suggestFilter) {
					extra="&fq="+that.searchModes[searchMode].suggestFilter.join("&fq=");
				}
			}
			// if multi token search term
			//let forParts = searchFor.trim().split(' ');
			//if (forParts.length > 1) {
			//	extra += "&fq=scientificName:"+searchFor
			//	extra += "&fq=commonName:"+searchFor
			//}
			extra += '&fq=rank:species'
			console.log(['ALA SEARCH with'])
			fetch('https://biocache-ws.ala.org.au/ws/autocomplete/search?pageSize=300&q='+searchFor+extra)
			  .then(function(response) {
				return response.json()
			  }).then(function(json) {
				console.log(['SEARCH results d',json && json.searchResults ? json.searchResults.results : []])
				let final = json && json.searchResults ? json.searchResults.results : [];
				that.setState({suggestions:final});
				that.loading = false;
				final.unshift({name:' ',commonName:[]});
				resolve(final)
			  }).catch(function(ex) {
				console.log(['error loading results', ex])
				reject()
			})			
			
		})
		return p
	}
	
    
      
    /**
	 * Render a single result
	 */
	renderResult(result,resultKey,isRow) {
		let that = this;
		if (result) { // && result.rank === "species") {
			//https://bie.ala.org.au/species/
			//https://bie.ala.org.au/species/urn:lsid:biodiversity.org.au:afd.taxon:37e8eb33-f608-460e-904a-cf0a29e779c0
			let alaLink="https://bie.ala.org.au/species/"+result.guid;
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
		//	{JSON.stringify(result)}
					
			// ref={(section) => { this.scrollTo['result_'+resultKey] = section; }}
			return <div  key={resultKey} style={rowStyle} className={rowClass}  >
				<div style={{width:'100%', clear:'both'}} >
					{this.state.results.length > 1 && <div style={{float:'left', marginRight:'1em'}} >
						{!isExpanded && expandedLink && <span ><div  onClick={(e) => that.expandItem(resultKey)} className='btn btn-info' >+</div></span>}
						{isExpanded && expandedLink && <span ><div  onClick={(e) => that.contractItem(resultKey)} className='btn btn-info' >-</div></span>}
					</div>}
					{isExpanded && <div style={{float:'right'}}>
						{<span ><a target="_blank" href={alaLink} className='btn btn-info' >Link</a></span>}
						{result.image && <span ><a target="_blank" href={alaGalleryLink} className='btn btn-info' >Gallery</a></span>}
						{result.wikipediaPageId && result.wikipediaPageId > 0 && <span ><a target="_blank" href={wikipediaLink} className='btn btn-info' >Wikipedia</a></span>}
						{this.props.user && <button className='btn btn-success' onClick={(e) => this.addToReview(result,resultKey,this.props.user._id)} >Add To My Review List</button>}
					</div>}
						{commonName && <div style={{fontWeight:'bold'}} >{commonName}</div>}
						<i>{scientificName}</i>   
					
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
				
				  <div ref={(section) => { this.scrollTo.end = section; }} ></div>
               
				{!isExpanded &&  result.imageUrl && <img crossorigin="anonymous" ref={(section) => { this.images[resultKey] = section; }}  onClick={(e) => this.getBase64Image(resultKey)} style={{maxHeight:'300px' }}  src={result.smallImageUrl} />}   
				{isExpanded &&  result.imageUrl && <img  crossorigin="anonymous" ref={(section) => { this.images[resultKey] = section; }}    onClick={(e) => this.getBase64Image(resultKey)} src={result.smallImageUrl} />}   
				
				<hr/>
			</div>
		} else {
			return null;
		}
	}
	
    
    
    /**
	 * Render component
	 */
	render() {
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
			//if (that.state.searchFor) {
				//modeLink = '/ala/'+encodeURIComponent(that.state.searchFor)+'/mode/'+encodeURIComponent(modeKey)
			//} 
			//if (that.state.searchFor.length > 0) {
				//modeLink = '/ala/mode/'+encodeURIComponent(modeKey)+"/"+that.state.searchFor+"/"
			//}
			let style={}
			if (selectedMode === modeKey) {
				style={fontWeight:'bold',border:'2px solid black'}
			}
			return <Link key={modeKey} style={style} to={modeLink} className='btn btn-info'>{modeKey}</Link>
		})
		let loader = this.state.hasMore ? <div className="loader" key={0}></div> : <div className="loader"></div>;
		//({item.commonName.join(",")})
        return  (
        <div className="alasearch"  style={{marginLeft:'0.5em'}}>
			<div  ref={(section) => { this.scrollTo.topofpage = section; }} ></div>
               
			<h3>{searchLabel}</h3>
			{this.state.message && <b style={{color:'red'}}>{this.state.message}</b>}

	  
			<div style={{padding:'0.5em',backgroundColor:'grey',border:'1px solid black',marginBottom:'1em'}}>
			
			<a  className='btn btn-warning' target="_blank" href="https://auth.ala.org.au/cas/login?service=https://mnemolibrary.com/ala" style={{float:'right',marginLeft:'1em'}}>No Images?</a>
			
			
			<div style={{marginTop:'0.5em',marginBottom:'0.5em'}}>
			{searchModes}
			</div>
			
			<div style={{float:'right'}}>
			<a  className='btn btn-info' target="_blank" href="https://biocache.ala.org.au/search#tab_simpleSearch" style={{marginLeft:'1em'}}>Advanced Search</a><Link to="/ala" className="btn btn-danger">Reset</Link>
			</div>
			
			<form onSubmit={(e) => this.submitForm(e)}>
			  <Autocomplete
			getItemValue={(item) => item.name   }
			items={that.state.suggestions}
			renderItem={(item, isHighlighted) => {
				if (item.rank === 'species') { 
					return <div style={{ borderBottom: '1px solid grey',borderTop: '1px solid grey',width: '100%' ,background: isHighlighted ? 'lightgray' : 'white' }}>
					  <div><b>{item.commonName ? item.commonName.join(' ') : item.name}</b> <i>{item.name}</i></div>
					</div>
				} else {
					return <div></div>;
				}
			}}
			value={that.state.searchForValue}
			
			onSelect={(value, item) => {
				console.log(['SELECT',value,item])
				//onSelect={(val) => value = val}
				// set the menu to only the selected item
				that.setState({ searchFor:item.nameComplete, suggestions: []}) //, suggestions: [] })
				that.submitFormOnSelect();
				// or you could reset it to a default list again
				// this.setState({ unitedStates: getStates() })
			}}
			onChange={(event, value) => {
				console.log(['SEARCH CHANGE',value])
				that.setState({ searchForValue:value}) //, suggestions: [] })
				
				//if (this.searchTimeout) clearTimeout(this.searchTimeout)
				//this.searchTimeout = setTimeout(this.setAlaSearch,500)
				
				if (that.suggestTimeout) clearTimeout(that.suggestTimeout)
				that.suggestTimeout = setTimeout(function() {that.loadSuggestions(value)},500)
	
				//this.setState({ value })
				//clearTimeout(this.requestTimer)
				//this.requestTimer = fakeRequest(value, (items) => {
				  //this.setState({ unitedStates: items })
				//})
				//overflow:'scroll', position:'fixed',zIndex:9999999,
			}}
			
          renderMenu={children => (
            <div className="menu" style={{ width:'100%'}}>
              {children}
            </div>
          )}
        />
			
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


//		
//	<span>Locality: <select  className='btn btn-info'  onChange={this.setLocality} >{this.state.locality ? " - "+this.state.locality : ''} ><option >All</option><option value="state:NSW" >NSW</option></select></span>
		
		//<div>{result.license ? <span>Licence: {result.license}</span> : null}</div>
					//<div>{id ? <span>ID: {id}</span> : null}</div>
					//<div>{result.content ? result.content : ''}</div>
					//<div>{result.temporal ? <span>Temporal: {result.temporal}</span> : null}</div>
				//<hr/>
