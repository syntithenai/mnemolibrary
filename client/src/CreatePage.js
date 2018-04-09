import React, { Component } from 'react';
//const config=require('../../config');


export default class CreatePage extends Component {
    
    constructor(props) {
        super(props);
        this.saveQuestion = this.saveQuestion.bind(this);
        this.change = this.change.bind(this);
        this.hideHelp = this.hideHelp.bind(this);
        this.showHelp = this.showHelp.bind(this);
        let question = this.props.question ? this.props.question : {};
        this.state = {
            warning_message: '',
            question : {
                _id: question._id?question._id:'',
                interrogative: question.interrogative?question.interrogative:'',
                question:question.question?question.question:'',
                mnemonic:question.mnemonic?question.mnemonic:'',
                technique:question.technique?question.technique:'',
                answer:question.answer?question.answer:'',
                topic:question.topic?question.topic:'',
                link:question.link?question.link:'', 
                tags:question.tags?question.tags:''
            },
            showHelp:false,
        }
        
       // console.log(['constr',this.state]);
    
    };
    
    saveQuestion(e) {
        e.preventDefault();
        var that = this;
        that.setState({'warning_message':''});
        //console.log('save user ',this.state.user);
        var data = {...this.state.question}
        this.props.saveQuestion(data,this);  
            
    };
    
    change(e) {
        let state = {...this.state.question};
        var key = e.target.name;
        state[key] =  e.target.value;
       // console.log(['CHANGE',state]);
        this.setState({'question':state});
        return true;
    };
    
    showHelp(e) {
        this.setState({showHelp:true});
        return false;
    };
    hideHelp(e) {
        this.setState({showHelp:false});
        return false;
    };
    
    render() {
        return (
        <div >
        
              Mnemos Library is just getting started and we want your help. <br/>  
              <b>Coming soon</b> you will be able to add your own questions and mnemonics.<br/>
              In the meantime, please email your ideas <a href='mailto:mnemoslibrary@gmail.com' >here.</a>
              
        </div>
        )
    };
    
    erender() { //req,vars/
        if (this.state.showHelp) {
            return (
                <div className="row">
                    <div className="col-12  card">
                    <form>
                    <h3 className="card-title">Submission Help</h3>
                    <a  href='#' onClick={() => this.hideHelp()} className='btn btn-info ' style={{'float':'right'}}>
                       Close
                      </a>
                    blah balh
                    </form>
                    </div>
                </div>
            )
             
        } else {
            let techniques = this.props.mnemonic_techniques.map((technique, key) => {
              
              return <option  key={key} value={technique}  >{technique}</option>
            })
            return (
            
            // TAGS https://www.npmjs.com/package/react-tag-autocomplete
                <div className="questionform">
                    
                        <form method="POST" onSubmit={this.saveUser} className="form-group" autoComplete="false" >
                          <h3 className="card-title">Create A Question</h3>
                          <a  href='#' onClick={() => this.showHelp()} className='btn btn-info ' style={{'float':'right'}}>
                       Help
                      </a>
                      <div className="row" >
                        <div className='col-12  warning-message'>{this.state.warning_message}</div>
                         <div className='col-12' ><label htmlFor="topic" className='row'>Topic </label><b>{this.state.question.topic}</b></div>
                            
                            
                        <div className='col-12 col-md-6'>
                            <label htmlFor="interrogative" className='row'>Interrogative </label><input autoComplete="false" id="interrogative" type='text' name='v' onChange={this.change} value={this.state.question.interrogative} />
                            
                            <label htmlFor="question" className='row'>Question </label><textarea autoComplete="false" id="question" type='text' name='question' onChange={this.change} value={this.state.question.question} ></textarea>
                            
                            <label htmlFor="answer" className='row'>Answer </label><textarea autoComplete="false" id="answer" type='text' name='answer' onChange={this.change} value={this.state.question.answer} ></textarea>
                            <label htmlFor="link" className='row'>Link </label><input autoComplete="false" id="link" type='text' name='link' onChange={this.change} value={this.state.question.link} />
                            
                        </div><div className='col-12 col-md-6'>    
                            <label htmlFor="mnemonic" className='row'>Mnemonic </label><textarea autoComplete="false" id="mnemonic" type='text' name='mnemonic' onChange={this.change} value={this.state.question.mnemonic}></textarea>
                            
                            <label htmlFor="technique" className='row'>Technique </label><select autoComplete="false" id="technique" type='text' name='technique' onChange={this.change} value={this.state.question.technique} ><option/>{techniques}</select>
                            
                            
                            
                            
                            <label htmlFor="tags" className='row'>Tags </label><input autoComplete="false" id="tags" type='text' name='tags' onChange={this.change} value={this.state.question.tags} />
                            
                            
                            <br/>
                            <br/>
                            <button  className='btn btn-info'>Save</button>
                        </div>
                    </div>
                    </form>
                    <br/>
            </div>
            )
            
        }
        
    }
    

}
