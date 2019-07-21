/* eslint-disable */ 
import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
var nlp = require('compromise') // (or window.nlp)
		

export default class FeedMuncher extends Component {
    
    constructor(props) {
		super(props)
		this.state={
			feedUrl:'https://www.abc.net.au/news/feed/51120/rss.xml',
			feedData:'',
			expanded: {},
			tagWords: {},
			isEditing:{},
			deleted: {}
		}
		this.updateTimeout = null
		
		this.domRefs = {}
		this.startEditing = this.startEditing.bind(this)
		this.deleteItemNow = this.deleteItemNow.bind(this)
		this.setExpanded = this.setExpanded.bind(this)
		this.deleteItem = this.deleteItem.bind(this)
		this.addTagWord = this.addTagWord.bind(this)
		this.setExpanded = this.setExpanded.bind(this)
		this.updateUrl = this.updateUrl.bind(this)
		this.sendToReview = this.sendToReview.bind(this)
		
	}
	
	componentDidMount() {
		try {
			this.setState({deleted: JSON.parse(localStorage.getItem('feedmuncher_blocked_guids'))});
		} catch (e) {
			this.setState({deleted:{}})
		}
		this.updateUrl(null,this.state.feedUrl);
	}
    
    
    setExpanded(key) {
		let that = this;
		if (this.state.items.length > key && this.state.items[key] && this.state.items[key].link) {
			let item = this.state.items[key]
			fetch('/api/pageproxy?url='+that.state.items[key].link.trim()).then(response => {
				return response.json()
				
			}).then(function(jsonarray) {
				let json = jsonarray.join("\n")
				var d = document.createElement('div');
				d.innerHTML = item.description;
				var description = (d.textContent || d.innerText)
				var r = document.createElement('div');
				r.innerHTML = json;
				var longDescription = (r.textContent || r.innerText)
				
				var doc = nlp(item.title+'\n'+description+'\n'+longDescription)
				function onlyUnique(value, index, self) { 
					return self.indexOf(value) === index;
				}	
				let docInfo = {
					people: doc.people().match('#FirstName #LastName').out('array').filter(onlyUnique),
					places: doc.places().out('array').filter(onlyUnique),
					dates: doc.dates().out('array').filter(onlyUnique),
					questions: doc.questions().out('array').filter(onlyUnique),
					terms: doc.terms().out('array').filter(onlyUnique),
					topics: doc.topics().out('array').filter(onlyUnique),
					values : doc.values().out('array').filter(onlyUnique),
					nouns : doc.nouns().out('array').filter(onlyUnique),
					verbs : doc.verbs().out('array').filter(onlyUnique)
				}
				let nouns = docInfo.people//.concat(docInfo.nouns).filter(onlyUnique);
				let values = docInfo.places//.concat(docInfo.values).filter(onlyUnique);
				
				//let expanded = that.state.expanded;
				//expanded[key] = json;
				let expanded = that.state.expanded;
				let guid = item.guid['#'];
				expanded[guid] = {guid:guid,nouns:nouns,values:values,lines:jsonarray};
				console.log(['JJ',expanded[guid]])
				//expanded:expanded,
				that.setState({expanded:expanded})
			})
		}
	}
    
    updateUrl(event,value) {
		let that = this;
		if (this.updateTimeout) clearTimeout(this.updateTimeout)
		this.updateTimeout = setTimeout(function() {
			if (that.state.feedUrl) {
				fetch('/api/feedproxy?url='+that.state.feedUrl.trim()).then(response => {
					return response.json()
				}).then(function(json) {
					that.setState({items:json.rss.channel.item,title:json.rss.channel.title,copyright:json.rss.channel.copyright})
				})
			}
			that.setState({feedUrl:value})
		},500)
	}
	

	deleteItemNow(key) {
		let that = this;
		let deleted = this.state.deleted
		if (deleted) {
			if (this.state.items.length > key) {
				deleted[this.state.items[key].guid['#']]=true
			}
		} else {
			deleted={}
		}
		
		//let items = this.state.items
		//items:items,
		//items.splice(key,1);
		localStorage.setItem('feedmuncher_blocked_guids',JSON.stringify(deleted));
		that.setState({deleted:deleted});
	}
	
	deleteItem(key) {
		let that = this;
		confirmAlert({
		  title: 'Delete News Item',
		  message: 'Are you sure you want to delete this news item?',
		  buttons: [
			{
			  label: 'Yes',
			  onClick: that.deleteItemNow(key)
			},
			{
			  label: 'No',
			  onClick: () => {}
			}
		  ]
		})
 
	}
	
