var removeDiacritics=require('./diacritics');
    
alexaUtils={
    canAnswer: function(val) {
        let answerParts=val.answer.split(' ');
        if (answerParts.length < 5 || (val.specific_answer && String(val.specific_answer).length > 0) || (val.also_accept && String(val.also_accept).length > 0)) {
            return true;
        } else {
            return false;
        }
    },
    munge:function (val) {
        if (val) {
            if (val.indexOf("mnemo's")==0) val = val.replace("mnemo's","nemo's");  // for ASR matching
            val = removeDiacritics(val);
            // replace some characters with space
            val = val.trim()
                .toLowerCase()
                .replace(/\//g, " ")
                .replace("..."," ")
                //.replace("["," ")
                //.replace("]"," ")
                .replace("{"," ")
                .replace("}"," ")
                .replace("("," ")
                .replace(")"," ")
                .replace("|"," ")
                .replace("+"," ")
                .replace("-"," ")
                .replace("&"," ")
                .replace("*"," ")
               // .replace(":"," ")
               // .replace(";"," ")
                .replace("~"," ")
                .replace("@"," ")
                .replace("#"," ")
                .replace("="," ")
                .replace("\r\n"," ")
                .replace("\n"," ");
            // strip
            //val = val.trim().replace(/[^0-9 'a-z]/gi, '');
            //val = val.slice(0,139).trim();
            return val.trim();
        } else {
            return ''
        }
    },
    strip:function (val) {
        if (val) {
            val = alexaUtils.munge(val).replace(/[^0-9 'a-z]/gi, '');
        }
        return val;
    },
    firstSentence: function (text) {
        text = text.replace('...',', ');
        if (text) {
            return String(text).split('.')[0];
        } else return '';
    },
    answer: function (question) {
        if (question) {
            //// if there is a specific answer that has been used as short form, return whole answer
            //if (question.specific_answer && question.specific_answer.length > 0) {
                //return question.specific_answer;
            //} else {
            return alexaUtils.firstSentence(question.answer)
            //}
        } else {
           return ''  
        }
    },
    attribution: function (question) {
        if (question) {
            return question.attribution;
            //}
        } else {
           return ''  
        }
    },
    moreInfo: function (question) {
        //console.log(['more info',question]);
        if (question) {
            // if there is a specific answer that has been used as short form, return whole answer
            // otherwise strip first sentence and trailing commentary
            let text=question.answer;
            if (text) {
                //if (alexaUtils.strip(question.specific_answer) === alexaUtils.strip(question.answer) ) {
                    //return '';
                //}
                // strip first sentence if only if we didn't use specific answer as answer
                if (question.specific_answer && question.specific_answer.length > 0) {
                    return '';
                } else {
                    text = text.replace('...',', ');
                    if (text.indexOf('.')!==-1) {
                        let startAt = text.indexOf('.')+1;
                        if (startAt > 0) {
                            text = text.slice(startAt);
                        }
                    } else {
                        return '';
                    }
                    
                    let endAt = text.indexOf("\n---") - 1;
                    if (endAt > 0) {
                        return String(text).slice(0,endAt).trim();
                    } else {
                       return text;
                    }
                }
            } else {
                return '';
            }                   
        } else {
            return '';
        }
    },

    limit140:function (val) {
        if (val) {
            val = val.slice(0,139).trim();
        }
        return val;
    },
    speakable:function (val) {
        if (val) {
            val = val.trim().replace(/[^0-9 'a-z,.;:?]/gi, '');
        }
        return val;
    }
    
}
module.exports=alexaUtils;
