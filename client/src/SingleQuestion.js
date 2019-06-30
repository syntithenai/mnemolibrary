/* eslint-disable */ 
import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
// icons
import ShowAll from 'react-icons/lib/fa/asterisk';
import Check from 'react-icons/lib/fa/check';
import ArrowRight from 'react-icons/lib/fa/arrow-right';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Trash from 'react-icons/lib/fa/trash';
import EditIcon from 'react-icons/lib/fa/pencil';

import Music from 'react-icons/lib/fa/music';
import Info from 'react-icons/lib/fa/info';
import Ellipsis from 'react-icons/lib/fa/ellipsis-v';
//import ThumbsUp from 'react-icons/lib/fa/thumbs-up';
import Image from 'react-icons/lib/fa/image';
//import Ban from 'react-icons/lib/fa/ban';
import Search from 'react-icons/lib/fa/search';
import Tags from 'react-icons/lib/fa/tags';
import ExternalLink from 'react-icons/lib/fa/external-link';
import ConnectDevelop from 'react-icons/lib/fa/connectdevelop';  
import Close from 'react-icons/lib/fa/close';
//import Book from 'react-icons/lib/fa/book';
import ShareAlt from 'react-icons/lib/fa/share-alt';
import CommentIcon from 'react-icons/lib/fa/comment';

import ShareDialog from './ShareDialog';

//import ReactFBLike from 'react-fb-like';
//import { FacebookProvider, Like } from 'react-facebook';

import scrollToComponent from 'react-scroll-to-component';
import MnemonicsList from './MnemonicsList';
import Utils from './Utils';
//import ProblemReport from './ProblemReport';
import CommentEditor from './CommentEditor';
import CommentList from './CommentList';

//import Swipe from 'react-swipe-component';
import Swipeable from 'react-swipeable'
//import ThumbsDown from 'react-icons/lib/fa/thumbs-down';

import ExclamationTriangle from 'react-icons/lib/fa/exclamation-triangle';
import "video-react/dist/video-react.css"; // import css
import { Player } from 'video-react';
import MultipleChoiceQuestions from './MultipleChoiceQuestions';
import sanitizeHtml from 'sanitize-html';

const QuizIcon = 
<svg style={{height:'1.5em'}}  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M504 256c0 136.997-111.043 248-248 248S8 392.997 8 256C8 119.083 119.043 8 256 8s248 111.083 248 248zM262.655 90c-54.497 0-89.255 22.957-116.549 63.758-3.536 5.286-2.353 12.415 2.715 16.258l34.699 26.31c5.205 3.947 12.621 3.008 16.665-2.122 17.864-22.658 30.113-35.797 57.303-35.797 20.429 0 45.698 13.148 45.698 32.958 0 14.976-12.363 22.667-32.534 33.976C247.128 238.528 216 254.941 216 296v4c0 6.627 5.373 12 12 12h56c6.627 0 12-5.373 12-12v-1.333c0-28.462 83.186-29.647 83.186-106.667 0-58.002-60.165-102-116.531-102zM256 338c-25.365 0-46 20.635-46 46 0 25.364 20.635 46 46 46s46-20.636 46-46c0-25.365-20.635-46-46-46z"></path></svg>

