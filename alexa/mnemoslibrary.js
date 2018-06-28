var alexa = require("alexa-app");
let intentHandlers = require('./mnemoslibrary_intentHandlers');
var __ = require('./speechStrings'); 
var app = new alexa.app("mnemoslibrary");

let customSlots = require('./vocabdump.js');
for (slot in customSlots) {
    app.customSlot(slot,customSlots[slot]);
}

//app.dictionary["names"]= ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"];
app.invocationName="nemo's library";

// ENTRY/EXIT
app.launch(intentHandlers.launch);

// CUSTOM INTENTS

app.intent("yes", {
    "slots": { },
    "utterances": ["yes","i agree","yep","yes please","please do","that's what i want","affirmative","okay","ok"]
  },intentHandlers.yes
);

app.intent("no", {
    "slots": { },
    "utterances": ["no","i disagree","nope","no thanks","please don't","that's not what i want"]
  },intentHandlers.no
);

app.intent("discover", {
    "slots": {
      "TAG": "tags",
      "TOPIC": "topics",
    },
    "utterances": [
      "{discover|browse|search|explore}","{discover|browse|search|find|learn about|give me|locate|unearth|uncover|explore|reveal|see|dig up|look up} {tag |} {-|TAG}","{discover|browse|search|find|learn about|give me|locate|unearth|uncover|explore|reveal|see|dig up|look up} {topic |}  {-|TOPIC}"
    ]
  },intentHandlers.start_discover
);

//app.intent("rediscover", {
    //"utterances": [
      //"rediscover {questions |}",
    //]
  //},intentHandlers.rediscover
//);


app.intent("review", {
    "slots": {
      "TAG": "tags",
      "TOPIC": "topics",
    },
    "utterances": ["{start |}{commence |}{begin |} {review|quiz|test|test me on|pop quiz |questionnaire } {on |} {about |} {-|TAG}","review {-|TOPIC}","{start |}{commence |}{begin |} {review|quiz|test|test me on|pop quiz |questionnaire }"]
  },intentHandlers.start_review
);

// RECALL DURING REVIEW
app.intent("recall", {
    "slots": { }, 
    "utterances": ["recall","i recall","remember","i remember","i remember that"]
  },intentHandlers.recall
);
//, THELASTWORD: "mnemonicLastWords"
//,"the last word  is {-|THELASTWORD}"
app.intent("mnemonic_is", {
    "slots": { THEMNEMONIC:"mnemonics"},  
    "utterances": ["the mnemonic is {-|THEMNEMONIC} ","the memory aid is {-|THEMNEMONIC} "] 
  },intentHandlers.mnemonic_is
); 
//,"{-|THEANSWER}"
app.intent("answer_is", {
    "slots": { THEANSWER:"answers"},
    "utterances": ["the {answer|solution} is {-|THEANSWER}"]  
  },intentHandlers.answer_is
);
//app.intent("spelling_is", {
    //"slots": { THEANSWERASLETTERS:"spelledWords"},
    //"utterances": ["{it|the answer|answer} is {spelled|spelt|written} {-|THEANSWERASLETTERS}"]
  //},intentHandlers.spelling_is
//);

// SPEAK QUESTION ELEMENTS
app.intent("answer", {
    "slots": { },
    "utterances": ["{answer|solution}","what is the {answer|solution}","give me the {answer|solution}","tell me the {answer|solution}","I want the {answer|solution}"]
  },intentHandlers.answer
);
app.intent("moreinfo", {
    "slots": { },
    "utterances": ["more info","more information","give me the {full|complete|whole} answer"]
  },intentHandlers.moreinfo
);
app.intent("spellanswer", {
    "slots": { },
    "utterances": ["spell {answer|solution}","spell that","how do i spell that"]
  },intentHandlers.spellthat
);

app.intent("block_question", {
    "slots": { },
    "utterances": ["{block|ignore|discard|reject|throw away|delete|trash} {this |} question"]
  },intentHandlers.block_question
);

app.intent("mnemonic", {
    "slots": { },
    "utterances": ["mnemonic","what is the mnemonic","what is the memory aid","give me a clue"]
  },intentHandlers.mnemonic
);

