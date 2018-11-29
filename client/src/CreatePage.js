import React, { Component } from 'react';
//const config=require('../../config');
import TopicEditor from './TopicEditor';

import {BrowserRouter as Router,Route,Link,Switch,Redirect} from 'react-router-dom'     

export default class CreatePage extends Component {
    
    constructor(props) {
        super(props);
        this.hideHelp = this.hideHelp.bind(this);
        this.showHelp = this.showHelp.bind(this);
        this.state = {
            showHelp:false,
        }
        
       // //console.log(['constr',this.state]);
    
    };
    

    
    showHelp(e) {
        this.setState({showHelp:true});
        return false;
    };
    hideHelp(e) {
        this.setState({showHelp:false});
        return false;
    };
    
    render() {
        if (this.props.user && this.props.user._id && this.props.user._id.length > 0) {
            return <div>
                <TopicEditor fetchTopicCollections={this.props.fetchTopicCollections} user={this.props.user} setQuizFromTopic={this.props.setQuizFromTopic} mnemonic_techniques={this.props.mnemonic_techniques}  setCurrentPage={this.props.setCurrentPage} />
            </div>
        } else {
            return <Redirect to="login" />
        }
            
        
    }
    

}
