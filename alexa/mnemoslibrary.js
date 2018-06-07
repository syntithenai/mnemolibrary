var alexa = require("alexa-app");


var app = new alexa.app("mnemoslibrary");
app.dictionary = {
  "names": ["matt", "joe", "bob", "bill", "mary", "jane", "dawn"]
};
app.invocationName="nemo's library";


// CUSTOM INTENTS
app.intent("get_question", {
    "slots": { },
    "utterances": ["Discover"]
  },
  function(request, response) {
    let session = request.getSession();
    let type = request.type();
    let confirmed = request.isConfirmed();
    let confirmedStatus = request.confirmationStatus
    let context = request.context;
    let data = request.data;
    
    //var number = request.slot("number");
    response.shouldEndSession(false ,'Now what' )
    response.say("Discover");
  }
);

app.intent("test", {
  },
  function(request, response) {
    response.say("test");
  }
);


app.intent("login", {
    "slots": { },
    "utterances": ["Login"]
  },
  function(request, response) {
    response.linkAccount();
  }
);

// ENTRY/EXIT
app.launch(function(request, response) {
  response.say("Hello me to");
  response.card("Hello Worlddes", "This is an example card");
});


app.sessionEnded(function(request, response) {
  // cleanup the user's server-side session
  //logout(request.userId);
  // no response required
});

// AMAZON INTENTS
app.intent("AMAZON.HelpIntent", {
    "slots": {},
    "utterances": []
  },
  function(request, response) {
    var helpOutput = "You can say 'some statement' or ask 'some question'. You can also say stop or exit to quit.";
    var reprompt = "What would you like to do?";
    // AMAZON.HelpIntent must leave session open -> .shouldEndSession(false)
    response.say(helpOutput).reprompt(reprompt).shouldEndSession(false);
  }
);

app.intent("AMAZON.StopIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var stopOutput = "Don't You Worry. I'll be back.";
    response.say(stopOutput);
  }
);

app.intent("AMAZON.CancelIntent", {
    "slots": {},
    "utterances": []
  }, function(request, response) {
    var cancelOutput = "No problem. Request cancelled.";
    response.say(cancelOutput);
  }
);

// PRE/POST 
app.pre = function(request, response, type) {
    console.log(['REQUEST',request.type,request.session,request.slots]);
  //if (request.applicationId != "amzn1.echo-sdk-ams.app.000000-d0ed-0000-ad00-000000d00ebe") {
    //// fail ungracefully
    //throw "Invalid applicationId";
    //// `return response.fail("Invalid applicationId")` will also work
  //}
};
app.post = function(request, response, type, exception) {
  if (exception) {
    // always turn an exception into a successful response
    return response.clear().say("An error occured: " + exception).send();
  }
};
//console.log(app.schemas.askcli("Mnemo's Library") );
module.exports = app;
