/* eslint-disable */ 
import React from 'react';
import { ResponsivePie } from '@nivo/pie'
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
//import PieChartIcon from 'react-icons/lib/fa/chart-pie';
import TrashIcon from 'react-icons/lib/fa/trash';
import ListIcon from 'react-icons/lib/fa/list';
import ArchiveIcon from 'react-icons/lib/fa/archive';
//import ReviewIcon from 'react-icons/lib/fa/gas-pump';
import ContinueIcon from 'react-icons/lib/fa/play';

//import RediscoverIcon from 'react-icons/lib/fa/redo';

const buttonStyle={height:'1.1em'}

const rediscoverIcon=
<svg style={buttonStyle} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path fill="currentColor" d="M500.33 0h-47.41a12 12 0 0 0-12 12.57l4 82.76A247.42 247.42 0 0 0 256 8C119.34 8 7.9 119.53 8 256.19 8.1 393.07 119.1 504 256 504a247.1 247.1 0 0 0 166.18-63.91 12 12 0 0 0 .48-17.43l-34-34a12 12 0 0 0-16.38-.55A176 176 0 1 1 402.1 157.8l-101.53-4.87a12 12 0 0 0-12.57 12v47.41a12 12 0 0 0 12 12h200.33a12 12 0 0 0 12-12V12a12 12 0 0 0-12-12z"></path></svg>

const reviewIcon=<svg style={buttonStyle}  role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M336 448H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h320c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zm208-320V80c0-8.84-7.16-16-16-16s-16 7.16-16 16v48h-32V80c0-8.84-7.16-16-16-16s-16 7.16-16 16v48h-16c-8.84 0-16 7.16-16 16v32c0 35.76 23.62 65.69 56 75.93v118.49c0 13.95-9.5 26.92-23.26 29.19C431.22 402.5 416 388.99 416 372v-28c0-48.6-39.4-88-88-88h-8V64c0-35.35-28.65-64-64-64H96C60.65 0 32 28.65 32 64v352h288V304h8c22.09 0 40 17.91 40 40v24.61c0 39.67 28.92 75.16 68.41 79.01C481.71 452.05 520 416.41 520 372V251.93c32.38-10.24 56-40.17 56-75.93v-32c0-8.84-7.16-16-16-16h-16zm-283.91 47.76l-93.7 139c-2.2 3.33-6.21 5.24-10.39 5.24-7.67 0-13.47-6.28-11.67-12.92L167.35 224H108c-7.25 0-12.85-5.59-11.89-11.89l16-107C112.9 99.9 117.98 96 124 96h68c7.88 0 13.62 6.54 11.6 13.21L192 160h57.7c9.24 0 15.01 8.78 10.39 15.76z"></path></svg>

const pieChartIcon = 
<svg style={{height:'1.3em'}} role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 544 512"><path fill="currentColor" d="M527.79 288H290.5l158.03 158.03c6.04 6.04 15.98 6.53 22.19.68 38.7-36.46 65.32-85.61 73.13-140.86 1.34-9.46-6.51-17.85-16.06-17.85zm-15.83-64.8C503.72 103.74 408.26 8.28 288.8.04 279.68-.59 272 7.1 272 16.24V240h223.77c9.14 0 16.82-7.68 16.19-16.8zM224 288V50.71c0-9.55-8.39-17.4-17.84-16.06C86.99 51.49-4.1 155.6.14 280.37 4.5 408.51 114.83 513.59 243.03 511.98c50.4-.63 96.97-16.87 135.26-44.03 7.9-5.6 8.42-17.23 1.57-24.08L224 288z"></path></svg>



export default class TopicsChart extends React.Component {
 
  
    constructor(props) {
        super(props);
        this.state = {
                labels:[],
                series:[],
                archiveSeries:[],
                show: 'list',
                exitRedirect:null
        } 
        this.loadData = this.loadData.bind(this);
        this.blockTopic = this.blockTopic.bind(this);
        this.unblockTopic = this.unblockTopic.bind(this);
        this.blockTopicReal = this.blockTopicReal.bind(this);
        this.showCurrent = this.showCurrent.bind(this);
        this.showArchive = this.showArchive.bind(this);
        this.showBlocks = this.showBlocks.bind(this);
        this.showChart = this.showChart.bind(this);
    }
    
