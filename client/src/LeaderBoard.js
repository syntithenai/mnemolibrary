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
        fetch('/api/leaderboard')
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            console.log(['leaderboard loaded', json])
           that.setState({series:json});
        }).catch(function(ex) {
            console.log(['leaderboard request failed', ex])
        })        
    };
         
    render() {
        if (this.state.series && this.state.series.length > 0) {
        
            let rows = this.state.series.map(function(user,key) {
                return   <tr>
                      <th scope="row">{key+1}</th>
                      <td>{user.avatar}</td>
                      <td>{user.streak}</td>
                      <td>{user.questions}</td>
                      <td>{user.recall}</td>
                    </tr>
              
            });
            return <div style={{height: '200px'}}>
                   <h4 id="leaderboard" className='graphTitle' >Leaderboard</h4>
                  <table className="table table-striped table-responsive">
                  <thead className="thead-dark">
                    <tr>
                      <th scope="col">#</th>
                      <th scope="col">Avatar</th>
                      <th scope="col">Days in a row</th>
                      <th scope="col">Total Questions</th>
                      <th scope="col">Recall %</th>
                    </tr>
                  </thead>
                  <tbody>
                  {rows}
                  
                  </tbody>
                </table>
                                  
                  
                  
            </div>
        } else {
            return '';
        }
    }
}
