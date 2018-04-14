import React, { Component } from 'react';
//import Utils from './Utils';
import 'whatwg-fetch'
import Ban from 'react-icons/lib/fa/ban';
import Search from 'react-icons/lib/fa/search';

import ThumbsUp from 'react-icons/lib/fa/thumbs-up';

export default class MnemonicsList extends Component {

    constructor(props) {
        super(props);
        const question = this.props.question;
        this.state={
           defaultMnemonic:'default', 
           mnemonics:{'default':{question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question}}
        }
        //this.recoverPassword = this.recoverPassword.bind(this);
        
    };

    componentDidMount() {
        let that=this;
        console.log(['mount mnem list',this.props.question,this.props.user]);
      if (this.props.question) {
          //// load mnemonics
          //let user=this.props.user;
          let question=this.props.question;
          fetch('/api/mnemonics',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                question: this.props.question._id
              })
          })
          .then(function(response) {
            //console.log(['got response', response])
            return response.json()
          }).then(function(json) {
              let final={'default':{question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question}};
              
            json.forEach(function(mnemonic) {
                final[mnemonic._id] = mnemonic;
            });
            //console.log(['create indexes', json])
            that.setState({defaultMnemonic:'default',mnemonics:final});
             
          }).catch(function(ex) {
            console.log(['parsing failed', ex])
          })

      }
     
    };

    render() {
        //let user=this.props.user;
        let question=this.props.question;
        let otherMnemonics = '';
        if (this.state.mnemonics) {
            if (this.state.mnemonics.length > 0) {
                otherMnemonics = Object.keys(this.state.mnemonics).map((key,mnemonic) => {
                    let likeButton=<a  className='btn btn-primary' >LLL</a>
                    if (this.props.isLoggedIn()) {
                        likeButton = <span className='like_dislike' >&nbsp;&nbsp;&nbsp;<a  className='btn btn-primary'  onClick={() => this.props.like(question._id,mnemonic._id)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Like&nbsp;<span className="badge badge-pill badge-info"  >{question.score}</span></a></span>
                    }  
                
                    console.log(['mnemoth',key,mnemonic]);
                    if (key !== this.state.defaultMnemonic) {
                        
                        var techniqueButton = <button className="btn btn-outline btn-primary"   ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.props.setDiscoveryBlock('technique',question.mnemonic_technique)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTechnique(question.mnemonic_technique)} style={{float:'right'}}/><span className="hidden-sm-down" >{question.mnemonic_technique}</span></button>
                        
                       // if (showRecallButton) {
                            //// remove search options from tech button
                        //}
                        
                        //{likeButton}
                        return <div className='list-group-item' key={key} >
                            {likeButton}{techniqueButton}
                            <pre  className='mnemonic' >{mnemonic.mnemonic}</pre>
                            <hr/>
                        </div>
                    
                    } else {
                        return '';
                    }
                })
            }
            console.log(['rebnmnlist',this.state.mnemonics,this.state.defaultMnemonic]);
            let mainLikeButton='';
            if (this.props.isLoggedIn()) {
                mainLikeButton = <span className='like_dislike' style={{float:'right'}} >&nbsp;&nbsp;&nbsp;<a  className='btn btn-primary'  onClick={() => this.props.like(question._id,this.state.mnemonics[this.state.defaultMnemonic]._id)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Like&nbsp;<span className="badge badge-pill badge-info"  >{question.score}</span></a></span>
            } 
            let mainTechniqueButton=<button className="btn btn-outline btn-primary"  style={{float:'right'}}  ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.props.setDiscoveryBlock('technique',this.state.mnemonics[this.state.defaultMnemonic].technique)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTechnique(this.state.mnemonics[this.state.defaultMnemonic].technique)} style={{float:'right'}}/><span className="hidden-sm-down" >{this.state.mnemonics[this.state.defaultMnemonic].technique}</span></button>
            return (<div   className="card-block mnemonics list-group">
                <div className='card-text'>
                    <b>Mnemonics</b>
                    {mainLikeButton}{mainTechniqueButton}
                    <pre  className='mnemonic' >{this.state.mnemonics[this.state.defaultMnemonic].mnemonic}</pre>
                    {otherMnemonics}
                </div>
            </div>);
        } else {
            return '';
        }
         
    };
}


 //{this.isVisible('mnemonic') && showRecallButton && <div  ref={(section) => { this.scrollTo.mnemonic = section; }}  className="card-block mnemonic">
                    //<div className='card-text'><b>Mnemonic</b><pre className='mnemonic' >{question.mnemonic}</pre></div>
                    //<div className='card-text' ><b>Technique</b><button className="btn btn-outline btn-primary"   > <span className="hidden-sm-down" >{question.mnemonic_technique}</span></button>{likeButton}</div>
                //</div>}
