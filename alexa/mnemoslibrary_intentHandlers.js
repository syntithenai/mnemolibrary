var levenshtein = require('fast-levenshtein');
var config = require("../config")
var utils= require('./alexautils'); 
var alexaSpeak=require('./alexaSpeak')

//let talisman = require('talisman/metrics/distance/eudex');
//let distance=talisman.distance;
//console.log(['talisman'])
//console.log(talisman)

const database = require('../oauth/database');
database.connect();
let db = null;    
try {
    // ugg mongoose and raw connections
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(config.databaseConnection, (err, client) => {
      if (err) return console.log(err)
      db = client.db(config.database)       
    })
} catch (e) {}
 
const databaseFunctions = require('./database');
const closest= require('./closest');


var mqtt = require('mqtt')
//var client  = mqtt.connect('wss://mosquitto:9001')
var client  = mqtt.connect('mqtt://mosquitto',{clientId: 'alexa_' + Math.random().toString(16).substr(2, 8),keepalive: 10000})
//var client  = mqtt.connect('wss://mongo')

console.log('MQTT INIT');
client.on('connect', function () {
    console.log('MQTT CONNECT');
  client.subscribe('presence')
 // client.publish('presence', 'Hello mqtt alex')
})

client.on('message', function (topic, message) {
  // message is Buffer
  console.log('MQTT MESSAGE');
  console.log(message.toString())
})

client.on('error', function (error) {
  // message is Buffer
  console.log('MQTT Error');
  console.log(error.toString())
  console.log(error)
  //client.end()
})

client.on('reconnect', function (error) {
 console.log('MQTT reconnect');
})


// put filter slots into session
    // AND do soundex matching on filter
    // @return Object with fields re soundex matching
function setDiscoveryFilters(request,response) {
    let session = request.getSession();
    let tagFilter = null
    let topicFilter = null
    console.log(['setDiscoveryFilters',request.slots['TOPIC'],request.slots['TAG']]);
    if (request.slots['TOPIC'] && request.slots['TOPIC'].value)  {
        session.set('topicFilter',request.slots['TOPIC'].value);
        topicFilter=closest.topic(request.slots['TOPIC'].value);
    } else if (request.slots['TAG'] && request.slots['TAG'].value)  {
        session.set('tagFilter',request.slots['TAG'].value);
        tagFilter = closest.tag(request.slots['TAG'].value);
    }
    return {tagFilter:tagFilter,topicFilter:topicFilter};
}

function setReviewFilters(request,response) {
    let session = request.getSession();
    let tagFilter = null
    let topicFilter = null
    console.log(['setReviewFilters',request.slots['TOPIC'],request.slots['TAG']]);
    if (request.slots['TOPIC'] && request.slots['TOPIC'].value)  {
        session.set('reviewTopicFilter',request.slots['TOPIC'].value);
        topicFilter=closest.topic(request.slots['TOPIC'].value);
    } else if (request.slots['TAG'] && request.slots['TAG'].value)  {
        session.set('reviewTagFilter',request.slots['TAG'].value);
        tagFilter = closest.tag(request.slots['TAG'].value);
    }
    return {tagFilter:tagFilter,topicFilter:topicFilter};
}