    //handleChange {
        //var self = this;          // Store `this` component outside the callback
        //if ('onorientationchange' in window) {
            //window.addEventListener("orientationchange", function() {
                //// `this` is now pointing to `window`, not the component. So use `self`.
                //self.setState({   
                    //orientation: !self.state.orientation
                //})
                ////console.log("onorientationchange");
            //}, false);
        //}
    //}
    
    
    /**
   * Calculate & Update state of new dimensions
   */
  updateDimensions() {
      ////console.log(['U',window.innerWidth,this.state.series.length]);
    //if (window.innerWidth < 700 || this.state.series.length > 17) {
        //this.setState({show:'list'});
    //} else {
        //this.setState({show:'chart'});
    //}
  }

  
  /**
   * Remove event listener
   */
  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions.bind(this));
  }
    
    componentDidMount() {
        let that=this;
       this.loadData().then(function() {
            that.updateDimensions();
            window.addEventListener("resize", that.updateDimensions.bind(that));
       });
       
       
  
    };
    
    loadData(type) {
        let that = this;
        //usersuccessprogress
        //useractivity
        that.props.addAward('topics',null);
        //that.props.addAward('distribution',null);
        that.props.addAward('questions',null);
        that.props.addAward('recall',null);
        that.props.addAward('successes',null);
        let colors = [];
        let url='/api/recenttopics?user='+this.props.user._id;
        if (type==='blocks')  {
            url='/api/blockedtopics?user='+this.props.user._id;
        } else if (type==='archive')  {
            url='/api/archivedtopics?user='+this.props.user._id;
        }
        let promise = new Promise(function(resolve,reject) {
			console.log(['TOPICS FETCH',url]);
            fetch(url)
            .then(function(response) {
                return response.json()
            }).then(function(json) {
               console.log(['got CORE response', json]);

                let series=[];
                let totalSeen=0;
                let totalSuccess=0;
                let countSuccess=0;
                let completedTopics=[];
                json.map(function(val,key) {
                //    //console.log(['ssss map',key,val]);
                    if (val.topic && val.topic.length > 0) {
                        
                        function getGreenToRed(percent){
                            let r = percent<50 ? 255 : Math.floor(255-(percent*2-100)*255/100);
                            let g = percent>50 ? 255 : Math.floor((percent*2)*255/100);
                            return 'rgb('+r+','+g+',0)';
                        }
                        let completion=val.questions/val.total;
                        // completion approaches 1, successRate approaches 1 so divide by 2 to limit to 1
                        //let score=(((val.successRate)*(completion)*3) + (completion))/4
                        let score=(val.successRate + completion)/2
                        let color=getGreenToRed(score*100);
                        colors.push(color);
                       //console.log(['score',score,color,val.topic,val.questions,val.total,val.successRates]);
                        //+ ' (' + val.questions + '/' + val.total+')'
                        let point={"topic": val.topic+" "+score,"id": val.topic+" "+score ,"value": 1,"total": val.total,"questions": val.questions,"score":score,successRate:val.successRate,color:color,blocks:val.blocks};
                        //if (point.score < 0.7) {
                        if (parseFloat(val.questions) > 0) {
                            totalSeen += parseFloat(val.questions)
                        }
                        if (parseFloat(val.successRate) > 0 && parseFloat(val.questions) > 0) {
                            totalSuccess += parseFloat(val.successRate)
                            countSuccess++;
                        }    
                        if (parseFloat(val.questions) > 0 && parseFloat(val.total) > 0 && val.topic && val.questions === val.total) {
                            completedTopics.push(val.topic);
                        }
                        
                        series.push(point);
                        //}
                        series.sort(function(a,b) {
                            if (a.topic < b.topic) {
                                return -1;
                            } else {
                                return 1;
                            }
                        });
                        
                    }
                    return null;
                });
                //console.log(['LOADDATA TOPIC CHART',type]);
                if (type!=='blocks' && type!=='archive') {
                    that.props.addAward('topics',completedTopics.length);
                   // that.props.addAward('questions',totalSeen);
                    that.props.addAward('recall',totalSuccess/countSuccess + totalSeen/1000) ;
                }
                console.log(['SET DATA',series,colors]);
                that.setState({colors:colors,series:series});
                resolve();
                    
            }).catch(function(ex) {
                //console.log(['test request failed', ex])
                reject();
            })   
        });
        return promise;     
    }
    
    
    clickPie(a,forceReview=false,search=false) {
        //console.log(['click ',a]);
      //  return;
        if (search===true) {
             //console.log(['SEARCH ',a.topic,a]);
            //this.props.searchQuizFromTopic(a.topic);
            this.setState({'exitRedirect':'/discover/searchtopic/'+a.topic});
        } else if (a.questions === a.total || forceReview===true) {
            // review
            //console.log(['REVIEW ',a.topic,a]);
            //this.props.setReviewFromTopic(a.topic);
            this.setState({'exitRedirect':'/review/topic/'+a.topic});
        } else {
            // discover
            //console.log(['DISCO ',a]);
            if (a.questions <= a.total) {
                //this.props.setQuizFromTopic(a.topic);
                this.setState({'exitRedirect':'/discover/topic/'+a.topic});
            } else {
                this.setState({'exitRedirect':'/review/topic/'+a.topic});
                //this.props.setReviewFromTopic(a.topic);
            }
        }
    }; 
    
    blockTopic(a) {
        confirmAlert({
          title: 'Block Topic',
          message: 'Are you sure you want to block all the questions in the topic - '+a.topic+'?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.blockTopicReal(a)
            },
            {
              label: 'No'
            }
          ]
        })
    }    
    
    blockTopicReal(a) {
        let that = this;
        fetch('/api/blocktopic?topic='+a.topic+'&user='+this.props.user._id)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            //console.log(['got response', json]);
            that.loadData();
        }).catch(function(ex) {
            //console.log(['test request failed', ex])
        })        
    };
    
    showArchive() {
        let that = this;
        this.setState({series:[]});
        this.loadData('archive').then(function() {
            that.setState({show:'archive'});
        });
        
    };
    showChart() {
        let that = this;
        this.setState({series:[]});
        this.loadData().then(function() {
            that.setState({show:'chart'});
        });
    };
    showBlocks() {
        let that = this;
        this.setState({series:[]});
        this.loadData('blocks').then(function() {
            that.setState({show:'blocks'});
        });
    };
    showCurrent() {
        let that = this;
        this.setState({series:[]});
        this.loadData().then(function() {
            that.setState({show:'list'});
        });
    };
    unblockTopic(topic) {
        //console.log('unblock' + topic);
         let url='/api/unblocktopic?user='+this.props.user._id+'&topic='+topic;
        let that=this;
        fetch(url)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
           //console.log(['got unblock response', json]);
           that.loadData('blocks');
        });
      //  this.setState({showList:!this.state.showList});
    };
    
    toggleList() {
        this.setState({showList:!this.state.showList});
    };
    
    
    setCurrentPage(page) {
        //console.log(page);
        this.props.setCurrentPage(page);
        return false;
    };
    
    //setQuizFromDiscovery() {
        ////console.log('setQuizFromDiscovery');
        //this.props.setQuizFromDiscovery();
        //return false;
    //};
    
    //clickTopic(e) {
        ////console.log(['REDISCOVER ', e.target.textContent]);
       //// this.props.setQuizFromTopic(e.target.textContent);
    //};   
         
    // make sure parent container have a defined height when using responsive component,
    // otherwise height will be 0 and no chart will be rendered.
    //tooltip={function(e) {//console.log(['TT',e]); return (<b>dddd</b>);}}
                //onClick={this.clickTopic.bind(this)}
    
    //<button   className="btn btn-danger" onClick={(e) => that.deleteComment(comment)} ><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Delete</span></button>
    render() {
        if (this.state.exitRedirect === null) {
            let that = this;
            if (this.state.series) {
                if (this.state.show==="list") {
                    let topicsList = '';
                    if (this.state.series.length > 0) {
                        let topicsItems = this.state.series.map(function(val,key) {
                            let continueButton='';
                            let successRate =val.successRate ? parseInt(parseFloat(val.successRate,10)*100,10) : 0;
                            if (val.total > val.questions) {
                                continueButton=(<a className='btn btn-info' style={{color:'white'}} onClick={() => that.clickPie.bind(that)(val)}><ContinueIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Continue</span>&nbsp; <span className="badge badge-light">{val.questions}/{val.total}</span>&nbsp;</a>);
                            } else {
                                continueButton=(<a className='btn btn-info' style={{color:'white'}} onClick={() => that.clickPie.bind(that)(val,false,true)}>{rediscoverIcon}&nbsp;<span className="d-none d-md-inline-block">Rediscover</span></a>);
                            }
                            let reviewButton=''
                            if (val.questions > 0) {
                                reviewButton=(<a className='btn btn-success' style={{color:'white'}} onClick={() => that.clickPie.bind(that)(val,true)}>&nbsp;{reviewIcon}&nbsp;<span className="d-none d-md-inline-block">Review</span>&nbsp;<span className="badge badge-light">{successRate}%</span>&nbsp;</a>);
                            }
                            return (<div href="#" style={{width: '100%',borderBottom:'1px solid black'}} key={val.topic} className="cols-12">{val.topic}   <span style={{float: 'right'}} className='topicbuttons' >{continueButton}{reviewButton}<a style={{color:'white'}} className='btn btn-danger' onClick={() => that.blockTopic.bind(that)(val)}><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Block</span></a></span></div>)
                        });
                        
                        topicsList = (<div className="row" style={{width: '90%', marginLeft: '2em', padding: '0.3em', border: '1px solid black'}} >{topicsItems}</div>);
                        
                    } else {
                        topicsList = (<div className="row" style={{width: '90%', marginLeft: '2em', padding: '0.3em', border: '1px solid black'}} >No progress yet</div>);
                    }
                    //<a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showChart.bind(that)} >{pieChartIcon}&nbsp;<span className="d-none d-md-inline-block">Chart</span></a>
                    return (<div style={{width: '100%',height: '100%'}} >
                       <br/><br/>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showBlocks.bind(that)} ><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Blocks</span></a>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showArchive.bind(that)} ><ArchiveIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Archive</span></a>
                       
                       <h4 className='graphTitle' id="topics" >Active Topics 
                      </h4>
                       <br/>
                        {topicsList}<br/><br/><br/><br/><br/><br/><br/><br/>
                    </div>);
                    
                        
                } else if (this.state.show==="archive") {
                    let topicsList = '';
                    if (this.state.series.length > 0) {
                        let topicsItems = this.state.series.map(function(val,key) {
                            let reviewButton=(<a className='btn btn-success' style={{color:'white'}} onClick={() => that.clickPie.bind(that)(val,true)}>&nbsp;Review&nbsp;&nbsp;</a>);
                            
                            let successRate =val.successRate ? parseInt(parseFloat(val.successRate,10)*100,10) : 0; 
                            return (<div href="#" style={{width: '100%',borderBottom:'1px solid black'}} key={val.topic} className="cols-12">{val.topic}   <span style={{float: 'right'}} className='topicbuttons' ><a className='btn btn-outline-secondary' style={{color:'black'}}>{val.questions}/{val.total}</a><a className='btn btn-outline-secondary' >{successRate}%</a>{reviewButton}</span></div>)
                        });
                        
                        topicsList = (<div className="row" style={{width: '90%', marginLeft: '2em', padding: '0.3em', border: '1px solid black'}} >{topicsItems}</div>);
                    } else {
                        topicsList = (<div className="row" style={{width: '90%', marginLeft: '2em', padding: '0.3em', border: '1px solid black'}} >No archived questions yet. Keep up the review.</div>);
                    }
                    return (<div style={{width: '100%',height: '100%'}} >
                       <br/><br/>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showBlocks.bind(that)} ><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Blocks</span></a> 
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showCurrent.bind(that)} ><ListIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Current</span></a>
                       
                       
                       <h4 className='graphTitle' id="topics" >Archived Topics</h4>
                       <br/>
                        {topicsList}
                        <br/><br/><br/><br/><br/><br/><br/><br/>
                    </div>);
                } else if (this.state.show==="blocks") {
                    let topicsList = '';
                    if (this.state.series.length > 0) {
                       let topicsItems = this.state.series.map(function(val,key) {
                            let successRate =val.successRate ? parseInt(parseFloat(val.successRate,10)*100,10) : 0;
                            return (<div href="#" style={{width: '100%',borderBottom:'1px solid black'}} key={val.topic} className="cols-12">{val.topic}   <span style={{float: 'right'}} className='topicbuttons' ><a style={{color:'white'}} className='btn btn-danger' onClick={() => that.unblockTopic.bind(that)(val.topic)}>Unblock</a></span></div>)
                        });
                        topicsList = (<div className="row" style={{width: '90%', marginLeft: '2em', padding: '0.3em', border: '1px solid black'}} >{topicsItems}</div>);
                    
                    } else {
                        topicsList = (<div className="row" style={{width: '90%', marginLeft: '2em', padding: '0.3em', border: '1px solid black'}} >No blocked questions</div>);
                    }
                        
                    return (<div style={{width: '100%',height: '100%'}} >
                       <br/><br/>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showArchive.bind(that)} ><ArchiveIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Archive</span></a>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showCurrent.bind(that)} ><ListIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Current</span></a>
                      
                       <h4 className='graphTitle' id="topics" >Blocked Topics</h4>
                       <br/>
                        {topicsList}
                        <br/><br/><br/><br/><br/><br/><br/><br/>
                    </div>);
                } else {
                    // colors={this.state.colors} 
                       
                    let chart=(<ResponsivePie
                        data={this.state.series}
                        margin={{
                            "top": 40,
                            "right": 80,
                            "bottom": 80,
                            "left": 80
                        }}
                        height={380}
                        innerRadius={0.5}
                        padAngle={0.7}
                        cornerRadius={3}
                        colorBy="color"              
                        borderColor="inherit:darker(0.6)"
                        radialLabelsSkipAngle={10}
                        radialLabelsTextXOffset={6}
                        radialLabelsTextColor="#333333"
                        radialLabelsLinkOffset={0}
                        radialLabelsLinkDiagonalLength={16}
                        radialLabelsLinkHorizontalLength={24}
                        radialLabelsLinkStrokeWidth={2}
                        radialLabelsLinkColor="inherit"
                        slicesLabelsSkipAngle={10}
                        slicesLabelsTextColor="#333333"
                        sliceLabel={function(e){return e.questions+"/"+e.total}}
                        animate={true}
                        motionStiffness={90}
                        motionDamping={15}
                        onClick={this.clickPie.bind(this)}
                        />)
                        
                    return (<div style={{width: '100%',height: '100%'}} >
                       <br/><br/>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showBlocks.bind(that)} ><TrashIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Blocks</span></a>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showArchive.bind(that)} ><ArchiveIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">Archive</span></a>
                       <a className="btn btn-info" style={{float:'right',color:'white'}}   onClick={that.showCurrent.bind(that)} ><ListIcon size={26}  />&nbsp;<span className="d-none d-md-inline-block">List</span></a>

                       {this.state.series.length > 0 && <div id="activetopics"  style={{height: '380px',zIndex:'9999'}}><h4 className='graphTitle' id="topics" >Active Topics</h4>
                       <br/>
                        <b>Click a slice to continue topic</b>
                      {chart}</div>}
                      
                       {this.state.series.length === 0 && <div id="activetopics"  style={{height: '580px',zIndex:'9999'}}> <h4 className='graphTitle' id="topics" >Welcome to Mnemo's Library</h4><b>To get started you can <Link to="/discover"  className='btn btn-info' >Discover</Link> random questions or <Link to="/search"  className='btn btn-info' >Search</Link> topics or tags.</b>
                      </div>}
                    </div>);
                        
                }
                        
        
            } else {
                return '';
            }
        } else {
            return <Redirect to={this.state.exitRedirect} />
        }
    }
}
