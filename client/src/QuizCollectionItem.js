import React, { Component } from 'react';
import getIcon from './collectionIcons';
import Utils from './Utils'

export default class QuizCollectionItem extends Component {
    
    constructor(props) {
        super(props);
        this.state={}
        this.onQuestionClick = this.onQuestionClick.bind(this);
    }
    
    componentDidMount() {
        let that = this;
        // load this question
        
        if (!this.props.hideSingleQuestionInCollectionView) {
            if (this.props.loadQuestionByDifficulty) {
                this.props.loadQuestionByDifficulty.bind(this)(this.props.difficulty).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id});
                });
            } else if (this.props.loadQuestionByTopics) {
                this.props.loadQuestionByTopics.bind(this)(this.props.topics).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id});
                });
            }  else if (this.props.loadQuestionByCommunity) {
                this.props.loadQuestionByCommunity.bind(this)(this.props.topics).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id});
                });
            }  else if (this.props.loadQuestionByAll) {
                this.props.loadQuestionByAll.bind(this)(this.props.topics).then(function(question) {
                    that.setState({question:Utils.getQuestionTitle(question),id:question._id});
                });
            }             
        }
        
    

        //else {
            //this.setState({question:'Why is it NOT so'});
        //}
    };
    
    onQuestionClick(e) {
        if (this.state.id && this.state.id.length > 0) {
            this.props.setQuizFromQuestionId(this.state.id)
        }
    };
    
    render() {
        let iconStyle={height: '3.6em'}
        let blockStyle={minHeight:'220px',border:'2px solid white',fontSize:'1.1em',paddingTop:'0.2em'}
        
        return (
                <div onClick={this.props.onClick} style={Object.assign({backgroundColor:this.props.backgroundColor, color: this.props.color ? this.props.color : 'black'},blockStyle)}  className="col-lg-4 col-6" >
                    <span style={{sfloat:'right',marginRight:'0.8em'}} >{getIcon(this.props.icon,iconStyle)}</span>
                    <span style={{fontSize:'1.4em',fontWeight:'bold'}}>{this.props.name}</span>
                    <div onClick={this.onQuestionClick} style={{marginTop:'0.8em'}} >{this.state.question}</div>
                </div>
            );
        
    }
//const QuizCollectionItem = function (props) {
};
