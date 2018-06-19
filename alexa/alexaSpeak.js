var alexaUtils = require('./alexautils'); 
var Speech = require('ssml-builder');
var AmazonSpeech = require('ssml-builder/amazon_speech');

let alexaSpeak = {    

    // VIEWS
    readQuestion: function (question,request,responser) {
        var response = new AmazonSpeech()
        if (question) {
            if (question.specific_question) {
                response.say(alexaUtils.speakable(question.specific_question))
            } else if (question.question) {
                if (question.interrogative) {
                    response.say(alexaUtils.speakable(question.interrogative))
                }
                response.say(alexaUtils.speakable(question.question))
            }
             if (question.specific_answer) {
                response.pause('800ms').say('The answer is ').pause('200ms').say(alexaUtils.speakable(question.specific_answer));
            } else if (question.answer) {
                response.pause('800ms').say('The answer is ').pause('200ms').say(alexaUtils.speakable(alexaUtils.answer(question)));
            }
            if (question.mnemonic) {
                response.pause('800ms').say('The mnemonic is ').pause('200ms').say(alexaUtils.speakable(question.mnemonic)).pause('200ms')
            }
            responser.say(response.ssml());
        }
    },

    readAnswer: function (question,request,response) {
        response.say('The answer is ')
        response.say(alexaUtils.speakable(alexaUtils.answer(question)));
    },

    readAnswerLetters: function (question,request,response) {
        if (question) {
            if (question.specific_answer) {
                let answer=alexaUtils.strip(question.specific_answer);
                // just the first two words with spaces between each letter
                answer=answer.split(' ').slice(0,2).join(' ').split().join(' ');
                response.say(answer);            
            } else if (question.answer) {
                let answer=alexaUtils.strip(alexaUtils.firstSentence(question.answer));
                // just the first two words with spaces between each letter
                answer=alexaUtils.strip(question.answer).split(' ').slice(0,1).join(' ').split().join(' ');
                response.say(answer);            
            }
        }
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
        responser.say(response.ssml());
    }
}
module.exports=alexaSpeak
