import React, { Component } from 'react';
import Check from 'react-icons/lib/fa/check';
import ArrowRight from 'react-icons/lib/fa/arrow-right';
import ArrowLeft from 'react-icons/lib/fa/arrow-left';
import Trash from 'react-icons/lib/fa/trash';
import Info from 'react-icons/lib/fa/info';
import Ellipsis from 'react-icons/lib/fa/ellipsis-v';

export default class QuizActionButtons extends Component {
    render() {
        console.log(['QAB',this.props.currentPage]);
        let visible=this.props.currentPage === "review" || this.props.currentPage === "home" ? true : false;
        let showRecallButton=this.props.currentPage === "review"  ? true : false;
       
        if (!visible) {
            return '';
        } else {
            return <div className="row buttons justify-content-between" style={{width: '100%'}}>
            <button className="col-1 btn btn-outline btn-info" onClick={() => this.props.handleQuestionResponse(this.props.question,'list')} ><Ellipsis size={25} />&nbsp;</button>
            <button className="col-2 btn btn-outline btn-info" onClick={() => this.props.handleQuestionResponse(this.props.question,'previous')} ><ArrowLeft size={25} /><span className="d-none d-md-inline-block" >&nbsp;Prev&nbsp;</span></button>
            <div className='col-1'>&nbsp;</div>
            <button className="col-2 btn btn-outline btn-info" onClick={() => this.props.handleQuestionResponse(this.props.question,'next')}><ArrowRight size={25} /><span className="d-none d-md-inline-block"> Next</span></button>
            {showRecallButton && <button className="col-3 btn btn-outline btn-success" onClick={() => this.props.handleQuestionResponse(this.props.question,'success')}><Check size={25} /><span className="d-none d-md-inline-block"> Recall</span></button>}
            <div className='col-1'>&nbsp;</div>
            {<button className="col-2 btn btn-outline btn-danger" onClick={() => this.props.handleQuestionResponse(this.props.question,'block')} ><Trash size={25} /><span className="d-none d-md-inline-block"> Bin</span></button>}
            
            </div>
        }
    }
}
