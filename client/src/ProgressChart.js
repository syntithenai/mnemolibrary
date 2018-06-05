import React from 'react';
import { ResponsiveBar } from '@nivo/bar'

export default class ProgressChart extends React.Component {
 
  
    constructor(props) {
        super(props);
        this.state = {
                labels:[],
                
        } 
    }
    componentDidMount() {
           let that = this;
        fetch('/api/usersuccessprogress?user='+this.props.user._id)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            console.log(['got response', json]);
            let max=0;
            
            let dataObject = {}
            json.map(function(val,key) {
                let id=0;
                if ((parseInt(val._id,10) > 0)) id=parseInt(val._id,10);
                if (id > max) max=id;
                let point={y:val.questions,x:id,yColor:'blue'}
               // val.questionsColor = "lightblue";
                dataObject[id]=point;
                return null;
                //return point;
            });
            for (var i=0; i <= max; i++) {
                if (dataObject.hasOwnProperty(i)) {
                    
                } else {
                    dataObject[i]={y:0,x:i,yColor:'blue'}
                }
            }
            let data = Object.values(dataObject);
            data.sort(function(a,b) {
                if (a.x < b.x) return -1
                else return 1;
            });
            let state={series:data}
            console.log('SETSTATE');
            console.log(state.data);
            that.setState(state);
                
        }).catch(function(ex) {
            console.log(['test request failed', ex])
        })        
    };
    
    clickPie(a) {
      console.log(a); 
      this.props.reviewBySuccessBand(a.index); 
    };
         
    // make sure parent container have a defined height when using responsive component,
    // otherwise height will be 0 and no chart will be rendered.
    render() {
        if (this.state.series && this.state.series.length > 0) {
            return <div style={{height: '500px',marginBottom:'200px'}}>
               
                <h4 id="progress"  className='graphTitle' >Recall Distribution</h4>
                 <b>Click to review a success band</b>
                <ResponsiveBar
                    data={this.state.series}
                     keys={[
                    "y",
                ]}
                height={300}
                indexBy="x"
                margin={{
                    "top": 50,
                    "right": 130,
                    "bottom": 50,
                    "left": 61
                }}
                padding={0.3}
            colors="set1"
            colorBy={({ id, data }) => data[`${id}Color`]}
            defs={[
                {
                    "id": "dots",
                    "type": "patternDots",
                    "background": "inherit",
                    "color": "#38bcb2",
                    "size": 4,
                    "padding": 1,
                    "stagger": true
                },
                {
                    "id": "lines",
                    "type": "patternLines",
                    "background": "inherit",
                    "color": "#eed312",
                    "rotation": -45,
                    "lineWidth": 6,
                    "spacing": 10
                }
            ]}

                borderWidth={1}
                borderColor="inherit:darker(1.6)"
                axisBottom={{
                    "orient": "bottom",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Success Tally",
                    "legendPosition": "center",
                    "legendOffset": 36
                }}
                axisLeft={{
                    "orient": "left",
                    "tickSize": 5,
                    "tickPadding": 5,
                    "tickRotation": 0,
                    "legend": "Questions",
                    "legendPosition": "center",
                    "legendOffset": -40
                }}
                labelSkipWidth={12}
                labelSkipHeight={12}
                labelTextColor="inherit:darker(1.6)"
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                theme={{
                    "tooltip": {
                        "container": {
                            "fontSize": "13px"
                        }
                    },
                    "labels": {
                        "textColor": "#555"
                    }
                }}
                onClick={this.clickPie.bind(this)}
                    
                />  
                
            </div>
            
        } else {
            return '';
        }
    }
}
            //legends={[
                //{
                    //"dataFrom": "keys",
                    //"anchor": "bottom-right",
                    //"direction": "column",
                    //"translateX": 120,
                    //"itemWidth": 100,
                    //"itemHeight": 20,
                    //"itemsSpacing": 2,
                    //"symbolSize": 20
                //}
            //]}
