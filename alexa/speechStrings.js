let speechStrings={
    "Sure. Check your Alexa app for a card with a link":[],
    "Sure. Check your Alexa app for a card with the image":[],
    "Sadly there's no image for this question":[],
    
    "An error occured: ":[],
    // read question
    "From ":['Sourced from ','Care of ','Thanks to '],
    "The answer is ":[],
    "The mnemonic is ":['The memory aid is',"Mnemo's tip is "],
    // exit
    "Bye.":['see you Later','Seeya','Chow','I hope to see you again soon',"Until we meet again. Don't be evil."],
    // ??
    "Ok.":['No worries',"Okydoke"],
    
    // launch intent
    "Hi ":["<say-as interpret-as='interjection'>g'day</say-as>","Bonjour","guten tag","bon giorno","konichiwa","Hello",""],
    ". Welcome to Nemo's Library. ":[". Ready to learn with Nemo's library. ",". Let's get going with with Mnemo's library"],
    
    // help
    "You can say discover questions or review them. You can also say stop to stop speech or cancel to quit.":["From Discover or review you can ask mnemo to repeat the question , say the answer or mnemonic or even block the question"],
    
    "What would you like to do?":[],
    
    'What next ?':[],
    'Do you need more time?':[],
    "Do you want to Discover Nemo's questions or start a review":[],
    'Discover or review ?':[],
    
    'Do you want to start a review':[],
    'Would you like to review all questions':[],
    
    'No questions currently available for review  . Would you like to discover new questions.':[],
    
    'Do you want to start discovery':[],
    
    'No current question. Would you like to hear one':[],
    
    'Do you want another question':[],
    'Would you like another question':[],
    
    
    "Couldn't find ":["That's a big zero looking for ","Hmm. No joy finding "],
    "Did you mean ":['Did you want ','Are you after '],
    'Should I search for ':['Shall I look for ', "Should I try find ","Should I try"],
    
    'Would you like more information?':['Do you want the long answer?','More information ?','Do you want the rest?'],
    
    'I had a problem finding a question matching ':[],
    'Would you like to search again without a filter':[],
    'Would you like to try a random question':[],
    
    'I had a problem finding a question sorry. Try again later.':[],
    
    'No questions matching topic ':["I couldn't find a single question matching the topic "],
    
    'No questions matching tag ':["Not a tag to be found matching "],
    
    "Starting review with ":['Kicking off a review with ','Ready to quiz you on '],
    
    ' available for review ':[' ready for review ',' to be reviewed '],
    
    'OK':['Alrighty','OK then'],
    "Next question":['The next question'],
    
    "Would you like to login to track progress and review?":['You need to login for review. Ready to do that?','For review, you need to login. Do you want a card for that?'],
    
    'Would you like to login?':['Do you want to sign in?','OK to login?'],
    
    "You've finished this review set. Do you want to review more or discover new questions":['All done. Do you want to keep going or switch to discovery'],
    
    
    'Ok blocked. ':["Done. You won't hear that one again.","Killed it."],
    'Do you really want to block this question':["Are you sure you never ever ever want to hear this question again."],
    
    'what is the answer ?':['Tell me the answer','The answer is '],
    'Do you remember ?':['Do you recall?','Do you know?'],
    // commendations !!! 
    " is correct":[' is right.',' is the right answer.',' is spot on.'],
    
    " is not correct. Try again ":["Gadong, that's wrong. Try again "],
    "is not correct. Try again .":["is not the answer. Try again ."],
    
    "I can't answer this question. Just say. I recall":["I don't know how to answer this question. Just say.  I remember."],
    'Correct':['Got it',"Yay","Well done","That's right"],
    
    "Didn't catch that. Try again":["What's that","Sorry","Huh"],
    
    " well done ":[' OK ',' Awesome ',' Yay ',' Excellent ',' Good job ',' nice one ',' cool ',' keep it up ']
}

function get(key,mode) {
    if (!mode || String(mode).length==0) {
        mode='en';
    }
    if (speechStrings && speechStrings.hasOwnProperty(key)) {
        let length = speechStrings[key].length;
        let index = Math.floor(Math.random()*(length+1));
        if (index==0) {
            return key;
        } else {
            return speechStrings[key][index-1]
        }
    } else {
        return key;
    }
    
}

module.exports=get;