	selectLine(itemKey,lineKey) {
		console.log(['sel line',itemKey,lineKey])
		this.startEditing(itemKey,lineKey);
	}
	
	startEditing(itemKey,lineKey) {
		let editing = this.state.isEditing;
		editing[itemKey +'-' + lineKey] = true;
		this.setState({isEditing:editing})
	}
	
	
	addTagWord(word) {
		let tagWords = this.state.tagWords;
		tagWords[word] = true;
		this.setState({tagWords:tagWords})
	}
	
	sendToReview(record) {
		
	}
    
    render() {
		let that = this;
		
		if (this.state.saveForReview)  {
			return <div>
			<h3>Save for review</h3>
			
			<form>
				<b>Question </b> <input type='text' size='120' value={this.state.saveForReview.question} />
				<b>Answer </b> <textarea type='text' style={{width:'100%'}} >{this.state.saveForReview.answer}</textarea>
				<b>Mnemonic </b> <input type='text' size='120' value={this.state.saveForReview.mnemonic} />
				<b>Difficulty </b> 
				<select value={this.state.saveForReview.difficulty} ><option value="1" >1</option><option value="2" >2</option><option value="3" >3</option><option value="4" >4</option><option value="5" >5</option></select>
			</form>
			
			
			tags
			mcquestion
			
			
			
			</div>
		}
 		
		
		let copyright = this.state.copyright ? this.state.copyright : '';
		let title =  this.state.title  ? this.state.title : '';
		let finalArticles = [];
		console.log(this.state.items)
		let tally = 0;
		if (this.state.items) {
			finalArticles = this.state.items.map(function(item,itemKey) {
				console.log(['ITER',item.guid['#'],that.state.deleted])
					
				if (tally < 10 && (!that.state.deleted || (that.state.deleted && !that.state.deleted.hasOwnProperty(item.guid['#'])))) {
					tally ++;
					// render expanded lines with onclick
					let renderedExpanded = null;
					console.log(['ISDEL',item.guid['#'],that.state.deleted])
					
					if (that.state.expanded[item.guid['#']] && that.state.expanded[item.guid['#']].lines) {
						let dlineKey = 0;
						
						renderedExpanded = that.state.expanded[item.guid['#']].lines.map(function(dline,dk) {
							dlineKey++;
							function doit(dline,dk,dlineKey) {
								//console.log([dline,dlineKey,dk])
								if (that.state.isEditing[item.guid['#']+'-'+dlineKey]) { 
									let dka = String(dlineKey) 
									return <span   key={dlineKey} ref={(section) => { that.domRefs[item.guid['#']+'-'+dlineKey] = section; }}
><input style={{width:'100%'}} onChange={(e) => that.selectLine(item.guid['#'],dka)} value={dline} readOnly={true} /></span>
								} else {
									return <span ref={(section) => { that.domRefs[item.guid['#']+'-'+dlineKey] = section; }} key={dlineKey}   onClick={(e) => that.selectLine(item.guid['#'],dlineKey)} dangerouslySetInnerHTML={{__html:dline}}></span>
								}									
							}
							return doit(dline,dk,dlineKey)
						})
					}
					
					var d = document.createElement('div');
					d.innerHTML = item.description;
					var description = (d.textContent || d.innerText)
							 
					let tags = item.category;
					if (typeof tags === 'object') tags = Object.values(item.category).join(",")
					
					return <div key={itemKey} style={{marginLeft:'1em',borderBottom:'2px solid black', marginBottom:'1em', padding:'0.5em'}}>
						<div style={{float:'right', marginLeft:'1em'}}>
							{!that.state.expanded.hasOwnProperty(item.guid['#']) &&   <button className='btn btn-info'  style={{display:'block', marginTop:'2em'}} onClick={(e) => that.setExpanded(itemKey)}  >Expand</button>}

							{that.state.expanded.hasOwnProperty(item.guid['#']) &&  <button className='btn btn-success'  style={{display:'block'}} onClick={that.sendToReview}  >Save For Review</button>}
							
							{that.state.expanded.hasOwnProperty(item.guid['#']) &&  <button className='btn btn-danger'  style={{display:'block', marginTop:'2em'}} onClick={(e) => that.deleteItem(itemKey)}  >Cancel</button>}
							{!that.state.expanded.hasOwnProperty(item.guid['#']) &&  <button className='btn btn-danger'  style={{display:'block', marginTop:'2em'}} onClick={(e) => that.deleteItemNow(itemKey)}  >Delete</button>}
							
						</div>
						<h3><a href={item.link} target="_blank" >{item.title}</a></h3>
						{item['dc:creator'] && <span> by {item['dc:creator']}</span>}
						<div><b>Date:</b> {item.pubDate}</div>
						
						{tags ? <div style={{marginBottom:'1em'}}> <b>Tags:</b> <span style={{fontStyle:'italic'}}>{tags}</span></div> : null}
						{that.state.expanded.hasOwnProperty(item.guid['#']) && <div style={{fontStyle:'italic',marginBottom:'1em'}} >{description}</div>}
						{!that.state.expanded.hasOwnProperty(item.guid['#']) && <div style={{marginBottom:'1em'}} onClick={(e) => that.selectLine(description,'description')} >{description}</div>}
						
						{renderedExpanded && <div style={{marginTop:'1em',marginBottom:'1em'}} >{renderedExpanded}</div>}
						
						<div  onClick={(e) => that.selectLine(item['media:group'] ? item['media:group']['media:description'] : '','mediadescription')} style={{marginBottom:'1em'}}>{item['media:group'] && item['media:group']['media:description'] ? item['media:group']['media:description'] : null}</div>
						
						<div>{item['media:group'] && item['media:group']['media:content'] ? item['media:group']['media:content'].map(function(media,mk) {if (mk < 1) return <img style={{maxHeight:'300px'}} key={mk} src={media.url} /> }) : null}</div>
						
						{that.state.expanded.hasOwnProperty(item.guid['#']) && <div style={{padding:'0.5em',border: '1px solid black', backgroundColor: 'lightgrey'}} >
							{ that.state.expanded.hasOwnProperty(item.guid['#']) && <div>
								{that.state.expanded[item.guid['#']].nouns && that.state.expanded[item.guid['#']].nouns.length > 0 &&  <div><b>Nouns</b> {that.state.expanded[item.guid['#']].nouns.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey}  onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
							
							
							{ that.state.expanded.hasOwnProperty(item.guid['#']) && <div>
								{that.state.expanded[item.guid['#']].values && that.state.expanded[item.guid['#']].values.length > 0 &&  <div><b>Numbers</b> {that.state.expanded[item.guid['#']].values.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
						</div>}

						
							
						
						
					</div>
					} else {
						return null; 
					}
					
					
				})
			
		}	
		
		//className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"}
		//	{itemKey === that.state.expanded && <iframe style={{minHeight:'600px', width:'100%'}} src={item.link} ></iframe>}
				
        return  (
        <div className="feedmuncher" >
        <b>Enter an ABC NEWS RSS URL:</b> 
        
        <input style={{width:'50em'}} value={this.state.feedUrl} onChange={this.updateUrl}  />
        

<h3>News</h3>
{title}
<br/>
    {copyright}
<hr/>        
{finalArticles}
        
            <br/>
           
         </div>
        )
    }
//    <div dangerouslySetInnerHTML={{__html:this.state.feedData}} ></div>
	
}


//{ that.state.expanded.hasOwnProperty(itemKey) && <div>
							//{that.state.expanded[itemKey].people && that.state.expanded[itemKey].people.length > 0 &&  <div><b>People</b> {that.state.expanded[itemKey].people.map(function(record,recordKey) {
								//return <button  key={recordKey}  className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} onClick={(e) => that.addTagWord(record)} >{record}</button>
							//})}</div> }
						//</div>}
						
						//{ that.state.expanded.hasOwnProperty(itemKey) && <div>
							//{that.state.expanded[itemKey].places && that.state.expanded[itemKey].places.length > 0 &&  <div><b>Places</b> {that.state.expanded[itemKey].places.map(function(record,recordKey) {
								//return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.addTagWord(record)} >{record}</button>
							//})}</div> }
						//</div>}
//{ that.state.expanded.hasOwnProperty(itemKey) && <div>
							//{that.state.expanded[itemKey].dates && that.state.expanded[itemKey].dates.length > 0 &&  <div><b>Dates</b> {that.state.expanded[itemKey].dates.map(function(record,recordKey) {
								//return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey}  onClick={(e) => that.addTagWord(record)} >{record}</button>
							//})}</div> }
						//</div>}
						
						
