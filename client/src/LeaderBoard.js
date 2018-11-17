import React from 'react';
//import { PropTypes } , { Component } from 'react';
//import { render } from 'react-dom'
import { ResponsiveBar } from '@nivo/bar'

 
export default class LeaderBoard extends React.Component {
  
    constructor(props) {
        super(props);
        this.state = {
                series:[
                ]
        } 
    }
    componentDidMount() {
        let that = this;
        fetch('/api/leaderboard?type='+that.props.type)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            //console.log(['leaderboard loaded', json])
            json.sort(function(a,b) {
                if (a[that.props.type] > b[that.props.type]) {
                    return -1;
                } else if (a[that.props.type] < b[that.props.type]) {
                    return 1;
                } else {
                    return 0;
                }
            });
           that.setState({series:json});
        }).catch(function(ex) {
            console.log(['leaderboard request failed', ex])
        })        
    };
         
    render() {
        let that=this;
        if (this.state.series && this.state.series.length > 0) {
            let rows = this.state.series.map(function(user,key) {
                return   <tr>
                      <th scope="row">{key+1}</th>
                      <td>{user.avatar}</td>
                      {that.props.type==="streak" &&  <td>{user.streak}</td>}
                      {that.props.type==="questions" &&  <td>{user.questions}</td>}
                      {that.props.type==="recall" &&  <td>{user.recall}</td>}
                    </tr>
              
            });
            return <div style={{height: '200px'}}>
                  <table className="table table-striped table-responsive">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Avatar</th>
                      {that.props.type==="streak" && <th scope="col">Days in a row</th>}
                      {that.props.type==="questions" && <th scope="col">Total Questions</th> }
                      {that.props.type==="recall" && <th scope="col">Recall %</th> }
                    </tr>
                  </thead>
                  <tbody>
                  <tr style={{backgroundColor:'lightblue'}} >
                      <th scope="row"></th>
                      <td><b>You</b></td>
                      {that.props.type==="streak" &&  <td>{this.props.user.streak}</td>}
                      {that.props.type==="questions" &&  <td>{this.props.user.questions}</td>}
                      {that.props.type==="recall" &&  <td>{parseInt(this.props.user.recall*10000,10)/100}</td>}
                    </tr>
                   
                   {rows}
                  
                  </tbody>
                </table>
                                  
                  
                  
            </div>
        } else {
            return '';
        }
    }
}
