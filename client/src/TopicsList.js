import React, { Component } from 'react';
import QuizList from './QuizList';
import QuizCollection from './QuizCollection';
import Utils from './Utils';
//import FaClose from 'react-icons/lib/fa/close';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css
import Edit from 'react-icons/lib/fa/edit';
import Trash from 'react-icons/lib/fa/trash';
import Plus from 'react-icons/lib/fa/plus';


export default class TopicsList extends Component {
    constructor(props) {
        super(props);
        this.state={
            topics:[]
        };
        this.loadTopics = this.loadTopics.bind(this);
        this.deleteTopic = this.deleteTopic.bind(this);
    };
    
    componentDidMount() {
         this.loadTopics();  
    }
    
    loadTopics() {
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
          //  console.log(['loaded topics',topics]);
            //res.send({user:user,token:token});
            that.setState({topics:topics});
        })
        .catch(function(err) {
            console.log(['ERR',err]);
        });
    }; 
    
    deleteTopic(key) {
        this.props.deleteTopic(key).then(this.loadTopics);
        
    };
    
    askDeleteTopic(key) {
        confirmAlert({
          title: 'Delete Topic',
          message: 'Are you sure you want to delete this topic and all associated questions?',
          buttons: [
            {
              label: 'Yes',
              onClick: () => this.deleteTopic(key)
            },
            {
              label: 'No'
            }
          ]
        })
    };
    
    render() {
        let list='';
        if (this.state.topics && this.state.topics.length > 0) {
            list = this.state.topics.map((topic,key) => {
                     return <div className='list-group-item' key={key} ><button  className='btn btn-danger'  onClick={() => this.askDeleteTopic(topic._id)} style={{float:'right'}} ><Trash size={28}/>&nbsp;<span className="d-none d-sm-inline" >Delete</span> </button><button  className='btn btn-info'  onClick={() => this.props.loadTopic(topic._id)} style={{float:'right'}} ><Edit size={28}/>&nbsp;<span className="d-none d-sm-inline" >Edit</span> </button>{topic.topic}</div>
                });
        } else {
            list = <div></div>
        }
        return (
            <div>
        <button   className='btn btn-success' onClick={() => this.props.newTopic()} ><Plus size={28}/>&nbsp;<span className="d-none d-sm-inline" >Create Topic</span> </button>
            {list}
            </div>
        )
    }
};
