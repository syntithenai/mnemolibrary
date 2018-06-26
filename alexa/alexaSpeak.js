var alexaUtils = require('./alexautils'); 
var __ = require('./speechStrings'); 
var Speech = require('ssml-builder');
var AmazonSpeech = require('ssml-builder/amazon_speech');

let alexaSpeak = {    

    // VIEWS
    readQuestion: function (question,request,responser) {
        var response = new AmazonSpeech()
        if (question) {
            if (question.specific_question) {
                response.say(alexaUtils.speakable(question.specific_question)+".")
            } else if (question.question) {
                if (question.interrogative) {
                    response.say(alexaUtils.speakable(question.interrogative))
                }
                response.say(alexaUtils.speakable(question.question)+".")
            }
            if (alexaUtils.attribution(question).length > 0) {
                response.say('From '+alexaUtils.speakable(alexaUtils.attribution(question))+", ") //.pause('100ms')
            }
            if (question.specific_answer) {
                response.pause('800ms').say(__('The answer is ')).pause('200ms').say(alexaUtils.speakable(question.specific_answer));
            } else if (question.answer) {
                response.pause('800ms').say(__('The answer is ')).pause('200ms').say(alexaUtils.speakable(alexaUtils.answer(question)));
            }
            if (question.mnemonic) {
                response.pause('800ms').say(__('The mnemonic is ')).pause('200ms').say(alexaUtils.speakable(question.mnemonic)).pause('200ms')
            }
            //response.pause('10000ms');
            responser.say(response.ssml());
        }
    },

    readAnswer: function (question,request,response) {
        response.say(__('The answer is '))
        response.say(alexaUtils.speakable(alexaUtils.answer(question)));
    },
    readAnswerAndMnemonic: function (question,request,responser) {
        var response = new AmazonSpeech()
        if (question) {
            if (alexaUtils.attribution(question).length > 0) {
                response.say('From '+alexaUtils.speakable(alexaUtils.attribution(question))+", ") //.pause('100ms')
            }
            if (question.specific_answer) {
                response.pause('800ms').say(__('The answer is ')).pause('200ms').say(alexaUtils.speakable(question.specific_answer));
            } else if (question.answer) {
                response.pause('800ms').say(__('The answer is ')).pause('200ms').say(alexaUtils.speakable(alexaUtils.answer(question)));
            }
            if (question.mnemonic) {
                response.pause('800ms').say(__('The mnemonic is ')).pause('200ms').say(alexaUtils.speakable(question.mnemonic)).pause('200ms')
            }
            //response.pause('10000ms');
            responser.say(response.ssml());
        }
    },
    readAnswerLetters: function (question,request,responser) {
        var response = new AmazonSpeech()
        
        if (question) {
            if (question.specific_answer) {
                let answer=alexaUtils.strip(question.specific_answer);
                // just the first two words with spaces between each letter
                answer=answer.split(' ').slice(0,2).join(' '); //.split().join(' ');
                response.sayAs({
                  word: answer,
                  interpret: "spell-out"
                })
            } else if (question.answer) {
                let answer=alexaUtils.strip(alexaUtils.firstSentence(question.answer));
                // just the first two words with spaces between each letter
                answer=alexaUtils.strip(question.answer).split(' ').slice(0,1).join(' '); //.split().join(' ');
                response.sayAs({
                  word: answer,
                  interpret: "spell-out"
                })
            }
        }
        responser.say(response.ssml());
    },
    readQuestionLetters: function (question,request,responser) {
        var response = new AmazonSpeech()
        
        if (question) {
            if (question.question) {
                let questionA=alexaUtils.strip(alexaUtils.firstSentence(question.question));
                // just the first two words with spaces between each letter
                questionA=alexaUtils.strip(questionA).split(' ').slice(0,3).join(' '); //.split().join(' ');
                response.sayAs({
                  word: questionA,
                  interpret: "spell-out"
                })
            }
        }
        responser.say(response.ssml());
    },

    readMoreInfo: function (question,request,response) {
        if (question && question.answer) {
            response.say(alexaUtils.speakable(alexaUtils.moreInfo(question)));
        }
    },

    readMnemonic: function (question,request,response) {
        if (question) {
            let mnemonic = question.mnemonic ? question.mnemonic : '';
            response.say(alexaUtils.speakable(mnemonic));
        }
    },
    askQuestion: function (question,request,responser) {
        var response = new AmazonSpeech()
        if (question.specific_question) {
            response.say(alexaUtils.speakable(question.specific_question))
        } else if (question.question) {
            if (question.interrogative) {
                response.say(alexaUtils.speakable(question.interrogative))
            }
            if (question.question) {
                response.say(alexaUtils.speakable(question.question))
            }
        }
        response.say("<audio src='https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3'/>");
        response.pause('500ms');
        if (alexaUtils.canAnswer(question)) {
            response.say(__('what is the answer ?'))
        } else {
            response.say(__('Do you remember ?'))
        }
        responser.say(response.ssml());
    }
}
module.exports=alexaSpeak