let fbIcon = 
<svg style={{height:'1.5em', padding:0,margin:0}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512"><path fill="currentColor" d="M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"></path></svg>

export default class SingleQuestion extends Component {
    
    constructor(props,context) {
        super(props,context);
        this.player = null;
        this.setPlayerRef = element => {
          this.player = element;
          if (this.player) this.player.subscribeToStateChange(this.handleStateChange.bind(this));
        };
        this.state = {mcQuestionsLoaded:0,comments:[],showCommentDialog: false,swipeable:true,'visible':[],playerHeight:50,playerWidth:400,answer:'',image:'',showShareDialog:false}
        this.setVisible = this.setVisible.bind(this);
        this.toggleMedia = this.toggleMedia.bind(this);
        this.isVisible = this.isVisible.bind(this);
        this.hideAll = this.hideAll.bind(this);
        //this.setDiscoveryBlock = this.setDiscoveryBlock.bind(this);
        this.swipeLeft = this.swipeLeft.bind(this);
        this.swipeRight = this.swipeRight.bind(this);
        this.disableSwipe = this.disableSwipe.bind(this);
        this.enableSwipe = this.enableSwipe.bind(this);
        this.handleQuestionResponse = this.handleQuestionResponse.bind(this);
        this.fromWikipedia = this.fromWikipedia.bind(this);
        this.createMedia = this.createMedia.bind(this);
        this.isWikiApi = this.isWikiApi.bind(this);
        this.wikiBaseUrl = this.wikiBaseUrl.bind(this);
        //this.toggleCommentDialog = this.toggleCommentDialog.bind(this);
        //this.loadComments = this.loadComments.bind(this);
        //this.editComment = this.editComment.bind(this);
        //this.deleteComment = this.deleteComment.bind(this);
        this.scrollToComments = this.scrollToComments.bind(this);
        //this.newComment = this.newComment.bind(this);
		this.notifyQuestionsLoaded = this.notifyQuestionsLoaded.bind(this);
        this.setShareDialog = this.setShareDialog.bind(this);
        
        
        this.scrollTo={};
        this.questionmessage='';
        // most specific first
        this.wikiSites = ['https://simple.wikipedia.org','https://en.wikipedia.org','https://wikipedia.org','https://en.wiktionary.org','https://wiktionary.org'] 
		
    };
  
  
    
      componentDidMount() {
          let that = this;
        //   console.log(['SQ MOUNT',that.props.question]);
        that.setState({answer:''});
        that.setState({image:''});
        // subscribe state change
        //this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
        scrollToComponent(this.scrollTo['topofpage'],{align:'top',offset:-230});
       // setTimeout(function() {
		//console.log('timeout on sing leod now wiki')
			if (that.props.question) {
				if (that.props.question && that.props.question._id)  that.props.analyticsEvent('view question '+that.props.question._id);
				//console.log('timeout on sing leod now wiki RELLY')
				that.fromWikipedia();
				that.createMedia();
				that.props.loadComments(that.props.question._id,that.props.user ? that.props.user._id : null);
			}
		//},1000);
      } 
      
      componentDidUpdate(props) {
          let that = this;
         // console.log(['SQ UPDATE',props,this.props]);
          let newId = this.props.question ? this.props.question._id : null;
          let oldId = props.question ? props.question._id : null;
          if (oldId !== newId) {
			 that.setState({answer:''});
			that.setState({image:''});
			if (that.props.question && that.props.question._id) that.props.analyticsEvent('view question '+that.props.question._id);
			//console.log(['SQ UPDATE change question',oldId,newId]);
             this.fromWikipedia();
             this.createMedia();
             if (that.props.question) that.props.loadComments(that.props.question._id,that.props.user ? that.props.user._id : null);
          }
      };
    
     componentWillReceiveProps(props) {
         let that=this;
        // console.log(['rcv props',props]);
       // if (this.refs.player) this.refs.player.subscribeToStateChange(this.handleStateChange.bind(this));
        scrollToComponent(this.scrollTo['media'],{align:'top',offset:-230});
        //if (props.question) {
            ////that.fromWikipedia();
          ////  that.createMedia();
            
        //}
        //this.toggleMedia();
        //this.toggleMedia();
    };
    
	
	//toggleCommentDialog() {
		//console.log(['TOGGLE COMMENT',this.state.showCommentDialog])
		////// 
		////if (this.state.showCommentDialog) {
			////this.setState({'editingComment':null})
		////}
		//this.setState({showCommentDialog: !this.state.showCommentDialog})
	//}

	//editComment(comment) {
		//this.setState({commentId:comment._id,commentText:comment.comment,commentType:comment.type,commentCreateDate:comment.createDate})
		//this.toggleCommentDialog()
	//}
		
	//newComment() {
		//this.setVisible('comments')
		//this.setState({commentId:null,commentText:null,commentType:null,commentCreateDate:null})
		//this.toggleCommentDialog()
	//}
	//deleteComment(comment) {
		//// refresh single view comments list
		//let that = this;
		//let toSave = {}
		//toSave.question = this.props.question ? this.props.question._id : null;
		//toSave.user = this.props.user ? this.props.user._id : null
		//toSave.comment = comment ? comment._id : null
		
		//if (toSave.question && toSave.user && toSave.comment) {
			//fetch('/api/deletecomment', {
			  //method: 'POST',
			  //headers: {
				//'Content-Type': 'application/json'
			  //},
			  
			  //body: JSON.stringify(toSave)
			//}).then(function() {
				//that.setState({'comment':''});                
				////that.toggleCommentDialog();
				//console.log(['NOW RELOAD COMMENTS'])
				//that.loadComments(that.props.question._id,that.props.user._id)
			//});
		//}
	//} 
    
    disableSwipe() {
        this.setState({swipeable:false});
    };
    
    
    enableSwipe() {
        this.setState({swipeable:true});
    };
    
    swipeLeft(question) {
        if (this.state.swipeable) {
            this.handleQuestionResponse(question,'next')
        }
        
    };
    swipeRight(question) {
        if (this.state.swipeable) {
            this.handleQuestionResponse(question,'previous')
        }
    };
    
    isWikiApi(link) {
		console.log(['ISWIKIAPI',link]);
		if (link && link.length > 0 ) {
			let found = false;
			for (var i in this.wikiSites) {
				if (link.indexOf(this.wikiSites[i]) === 0) {
					return true
				}
			}
		}
		return false;
	}
	
	wikiBaseUrl(link) {
		if (link && link.length > 0 ) {
			for (var i in this.wikiSites) {
				if (link.indexOf(this.wikiSites[i]) === 0) {
					return this.wikiSites[i];
				}
			}
		}
		
	}
    
    fromWikipedia() {
        let that = this;
       console.log(['FROM WIKIPEDIA']);
        that.setState({answer:''});
        that.setState({image:''});
        if (this.props.question) {
			let questionId = this.props.question._id;
			if (this.props.question.answer && this.props.question.answer.length > 0) {
				console.log(['FROM WIKIPEDIA HAVE ANSWER']);
				this.setState({answer:this.props.question.answer});
			} else {
				console.log(['FROM WIKIPEDIA LOOKUP ANSWER']);
				if (this.isWikiApi(this.props.question.link)) {
					console.log(['FROM WIKIPEDIA LOOKUP ANSWER LINK GOOD']);
					let linkParts = this.props.question.link.split("/");
					let wikiPageParts = linkParts[linkParts.length - 1].split("#");
					let wikiPage = wikiPageParts[0];
					// wikilookup
					console.log(['FROM WIKIPEDIA LOOKUP ANSWER LINK GOOD',wikiPage,wikiPageParts]);
					Utils.loadWikipediaIntro(wikiPage,this.wikiBaseUrl(this.props.question.link)).then(function(answer) {
						console.log(['FROM WIKIPEDIA got',answer]);
						if (answer && answer.length > 0) {
							that.setState({answer:answer});
							fetch("/api/savewikidata", {
							   method: "POST",
							   headers: {
								"Content-Type": "application/json"
								},
							  body: JSON.stringify({_id:questionId,answer:answer})
							}).then(function(response) {
								return response.json();
							}).then(function(token) {
								console.log('updated wiki data');
							})
							.catch(function(err) {
								console.log(['ERR updating wiki data',err]);
							});
						} else {
							that.setState({answer:''});
						}
					});                    
				} else {
					that.setState({answer:''});
				}
			}
			if (this.props.question.image && this.props.question.image.length > 0) {
				console.log(['FROM WIKIPEDIA have image']);
				this.setState({image:this.props.question.image});
			} else if (this.props.question.image_png && this.props.question.image_png.length > 0) {
				console.log(['FROM WIKIPEDIA have png image']);
				this.setState({image:this.props.question.image_png});
			} else {
				console.log(['FROM WIKIPEDIA try LOOKUP image']);
				
				if (this.isWikiApi(this.props.question.link)) {
					console.log(['FROM WIKIPEDIA is wiki  api']);
				
					let linkParts = this.props.question.link.split("/");
					let wikiPageParts = linkParts[linkParts.length - 1].split("#");
					let wikiPage = wikiPageParts[0];
					// wikilookup
					console.log(['FROM WIKIPEDIA LOOKUP IMAGE']);
				
					Utils.loadWikipediaImage(wikiPage,this.wikiBaseUrl(this.props.question.link)).then(function(answer) {
						//console.log(['FROM WIKIPEDIA got image',answer]);
						that.setState({image:answer});
						if (answer && answer.length > 0) {
							fetch("/api/savewikidata", {
							  method: "POST",
							  headers: {
								"Content-Type": "application/json"
							  },
							  body: JSON.stringify({_id:questionId,image:answer})
							}).then(function(response) {
								return response.json();
							}).then(function(token) {
								//console.log('updated wiki data');
							})
							.catch(function(err) {
								console.log(['ERR',err]);
							});
						} else {
							that.setState({image:''});
						}
					});                    
				} else {
					that.setState({image:''});
				}
			}			
		}
    };
    
    
    createMedia() {
        let sources=[]
        let question=this.props.question
        if (question) {
			if (question.media && question.media.length > 0) sources.push(<source src={question.media} />)
			if (question.media_ogg && question.media_ogg.length > 0) sources.push(<source src={question.media_ogg} />)
			if (question.media_webm && question.media_webm.length > 0) sources.push(<source src={question.media_webm} />)
			if (question.media_mp4 && question.media_mp4.length > 0) sources.push(<source src={question.media_mp4} />)
				
			if (question.media_mp3 && question.media_mp3.length > 0) sources.push(<source src={question.media_mp3} />)
			if (question.media_mp4 && question.media_mp4.length > 0) sources.push(<source src={question.media_mp4} />)
			if (question.media_webmvideo && question.media_webmvideo.length > 0) sources.push(<source src={question.media_webmvideo} />)
			if (question.media_webmaudio && question.media_webmaudio.length > 0) sources.push(<source src={question.media_webmaudio} />)
				
			//console.log(['SINGLE VIEW CREATE MEDIA from q',this.props.question]);
			let that = this;
				let media=<Player
				  ref={this.setPlayerRef}
				  playsInline
				  autoPlay={question.autoplay_media==="YES" ? true : false}
				  height={this.state.playerHeight}
				  width={this.state.playerWidth}
				  fluid={false}
				>
				{sources}
				</Player>
				//console.log(['SINGLE VIEW CREATE MEDIA',media]);
				setTimeout(function() {
					//console.log(['SINGLE VIEW UPDATE MEDIA',media,question.media]);
						that.setState({media:media});
						if (that.player) that.player.load();
				},100);

				//this.setState({media:media});
		}
    };
      
      hasMedia(question) {
         // console.log(['HASMEDIA',question]);
          if (question.media ||
            question.media_ogg ||
            question.media_webm ||
            question.media_mp4 ||
            
            question.media_mp3 ||
            question.media_mp4 ||
            question.media_webmvideo ||
            question.media_webmaudio
            )  {
                return true;
            } else {
                return false;
            }
      };

      handleStateChange(state, prevState) {
          function getOS() {
              var userAgent = window.navigator.userAgent,
                  platform = window.navigator.platform,
                  macosPlatforms = ['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'],
                  windowsPlatforms = ['Win32', 'Win64', 'Windows', 'WinCE'],
                  iosPlatforms = ['iPhone', 'iPad', 'iPod'],
                  os = null;

              if (macosPlatforms.indexOf(platform) !== -1) {
                os = 'Mac OS';
              } else if (iosPlatforms.indexOf(platform) !== -1) {
                os = 'iOS';
              } else if (windowsPlatforms.indexOf(platform) !== -1) {
                os = 'Windows';
              } else if (/Android/.test(userAgent)) {
                os = 'Android';
              } else if (!os && /Linux/.test(platform)) {
                os = 'Linux';
              }

              return os;
          }  
          
        // copy player state to this component's state
        //console.log(['statechange',state,prevState]);
        
        if (state.ended && getOS() !== 'iOS') {
            this.toggleMedia();
        }
        if (state.videoHeight > 0) {
            if (this.state.playerHeight !== state.videoHeight) {
                this.setState({'playerHeight':state.videoHeight});   
                this.setState({'playerWidth':state.videoWidth});   
            }
           
        } else {
            this.setState({'playerHeight':50});   
            this.setState({'playerWidth':400});   
        }
        //this.setState({
          //player: state
        //});
      }

    
    removeA(arr) {
        var what, a = arguments, L = a.length, ax;
        while (L > 1 && arr.length) {
            what = a[--L];
            while ((ax= arr.indexOf(what)) !== -1) {
                arr.splice(ax, 1);
            }
        }
        return arr;
    }
    
    // which question parts are visible - mnemonic, answer, moreinfo
    setVisible(toShow) {
		let that = this;
		console.log(['setvisible',toShow]);
        let visible = this.state.visible;
        let show = toShow;
        if (toShow=="all") {
			visible=['mnemonic','answer','moreinfo','media','image','tags'];
			show = 'answer';
		} else {
			visible.push(toShow);
		}
		this.setState({'visible':visible});
		console.log(['didsetvis',visible]);
        //console.log(['scroll to ',toShow,this.scrollTo[toShow],this.scrollTo]);
       // if (toShow==='image') {
			setTimeout(function() {
				console.log('SCROLL TO IMAGE')
				scrollToComponent(that.scrollTo[toShow],{align:'top',offset:-230});
			},300) 
		//}
    };
    
    scrollToComments() {
		let that = this;
		this.setVisible('comments')
		scrollToComponent(that.scrollTo['comments'],{align:'top',offset:-230});
	}

    setShareDialog(val) {
		this.setState({showShareDialog:val});
	}
    
    toggleMedia() {
        ////console.log(['invisible',toHide]);
        let visible = this.state.visible;
        if (this.state.visible.indexOf('media')>=0) {
            visible = this.removeA(visible,'media');
        } else {
            visible.push('media');
        }
        
        this.setState({'visible':visible});
        
    };
    
    isVisible(toShow) {
        return (this.state.visible.includes(toShow));
    };
    
    hideAll() {
        this.setState({'visible':[]});
    };
    

    handleQuestionResponse(question,response) {
        this.hideAll();
        this.props.handleQuestionResponse(question,response);
    };
    
    //setDiscoveryBlock(type,id) {
        //this.hideAll();
        //this.props.setDiscoveryBlock(type,id)
    //};
    
    //clearDiscoveryBlock(type,id) {
        //this.hideAll();
        //this.props.clearDiscoveryBlock(type,id)
    //};
    
    firstSentence (text) {
        if (text) {
            text = text.replace('...',', ');
            text = text.replace('.[','. ');
            text = text.replace('."','. ');
            text = text.replace('.\n','. ');
            text = text.replace('_c._','_c.');
            return String(text).split('. ')[0];
        } else return '';
    };
    
    
    
    notifyQuestionsLoaded(tally) {
		this.setState({mcQuestionsLoaded:tally});
	}
    
    render() {
        let that = this;
        let showRecallButton = this.props.successButton 
        
        let blockedTags = '';
        let blockedTopics = '';
        let blockedTechniques = '';
        //if (!showRecallButton)  {
            //blockedTags = this.props.blocks.tag.map((tag, key) => {
              
              //return <button className="btn btn-outline btn-primary" key={key}  ><Close size={28} className="badge badge-pill badge-info"  onClick={() => this.clearDiscoveryBlock('tag',tag)} /><span className="hidden-sm-down" >&nbsp;{tag}</span></button>
            //})          
            //blockedTopics = this.props.blocks.topic.map((topic, key) => {
              
              //return <button className="btn btn-outline btn-primary" key={topic}  ><Close size={28} className="badge badge-pill badge-info"  onClick={() => this.clearDiscoveryBlock('topic',topic)} /><span className="hidden-sm-down" >&nbsp;{topic}</span></button>
            //}) 
            //blockedTechniques = this.props.blocks.technique.map((technique, key) => {
              
              //return <button className="btn btn-outline btn-primary" key={technique}  ><Close size={28} className="badge badge-pill badge-info"  onClick={() => this.clearDiscoveryBlock('technique',technique)} /><span className="hidden-sm-down" >&nbsp;{technique}</span></button>
            //}) 
        //}
      
        if (this.props.question) {
          
          let question = this.props.question;
         // let showAnswerButton = !this.isVisible('answer') && question.answer;
          let header = Utils.getQuestionTitle(question);
          //let image =   question.image ?  question.image : '/clear.gif';
          let link = '';
          let target=false;
          if (question.link && question.link.length > 0) {
             //if (question.link.indexOf('wikipedia.org') > 0) {
             if (question.link.indexOf('wikipedia.org') > 0  ) {
                 let parts = question.link.split('#');
                 if (parts.length>1) {
                    link = parts.slice(0,-1) + '?printable=yes#' + parts.slice(-1);
                 } else {
                     link = question.link  + '?printable=yes'
                 }
                 
             } else {
                 link = question.link;
                 target='_new';
             }
          } else {
              link = 'https://www.google.com.au/search?q='+header;
              target='_new';
          }
       
          let tags = '';
          let tagsClean=''; 
          if (question.tags && Array.isArray(question.tags)) {
              tags = question.tags.map((tag, key) => {
                  tag=tag.trim().toLowerCase();
                  //<Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.setDiscoveryBlock('tag',tag)} />
                  return <Link to={"/discover/tag/"+tag} className="btn btn-outline btn-primary" key={key}  ><Search size={28} className="badge badge-pill badge-info"  style={{float:'right'}}/><span className="hidden-sm-down" >&nbsp;{tag}&nbsp;</span></Link>
                })
            //
        
              tagsClean = question.tags.map((tag, key) => {
                  
                  return <button className="btn btn-outline btn-primary" key={key}  ><span className="hidden-sm-down" >{tag}</span></button>
                })
                 //!this.isVisible('mnemonic') && 
                      //(!this.isVisible('image')) && 
                      //(!this.isVisible('image')) && 
                      //!this.isVisible('moreinfo') 
                      // !this.isVisible('topic')) && 
                      // (!this.isVisible('tags')) && 
            
            }
            
           // var {Platform} = React;


            let media=this.state.media;
            //if (Platform.OS === 'ios')
              //return (
                //media=<a href={question.media} target='_new' >Play</a>
            //)
            //else
              //return (
               
            //)
            let attribution=question.attribution;
            if (attribution && attribution.indexOf('http')===0) {
                let endAttribution=question.attribution.indexOf("/",9);
                let shortAttribution=question.attribution.slice(0,endAttribution);
                attribution=(<a href={question.attribution} >{shortAttribution}</a>)
            }
            let imageAttribution=question.imageattribution;
            let imageLink= this.state.image; //question.image_png ? question.image_png : question.image;
            //imageLink="/s3/uploads/imagefiles/image_5b6ac06107ddb0007afc848b.png"
            //imageLink =  imageLink ? imageLink +"?rand="+Math.random() : '';
            if (imageAttribution && imageAttribution.indexOf('http')===0) {
                let endAttribution=question.imageattribution.indexOf("/",9);
                let shortAttribution=question.imageattribution.slice(0,endAttribution);
                imageAttribution=(<a href={question.imageattribution} >{shortAttribution}</a>)
               // imageLink=question.imageattribution
            }
            
            let mediaAttribution=question.mediaattribution;
            if (mediaAttribution && mediaAttribution.indexOf('http')===0) {
                let endAttribution=mediaAttribution.indexOf("/",9);
                let shortAttribution=mediaAttribution.slice(0,endAttribution);
                attribution=(<a href={mediaAttribution} >{shortAttribution}</a>)
            }
            let shortanswer = this.firstSentence(that.state.answer);
            let cleanShortAnswer = sanitizeHtml(shortanswer, {
			allowedTags: ['b', 'i', 'em', 'strong', 'a','span','kanji'],
			allowedAttributes: {
			  a: ['href', 'target','className']
			}
		  });

            let showLongAnswer = false;
            if (shortanswer.length < that.state.answer.length) {
                showLongAnswer = true;
            }
            //console.log(['RENDER SINGLE',that.state.answer,shortanswer,showLongAnswer,media]);
            let shortLink = ""
            if (question.link) {
                let endDomain=question.link.indexOf("/",9);
                shortLink = question.link.slice(0,endDomain);
            }
            let hasMedia=this.hasMedia(question);
            let cardClassName = "card question container";
            if (this.props.isReview) cardClassName = "card question container review";
            let shortAnswerStyle={}; //fontSize:'1.1em',fontFamily:'sans_forgeticaregular'};
            if (this.props.isReview)   shortAnswerStyle={}; //fontSize:'1.1em'
           //<ShareTopicDialog id="sharedialog"  header={header}  question={question}/>
           //<div style={{height:'11em'}}><br/></div>
            
            let shareTitle="Mnemo's Library -"+(this.props.question.mnemonic ? this.props.question.mnemonic : '') + " - \n" + question.interrogative+ ' ' +question.question + '?';
			//let longTitle=(this.props.question.mnemonic ? this.props.question.mnemonic : '') + "  \n" + question.interrogative+ ' ' +question.question + '?' ;
			//let twitterTitle=(this.props.question.mnemonic ? this.props.question.mnemonic : '') + "  \n" + question.interrogative+ ' ' +question.question  + "?\n" + question.link;
			let shareLink = window.location.protocol+'//'+window.location.host+"/discover/topic/"+encodeURIComponent(question.quiz)+"/"+question._id;     
            
            let iframeLink = "https://www.facebook.com/plugins/like.php?href="+encodeURIComponent(shareLink)+"&width=100&layout=button_count&action=like&size=large&show_faces=false&share=false&height=26&appId=704362873350885"

        
           
						//&nbsp;  
						//<iframe src="https://www.facebook.com/plugins/like.php?href=https%3A%2F%2Fmnemolibrary.com%2Fprofile&width=88&layout=button_count&action=like&size=large&show_faces=false&share=false&height=21&appId=704362873350885" width="74" height="21" style={{border:'none',overflow:'hidden'}} scrolling="no" frameBorder="0" allowtransparency="true" allow="encrypted-media"></iframe>
						
            
            //{!this.props.user && <Link to='/login' className="col-4 btn btn-outline btn-success" ><ArrowRight size={25} /><span className="d-none d-md-inline-block">&nbsp;Add to Review List&nbsp;</span></Link>}
			let buttonStyle={height: '2.6em'}

           return (
            <div className="questionwrap"  >
               <div  ref={(section) => { this.scrollTo.topofpage = section; }} ></div>
                <div className="row buttons justify-content-between" >
                  
                    <button style={buttonStyle} className="col-1 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'list')} ><Ellipsis style={{marginLeft:'-0.7em'}} size={25} />&nbsp;</button>
                    
					{!this.props.user && <button style={buttonStyle}  className="col-2 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'previous')} ><ArrowLeft size={25} /><span className="d-none d-md-inline-block" >&nbsp;Back&nbsp;</span></button>}
					
					{(!this.props.user) && <button  style={buttonStyle} className="col-3 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'next')}><ArrowRight size={25} /><span className="d-none d-md-inline-block">&nbsp;Next&nbsp;</span></button>}

                    {showRecallButton && this.props.user && <button  style={buttonStyle} className="col-3 btn btn-outline btn-info" onClick={() => this.handleQuestionResponse(question,'next')}><ArrowRight size={25} /><span className="d-none d-md-inline-block">More Review Needed</span></button>}

                    {showRecallButton && this.props.user && <button  style={buttonStyle} className="col-4 btn btn-outline btn-success" onClick={() => this.handleQuestionResponse(question,'success')}><Check size={25} /><span className="d-none d-md-inline-block">Enough Review For Now</span></button>}
                   
                    {!showRecallButton && this.props.user && <button  style={buttonStyle} className="col-4 btn btn-outline btn-success" onClick={() => this.handleQuestionResponse(question,'next')}><Check size={25} /><span className="d-none d-md-inline-block">Add To My Review List</span></button>}
                    
                    
                    <span >&nbsp;</span>
                    {this.props.user && <button  style={buttonStyle}  className="col-3 btn btn-outline btn-danger" onClick={() => this.handleQuestionResponse(question,'block')} ><Trash size={25} /><span className="d-none d-md-inline-block"> Not Interested</span></button>}
                   
                    {showRecallButton && <div className="scrollbuttons col-sm-12" >
                          
                         <button style={{float:'right'}}  onClick={(e) => this.setShareDialog(true)} className='btn btn-primary'  ><ShareAlt size={26}  />&nbsp;<span className="d-none d-md-inline-block">Share</span></button>
                            &nbsp;
                           
                                      
						{this.state.mcQuestionsLoaded > 0 && <button style={{float:'right'}} className='btn btn-primary' onClick={() => this.setVisible('questions')}> <span className="badge badge-light">{this.state.mcQuestionsLoaded}</span>&nbsp;<span className="d-none d-md-inline-block"> Quiz</span></button>} 
                         
                        
                             {this.props.user && this.props.comments && this.props.comments.length > 0 && <button style={{float:'right'}}   onClick={this.scrollToComments}  className='btn btn-primary'><CommentIcon size={26} /><span className="d-none d-md-inline-block">&nbsp;{this.props.comments.length}&nbsp;Comments&nbsp;</span></button>}
                             
                             {this.props.user && (!this.props.comments || this.props.comments.length === 0) && <button style={{float:'right'}} onClick={this.props.newComment} className='btn btn-primary'><CommentIcon size={26} /><span className="d-none d-md-inline-block">&nbsp;Comment&nbsp;</span></button>}
								
							&nbsp;
                                         
                            {<button className='btn btn-primary' onClick={() => this.setVisible('mnemonic')} ><ConnectDevelop size={26}  />&nbsp;<span className="d-none d-md-inline-block">Memory Aid</span></button>
                            }&nbsp;
                            {question.answer && <button className='btn btn-primary' onClick={() => this.setVisible('all')}><Info size={26}  />&nbsp;<span className="d-none d-md-inline-block">Answer</span></button>
                            }&nbsp;
                            {imageLink && <button  className='btn btn-primary' onClick={() => this.setVisible('image')}><Image size={26} />&nbsp;<span className="d-none d-md-inline-block">Image</span></button>
                            }&nbsp;
                            {hasMedia && <button  className='btn btn-primary' onClick={() => this.toggleMedia()}><Music size={26} />&nbsp;<span className="d-none d-md-inline-block">Media</span></button>
                            }&nbsp;
                            
                            {(!target) && <button  className='btn btn-primary' onClick={() => this.setVisible('moreinfo')}><ExternalLink size={26}  />&nbsp;<span className="d-none d-md-inline-block">More Info</span></button>
                            }
                            {(target) && <a  className='btn btn-primary' target={target} href={link}><ExternalLink size={26}  />&nbsp;<span className="d-none d-md-inline-block">More Info</span></a>
                            }&nbsp;
                            
                            {<button  className='btn btn-primary' onClick={() => this.setVisible('tags')}><Tags size={26}  />&nbsp;<span className="d-none d-md-inline-block">Tags</span></button>
                            }
                    </div>}
                </div>
                
                
                <div className={cardClassName} style={{backgroundColor: '#add8e6'}}>
                     <div id="spacerforsmall" className='d-none d-sm-block d-md-none' ><br/><br/> </div>
                    <div id="progressbar" style={{backgroundColor: 'blue',width: '100%',height:'0.3em'}} > <div id="innerprogressbar" style={{backgroundColor: 'red',height:'0.3em',width: this.props.percentageFinished()}} >&nbsp;</div></div>
                    
                    <Swipeable onSwipedLeft={() => this.swipeLeft(question)} onSwipedRight={() => this.swipeRight(question)}   >  
                        <div ref={(section) => { this.scrollTo.media = section; }} ></div>
                        {((!showRecallButton || this.isVisible('media') || question.autoplay_media==="YES") && hasMedia) && <span style={{marginTop:'1em',float:'right'}}>
                            {media}</span> }
                         
                         
 &nbsp;
                           
	                   {!showRecallButton && <span> 
						   
                            <button style={{marginTop:'1em',float:'right'}} onClick={(e) => this.setShareDialog(true)} className='btn btn-primary'  ><ShareAlt size={26}  />&nbsp;<span className="d-none d-md-inline-block">Share</span></button>
                       
                        &nbsp;
						  {this.state.mcQuestionsLoaded > 0 && <button style={{marginTop:'1em',float:'right'}} className='btn btn-primary' onClick={() => this.setVisible('questions')}> <span className="badge badge-light">{this.state.mcQuestionsLoaded}</span>&nbsp;<span className="d-none d-md-inline-block"> Quiz</span></button>} 
						  
						
                         &nbsp;   
                              {this.props.user && this.props.comments && this.props.comments.length > 0 && <button style={{marginTop:'1em',float:'right'}} onClick={this.scrollToComments}  className='btn btn-primary'><CommentIcon size={26} /><span className="d-none d-md-inline-block">&nbsp;{this.props.comments.length}&nbsp;Comments&nbsp;</span></button>}
                             
                             {this.props.user && (!this.props.comments || this.props.comments.length === 0) && <button style={{marginTop:'1em',float:'right'}} onClick={this.props.newComment} className='btn btn-primary'><CommentIcon size={26} /><span className="d-none d-md-inline-block">&nbsp;Comment&nbsp;</span></button>}
                             &nbsp;  
						    {(!target) && <button style={{float:'right' ,marginTop:'1em'}}  className='btn btn-primary' onClick={() => this.setVisible('moreinfo')}><ExternalLink size={26}  />&nbsp;<span className="d-none d-md-inline-block">More Info</span></button>
                         }
                        {(target) && <a style={{float:'right',marginTop:'1em'}}  className='btn btn-primary' target={target} href={link}><ExternalLink size={26}  />&nbsp;<span className="d-none d-md-inline-block">More Info</span></a>
                        }
                        </span>}
						    
						
                        
                        <div style={{width:'100%',clear:'both'}}></div>
                        
                        
                        <div  className="card-title questionheader">{this.props.isReview && <br/>}{header}?</div>
                        <div className="card-block">
                            {(this.isVisible('media') || question.autoplay_media==="YES") && question.mediaattribution && hasMedia  && <div className="card-block mediaattribution">
                            <div  className='card-text ' style={{fontSize:'0.85em'}}><b>Media Attribution/Source</b> <span><pre>{mediaAttribution}</pre></span></div>
                        </div>}
                        
                        </div>
                          
                        <div className="card-block answer">
                        {((this.isVisible('image') || question.autoshow_image==="YES" || !showRecallButton) && imageLink  ) && 
                            <img   alt={question.question} onClick={() => this.setVisible('image')} style={{ float:'left', maxHeight:'150px', maxWidth:'150px',border: "0px",clear:'both', paddingRight: '1em'}} src={imageLink} />
                            }
                        
                        {(this.isVisible('answer') || !showRecallButton)  && shortanswer.length > 0  && 
                            <div  className='card-text'><b>Answer</b><br/> 
                             
                                
                            <span className='shortanswer' style={shortAnswerStyle} dangerouslySetInnerHTML={{__html: cleanShortAnswer}} ></span>&nbsp;&nbsp;&nbsp;&nbsp;{showLongAnswer && <button style={{display:'inline'}} className="btn btn-primary" onClick={() => this.setVisible('answer')}>...</button>}</div>
                        }
                            
                        </div>
                        <div style={{width:'100%',clear:'both',height:'1em'}}></div>
                       
                        <div ref={(section) => { this.scrollTo.mnemonic = section; }} ></div>
                    {(this.isVisible('mnemonic')|| !showRecallButton) &&<MnemonicsList isAdmin={this.props.isAdmin} disableSwipe={this.disableSwipe} enableSwipe={this.enableSwipe} saveSuggestion={this.props.saveSuggestion} mnemonic_techniques={this.props.mnemonic_techniques} user={this.props.user} question={question} showRecallButton={showRecallButton}  setQuizFromTechnique={this.props.setQuizFromTechnique} isLoggedIn={this.props.isLoggedIn} like={this.props.like}/>}
                        
                       
                        
                    <div className="card-block">
                        <div ref={(section) => { this.scrollTo.answer = section; }} ></div>
                        
                        {(this.isVisible('answer') || !showRecallButton) && showLongAnswer && <div  className='card-text'><span style={{fontSize:'1.4em'}}><pre>{this.state.answer}</pre></span></div>}
                         
                        <div  className='card-text' style={{fontSize:'0.85em'}}>
                        {(this.isVisible('answer') || !showRecallButton) && question.link && <b >From <a href={question.link} target='_new' >{shortLink}</a></b>}
                       
                        {(this.isVisible('answer') || !showRecallButton) && question.attribution && 
                            <div><b >Attribution/Source</b> <span >{attribution}</span></div>
                        }
                        </div>
                        <br/>
                    </div>
                       
                        
                        <div ref={(section) => { this.scrollTo.tags = section; }} ></div>
                        {((this.isVisible('tags')  && showRecallButton) && question.quiz) && <div className="card-block topic">
                            <b>Topic&nbsp;&nbsp;&nbsp;</b> <span><button className="btn btn-outline btn-primary"   ><span className="hidden-sm-down" >{question.quiz}</span></button></span><br/>
                        </div>}
                        {((!showRecallButton) && question.quiz) && <div className="card-block topic">
                            <b>Topic&nbsp;&nbsp;&nbsp;</b><Link to={"/discover/topic/"+question.quiz} className="btn btn-outline btn-primary"   ><Search size={28} className="badge badge-pill badge-info"  style={{float:'right'}}/> <span className="hidden-sm-down" >{question.quiz}</span></Link><br/>
                        </div>}
                        
                        {(!showRecallButton) && <div   className="card-block tags" >
                          <b>Tags&nbsp;&nbsp;&nbsp;</b>
                           {tags}
                        </div>}
                        {(showRecallButton && this.isVisible('tags')) && showRecallButton && <div    className="card-block tags" >
                          <b>Tags&nbsp;&nbsp;&nbsp;</b>
                           {tagsClean}
                        </div>}
                        
                       
                    </Swipeable>
                    <br/>
                     <div ref={(section) => { this.scrollTo.moreinfo = section; }} ><br/></div>
                       
                    <div className="card-block">
                         {(this.isVisible('moreinfo') && !target) && <div className="holds-the-iframe"><iframe className='wikiiframe'  src={link} style={{width:"98%", height: "1200px", border: "0px"}}/></div> }                
                    </div>
                    
                    <div className="card-block">
                        <div ref={(section) => { this.scrollTo.image = section; }} ></div>
                        {((this.isVisible('image') || !showRecallButton || question.autoshow_image==="YES") && imageLink) && <span><a href={imageLink} target='_new'><img  className="d-lg-none"   alt={question.question} src={imageLink} style={{width:"98%",  border: "0px"}}/><img  className="d-none d-lg-block"   alt={question.question} src={imageLink} style={{width:"50%",  border: "0px"}}/></a></span> }
                        {(this.isVisible('image') || !showRecallButton) && question.imageattribution && <div><div className="card-block imageattribution">
                            
                        </div><div   style={{fontSize:'0.85em'}}><b>Image Attribution/Source</b> <span>{imageAttribution}</span></div></div>}
                    </div>
                    
                    {(!showRecallButton || this.isVisible('comments')) && <div ref={(section) => { this.scrollTo.comments = section; }}  className="card-block" id="comments">
						<CommentList isAdmin={this.props.isAdmin} user={this.props.user} question={this.props.question} comments={this.props.comments}   editComment={this.props.editComment}  deleteComment={this.props.deleteComment} toggleCommentDialog={this.props.toggleCommentDialog} newComment={this.props.newComment} saveComment={this.props.saveComment} setComment={this.props.setComment} newCommentReply={this.props.newCommentReply} isSingleView={true}/>
					</div>}
						
					{<div style={((!showRecallButton || this.isVisible('questions'))  ? {display:'block'} : {display:'none'})} ref={(section) => { this.scrollTo.questions = section; }}  className="card-block">
						<MultipleChoiceQuestions viewOnly={true} notifyQuestionsLoaded={this.notifyQuestionsLoaded}  question={this.props.question._id} topic={this.props.question.quiz} carousel={true}/>
					</div>
					} 
                </div>
                
				{this.state.showShareDialog && <ShareDialog setShareDialog={this.setShareDialog} url={shareLink} title={shareTitle} dialogTitle={'Share Question using'} />}
			
                 <div ref={(section) => { this.scrollTo.end = section; }} ></div>
                       
            </div>
          
          
            )
            
 
             
        } else {
            return <div className="card question container" >
               
                <div>No new/matching questions</div>
                <br/>
                {this.props.match.params.topic && <Link style={{float:'right'}} className='btn btn-info lg-2' to={'/discover/searchtopic/'+this.props.match.params.topic} >
				<ShowAll size={25} /> Show All Questions In This Topic
				</Link>}
                
                
            </div>
        }
        
    };
}