app.intent("repeat_question", {
    "slots": { },
    "utterances": ["repeat question","say question again","repeat that","say again","pardon","read question again"]
  },intentHandlers.repeat_question
);
app.intent("more_time", {
    "slots": { },
    "utterances": ["i need more time","give me more time","wait please"]
  },intentHandlers.more_time
);



// MISC
app.intent("next_question", {
    "slots": { },
    "utterances": ["next question"]
  },intentHandlers.next_question
);

app.intent("open_website", {
    "slots": { },
    "utterances": ["{open|go to} {the |} {website|Mnemo site|Mnemo site on the internet|Mnemo's Library site}"]
  },intentHandlers.open_website
);

app.intent("show_image", {
    "slots": { },
    "utterances": ["{show|display} {image|picture|photo|photograph}"]
  },intentHandlers.show_image
);

// OTHER INTENTS

app.intent("login", {
    "slots": { },
    "utterances": ["Login","sign in","log in to site"]
  },intentHandlers.login
);


app.sessionEnded(function(request, response) {
  // cleanup the user's server-side session
  //logout(request.userId);
  // no response required
});

// AMAZON INTENTS
app.intent("AMAZON.HelpIntent", {
    "slots": {},
    "utterances": ['help']
  },
  function(request, response) {
    var helpOutput = __("You can say discover questions or review them. You can also say stop to stop speech or cancel to quit.");
    var reprompt = __("What would you like to do?");
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  }
);

app.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": ['stop']
  }, function(request, response) {
    //var stopOutput = __("Ok.");
    //response.say(stopOutput).say(__('Do you want another question?')).shouldEndSession(false,__('Do you want another question?'));
    var cancelOutput = __("Bye.");
    response.say(cancelOutput).shouldEndSession(true);
  }
);

app.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": ['cancel','exit','quit','die','go away']
  }, function(request, response) {
    var cancelOutput = __("Bye.");
    response.say(cancelOutput).shouldEndSession(true);
  }
);
//app.intent("AMAZON.FallbackIntent", {
    //"slots": {},
    //"utterances": []
  //}, function(request, response) {
    //var cancelOutput = "what was that";
    //response.say(cancelOutput);
  //}
//);

// PRE/POST 
app.pre = function(request, response, type) {
    //console.log(['REQUEST',request.data.request.intent,request.type()]); //,request.getSession().details.attributes]);//,request.getSession().details.attributes,request.slots]);
    //,JSON.stringify(request.data)
  //if (request.applicationId != "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe") {
    //// fail ungracefully
    //throw "Invalid applicationId";
    //// `return response.fail("Invalid applicationId")` will also work
  //}

};
app.post = function(request, response, type, exception) {
  if (exception) {
    // always turn an exception into a successful response
    //console.log(exception);
    return response.clear().say(__("An error occured: ") + exception).send();
  }
};

app.on('AMAZON.CanFulfillIntentRequest', (request, response, request_json) => {
  response.say("You triggered an event from device " + request_json.request.event.deviceName);
});

module.exports = app;



//// ASK QUESTIONS
//app.intent("who_is", {
    //"slots": { QUESTION:"questions"},
    //"utterances": ["who is {-|QUESTION} "]
  //},intentHandlers.who_is
//);
//app.intent("what_is", {
    //"slots": { QUESTION:"questions"},
    //"utterances": ["what is {-|QUESTION} "]
  //},intentHandlers.what_is
//);
//app.intent("when_is", {
    //"slots": { QUESTION:"questions"},
    //"utterances": ["when is {-|QUESTION} ","when was {-|QUESTION} "]
  //},intentHandlers.when_is
//);
//app.intent("where_is", {
    //"slots": { QUESTION:"questions"},
    //"utterances": ["where is {-|QUESTION} "]
  //},intentHandlers.answer_is
//);
//app.intent("why_is", {
    //"slots": { QUESTION:"questions"},
    //"utterances": ["why is {-|QUESTION} "]
  //},intentHandlers.why_is
//);
//app.intent("how_is", {
    //"slots": { QUESTION:"questions"},
    //"utterances": ["how is {-|QUESTION} "]
  //},intentHandlers.how_is
//);
