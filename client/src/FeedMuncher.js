/* eslint-disable */ 
import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Autocomplete from 'react-autocomplete'
import InfiniteScroll from 'react-infinite-scroller';
		
import Swipeable from 'react-swipeable'

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
			deleted: {},
			saveForReview:null,
			showTagSelector: false,
			showMemoryAidSelector: false,
			lineSearch:''
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
		this.reallySendToReview = this.reallySendToReview.bind(this)
		this.change = this.change.bind(this)
		this.deleteTag = this.deleteTag.bind(this)
		this.addTag = this.addTag.bind(this)
		this.addMemoryAid = this.addMemoryAid.bind(this)
		this.showTagSelector = this.showTagSelector.bind(this)
		this.saveMemoryAid = this.saveMemoryAid.bind(this)
		this.mcFromWord = this.mcFromWord.bind(this)
	}
	
	componentDidMount() {
		try {
			this.setState({deleted: JSON.parse(localStorage.getItem('feedmuncher_blocked_guids'))});
		} catch (e) {
			this.setState({deleted:{}})
		}
		this.updateUrl(null,this.state.feedUrl);
	}
    
    
    html2Text(html)  {
		if (!html) return ''
		var d = document.createElement('div');
		d.innerHTML = html;
		return  (d.textContent || d.innerText)
	}
    
    setExpanded(key) {
		let that = this;
		if (this.state.items.length > key && this.state.items[key] && this.state.items[key].link) {
			let item = this.state.items[key]
			fetch('/api/pageproxy?url='+that.state.items[key].link.trim()).then(response => {
				return response.json()
			}).then(function(jsonarray) {
				let json = jsonarray.join("\n")
				var description = that.html2Text(item.description)
				var longDescription = that.html2Text(json)
				
				var doc = nlp(item.title+'\n'+description+'\n'+longDescription)
				function onlyUnique(value, index, self) { 
					return self.indexOf(value) === index;
				}	
				let docInfo = {
					topics: Object.assign(doc.people().match('#FirstName #LastName').out('array'),Object.assign(doc.places().out('array'),doc.organizations().out('array'))).filter(onlyUnique),
					//places: doc.places().out('array').filter(onlyUnique),
					//organizations: doc.organizations().out('array').filter(onlyUnique),
					values: Object.assign(doc.dates().out('array'),doc.values().out('array')).filter(onlyUnique),
					//values : doc.values().out('array').filter(onlyUnique),
					
					//adjectives: doc.adjectives().out('array').filter(onlyUnique),
					//questions: doc.questions().out('array').filter(onlyUnique),
					//terms: doc.terms().out('array').filter(onlyUnique),
					//topics: doc.topics().out('array').filter(onlyUnique),
					nouns : doc.nouns().out('array').filter(onlyUnique),
					//verbs : doc.verbs().out('array').filter(onlyUnique)
				}
				//let nouns = docInfo.people//.concat(docInfo.nouns).filter(onlyUnique);
				//let values = docInfo.places//.concat(docInfo.values).filter(onlyUnique);
				
				//let expanded = that.state.expanded;
				//expanded[key] = json;
				let expanded = that.state.expanded;
				let guid = item.guid["#"];
				expanded[guid] = Object.assign(docInfo,{guid:guid,lines:jsonarray,item:item});
				//console.log(['JJ',guid,expanded[guid]])
				//expanded:expanded,
				// load existing questions by feed guid
				fetch('/api/guid/?guid='+guid).then(response => {
					return response.json()
				}).then(function(question) {
					if (question) {
						fetch('/api/mcguid?guid='+guid).then(response => {
							return response.json()
						}).then(function(mcQuestions) {
							expanded.db = {question: question,mcQuestions:mcQuestions}
							that.setState({expanded:expanded})
						})
					}
				})
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
	
	selectLine(itemKey,itemGuid,lineKey,lineText) {
		let that = this;
		console.log(['sel line',itemKey,lineKey,lineText,that.state.items])
		if (that.state.items.length > itemKey && lineText) {
			let item = that.state.items[itemKey]
			that.sendToReview(item,that.html2Text(lineText));
		} else if (itemGuid && that.state.expanded && that.state.expanded.hasOwnProperty(itemGuid)) {
			console.log(['sel line1'])
			let item = that.state.expanded[itemGuid]
			if (lineText) {
					that.sendToReview(item.item,that.html2Text(lineText));
			} else if (item && item.lines) {
				console.log(['sel line2'])
				let lines = item.lines;
				if (lines.length > lineKey) {
					console.log(['sel line3'])
					that.sendToReview(item.item,that.html2Text(lines[lineKey-1]));
				}
			}
			
		}
		//this.startEditing(itemKey,lineKey);
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
	
	sendToReview(item,sentence) {
		if (item) {
			let that = this;	
			let tags = item.category.join(",").toLowerCase().split(",");
			console.log(tags)	
			//let oldSaveForReview = this.state.oldSaveForReview ? this.state.oldSaveForReview : {}
			this.setState({
				saveForReview:Object.assign(item,{
						guid:item.guid ? item.guid['#'] : '',
						answer:that.html2Text(item.title),
						question:'',difficulty:2,
						mnemonic:'',
						specific_question:that.html2Text(sentence).length > 0 ? that.html2Text(sentence) : '',
						specific_answer:'',
						multiple_choices:'',
						feedback:that.html2Text(item.description),
						atags:tags
					})
				})
				//))})
			console.log(['stsart review',item])
		} else {
			this.setState({saveForReview:null,oldSaveForReview:this.state.saveForReview});
		}
	}
	
	reallySendToReview(record) {
		console.log(['send review',this.state.saveForReview])
	}
    
     change(e) {
        //console.log(e.target.name,e.target.value);
        let state = this.state.saveForReview;
        var key = e.target.name;
        state[key] =  e.target.value;
        this.setState({saveForReview:state});
        return false;
    };
    
    deleteTag(tagKey) {
		let saveForReview = this.state.saveForReview
		saveForReview.atags.splice(tagKey,1)
		this.setState({saveForReview:saveForReview})
	}
	
	addTag(tag) {
		let saveForReview = this.state.saveForReview
		let newTag = tag
		if (!newTag)  {
			newTag = saveForReview.newtag
		}
		saveForReview.atags.push(newTag)
		saveForReview.newtag = '';
		this.setState({saveForReview:saveForReview,showTagSelector:null,})
	}
	
	
	addMemoryAid() {
		this.setState({showMemoryAidSelector:true});
	}
	
	
	showTagSelector() {
		this.setState({showTagSelector:true});
	}
	
	saveMemoryAid(text) {
		console.log(['saveMemoryAid',text])
		let saveForReview = this.state.saveForReview;
		let memoryAid = saveForReview.mnemonic ? saveForReview.mnemonic : '';
		memoryAid += '\n' + text;
		saveForReview.mnemonic = memoryAid;
		this.setState({showMemoryAidSelector: null,showTagSelector:null,tagWords:{}});
		this.setState({saveForReview:saveForReview});
		
		console.log(['saveMemoryAid',this.state.saveForReview])
	}
	
	mcFromWord(word) {
		if (this.state.saveForReview && word !== '[______]') {
			let saveForReview = this.state.saveForReview
			let q = saveForReview.specific_question;
			//var doc = nlp(q)
			saveForReview.specific_question = q.replace(new RegExp(word, "ig"), '[______]')
			
			saveForReview.specific_answer = word;
			this.setState({saveForReview:saveForReview})
		}
	}
	
	swipeRight() {
		console.log('sw ri')
	}
    
    render() {
		let that = this;
		let taStyle={minHeight:'10em'};
			
		if (this.state.saveForReview)  {
			let reviewItem = this.state.saveForReview;
			var doc = nlp(this.html2Text(reviewItem.specific_question))
			var questionWords = doc.nouns().out('array')	
			return <div style={{marginLeft:'1em'}} id="newssubmission" >
			<div style={{float:'right'}} >
				<button onClick={this.reallySendToReview} className='btn btn-success'>Save</button>
				<button onClick={(e) => this.sendToReview(null)} className='btn btn-danger' >Cancel</button>
			</div>
			<h3>Save for review</h3>
			<b>* Required</b>
				
				<div className="form-group row">
					<label  className="col-12" >Question * <input onChange={this.change} name="question" className="form-control form-control-lg" type='text' value={this.state.saveForReview.question} /></label>
				</div>
				<div className="form-group row">
					<label  className="col-12" >Answer <textarea style={taStyle} onChange={this.change} name="answer"  type='text' className="form-control form-control-lg" value={this.state.saveForReview.answer}></textarea></label>
				</div>
					
				<div className="form-group row">
					<label  className="col-12" >
					 <button onClick={this.addMemoryAid} className="btn btn-info" >+</button>
					 &nbsp;&nbsp;&nbsp; Memory Aid  *
					  
					 {that.state.showMemoryAidSelector === true &&  that.state.expanded.hasOwnProperty(reviewItem.guid) && <div style={{padding:'0.5em',border: '1px solid black', backgroundColor: 'lightgrey'}} >
							
							<button style={{float:'right'}} className='btn btn-success' onClick={(e) => this.saveMemoryAid(Object.keys(this.state.tagWords).join(","))}>Save</button>
							
							{ that.state.expanded.hasOwnProperty(reviewItem.guid) && <div>
								{that.state.expanded[reviewItem.guid].nouns && that.state.expanded[reviewItem.guid].nouns.length > 0 &&  <div><b>Topics</b> {that.state.expanded[reviewItem.guid].nouns.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-warning" : "btn btn-info"} key={recordKey}  onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
							
							
							{ that.state.expanded.hasOwnProperty(reviewItem.guid) && <div>
								{that.state.expanded[reviewItem.guid].values && that.state.expanded[reviewItem.guid].values.length > 0 &&  <div><b>Values</b> {that.state.expanded[reviewItem.guid].values.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
							
								{ that.state.expanded.hasOwnProperty(reviewItem.guid) && <div>
								{that.state.expanded[reviewItem.guid].values && that.state.expanded[reviewItem.guid].nouns.length > 0 &&  <div><b>Nouns</b> {that.state.expanded[reviewItem.guid].nouns.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
							
						</div>}
						
						
					<textarea style={taStyle}   onChange={this.change} name="mnemonic"  type='text' className="form-control form-control-lg" value={this.state.saveForReview.mnemonic} ></textarea></label>
				</div>
				<div className="form-group row">
					<label>Difficulty  *
					<select  onChange={this.change} name="difficulty"  value={this.state.saveForReview.difficulty} className="form-control form-control-lg" ><option value="1" >1</option><option value="2"   >2</option><option value="3" >3</option><option value="4" >4</option><option value="5" >5</option></select></label>
				</div>
				<div className="form-group row">
					<label>Tags </label>  
					&nbsp;&nbsp;<div>{that.state.saveForReview.atags ? that.state.saveForReview.atags.map(function(tag,tagKey) {
							return <button className='btn btn-info'  onClick={(e)=>that.deleteTag(tagKey)} key={tagKey} >{tag}  <b>X</b></button>
						}) : null}
						</div>
						<button className='btn btn-info' onClick={this.showTagSelector}>+</button>
				
						<form onSubmit={this.addTag} >
						<input value={that.state.saveForReview.newtag}  name="newtag" onChange={this.change} />
						</form>
						
						 {that.state.showTagSelector === true &&  that.state.expanded.hasOwnProperty(reviewItem.guid) && <div style={{padding:'0.5em',border: '1px solid black', backgroundColor: 'lightgrey'}} >
							
								
							{ that.state.expanded.hasOwnProperty(reviewItem.guid) && <div>
								{that.state.expanded[reviewItem.guid].nouns && that.state.expanded[reviewItem.guid].nouns.length > 0 &&  <div><b>Topics</b> {that.state.expanded[reviewItem.guid].nouns.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-warning" : "btn btn-info"} key={recordKey}  onClick={(e) => that.addTag(record)} >{record}</button>
								})}</div> }
							</div>}
							
							
							{ that.state.expanded.hasOwnProperty(reviewItem.guid) && <div>
								{that.state.expanded[reviewItem.guid].values && that.state.expanded[reviewItem.guid].values.length > 0 &&  <div><b>Values</b> {that.state.expanded[reviewItem.guid].values.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.addTag(record)} >{record}</button>
								})}</div> }
							</div>}
							
								{ that.state.expanded.hasOwnProperty(reviewItem.guid) && <div>
								{that.state.expanded[reviewItem.guid].values && that.state.expanded[reviewItem.guid].nouns.length > 0 &&  <div><b>Nouns</b> {that.state.expanded[reviewItem.guid].nouns.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
							
						</div>}
						
						
						
						
				</div>
				<hr/>
				<h5>Multiple Choice Question </h5>
				<div className="form-group row">
					<label className="col-12" >Question  
					  {that.state.expanded && that.state.expanded[reviewItem.guid] && that.state.expanded[reviewItem.guid].lines && <Autocomplete
						getItemValue={(item) => item  }
						items={that.state.expanded[reviewItem.guid].lines}
						renderItem={(item, isHighlighted) => {
							  let text = this.html2Text(item)
							  if (text && text.toLowerCase().indexOf(that.state.lineSearch.toLowerCase()) !== -1) {
								return <div style={{borderBottom:'1px solid black'}}>{text}</div>
							  } else {
								  return <div></div>;
							  }
						}}
						value={that.state.lineSearch}
						
						onSelect={(value, item) => {
							console.log(['SELECT',value,item])
							let reviewItem = that.state.saveForReview
							reviewItem.specific_question = that.html2Text(value)
							that.setState({reviewItem:reviewItem});
			
							//that.setState({ lineSearch:this.html2Text(value)})
							//that.submitFormOnSelect();
						}}
						onChange={(event, value) => {
							console.log(['CHANGE',value])
							if (value != null && value != undefined) {
								that.setState({ lineSearch:this.html2Text(value)})
							}
							//if (that.suggestTimeout) clearTimeout(that.suggestTimeout)
							//that.suggestTimeout = setTimeout(function() {that.loadSuggestions(value)},500)
						}}
						
					  renderMenu={children => (
						<div  style={{ width:'100%', padding:'0.5em', margin:'0.5em', backgroundColor:'lightgrey', border:'1px solid black'}}>
						  {children}
						</div>
					  )}
					/>}

					{questionWords && questionWords.length > 0 && <div><i>Select a word below to use it as the answer</i></div>}
					{doc && <div>{questionWords.map(function(record,recordKey) {
						return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.mcFromWord(record)} >{record}</button>
					})}</div> }
				
					<textarea   style={taStyle} onChange={this.change} name="specific_question"  type='text'  className="form-control form-control-lg" value={this.state.saveForReview.specific_question}></textarea></label>
				</div>
				<div className="form-group row">
					<label className="col-12" >Answer  <input  onChange={this.change} name="specific_answer"  type='text' className="form-control form-control-lg" value={this.state.saveForReview.specific_answer} /></label>
				</div>
				<div className="form-group row">
					<label className="col-12">Choices (split by |||)  <input type='text' onChange={this.change} name="multiple_choices"   className="form-control form-control-lg" value={this.state.saveForReview.multiple_choices} /></label>
				</div>
				<div className="form-group row">
					<label className="col-12">Feedback (optional)<textarea  style={taStyle}  onChange={this.change} name="feedback"  type='text'  className="form-control form-control-lg"  value={this.state.saveForReview.feedback}></textarea></label>
				</div>
				
				
				<div className="form-group row">
					<button onClick={this.reallySendToReview} className='btn btn-success'>Next</button>
					<button onClick={(e) => this.sendToReview(null)} className='btn btn-danger' >Cancel</button>
				</div>
			
		
			</div>
		}
 		
		//<form id="submitnews" style={{width:'90%'}} onSubmit={(e) => {e.preventDefault(); return false}}>
			 //</form>
			
		let copyright = this.state.copyright ? this.state.copyright : '';
		let title =  this.state.title  ? this.state.title : '';
		let finalArticles = [];
		console.log(this.state.items)
		let tally = 0;
		if (this.state.items) {
			finalArticles = this.state.items.map(function(item,itemKey) {
			//	console.log(['ITER',item.guid,that.state.deleted])
				let guid=item && item.guid ? item.guid['#'] : ''
				if (tally < 10 && (!that.state.deleted || (that.state.deleted && !that.state.deleted.hasOwnProperty(item.guid)))) {
					tally ++;
					// render expanded lines with onclick
					let renderedExpanded = null;
				//	console.log(['ISDEL',item.guid,that.state.deleted])
					
					if (that.state.expanded[guid] && that.state.expanded[guid].lines) {
						let dlineKey = 0;
						
						renderedExpanded = that.state.expanded[guid].lines.map(function(dline,dk) {
							dlineKey++;
							function doit(dline,dk,dlineKey) {
								//console.log([dline,dlineKey,dk])
								if (that.state.isEditing[guid+'-'+dlineKey]) { 
									let dka = String(dlineKey) 
									return <span   key={dlineKey} ref={(section) => { that.domRefs[guid+'-'+dlineKey] = section; }}
><input style={{width:'100%'}} onChange={(e) => that.selectLine(dk,item.guid,dka)} value={dline} readOnly={true} /></span>
								} else {
									return <span ref={(section) => { that.domRefs[guid+'-'+dlineKey] = section; }} key={dlineKey}   onDoubleClick={(e) => that.selectLine(dk,guid,dlineKey)} dangerouslySetInnerHTML={{__html:dline}}></span>
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
					
					return <Swipeable key={itemKey}  onSwipedRight={that.swipeRight} ><div style={{marginLeft:'1em',borderBottom:'2px solid black', marginBottom:'1em', padding:'0.5em'}}>
						
						<div style={{float:'right', marginLeft:'1em'}}>
							{!that.state.expanded.hasOwnProperty(guid) &&   <button className='btn btn-info'  style={{display:'block'}} onClick={(e) => that.setExpanded(itemKey)}  >Expand</button>}

							{that.state.expanded.hasOwnProperty(guid) &&  <button className='btn btn-success'  style={{display:'block'}} onClick={(e) => that.sendToReview(item)}  >Save For Review</button>}
							
							{that.state.expanded.hasOwnProperty(guid) &&  <button className='btn btn-danger'  style={{display:'block', marginTop:'2em'}} onClick={(e) => that.deleteItem(itemKey)}  >Delete</button>}
							{!that.state.expanded.hasOwnProperty(guid) &&  <button className='btn btn-danger'  style={{display:'block', marginTop:'2em'}} onClick={(e) => that.deleteItemNow(itemKey)}  >Delete</button>}
							
						</div>
						<h3><a href={item.link} target="_blank" >{item.title}</a></h3>
						{item['dc:creator'] && <span> by {item['dc:creator']}</span>}
						<div><b>Date:</b> {item.pubDate}</div>
						
						{tags ? <div style={{marginBottom:'1em'}}> <b>Tags:</b> <span style={{fontStyle:'italic'}}>{tags}</span></div> : null}
						{that.state.expanded.hasOwnProperty(guid) && <div  onClick={(e) => that.selectLine(itemKey,'description',description)}  style={{fontStyle:'italic',marginBottom:'1em'}} >{description}</div>}
						{!that.state.expanded.hasOwnProperty(guid) && <div style={{marginBottom:'1em'}} onClick={(e) => that.selectLine(itemKey,null,'description',description)} >{description}</div>}
						
						{renderedExpanded && <div style={{marginTop:'1em',marginBottom:'1em'}} >{renderedExpanded}</div>}
						
						<div  onClick={(e) => {that.selectLine(itemKey,null,'mediadescription',(item['media:group'] ? item['media:group']['media:description'] : ''))}} style={{marginBottom:'1em'}}>{item['media:group'] && item['media:group']['media:description'] ? item['media:group']['media:description'] : null}</div>
						
						<div>{item['media:group'] && item['media:group']['media:content'] ? item['media:group']['media:content'].map(function(media,mk) {if (mk < 1) return <img style={{maxHeight:'300px'}} key={mk} src={media.url} /> }) : null}</div>
						
						{that.state.expanded.hasOwnProperty(guid) && <div style={{padding:'0.5em',border: '1px solid black', backgroundColor: 'lightgrey'}} >
							{ that.state.expanded.hasOwnProperty(guid) && <div>
								{that.state.expanded[guid].nouns && that.state.expanded[guid].nouns.length > 0 &&  <div><b>Nouns</b> {that.state.expanded[guid].nouns.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey}  onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
							
							
							{ that.state.expanded.hasOwnProperty(guid) && <div>
								{that.state.expanded[guid].values && that.state.expanded[guid].values.length > 0 &&  <div><b>Numbers</b> {that.state.expanded[guid].values.map(function(record,recordKey) {
									return <button className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"} key={recordKey} onClick={(e) => that.addTagWord(record)} >{record}</button>
								})}</div> }
							</div>}
						</div>}
	
					</div>
					</Swipeable>
					} else {
						return null; 
					}
					
					
				})
			
		}	
		
		//className={that.state.tagWords.hasOwnProperty(record) ? "btn btn-success" : "btn btn-info"}
		//	{itemKey === that.state.expanded && <iframe style={{minHeight:'600px', width:'100%'}} src={item.link} ></iframe>}
				
        return  (
        <div className="feedmuncher" >
			<button style={{float:'right'}} className='btn btn-danger' onClick={(e) => {localStorage.setItem('feedmuncher_blocked_guids',{}); that.setState({deleted:{}})} }>Reset Deleted</button>
	
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
						
						
