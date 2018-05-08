import React, { Component } from 'react';
//import Utils from './Utils';
import 'whatwg-fetch'
import Ban from 'react-icons/lib/fa/ban';
import Search from 'react-icons/lib/fa/search';
import Plus from 'react-icons/lib/fa/plus';
import ThumbsUp from 'react-icons/lib/fa/thumbs-up';
import Edit from 'react-icons/lib/fa/edit';
import Trash from 'react-icons/lib/fa/trash';
import { confirmAlert } from 'react-confirm-alert'; // Import
import 'react-confirm-alert/src/react-confirm-alert.css' // Import css

export default class MnemonicsList extends Component {

    constructor(props) {
        super(props);
        const question = this.props.question;
        this.state={
           defaultMnemonic:'default', 
           mnemonics:{'default':{question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question}},
           suggest_mnemonic:'',
           suggest_technique:'',
           suggest_id:''
        }
        this.changeSuggest = this.changeSuggest.bind(this);
        this.loadMnemonics = this.loadMnemonics.bind(this);
        this.saveSuggestion = this.saveSuggestion.bind(this);
        this.createSuggestion = this.createSuggestion.bind(this);
        this.editSuggestion = this.editSuggestion.bind(this);
        this.deleteSuggestion = this.deleteSuggestion.bind(this);
        this.like = this.like.bind(this);
    };
    

