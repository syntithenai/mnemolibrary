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
			
import AlaDistributionMap from './AlaDistributionMap'


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
			suggestions: [],
			mapRef: null,
			showDistMap:false
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
		this.setMapRef= this.setMapRef.bind(this)
		this.setAlaSearch = this.setAlaSearch.bind(this)
		this.loadMore = this.loadMore.bind(this)
		this.alaFirstSearch = this.alaFirstSearch.bind(this)
		this.loadSuggestions = this.loadSuggestions.bind(this)
		this.submitForm = this.submitForm.bind(this)
		this.addToReview = this.addToReview.bind(this)
		this.showDistMap = this.showDistMap.bind(this)
		
		this.images = {}
		this.searchTimout = null
		this.searchModes = {
			'All':{subtitle:'',searchLabel:"Search Australian Biota",filter:[]},
			'Animals':{subtitle:'Animalia',searchLabel:"Search Australian Animals",filter:["rk_kingdom:ANIMALIA"],suggestFilter:["1"]},
			'Birds':{subtitle:'',searchLabel:"Search Australian Birds",filter:["rk_class:AVES"],suggestFilter:["212"]},
			'Reptiles':{subtitle:'',searchLabel:"Search Australian Reptiles",filter:["rk_class:REPTILIA"],suggestFilter:["358"]},
			'Insects':{subtitle:'',searchLabel:"Search Australian Insects",filter:["rk_class:INSECTA"],suggestFilter:["216"]},
			'Plants':{subtitle:'Plantae',searchLabel:"Search Australian Plants",filter:["rk_kingdom:Plantae"],suggestFilter:["6"]},
			'Fungi':{subtitle:'',searchLabel:"Search Australian Fungi",filter:["rk_kingdom:Fungi"],suggestFilter:["5"]},
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
		} 
		
	}
	
	setMapRef(ref) {
		this.setState({mapRef:ref});
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
	 * Reset search criteria, results and suggestions
	 */
    showDistMap() {
		this.setState({showDistMap:true})
	}
	
	/**
	 * Catch keypress return on search form and trigger search
	 */
	submitForm(e) {
		this.setState({rawSearch:true,searchFor:this.state.searchForValue,suggestions:[],showDistMap:false});
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
		this.setState({rawSearch:false,showDistMap:false});
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
		return;
		let that = this;
		if (this.loading) return;
		if (!this.state.hasMore) return;
		this.alaSearch(this.state.moreIndex+1).then(function(results) {
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
	alaFirstSearch() {
		let that = this;
		this.setState({results:[],hasMore:true,moreIndex:0})
		this.alaSearch().then(function(res) {
			if (res && res.length === 1) {
				that.alaExpandData(0)
			}
		});
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
		//console.log(['ALA SEARCH',searchMode,searchFor])
		let p = new Promise(function(resolve,reject) {
				// HAVE SEARCH CRITERIA
				if (searchFor.length > 0 ) { 
					let extra='';
					if (searchMode.length > 0) {
						if (that.searchModes.hasOwnProperty(searchMode) && that.searchModes[searchMode] && that.searchModes[searchMode].suggestFilter) {
							that.searchModes[searchMode].suggestFilter.map(function(sFilter) {
									extra += '&highertaxonKey='+sFilter;
							})
						}
					} 
					let start = skip > 0 ? (skip * 5) : 0;//q='+searchFor+extra+'&
					fetch('http://api.gbif.org/v1/occurrence/search?rank=SPECIES&mediaType=StillImage&skip='+skip+'&limit=5&q='+searchFor+extra)
					//fetch('https://bie-ws.ala.org.au/ws/search.json?pageSize=5&fq=idxtype:TAXON&sort=scientificName&dir=asc&start='+start+extra+'&q="'+searchFor+'"')
					  .then(function(response) {
						return response.json()
					  }).then(function(json) {
						// append results ?
						var prior = that.state.results ? that.state.results : []
						let newRes = json ? json.results : [];
						let newResCollation = {}
						newRes.map(function(occurrence) {
							let key = occurrence.species ? occurrence.species : (occurrence.scientificName ? occurrence.scientificName : null) 
							if (key && occurrence) {
								key = key.toLowerCase().trim();
								if (!newResCollation.hasOwnProperty(key)) newResCollation[key] = {}
								newResCollation[key].species = occurrence.species
								newResCollation[key].scientificName = occurrence.scientificName
								newResCollation[key].name = that.getName(occurrence);
								
								newResCollation[key].kingdom = occurrence.kingdom
								newResCollation[key].family = occurrence.family
								newResCollation[key].class = occurrence.class
								newResCollation[key].phylum = occurrence.phylum
								newResCollation[key].order = occurrence.order
								newResCollation[key].genus = occurrence.genus
								
								//newResCollation[key].species = occurrence.species
								//newResCollation[key].species = occurrence.species
								
								if (occurrence.media) {
									occurrence.media.map(function(mediaItem) {
									//	console.log(mediaItem);
										if (!newResCollation[key].images) newResCollation[key].images = [] 
										if (mediaItem.identifier) {
											let newImage = {}
											newImage.url = mediaItem.identifier
											let urlParts = mediaItem.identifier.split("/");
											let domain = urlParts.length > 1 ? urlParts[2] : null;
											newImage.imageattribution = (mediaItem.rightsHolder ? mediaItem.rightsHolder : (mediaItem.publisher ? mediaItem.publisher : (mediaItem.title ? mediaItem.title : (domain ? domain : ''))))
											newImage.title = mediaItem.title
											newImage.license = mediaItem.license
											newImage.publisher = mediaItem.publisher
											newImage.rightsHolder = mediaItem.rightsHolder
											newResCollation[key].images.push(newImage)
										}
									});
								}
								
							}
						})
						console.log(newResCollation)
						
						let final = null
						final = prior.concat(Object.values(newResCollation));
						that.setState({results:final,expanded:{}});
						that.loading = false;
						if (newRes.length === 1 ) {
							that.expandItem(0);
						}
						
						resolve(Object.values(newResCollation))
					})
					//.catch(function(ex) {
						//console.log(['error loading results', ex])
						//reject()
					//})
				// NO CRITERIA, USE FAVORITES 
				} 
			//else {
				//let filter='';
				//if (searchMode.length > 0) {
					//if (that.searchModes.hasOwnProperty(searchMode) && that.searchModes[searchMode] && that.searchModes[searchMode].filter) {
						//filter="&fq="+that.searchModes[searchMode].filter.join("&fq=");
						//let start = skip > 0 ? (skip * 5) : 0;
			
						//fetch('https://bie-ws.ala.org.au/ws/search.json?pageSize=5&fq=idxtype:TAXON&sort=imageAvailable&dir=desc&q=favourite:iconic'+filter+"&start="+start)
						  //.then(function(response) {
							//return response.json()
						  //}).then(function(json) {
							//let newRes = json && json.searchResults ? json.searchResults.results : [];
							//let final = null;
							//let prior= that.state.results ? that.state.results : []
							//final = prior.concat(newRes);
							//that.setState({results:final,expanded:{}});
							//that.loading = false;
							//resolve(newRes)
						  //}).catch(function(ex) {
							//console.log(['error loading results', ex])
							//reject()
						  //})
					//}
				//}
			//}
		})
		return p;
	}
	
	
	/**
	 * Extract the common name from the result or fallback to name
	 */
	getName(result) {
		if (result.vernacularNames) return result.vernacularNames.map(function(name) {
			return name.vernacularName
		}).join(",")
		return result.vernacularName ? result.vernacularName : (result.name ? result.name : '')
	}
	
	/**
	 * Extract the scientific name from the result or fallback to concept name
	 */
	getScientificName(result) {
		return result.species ? result.species : (result.scientificName ? result.scientificName : '')
	}
	
	
	/**
	 * Generate a link to ALA or wikipedia based on available information.
	 */
	getLink(result) {
		// TODO
		return;
		if (result.guid) {
			return "https://bie.ala.org.au/species/"+result.guid
		} else {
			return 'http://en.wikipedia.org/?curid='+result.wikipediaPageId;
		}
	}
	
	
	// Code taken from MatthewCrumley (https://stackoverflow.com/a/934925/298479)
	getBase64Image(imageRef) {
		if (this.images.hasOwnProperty(imageRef)) {
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
			return dataURL;
		}
	}
		
		
	/**
	 * Capture this result and save it as a question, then add it to the review feed (create a seen record)
	 */
	addToReview(result,resultKey,user) {
		let that = this;
		// defaults
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

		
		let mapImage = null //(canvas ? canvas.toDataURL('image/png'):null);
		let link = that.getLink(result)
		let headlineFacts = {Author: result.author, Kingdom: result.kingdom, Phylum: result.phylum,"Class": result["class"], Subclass: result.subclass, Superorder: result.superorder, Order:result.order, Family: result.family, Genus: result.genus, Species: result.species};
		
		fetch('/api/importquestion', {
		  method: 'POST',
		  headers: {
			'Content-Type': 'application/json'
		  },
		  body: JSON.stringify(Object.assign({user:user,tags:tags,quiz:quiz,access:'public',interrogative:interrogative,question:that.getScientificName(result),guid:that.getScientificName(result),difficulty:3,autoshow_image:"YES",image:that.getBase64Image(resultKey),image2:mapImage,answer:result.description,headlineFacts: headlineFacts,link:link,importtype:'species',importId:'userimport'},{}))
		}).then(function() {
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
		let question = this.state.results[questionKey];
		console.log(['EXPAND'])
		let questions = that.state.results;
					
		
		function sendFinal(json,questions) {	
			console.log(['SEND FINAL'])
			let pages = json.query && json.query.pages ? json.query.pages : null;
			let questionsLoaded = pages && Object.values(pages).length > 0 ? Object.values(pages)  : null;
			if (questionsLoaded && questionsLoaded[0] && questionsLoaded[0].pageid > 0) {
				let questionLoaded = questionsLoaded[0];
				questions[questionKey].description = questionLoaded.extract;
				questions[questionKey].wikipediaPageId = questionLoaded.pageid;
				let expanded = {};
				expanded[questionKey] = true;
				that.setState({results:questions,expanded:expanded});
			}
		}
		
		
		if (question && this.getScientificName(question).length > 0) {
             var url="https://en.wikipedia.org/w/api.php?format=json&redirects=true&action=query&origin=*&prop=extracts&exintro=&explaintext=&titles="+this.getScientificName(question)
	 	
		     fetch(url).then(function(response) {
                return response.json();
            }).then(function(json) {
				//sendFinal(json,questions)
				// try again with common name
				//} else 
				console.log(['got wikipedia page'])
			
			
				if (that.getName(question).length > 0)  {
					var url="https://en.wikipedia.org/w/api.php?format=json&redirects=true&action=query&origin=*&prop=extracts&exintro=&explaintext=&titles="+that.getName(question)
		            fetch(url).then(function(response) {
						return response.json();
					}).then(function(json) {
						let questions = that.state.results;
						// find practical plants page
						console.log(['got wikipedia EXTRACT'])
						sendFinal(json,questions)
						
						//https://practicalplants.org/w/api.php?format=json&redirects=true&action=query&titles=Acacia%20dealbata
						//https://practicalplants.org/wiki/Special:ExportRDF/Acacia_dealbata
						
					
					})
				}
            })
            .catch(function(err) {
                console.log(['ERR loading wiki results',err]);
            });
            
            
            fetch('/api/feedproxy?url='+encodeURIComponent('https://practicalplants.org/w/api.php?format=xml&redirects=true&action=query&titles='+that.getScientificName(question))).then(function(response) {
				return response.json();
			}).then(function(pppagejson) {
				console.log(['PP PAGE'])

				//{"query":{"pages":{"741":{"pageid":741,"ns":0,"title":"Acacia dealbata"}}}}
				let ppPart = pppagejson && pppagejson.api && pppagejson.api.query && pppagejson.api.query.pages  && pppagejson.api.query.pages.page ?  pppagejson.api.query.pages.page : null;
				//console.log( ppPart)
				
				if (ppPart && ppPart.title  && ppPart.title.length > 0) {
					let ppPage = ppPart.title
					//console.log(['pp 2',ppPage])

					fetch('/api/feedproxy?url=https://practicalplants.org/wiki/Special:ExportRDF/'+encodeURIComponent(ppPage)).then(function(response) {
						return response.json();
					}).then(function(ppjson) {
						console.log(['PP DATA'])

						//console.log(['PP 3',ppjson,ppjson['rdf:RDF']['swivt:Subject'][0]])//['rdf:RDF'],ppjson['rdf:RDF']['owl:ObjectProperty']])
						let properties = ppjson && ppjson['rdf:RDF'] && ppjson['rdf:RDF']['swivt:Subject'] && ppjson['rdf:RDF']['swivt:Subject'].length > 0 ? ppjson['rdf:RDF']['swivt:Subject'][0] : null;
						let finalProperties = {};
						//console.log(properties)
						let allowedProperties="Functions as,Has drought tolerance,Has edible part,Has edible use,Has fertility type,Has flowers of colour,Has flowers of type,Has growth rate,Has hardiness zone,Has image,Has lifecycle type,Has material part,Has material use,Has mature height,Has mature width,Has medicinal part,Has medicinal use,Has search name,Has seed requiring scarification,Has seed requiring stratification,Has shade tolerance,Has soil ph preference,Has soil teclayture preference,Has soil teloamyture preference,Has soil tesandyture preference,Has soil water retention preference,Has sun preference,Inhabits ecosystem niche,Is grown from,Tolerates air pollution,Tolerates maritime exposure,Tolerates nutritionally poor soil,Tolerates wind".split(",");
						if (properties) {
							
							Object.keys(properties).map(function(key) {
								let pval = properties[key]
							//	console.log(key,pval)
								let keyParts = key.split(":")
								if (keyParts.length == 2 && keyParts[0] === "property") {
									console.log(['prop',keyParts,typeof pval,pval])
									if (Array.isArray(pval)) {
										//console.log(['array prop'])
										let combined=[]
										pval.map(function(pival) {
											//console.log(pival);
											if (pival['rdf:resource']) {
												let resourceParts = pival['rdf:resource'].split("/");
												if (resourceParts.length > 0) {
													combined.push(resourceParts[resourceParts.length - 1]);
												}
											}
										})
										let cKey =keyParts[1].replace(/_/g,' ');
										if (allowedProperties.indexOf(cKey)) finalProperties[cKey] = combined.join(",")
									} else if (typeof pval === 'object' && pval['rdf:resource']) {
										//console.log(['obj prop'])
										//console.log(pval);
										let resourceParts = pval['rdf:resource'].split("/");
										if (resourceParts.length > 0) {
											let cKey =keyParts[1].replace(/_/g,' ');
											if (allowedProperties.indexOf(cKey) !== -1) {
												finalProperties[cKey] = resourceParts[resourceParts.length - 1]
											}
										}
										
									}
								}
							})
						} 
						console.log(finalProperties)
						//console.log(Object.keys(finalProperties).join(","))
						sendFinal(ppjson,questions)
					})
				
				} else {
					sendFinal(json,questions)
				}
			})
            
            
        }
	}
	
	/**
	 * Set this item as expanded
	 */
	expandItem(key) {
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
	 * Load autocomplete suggestions
	 */
	loadSuggestions(searchFor) {
		let that = this;
		this.setState({single:null})
		let searchMode = this.getSearchMode()
		let p = new Promise(function(resolve,reject) {
			let extra='';
			if (searchMode.length > 0) {
				if (that.searchModes.hasOwnProperty(searchMode) && that.searchModes[searchMode] && that.searchModes[searchMode].suggestFilter) {
					that.searchModes[searchMode].suggestFilter.map(function(sFilter) {
						//let sParts = sFilter.split(":");
						//if (sParts.length === 2) {
							//extra+= '&'+sParts[0]+'='+sParts[1]
							extra += '&highertaxonKey='+sFilter;
						//}
					})
					//extra="&fq="+that.searchModes[searchMode].suggestFilter.join("&fq=");
				}
			}
			//extra += '&fq=rank:species'
			////http://api.gbif.org/v1/species/search?rank=SPECIES&q=Black%20cockatoo
			// &mediaType=StillImage
//			fetch('https://biocache-ws.ala.org.au/ws/autocomplete/search?pageSize=300&q='+searchFor+extra)
			fetch('http://api.gbif.org/v1/species/search?rank=SPECIES&q='+searchFor+extra)
			  .then(function(response) {
				return response.json()
			}).then(function(json) {
				//let final = json && json.searchResults ? json.searchResults.results : [];
				let collate = {};
				let final = json  ? json.results.map(function(suggestion) {
					collate[suggestion.species] = suggestion;
					return;
				}) : [];
				// http://api.gbif.org/v1/species/123518303/vernacularNames
				that.setState({suggestions:Object.values(collate)});
				that.loading = false;
				//final.unshift({name:' ',commonName:[]});
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
		if (result) {
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
			return <div  key={resultKey} style={rowStyle} className={rowClass}  >
				<div style={{width:'100%', clear:'both'}} >
					{this.state.results.length > 1 && <div style={{float:'left', marginRight:'1em'}} >
						{!isExpanded && expandedLink && <span ><div  onClick={(e) => that.expandItem(resultKey)} className='btn btn-info' >+</div></span>}
						{isExpanded && expandedLink && <span ><div  onClick={(e) => that.contractItem(resultKey)} className='btn btn-info' >-</div></span>}
					</div>}
					{isExpanded && <div style={{float:'right'}}>
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
               
				{isExpanded &&  result.images && result.images.map(function(image) { 
					return <div>
						<img src={image.url} style={{maxHeight:'300px' }}  />
						<div>Attribution: {image.imageattribution}</div>
						<div>License: {image.license}</div>
						</div>
				})}

				{!isExpanded &&  result.images && result.images && result.images.length > 0 &&  <div><img src={result.images[0].url} style={{maxHeight:'300px' }}  /><div>Attribution: {result.images[0].imageattribution}</div><div>License: {result.images[0].license}</div></div>
				}
			
				<br/><br/>
				{ isExpanded &&  <div><h3>{this.showDistMap && <button className='btn btn-info' onClick={this.showDistMap}>+</button>} Distribution Map</h3>
				    {this.state.showDistMap && <AlaDistributionMap species={scientificName} setMapRef={this.setMapRef} />}
	
				</div>}
				<hr/>
			</div>
		} else {
			return null;
		}
	}
////				{!isExpanded &&  result.imageUrl && <img crossOrigin="anonymous" ref={(section) => { this.images[resultKey] = section; }}  onClick={(e) => this.getBase64Image(resultKey)} style={{maxHeight:'300px' }}  src={result.smallImageUrl} />}   
			
			
				//{isExpanded &&  result.imageUrl && <img  crossOrigin="anonymous" ref={(section) => { this.images[resultKey] = section; }}    onClick={(e) => this.getBase64Image(resultKey)} src={result.smallImageUrl} />}   
				
    
    
    /**
	 * Render component
	 */
	render() {
		if (this.props.analyticsEvent) this.props.analyticsEvent('ala search');
		let that = this;
		let expandedKeys = Object.keys(this.state.expanded);
		let rendered = this.state.results && this.state.results.length > 0 ? this.state.results.map(function(result,resultKey) {
			return that.renderResult(result,resultKey,true)
		}) : null;
		let selectedMode = that.searchModes.hasOwnProperty(this.getSearchMode()) ? this.getSearchMode() : 'All' 
		let searchLabel = that.searchModes[selectedMode].searchLabel
		let searchModes = Object.keys(that.searchModes).map(function(modeKey) {
			let mode = that.searchModes[modeKey]
			let modeLink = '/ala/mode/'+encodeURIComponent(modeKey)
			let style={}
			if (selectedMode === modeKey) {
				style={fontWeight:'bold',border:'2px solid black'}
			}
			return <Link key={modeKey} style={style} to={modeLink} className='btn btn-info'>{modeKey}</Link>
		})
		let loader = this.state.hasMore ? <div className="loader" key={0}></div> : <div className="loader"></div>;
        return  (
        <div className="alasearch"  style={{marginLeft:'0.5em'}}>
			<div  ref={(section) => { this.scrollTo.topofpage = section; }} ></div>
               
			<h3>{searchLabel}</h3>
			{this.state.message && <b style={{position:'fixed',top:'7em',left:'50%',backgroundColor:'pink',border:'1px solid black',color:'black',padding:'0.8em'}}>{this.state.message}</b>}

	  
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
			getItemValue={(item) => item.species   }
			items={that.state.suggestions}
			renderItem={(item, isHighlighted) => {
				if (item.nameType === 'SCIENTIFIC') { 
				//console.log(item)
					let name = that.getName(item);
							
					return <div key={item.species} style={{ borderBottom: '1px solid grey',borderTop: '1px solid grey',width: '100%' ,background: isHighlighted ? 'lightgray' : 'white' }}>
					  <div><b>{item.species}</b> <i> {name}</i></div>
					</div>
				} else {
					return <div key={item.species}></div>;
				}
			}}
			value={that.state.searchForValue}
			
			onSelect={(value, item) => {
				console.log(['SELECT',value,item])
				that.setState({ searchFor:item.species, suggestions: []})
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
