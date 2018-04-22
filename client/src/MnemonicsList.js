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

    componentWillReceiveProps(nextProps) {
      const question = nextProps.question;
        
      this.setState({
           defaultMnemonic:'default', 
           mnemonics:{'default':{question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question}}
        });  
    }
    //{question:'5abeec3d91ce1409b01e9553',mnemonic:'marshaled ..',technique:'association',questionText:'waht is marsh pln'}
    
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
              console.log(['got response', json])
              let final={'default':{question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question}};
              
            json.forEach(function(mnemonic) {
                final[mnemonic._id] = mnemonic;
            });
            console.log(['create MNEM indexes', final])
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
        console.log(['mnemoth ren',this.state.mnemonics]);
        if (this.state.mnemonics) {
            //if (this.state.mnemonics.length > 0) {
                //console.log(['mnemoth ren have len',this.state.mnemonics]);
                otherMnemonics = Object.keys(this.state.mnemonics).map((mnemonicId,key) => {
                    let mnemonic=this.state.mnemonics[mnemonicId]
                    console.log(['MNN',mnemonic]);
                    let likeButton=''
                    if (this.props.isLoggedIn()) {
                        likeButton = <span className='like_dislike' >&nbsp;&nbsp;&nbsp;<a  className='btn btn-primary'  onClick={() => this.props.like(question._id,mnemonic._id)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Like&nbsp;<span className="badge badge-pill badge-info"  >{question.score}</span></a></span>
                    }  
                
                    console.log(['mnemoth',key,mnemonic]);
                    if (mnemonicId !== this.state.defaultMnemonic) {
                        var techniqueButton = '';
                        if (this.props.showRecallButton) {
                            techniqueButton = <button className="btn btn-outline btn-primary"   ><span className="hidden-sm-down" >{question.mnemonic_technique}</span></button>
                        } else {
                            techniqueButton = <button className="btn btn-outline btn-primary"   ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.props.setDiscoveryBlock('technique',question.mnemonic_technique)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTechnique(question.mnemonic_technique)} style={{float:'right'}}/><span className="hidden-sm-down" >{question.mnemonic_technique}</span></button>                            
                        }
                        // if (showRecallButton) {
                            //// remove search options from tech button
                        //}
                        
                        //{likeButton}
                        return  <div className='row' key={mnemonicId} >
                                    <pre  className='mnemonicalternative col-12 col-lg-8' >{mnemonic.mnemonic}}</pre>
                                    <div className='col-12 col-lg-4' >{techniqueButton}&nbsp;{likeButton}</div>
                                </div>
                        
                    } else {
                        return '';
                    }
                })
            //}
            console.log(['rebnmnlist',this.state.mnemonics,this.state.defaultMnemonic]);
            let mainLikeButton='';
            if (this.props.isLoggedIn()) {
                mainLikeButton = <span className='like_dislike'  >&nbsp;&nbsp;&nbsp;<a  className='btn btn-primary'  onClick={() => this.props.like(question._id,this.state.mnemonics[this.state.defaultMnemonic]._id)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Like&nbsp;<span className="badge badge-pill badge-info"  >{question.score}</span></a></span>
            } 
            var mainTechniqueButton = '';
            if (this.props.showRecallButton) {
                mainTechniqueButton=<button className="btn btn-outline btn-primary"   ><span className="hidden-sm-down" >{this.state.mnemonics[this.state.defaultMnemonic].technique}</span></button>
            } else {
                mainTechniqueButton=<button className="btn btn-outline btn-primary"   ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.props.setDiscoveryBlock('technique',this.state.mnemonics[this.state.defaultMnemonic].technique)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTechnique(this.state.mnemonics[this.state.defaultMnemonic].technique)} style={{float:'right'}}/><span className="hidden-sm-down" >{this.state.mnemonics[this.state.defaultMnemonic].technique}</span></button>
            }
            return (<div   className="card-block mnemonics list-group">
                <div className='card-text'>
                    <b>Mnemonics</b>
                    <div className='row' >
                        <pre  className='mnemonic col-12 col-lg-8' >{this.state.mnemonics[this.state.defaultMnemonic].mnemonic}</pre>
                        <div className='col-12 col-lg-4' >{mainTechniqueButton}&nbsp;{mainLikeButton}</div>
                    </div>
                    {otherMnemonics}
                </div>
                <br/>
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