let intentHandlers ={
    launch: function(request, response) {
        //console.log('LAUNCH');
        let reprompt = "Do you want to Discover Nemo's questions or start a review";
        let now = new Date();
       // console.log(['DISCOVER',request.sessionDetails.accessToken]);
        return databaseFunctions.getUser(db,database,request,response).then(function(user) {
            //console.log('LAUNCHED',user);
            if (user) {
                // intentHandlers.yes(request,response);
                 let nameParts=user.name.split(' ');
                 response.say('Hi '+alexaUtils.speakable(nameParts[0])+". "+reprompt);
                 response.shouldEndSession(false, reprompt )
                 return response.send();
            } else {
                response.say("Hi. Welcome to Nemo's Library. "+ reprompt);
                response.shouldEndSession(false, reprompt )
                return response.send();                
            }
        });        
    },
    yes: function(request,response) {
        // if session.confirmAction then run that action
        let session = request.getSession();
        session.set('denyAction',null)
        let confirmAction = session.get('confirmAction')
        
        if (confirmAction) {
            console.log('confirm '+confirmAction);
            if (intentHandlers.hasOwnProperty(confirmAction)) {
                //console.log('confirm action exists');
                return intentHandlers[confirmAction](request,response)
            }
        }
    },
    no: function(request,response) {
        let session = request.getSession();
        session.set('confirmAction',null)
        let denyAction = session.get('denyAction')
        if (denyAction) {
            console.log('deny '+denyAction);
            if (intentHandlers.hasOwnProperty(denyAction)) {
                session.set('denyAction',null)
                return intentHandlers[denyAction](request,response)
            }
        } else {
            response.say('Do you want another question')
            response.shouldEndSession(false,'Do you want another question')
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            return response.send();  
        }
    },
    bye: function(request,response) {
        // clear session.confirmAction
        response.say('Bye');
        response.shouldEndSession(true)
        return response.send();                            
    },
    discover: function(request, response) {
        //client.publish('presence', 'discover')
        // set mode to discover
        let session = request.getSession();
        session.set('denyAction',null)
        session.set('confirmAction',null)
        session.set('mode','discover')
        let status=setDiscoveryFilters(request,response);
        // only on requests where slots exists but are not exact match
        console.log(status);
        //return;
        if ((status.tagFilter && status.tagFilter.seek && !status.tagFilter.match) ||  (status.topicFilter && status.topicFilter.seek && !status.topicFilter.match)) {
            session.set('confirmAction','discover')
            if (status.topicFilter)  {
                response.say("Couldn't find "+alexaUtils.speakable(status.topicFilter.seek));
                response.say('Did you mean '+alexaUtils.speakable(status.topicFilter.text));
                session.set('topicFilter',status.topicFilter.text);
                session.set('confirmAction','discover')
                response.shouldEndSession(false,'Should I search for '+alexaUtils.speakable(status.topicFilter.text))
            } else if (status.tagFilter)  {
                response.say("Couldn't find "+alexaUtils.speakable(status.tagFilter.seek));
                response.say('Did you mean '+alexaUtils.speakable(status.tagFilter.text));
                session.set('confirmAction','discover')
                session.set('tagFilter',status.tagFilter.text);
                response.shouldEndSession(false,'Should I search for '+alexaUtils.speakable(status.tagFilter.text))
            }
        } else {
            // yay discover
            return databaseFunctions.nextDiscoveryQuestion(db,database,request,response).then(function(questions) {
                //console.log(['then',questions]);
                let question=questions[0];
                if (question) {
                    session.set('currentQuestion',question)
                    // speak the question, the mnemonic and the short answer
                    client.publish('presence', JSON.stringify({from:'alexa',action:'discover',question:question._id} ))
                    alexaSpeak.readQuestion(question,request,response);
                    // mark question as seen
                    databaseFunctions.logStatus(db,database,'seen',question._id,request,response);
                    if (alexaUtils.moreInfo(question).length == 0) {
                        response.shouldEndSession(false,'Do you want another question')
                        session.set('confirmAction','discover')
                        session.set('denyAction','bye')
                        return response.send();                
                    } else {
                        response.say('Would you like more information');
                        response.shouldEndSession(false,'Would you like more information')
                        session.set('confirmAction','moreinfo')
                        session.set('denyAction','next_question')
                        return response.send();                
                    }
                } else {
                    session.set('currentQuestion',null)
                    if (session.get('tagFilter')) {
                        response.say('I had a problem finding a question matching '+alexaUtils.speakable(session.get('tagFilter')));
                        response.say('Would you like to search again without a filter');
                        response.shouldEndSession(false,'Would you like to try a random question')
                        session.set('tagFilter',null)
                        session.set('topicFilter',null)
                        session.set('confirmAction','discover')
                        session.set('denyAction','bye')
                    } else if (session.get('topicFilter')) {
                        response.say('I had a problem finding a question matching '+alexaUtils.speakable(session.get('topicFilter')));
                        response.say('Would you like to search again without a filter');
                        response.shouldEndSession(false,'Would you like to try a random question')
                        session.set('tagFilter',null)
                        session.set('topicFilter',null)
                        session.set('confirmAction','discover')
                        session.set('denyAction','bye')
                    } else {
                        // system error or seen all questions
                        response.say('I had a problem finding a question sorry. Try again later.');
                        response.shouldEndSession(true)
                    }
                    return response.send();                
                    
                }
            });
        }
        
    },
    //rediscover: function(request,response) {
        //let session = request.getSession();
        //session.set('rediscover',true)
        //return databaseFunctions.getReviewQuestions(db,database,request,response).then(function(questions) {
            //if (questions.length > 0) {
                //response.say("Starting review with "+questions.length+' questions.');
                //session.set('questions',questions);
                //session.set('currentQuestion',null);
                //return intentHandlers.review(request,response);                    
            //} else {
                //// couldn't find any questions matching ...
                 //session.set('currentQuestion',null)
                //if (session.get('reviewTagFilter')) {
                    //response.say('No questions matching tag '+alexaUtils.speakable(session.get('reviewTagFilter'))+' available for review ');
                    //response.say('Would you like to review all questions');
                    //response.shouldEndSession(false,'Would you like to review all questions')
                    //session.set('reviewTagFilter',null)
                    //session.set('confirmAction','start_review')
                    //session.set('denyAction','bye')
                //} else if (session.get('reviewTopicFilter')) {
                    //response.say('No questions matching topic '+alexaUtils.speakable(session.get('reviewTopicFilter'))+' available for review ');
                    //response.say('Would you like to review all questions');
                    //response.shouldEndSession(false,'Would you like to review all questions')
                    //session.set('reviewTopicFilter',null)
                    //session.set('confirmAction','start_review')
                    //session.set('denyAction','bye')
                //} else {
                    //// system error or seen all questions
                    //response.say('No questions currently available for review  . Would you like to discover new questions.');
                    //session.set('confirmAction','discover')
                    //response.shouldEndSession(false,'Do you want to start discovery')
                    //session.set('denyAction','bye')
                //}
                //return response.send();
            //}
        //});
    //},
    start_review: function(request,response) {
        // set mode to review
        let session = request.getSession();
        session.set('denyAction',null)
        session.set('confirmAction',null)
        session.set('mode','review')
        
        let status=setReviewFilters(request,response);
        // only on requests where slots exists but are not exact match
        console.log(status);
        if ((status.tagFilter && status.tagFilter.seek && !status.tagFilter.match) ||  (status.topicFilter && status.topicFilter.seek && !status.topicFilter.match)) {
            session.set('confirmAction','discover')
            if (status.topicFilter)  {
                response.say("Couldn't find "+alexaUtils.speakable(status.topicFilter.seek));
                response.say('Did you mean '+alexaUtils.speakable(status.topicFilter.text));
                session.set('confirmAction','discover')
                session.set('topicFilter',status.topicFilter.text);
                response.shouldEndSession(false,'Should I search for '+alexaUtils.speakable(status.topicFilter.text))
            } else if (status.tagFilter)  {
                response.say("Couldn't find "+alexaUtils.speakable(status.tagFilter.seek));
                response.say('Did you mean '+alexaUtils.speakable(status.tagFilter.text));
                session.set('tagFilter',status.tagFilter.text);
                session.set('confirmAction','discover')
                response.shouldEndSession(false,'Should I search for '+alexaUtils.speakable(status.tagFilter.text))
            }
        } else {
            return databaseFunctions.getReviewQuestions(db,database,request,response).then(function(questions) {
                if (questions.length > 0) {
                    response.say("Starting review with "+questions.length+' questions.');
                    session.set('questions',questions);
                    session.set('currentQuestion',null);
                    return intentHandlers.review(request,response);                    
                } else {
                    // couldn't find any questions matching ...
                     session.set('currentQuestion',null)
                    if (session.get('reviewTagFilter')) {
                        response.say('No questions matching tag '+alexaUtils.speakable(session.get('reviewTagFilter'))+' available for review ');
                        response.say('Would you like to review all questions');
                        response.shouldEndSession(false,'Would you like to review all questions')
                        session.set('reviewTagFilter',null)
                        session.set('reviewTopicFilter',null)
                        session.set('confirmAction','start_review')
                        session.set('denyAction','bye')
                    } else if (session.get('reviewTopicFilter')) {
                        response.say('No questions matching topic '+alexaUtils.speakable(session.get('reviewTopicFilter'))+' available for review ');
                        response.say('Would you like to review all questions');
                        response.shouldEndSession(false,'Would you like to review all questions')
                        session.set('reviewTagFilter',null)
                        session.set('reviewTopicFilter',null)
                        session.set('confirmAction','start_review')
                        session.set('denyAction','bye')
                    } else {
                        // system error or seen all questions
                        response.say('No questions currently available for review  . Would you like to discover new questions.');
                        session.set('confirmAction','discover')
                        response.shouldEndSession(false,'Do you want to start discovery')
                        session.set('denyAction','bye')
                    }
                    return response.send();
                }
            });
            
        }
    },
    review: function(request,response) {
        // set mode to review
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        console.log('REV');
        // try get next question
        // no question then say review complete
        // else deliver question
        if (session.get('questions') && session.get('questions').length > 0) {
            console.log('REVq');
            let currentQuestion=session.get('currentReviewQuestion')
            if (currentQuestion && parseInt(currentQuestion,10)>0) {
                currentQuestion+=1;
            } else {
                currentQuestion=1;
            }
            session.set('currentReviewQuestion',currentQuestion)
            console.log('REV'+currentQuestion);
            if (currentQuestion>session.get('questions').length) {
                // quiz complete
                response.say("You've finished this review set. Do you want to review more or discover new questions");
                response.shouldEndSession(false,'Discover or review ?')
                session.set('currentQuestion',null)
                session.set('currentReviewQuestion',null)
                session.set('questions',null)
            } else {
                //console.log(['REV',session.get('questions')]);
                let question=session.get('questions')[currentQuestion-1];
                console.log(question);
                if (question) {
                    console.log('yes question');
                    session.set('currentQuestion',question)
                    client.publish('presence', JSON.stringify({from:'alexa',action:'review',question:question._id}))
                    // ask the question
                    alexaSpeak.askQuestion(question,request,response);
                    databaseFunctions.logStatus(db,database,'seen',question._id,request,response);
                    response.shouldEndSession(false,'Do you remember ?')
                    session.set('confirmAction','recall')
                    session.set('denyAction','next_question')
                    return response.send();                
                } else {
                    console.log('no question');
                   // return response.send(); 
                }
            }
        } else {
            console.log('ERROR: review called without questions in session');
        }
    },
    really_block_question: function(request,response) {
        session.set('confirmAction',null)
        session.set('denyAction',null)
        let session = request.getSession();
        let currentQuestion = session.get('currentQuestion');
        databaseFunctions.getUser(db,database,request,response).then(function(user) {
            databaseFunctions.blockQuestion(db,database,user._id,currentQuestion._id,currentQuestion.quiz);
        });
        response.say('Ok blocked. Next question ');// console.log('recall');
        return intentHandlers.next_question(request,response);
    },
    block_question: function(request,response) {
        let session = request.getSession();
        session.set('confirmAction','really_block_question')
        session.set('denyAction','next_question')
        response.say('Do you really want to block this question');// console.log('recall');
        response.shouldEndSession(false,'Do you really want to block this question')            
    },
    recall: function(request,response) {
       // console.log('recall');
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        if (currentQuestion && session.get('mode') === 'review') {
            //console.log(currentQuestion);
            // mark question as success
            response.say('OK, next question');
            databaseFunctions.logStatus(db,database,'successes',currentQuestion._id,request,response);
            return intentHandlers.next_question(request,response);
        } else {
            response.shouldEndSession(false,'Do you want to start a review')            
            session.set('confirmAction','review');
            session.set('denyAction','bye')
            
        }
    },
    //spelling_is(request,response) {
        //return answer_is(request,response);
    //},
    // check recall
    answer_is:  function(request,response) {
        console.log(['ANSWERIS']);
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        console.log(request.slots,currentQuestion);
        if (currentQuestion) {
            if (request.slot('THEANSWER')) {
                let find = request.slot('THEANSWER');
                console.log(['FIND',find,currentQuestion.answer]);
                var levenshtein = require('fast-levenshtein');
             //   console.log(['ANSWERIS',find,currentQuestion.answer]);
                let answer='';
                let answerParts=currentQuestion.answer.split(' ');
                // if the answer is short enough, we can use it
                function  checkSpecificAnswer(find,currentQuestion) {
                     // also check for an answer in the specific_answer field and generate and test any responses in the also include field
                    if (currentQuestion.specific_answer) {
                        console.log(['ANSWERIS is specific']);
                        answer = currentQuestion.specific_answer;
                        if (find && (alexaUtils.strip(answer).toLowerCase()===alexaUtils.strip(find).toLowerCase()) ) {  //|| levenshtein.get(find,answer) < 1
                            response.say(alexaUtils.speakable(answer) + " is correct");
                            response.say("Next question");
                            databaseFunctions.logStatus(db,database,'successes',currentQuestion._id,request,response);
                            return intentHandlers.next_question(request,response);
                        } else {
                            return checkAlsoAccept(find,currentQuestion);
                        }
                    } else {
                        return checkAlsoAccept(find,currentQuestion);
                    }
                };
                
                function checkAlsoAccept(find,currentQuestion) {
                    console.log(['try also accept']);
                    // finally try also_include
                    if (currentQuestion.also_accept) {
                        
                        let aiParts = currentQuestion.also_accept.split(",");
                        for (var i=0 ; i < aiParts.length; i++) {
                            
                            answer = alexaUtils.strip(aiParts[i]).toLowerCase();
                            console.log(['ANSWERIS is also include',find,answer]);
                            if (find && (answer===alexaUtils.strip(find).toLowerCase()) ) { //|| levenshtein.get(find,answer) < 1
                                response.say(alexaUtils.speakable(answer) + " is correct");
                                response.say("Next question");
                                databaseFunctions.logStatus(db,database,'successes',currentQuestion._id,request,response);
                                return intentHandlers.next_question(request,response);
                            } 
                        };
                        response.say(alexaUtils.speakable(find) + " is not correct. Try again ");
                        session.set('denyAction','next_question')
                        return intentHandlers.repeat_question(request,response);
                    } else {
                        response.say(alexaUtils.speakable(find) + "is not correct. Try again ");
                        session.set('denyAction','next_question')
                        return intentHandlers.repeat_question(request,response);
                    }
                };
                
                if (answerParts.length < 5) {
                    // don't submit answer to model if there is a specific answer or also_accept
                    if (currentQuestion && currentQuestion.hasOwnProperty('specific_answer') && String(currentQuestion.specific_answer).length > 0)  {
                        // skip
                        return checkSpecificAnswer(find,currentQuestion);
                    } else if (currentQuestion && currentQuestion.hasOwnProperty('also_accept') && String(currentQuestion.also_accept).length > 0)  {
                        return checkAlsoAccept(find,currentQuestion);
                    } else {
                        answer = currentQuestion.answer;
                        console.log(['ANSWERIS < 5',answer,find,(answer.indexOf(find) !== -1)]);
                        if (find && (alexaUtils.strip(answer).indexOf(alexaUtils.strip(find)) !== -1 ) ) { //|| levenshtein.get(find,answer) < 4
                            response.say(alexaUtils.speakable(answer) + " is correct");
                            response.say("Next question");
                            databaseFunctions.logStatus(db,database,'successes',currentQuestion._id,request,response);
                            return intentHandlers.next_question(request,response);
                        } else {
                            return checkSpecificAnswer(find,currentQuestion);
                            //response.say("Wrong answer. Try again ");
                            //return intentHandlers.repeat_question(request,response);
                        }   
                    }
                } else {
                    if (currentQuestion.specific_answer || currentQuestion.also_accept) {
                        return checkSpecificAnswer(find,currentQuestion);
                    } else {
                        response.say("I can't answer this question. Just say ")
                        response.say("I recall");
                        response.shouldEndSession(false)
                        //return intentHandlers.repeat_question(request,response);
                    }
                }
            } else {
                response.say("Didn't catch that. Try again");
                response.shouldEndSession(false)
            }
        } else {
            response.say('No current question. Would you like to hear one');
            session.set('confirmAction','next_question')
            response.shouldEndSession(false,'Do you want another question')
            session.set('denyAction','bye')
        }
    },
    mnemonic_is:  function(request,response) {
        //response.card("Visit Mnemo's Library","(copy and paste)  \n\n https://mnemolibrary.com ");
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        if (currentQuestion) {
            let find = '';
            console.log(request.slot('THEMNEMONIC'));
            console.log(request.slot('THELASTWORD'));
            if (request.slot('THEMNEMONIC')) {
                find = request.slot('THEMNEMONIC');
            } else if (request.slot('THELASTWORD')) {
                find = request.slot('THELASTWORD');
            }
            console.log(['FIND M',find,currentQuestion.mnemonic]);
            // Is utterance contained in mnemonic ?
            // 
            let mnemonic=alexaUtils.strip(currentQuestion.mnemonic);
            find=alexaUtils.strip(find)
            console.log(['mnemonic compare ']);
            if (find && (mnemonic.indexOf(find) !== -1 ||  levenshtein.get(find,mnemonic) < 3)) {
                response.say("Correct");
                response.say('Next question');
                databaseFunctions.logStatus(db,database,'successes',currentQuestion._id,request,response);
                return intentHandlers.next_question(request,response);
            } else {
                response.say(alexaUtils.speakable(find) + "is not correct. Try again .");
                //session.set('denyAction','next_question')
                return intentHandlers.repeat_question(request,response);
            }
            
        } else {
            response.say('No current question. Would you like to hear one');
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            response.shouldEndSession(false,'Do you want another question')
        }
    },
    // repeat info
    answer: function(request,response) {
        // if there is a current question speak answer
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        if (currentQuestion) {
            alexaSpeak.readAnswer(currentQuestion,request,response);
            if (alexaUtils.moreInfo(currentQuestion).length==0) {
                response.shouldEndSession(false,'what next. Do you want another question?')
                session.set('confirmAction','next_question')
                session.set('denyAction','bye')
                return response.send();                
            } else {
                response.say('Would you like more information');
                response.shouldEndSession(false,'Would you like more information')
                session.set('confirmAction','moreinfo')
                session.set('denyAction','next_question')
                return response.send();                
            }
            
        // otherwise ask if want a new question and prime confirmAction=discover
        } else {
            response.say('No current question. Would you like to hear one');
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            response.shouldEndSession(false,'Do you want another question')
        }
    },
    spellanswer: function(request,response) {
        // if there is a current question speak answer
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        if (currentQuestion) {
            alexaSpeak.readAnswerLetters(currentQuestion,request,response);
            response.shouldEndSession(false,'What next. Would you like another question')
        // otherwise ask if want a new question and prime confirmAction=discover
        } else {
            response.say('No current question. Would you like to hear one');
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            response.shouldEndSession(false,'Do you want another question')
        }
    },
    moreinfo: function(request,response) {
        // if there is a current question speak answer
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        console.log(['more info',currentQuestion]);
        if (currentQuestion) {
            console.log(['more info preread']);
            alexaSpeak.readMoreInfo(currentQuestion,request,response);
            console.log(['more info postread']);
            response.shouldEndSession(false,'What next. Would you like another question')
        // otherwise ask if want a new question and prime confirmAction=discover
        } else {
            response.say('No current question. Would you like to hear one');
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            response.shouldEndSession(false,'Do you want another question')
        }
    },
    mnemonic: function(request,response) {
        // if there is a current question speak mnemonic
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        if (currentQuestion) {
            alexaSpeak.readMnemonic(currentQuestion,request,response);
            response.shouldEndSession(false,'What next. Would you like another question')
        // otherwise ask if want a new question and prime confirmAction=discover
        } else {
            response.say('No current question. Would you like to hear one');
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            response.shouldEndSession(false,'Do you want another question')
        }
    },
    repeat_question: function(request,response) {
        // if there is a current question speak question
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        if (currentQuestion) {
            alexaSpeak.askQuestion(currentQuestion,request,response);
             response.shouldEndSession(false,'What next. Would you like another question')
        // otherwise ask if want a new question and prime confirmAction=discover
        } else {
            response.say('No current question. Would you like to hear one');
            session.set('confirmAction','next_question')
            session.set('denyAction','bye')
            response.shouldEndSession(false,'Do you want another question')
        }
    },
    next_question: function(request,response) {
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        if (session.get('mode')==='review' ) {
            if (session.get('questions') && session.get('questions').length > 0) {
                return intentHandlers.review(request,response)
            } else {
                return intentHandlers.start_review(request,response)
            }
            
        } else {
            return intentHandlers.discover(request,response)
        }
    },
    open_website:  function(request,response) {
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        response.card("Visit Mnemo's Library","(copy and paste)  \n\n https://mnemolibrary.com ");
        response.say("Sure. Check your Alexa app for a card with a link");
        response.shouldEndSession(false,'Do you want another question')
        session.set('confirmAction','next_question')
        session.set('denyAction','bye')
        
    },
    show_image:  function(request,response) {
        let session = request.getSession();
        session.set('confirmAction',null)
        session.set('denyAction',null)
        
        let currentQuestion = session.get('currentQuestion');
        if (currentQuestion) {
            let text="https://mnemolibrary.com";
            if (currentQuestion.image) {
                if (currentQuestion.imageattribution) {
                    text="\nImage from "+currentQuestion.imageattribution;
                }
                response.card({type:"Standard",title:"Visit Mnemo's Library",text:text,image:{smallImageUrl:currentQuestion.image,largeImageUrl:currentQuestion.image}});
                response.say("Sure. Check your Alexa app for a card with the image");                
            } else {
                response.say("Sadly there's no image for this question");                
            }
        }
        response.shouldEndSession(false,'Do you want another question')
    },
    //// search by asking question
    //why_is:  function(request,response) {
        //if (request.slots['ANSWER'] && request.slots['ANSWER'].value)  {
        
        //} else {
            //response.say("why is what");
            //// slot fill answer
        //}
        //response.shouldEndSession(false,'Can you repeat your question')
    //},
    //when_is:  function(request,response) {
        //if (request.slots['ANSWER'] && request.slots['ANSWER'].value)  {
        
        //} else {
            //response.say("when is what");
            //// slot fill answer
        //}
        //response.shouldEndSession(false,'Can you repeat your question')    
    //},
    //where_is:  function(request,response) {
        //if (request.slots['ANSWER'] && request.slots['ANSWER'].value)  {
        
        //} else {
            //response.say("where is what");
            //// slot fill answer
        //}
        //response.shouldEndSession(false,'Can you repeat your question')
    //},
    //who_is:  function(request,response) {
        //if (request.slots['ANSWER'] && request.slots['ANSWER'].value)  {
        
        //} else {
            //response.say("Didn't catch that");
            //// slot fill answer
        //}
        //response.shouldEndSession(false,'Can you repeat your question')   
    //},
    //what_is:  function(request,response) {
        //if (request.slots['ANSWER'] && request.slots['ANSWER'].value)  {
        
        //} else {
            //response.say("why is what");
            //// slot fill answer
        //}
        //response.shouldEndSession(false,'Can you repeat your question')   
    //},
    //how_is:  function(request,response) {
        //if (request.slots['ANSWER'] && request.slots['ANSWER'].value)  {
        
        //} else {
            //response.say("why is what");
            //// slot fill answer
        //}
        //response.shouldEndSession(false,'Can you repeat your question')    
    //}
}

module.exports = intentHandlers;
