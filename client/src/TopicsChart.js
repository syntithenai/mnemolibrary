import React from 'react';
import { ResponsivePie } from '@nivo/pie'

export default class TopicsChart extends React.Component {
 
  
    constructor(props) {
        super(props);
        this.state = {
                labels:[],
                series:[]
        } 
    }
    componentDidMount() {
           let that = this;
        //usersuccessprogress
        //useractivity
        fetch('/api/recenttopics?user='+this.props.user._id)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
          //  console.log(['got response', json]);

            let series=[];
            json.map(function(val,key) {
            //    console.log(['ssss map',key,val]);
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
                   // console.log(['score',score,color,val.topic,val.questions,val.total,val.successRates]);
                    //+ ' (' + val.questions + '/' + val.total+')'
                    let point={"topic": val.topic,"id": val.topic ,"value": 1,"total": val.total,"questions": val.questions,"score":score,successRate:val.successRate,color:color};
                    if (point.score < 0.7) {
                        series.push(point);
                    }
                    
                }
                return null;
            });
            //console.log(['SET DATA',series]);
            that.setState({series:series});
       
                
        }).catch(function(ex) {
            console.log(['test request failed', ex])
        })        
    };
      
    clickPie(a,b) {
        console.log(['click ',a]);
        if (a.questions === a.total) {
            // review
            console.log(['REVIEW ',a]);
            this.props.setReviewFromTopic(a.topic);
        } else {
            // discover
            console.log(['DISCO ',a]);
            this.props.setQuizFromTopic(a.topic);
        }
        
        
    }; 
    //clickTopic(e) {
        //console.log(['REDISCOVER ', e.target.textContent]);
       //// this.props.setQuizFromTopic(e.target.textContent);
    //};   
         
    // make sure parent container have a defined height when using responsive component,
    // otherwise height will be 0 and no chart will be rendered.
    //tooltip={function(e) {console.log(['TT',e]); return (<b>dddd</b>);}}
                //onClick={this.clickTopic.bind(this)}
    render() {
        if (this.state.series && this.state.series.length > 0) {
            
            return <div id="activetopics"  style={{height: '280px',zIndex:'9999'}}>
                   <br/><br/>
                   <h4 className='graphTitle' id="topics" >Active Topics</h4>
                   <b>Click to continue a topic</b>
                <ResponsivePie
                data={this.state.series}
                margin={{
                    "top": 40,
                    "right": 80,
                    "bottom": 80,
                    "left": 80
                }}
                height={280}
                innerRadius={0.5}
                padAngle={0.7}
                cornerRadius={3}
                colorBy={function(e){return e.color}}
                borderColor="inherit:darker(0.6)"
                radialLabelsSkipAngle={10}
                radialLabelsTextXOffset={6}
                radialLabelsTextColor="#333333"
                radialLabelsLinkOffset={0}
                radialLabelsLinkDiagonalLength={16}
                radialLabelsLinkHorizontalLength={24}
                radialLabelsLinkStrokeWidth={1}
                radialLabelsLinkColor="inherit"
                slicesLabelsSkipAngle={10}
                slicesLabelsTextColor="#333333"
                sliceLabel={function(e){return e.questions+"/"+e.total}}
                animate={true}
                motionStiffness={90}
                motionDamping={15}
                onClick={this.clickPie.bind(this)}
                />
            </div>
        } else {
            return '';
        }
    }
}
