var alexaUtils = require('./alexautils'); 
var __ = require('./speechStrings'); 
var Speech = require('ssml-builder');
var AmazonSpeech = require('ssml-builder/amazon_speech');
var config = require("../config")

let alexaSpeak = {    

    askNextAction(question,request,responser) {
        var response = new AmazonSpeech()
        response.pause('1800ms');
        let session = request.getSession();
        if (session.get('mode')==='review' ) {
            let trigger = alexaSpeak.askQuestion(question,request,responser);
            responser.shouldEndSession(false,trigger)
            session.set('confirmAction','recall')
            session.set('denyAction','answerandmnemonic')
            responser.say(response.ssml());
        } else {
            response.say(__('Do you want another question?'))
            responser.shouldEndSession(false,__('Do you want another question?'))
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            responser.say(response.ssml());
        } 
        
    },

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
            if (question.media_mp3lq && question.media_mp3lq.length > 0 && question.autoplay_media==="YES") {
                response.audio(question.media_mp3lq);
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
    // short form
    sayQuestion: function (question,request,responser) {
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
            if (question.media_mp3lq && question.media_mp3lq.length > 0 && question.autoplay_media==="YES") {
                response.audio(question.media_mp3lq);
            }
            responser.say(response.ssml());
        }
    },

    readAnswer: function (question,request,responser) {
        var response = new AmazonSpeech()
        response.say(__('The answer is '))
        response.say(alexaUtils.speakable(alexaUtils.answer(question)));
        response.pause("1800ms");
        responser.say(response.ssml());
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
                response.pause('800ms').say(__('The mnemonic is ')).pause('200ms').prosody({rate: 'slow'},alexaUtils.speakable(question.mnemonic)).pause('200ms')
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

    readMnemonic: function (question,request,responser) {
        var response = new AmazonSpeech()
        if (question) {
            let mnemonic = question.mnemonic ? question.mnemonic : '';
            response.prosody({rate: 'slow'},alexaUtils.speakable(mnemonic));
        }
        responser.say(response.ssml());
    },
    askQuestion: function (question,request,responser) {
        var response = new AmazonSpeech()
        response.pause('500ms');
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
        if (question.media_mp3lq && question.media_mp3lq.length > 0 && question.autoplay_media==="YES") {
            console.log(['ASK '+ question.media_mp3lq]);
            response.audio(question.media_mp3lq);
        }
        response.audio("https://s3.amazonaws.com/ask-soundlibrary/foley/amzn_sfx_clock_ticking_long_01.mp3");
        response.pause('500ms');
        let trigger = __('what is the answer ?');
        if (alexaUtils.canAnswer(question)) {
            response.say(trigger)
        } else {
            trigger = __('Do you remember ?');
            response.say(trigger)
        }
        responser.say(response.ssml());
        return trigger;
    }
}
module.exports=alexaSpeak
