import React, { Component } from 'react';
import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'
import getIcon from './collectionIcons';
import Utils from './Utils'

export default class QuizCollectionItem extends Component {
    
    constructor(props) {
        super(props);
        this.state={}
        //this.onQuestionClick = this.onQuestionClick.bind(this);
    }
    
    componentDidMount() {
        let that = this;
        // load this question
        
        if (!this.props.hideSingleQuestionInCollectionView) {
            if (this.props.loadQuestionByDifficulty) {
                this.props.loadQuestionByDifficulty.bind(this)(this.props.difficulty).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id,topic:question.quiz});
                });
            } else if (this.props.loadQuestionByTopics) {
                this.props.loadQuestionByTopics.bind(this)(this.props.topics).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id,topic:question.quiz});
                });
            }  else if (this.props.loadQuestionByCommunity) {
                this.props.loadQuestionByCommunity.bind(this)(this.props.topics).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id,topic:question.quiz});
                });
            }  else if (this.props.loadQuestionByAll) {
                this.props.loadQuestionByAll.bind(this)(this.props.topics).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id,topic:question.quiz});
                });
            }             
        }
        
    

        //else {
            //this.setState({question:'Why is it NOT so'});
        //}
    };
    
    //onQuestionClick(e) {
        //if (this.state.id && this.state.id.length > 0) {
            //this.props.setQuizFromQuestionId(this.state.id)
        //}
    //};
    
    render() {
        let iconStyle={height: '3.6em'}
        let blockStyle={minHeight:'220px',border:'2px solid white',fontSize:'1.1em',paddingTop:'0.2em'}
        if (this.props.link) {
            return <div style={Object.assign({backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'},blockStyle)}  className="col-lg-4 col-6" >
                    <Link  to={this.props.link} ><div  style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'}} >
                        <span style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black',sfloat:'right',marginRight:'0.8em'}} >{getIcon(this.props.icon,iconStyle)}</span>
                        <span style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black',fontSize:'1.4em',fontWeight:'bold'}}>{this.props.name}</span>
                    </div></Link>
                    {this.state.question && <div style={{height:'100%'}} ><Link style={{height:'100%',display:'block'}} to={"/discover/topic/"+this.state.topic+"/"+this.state.id}  ><span style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'}} >{this.state.question}</span></Link></div>}
                </div>
        } else if (this.props.onClick) {
             return <div style={Object.assign({backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'},blockStyle)}  className="col-lg-4 col-6" >
                    <div  style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'}} onClick={this.props.onClick} >
                        <span style={{sfloat:'right',marginRight:'0.8em'}} >{getIcon(this.props.icon,iconStyle)}</span>
                        <span style={{fontSize:'1.4em',fontWeight:'bold'}}>{this.props.name}</span>
                    </div>
                    {this.state.question && <div style={{height:'100%',display:'block'}}><Link style={{height:'100%'}} to={"/discover/topic/"+this.state.topic+"/"+this.state.id}  ><span style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'}} >{this.state.question}</span></Link></div>}
                </div>
        } else {
            return ''
        } 
        
        return (
                <div style={Object.assign({backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'},blockStyle)}  className="col-lg-4 col-6" >
                    {this.props.link && <div  style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'}} ><Link  to={this.props.link} >
                        <span style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black',sfloat:'right',marginRight:'0.8em'}} >{getIcon(this.props.icon,iconStyle)}</span>
                        <span style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black',fontSize:'1.4em',fontWeight:'bold'}}>{this.props.name}</span>
                    </Link></div>}
                    {this.props.onClick && !this.props.link && <div  style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'}} onClick={this.props.onClick} >
                        <span style={{sfloat:'right',marginRight:'0.8em'}} >{getIcon(this.props.icon,iconStyle)}</span>
                        <span style={{fontSize:'1.4em',fontWeight:'bold'}}>{this.props.name}</span>
                    </div>}
                    {this.state.question && <div style={{height:'100%',display:'block'}}><Link style={{height:'100%'}} to={"/discover/topic/"+this.state.topic+"/"+this.state.id}  ><span style={{backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'}} >{this.state.question}</span></Link></div>}
                </div>
            );
        
    }
//const QuizCollectionItem = function (props) {
};
