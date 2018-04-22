import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';

export default class TopicsList extends Component {
    constructor(props) {
        super(props);
        this.state={
            topics:[]
        };
        this.loadTopics = this.loadTopics.bind(this);
    };
    
    componentDidMount() {
         this.loadTopics();  
    }
    
    loadTopics(params) {
        let that = this;
        fetch("/api/myusertopics", {
         method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({user:this.props.user})
        }).then(function(response) {
            return response.json();
        }).then(function(topics) {
            console.log(['loaded topics',topics]);
            //res.send({user:user,token:token});
            that.setState({topics:topics});
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
    }; 
    
    
    render() {
        let list='';
        if (this.state.topics && this.state.topics.length > 0) {
            list = this.state.topics.map((topic,key) => {
                     return <div className='list-group-item' key={key} ><button  className='btn btn-info'  onClick={() => this.props.loadTopic(topic._id)} >Load {topic.topic} </button></div>
                });
        } else {
            list = <div></div>
        }
        return (
            <div>
        <button   className='btn btn-success' onClick={() => this.props.newTopic()} >Create Topic</button>
            {list}
            </div>
        )
    }
};