    loadMnemonics(loadQuestion) {
        let that=this;
        let question=this.props.question;
        if (loadQuestion) {
            question=loadQuestion;
        }
        if (question) {
          fetch('/api/mnemonics',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                question: question._id
              })
          })
          .then(function(response) {
            //console.log(['got response', response])
            return response.json()
          }).then(function(json) {
                //console.log(['got response', json])
                let final={'default':{question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question}};
                  
                json.forEach(function(mnemonic) {
                    final[mnemonic._id] = mnemonic;
                });
               // console.log(['create MNEM indexes', final,that.props.user])
                let defaultMnemonic='default';
                if (that.props.user && that.props.user.selectedMnemonics && that.props.user.selectedMnemonics.hasOwnProperty(question._id) && that.props.user.selectedMnemonics[question._id].length > 0 && final.hasOwnProperty(that.props.user.selectedMnemonics[question._id])) {
                    defaultMnemonic = that.props.user.selectedMnemonics[question._id];
                }
                //console.log(['MNEMOLOAD',{defaultMnemonic:defaultMnemonic,mnemonics:final}]);
                that.setState({defaultMnemonic:defaultMnemonic,mnemonics:final});
          }).catch(function(ex) {
            console.log(['parsing failed', ex])
          })
        }

    };
    
    changeSuggest(e) {
       // console.log(['cs',e.target.name,e.target.value]);
        if (e.target.name && e.target.name==="suggest_mnemonic") {
            this.setState({suggest_mnemonic:e.target.value});
        } else {
            this.setState({suggest_technique:e.target.value});
        }
        
    };
    
    saveSuggestion(id,question,mnemonic,technique) {
        //let mnemonics = this.state.mnemonics;
        //mnemonics.unshift({question:question._id,mnemonic:mnemonic,technique:technique,questionText:question.question});
        
        this.props.saveSuggestion(this.state.suggest_id,this.props.question,this.state.suggest_mnemonic,this.state.suggest_technique).then(this.loadMnemonics);
        this.setState({suggest_id:'',suggest_mnemonic:'',suggest_technique:''});
    };

    componentWillReceiveProps(nextProps) {
       // console.log(['UPDATEMNEMLIST',nextProps.question]);
      const question = nextProps.question;        
      //this.setState({
           //defaultMnemonic:'default', 
           //mnemonics:{'default':{question:question._id,mnemonic:question.mnemonic,technique:question.mnemonic_technique,questionText:question.question}}
        //});  
        this.loadMnemonics(question);
    }
    //{question:'5abeec3d91ce1409b01e9553',mnemonic:'marshaled ..',technique:'association',questionText:'waht is marsh pln'}
    
    componentDidMount() {
      //  console.log(['mount mnem list',this.props.question,this.props.user]);
           //// load mnemonics
          //let user=this.props.user;
          this.loadMnemonics();
      //}
     
    };
    
    editSuggestion(mnemonic) {
        this.setState({suggest_id:mnemonic._id,suggest_mnemonic:mnemonic.mnemonic,suggest_technique:mnemonic.technique});
    };
    
    createSuggestion() {
        this.setState({suggest_mnemonic:'',suggest_technique:''});
        return true;
    };

    deleteSuggestion(mnemonic) {
        let that=this;
        fetch('/api/deletemnemonic',{
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                _id: mnemonic._id
              })
          })
          .then(function(response) {
              //console.log('DELETED');
              that.loadMnemonics();
          }).catch(function(ex) {
            console.log(['delete failed', ex])
          })
    };

    askDeleteSuggestion(key) {
            confirmAlert({
              title: 'Delete Suggested Mnemonic',
              message: `Are you sure?`,
              buttons: [
                {
                  label: 'Yes',
                  onClick: () => this.deleteSuggestion(key)
                },
                {
                  label: 'No'
                }
              ]
            })
        
    }; 

    like(questionId,mnemonicId) {
        //console.log(['like(',questionId,mnemonicId]);
        this.props.like(questionId,mnemonicId).then(this.loadMnemonics);
    };

    render() {
        let techniques = this.props.mnemonic_techniques.map((technique, key) => {
                return <option  key={key} value={technique}  >{technique}</option>
            })
        //let user=this.props.user;
        let question=this.props.question;
        let otherMnemonics = '';
       // console.log(['mnemoth ren',this.state.mnemonics]);
        if (this.state.mnemonics) {
            //if (this.state.mnemonics.length > 0) {
                //console.log(['mnemoth ren have len',this.state.mnemonics]);
                otherMnemonics = Object.keys(this.state.mnemonics).map((mnemonicId,key) => {
                    let mnemonic=this.state.mnemonics[mnemonicId]
                   // console.log(['MNN',mnemonic]);
                    let likeButton=''
                    if (this.props.isLoggedIn()) {
                        likeButton = <span className='like_dislike' >&nbsp;&nbsp;&nbsp;<a  className='btn btn-primary'  onClick={() => this.like(question._id,mnemonicId)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Select&nbsp;</a></span>
                    }  
                
                   // console.log(['mnemoth',key,mnemonic]);
                    if (mnemonicId !== this.state.defaultMnemonic) {
                        var techniqueButton = '';
                        if (mnemonic.technique && mnemonic.technique.length > 0) {
                            if (this.props.showRecallButton) {
                                techniqueButton = <button className="btn btn-outline btn-primary"   ><span className="hidden-sm-down" >&nbsp;{mnemonic.technique}&nbsp;</span></button>
                            } else {
                                techniqueButton = <button className="btn btn-outline btn-primary"   ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.props.setDiscoveryBlock('technique',mnemonic.technique)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTechnique(mnemonic.technique)} style={{float:'right'}}/><span className="hidden-sm-down" >&nbsp;{mnemonic.technique}&nbsp;</span></button>                            
                            }
                        }
                        //if (showRecallButton) {
                            //// remove search options from tech button
                        //}
                        
                        //{likeButton}
                        
                        return  <div className='row' key={mnemonicId} >
                           <div className='col-12' >
                            <hr/>
                            {(this.props.isAdmin() || (this.props.user && this.props.user._id == mnemonic.user)) && mnemonic._id && mnemonic._id.length > 0 && <span>

                                <button style={{float:'right'}}   onClick={() => this.askDeleteSuggestion(mnemonic)} className='btn btn-danger'><Trash size={26}  style={{float: 'left'}} /><span className="d-none d-md-inline-block">&nbsp;Delete&nbsp;</span></button>
                                <button style={{float:'right'}} data-toggle="modal" data-target="#suggestdialog" onClick={() => this.editSuggestion(mnemonic)} className='btn btn-primary'><Edit size={26}  style={{float: 'left'}} /><span className="d-none d-md-inline-block">&nbsp;Edit&nbsp;</span></button>
                                </span>
                            }
                            <div style={{float:'left'}} >{likeButton}&nbsp;{techniqueButton}</div>
                            
                            </div>
                            <pre  className='mnemonicalternative col-12 col-lg-5' >{mnemonic.mnemonic}</pre>
                            
                        </div>
                        
                    } else {
                        return '';
                    }
                })
            //}
           // console.log(['rebnmnlist',this.state.mnemonics,this.state.defaultMnemonic]);
            let mainLikeButton='';
            //if (this.props.isLoggedIn()) {
                //mainLikeButton = <span className='like_dislike'  >&nbsp;&nbsp;&nbsp;<a  className='btn btn-primary'  onClick={() => this.props.like(question._id,this.state.mnemonics[this.state.defaultMnemonic]._id)} ><ThumbsUp size={26}  style={{float: 'left'}} className="badge badge-pill badge-info"/>&nbsp;Like&nbsp;<span className="badge badge-pill badge-info"  >{question.score}</span></a></span>
            //} 
            var mainTechniqueButton = '';
            if (this.state.mnemonics[this.state.defaultMnemonic].technique && this.state.mnemonics[this.state.defaultMnemonic].technique.length > 0) {
                if (this.props.showRecallButton) {
                    mainTechniqueButton=<button className="btn btn-outline btn-primary"   ><span  >{this.state.mnemonics[this.state.defaultMnemonic].technique}</span></button>
                } else {
                    mainTechniqueButton=<button className="btn btn-outline btn-primary"   ><Ban size={28} className="badge badge-pill badge-info"  onClick={() => this.props.setDiscoveryBlock('technique',this.state.mnemonics[this.state.defaultMnemonic].technique)} /><Search size={28} className="badge badge-pill badge-info" onClick={() => this.props.setQuizFromTechnique(this.state.mnemonics[this.state.defaultMnemonic].technique)} style={{float:'right'}}/><span className="hidden-sm-down" >&nbsp;{this.state.mnemonics[this.state.defaultMnemonic].technique}&nbsp;</span></button>
                }
            }
            let selectedMnemonic=this.state.mnemonics[this.state.defaultMnemonic];
                        
            return (<div   className="card-block mnemonics list-group">
                <div className='card-text'>
                    {this.props.isLoggedIn() && <button  className='btn btn-success '  style={{float:'right'}} data-toggle="modal" data-target="#suggestdialog" onClick={this.createSuggestion} ><Plus size={26}  style={{float: 'left'}} /><span className="d-none d-md-inline-block">&nbsp;Suggest a Mnemonic&nbsp;</span></button>}
                    <b>Mnemonics</b>
                    <div id="suggestdialog" className="modal" tabIndex="-1" role="dialog">
                      <div className="modal-dialog" role="document">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title">Suggest a mnemonic for this question</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                              <span aria-hidden="true">&times;</span>
                            </button>
                          </div>
                          <div className="modal-body">
                            <div className='form-group'>    
                               <label htmlFor="suggest_mnemonic" ><b>Mnemonic&nbsp;</b> </label><textarea autoComplete="false" id="suggest_mnemonic" type='text' name='suggest_mnemonic' onChange={this.changeSuggest} value={this.state.suggest_mnemonic} className='form-control'></textarea>
                                <br/>
                            </div>
                            
                            <div className='form-inline'>    
                                 <label htmlFor="suggest_technique" ><b>Technique&nbsp;</b></label><select autoComplete="false" id="suggest_technique" type='text' name='suggest_technique' onChange={this.changeSuggest} value={this.state.suggest_technique} className='col-5 form-control' ><option/>{techniques}</select>
                                 <div className="col-1" ></div>
                            
                            </div>
                            <div className='form-group'>    
                            <br/>
                                  <button  data-toggle="modal" data-target="#suggestdialog" onClick={() => this.saveSuggestion()} className='btn btn-info'>&nbsp;Submit&nbsp;</button>     
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    
                    <div className='row' >
                        <pre  className='mnemonic col-12 col-lg-8' >{this.state.mnemonics[this.state.defaultMnemonic].mnemonic}</pre>
                         {this.state.defaultMnemonic !=="default" && (this.props.isAdmin() || this.props.user._id == selectedMnemonic.user) && selectedMnemonic._id && selectedMnemonic._id.length > 0 && <span>

                                <button style={{float:'right'}}   onClick={() => this.askDeleteSuggestion(selectedMnemonic)} className='btn btn-danger'><Trash size={26}  style={{float: 'left'}} /><span className="d-none d-md-inline-block">&nbsp;Delete&nbsp;</span></button>
                                <button style={{float:'right'}} data-toggle="modal" data-target="#suggestdialog" onClick={() => this.editSuggestion(selectedMnemonic)} className='btn btn-primary'><Edit size={26}  style={{float: 'left'}} /><span className="d-none d-md-inline-block">&nbsp;Edit&nbsp;</span></button>
                                </span>
                            }
                        <div className='col-12 col-lg-4' >&nbsp;{mainTechniqueButton}&nbsp;{mainLikeButton}</div>
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
