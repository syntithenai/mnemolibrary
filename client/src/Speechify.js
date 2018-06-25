import React, { Component } from 'react';
import FaMicrophone from 'react-icons/lib/fa/microphone';
import FaMicrophoneSlash from 'react-icons/lib/fa/microphone-slash';


export default class Speechify extends Component {
 
  constructor(props) {
        super(props);
        this.state = {
            microphoneBorderColor:'red',
            microphoneColor:'pink',
            isSpeaking: false,
            recognitionText:''
        }
       this.startRecognition = this.startRecognition.bind(this);
       this.stopRecognition = this.stopRecognition.bind(this);
       this.switchRecognition = this.switchRecognition.bind(this);
        
        this.recognition = null;
        this.recognitionText = null;
        
    };

    isChrome() {
        return !!window.chrome;
	};

   componentDidMount() {
   }                   
					
                    
   

    startRecognition() {
        //console.log('START RE');
        let that=this;
        this.recognition = new window.webkitSpeechRecognition();
        this.recognition.onstart = function(event) {
            //updateRec();
        };
        this.recognition.onresult = function(event) {
            //console.log(['ONRES',event]);
            var text = "";
            for (var i = event.resultIndex; i < event.results.length; ++i) {
                text += event.results[i][0].transcript;
                //console.log(['ONRES',event.results[i]]);
            
            }
            that.setState({recognitionText:text});
            that.stopRecognition();
        };
        this.recognition.onend = function() {
            //console.log(['ONRES',event]);
            that.stopRecognition();
        };
        this.recognition.lang = "en-US";
        this.recognition.start();
    }

    stopRecognition() {
        //console.log('STOP RE');
        if (this.recognition) {
            this.recognition.stop();
            this.recognition = null;
        }
        //updateRec();
    }

    switchRecognition() {
             //console.log('toggle');
   
        if (this.recognition) {
            this.stopRecognition();
        } else {
            this.startRecognition();
        }
        return false;
    }
    
    
                    
    render() {
        
            return <span style={{position:'relative'}} ><b style={{color:'black',backgroundColor:'lightgrey'}}>{this.state.recognitionText}</b>
            {this.isChrome() && <button id="voicerecognitionbutton" onClick={this.switchRecognition} style={{backgroundColor: this.state.microphoneColor, borderColor:this.state.microphoneBorderColor}}  className="voicerecognitionbutton fi-microphone" ><FaMicrophone/></button>}
            {!this.isChrome() && <button  id="voicerecognitionbutton" className='voicerecognitionbutton fi-microphone'  ><FaMicrophoneSlash/></button>}
            </span>
    }
}

