# Mnemos' Library

Mnemos' Library is learning software based on mnemonics with flashcards, staged review and novel content creation tools integrating Wikipedia.

This project was bootstrapped with [Create React App](https://github.com/facebookincubator/create-react-app).

Future goals include 
- support for voice platforms including Google Home, Alexa, Snips and Mycroft.
- using the ntlk/spacey frameworks to further enhance content creation and gain additional data to support gamification outcomes like crosswords.

For a working example see https://mnemolibrary.com


## Technology

Mnemos' Library uses react for front end development, node.js (using create-react-app) for web services and MongoDB as a persistence layer.

The library integrates an oauth server into it's web services to support login in anticipation of third party integration including voice platforms.

The library relies on Amazon S3 for storage of uploaded media files and backups.


## Quickstart
The services are easily deployed using docker. An example docker-compose.yml is available in this repository.


## Model

The primary collections in the MongoDB store are questions and words(tags).

To support tracking user progress there are
- seen
- successes
- userquestionprogress

Other collections include
- users
- oauth*
- reportedproblems
- userTopics for staging user created questions before publishing into the questions table
- topicCollections for manual control of the Search page layout.


The application supports import of questions from a Google spreadsheet. Administrators of the application can click the Import button to update questions from the spreadsheet. When complete a spreadsheet is downloaded that includes ids for any new questions. !!IT IS IMPORTANT TO COPY AND PASTE THE CONTENT OF THIS FILE BACK TO THE GOOGLE SHEET OR THE IDS OF THE NEW QUESTIONS WILL CHANGE AT EVERY IMPORT AFFECTING LINKING.



## NPM management

bad packages will crash container so need to start manually to allow npm install

docker stop syn; docker rm syn; docker run --name syn -it -v /var/docker/mnemolibrary:/usr/src/app  --entrypoint /bin/bash syntithenai/nemo 



## Backup




A backup script is included in this repository that will create a backup and upload it to Amazon S3.

The script needs to be run inside the MongoDB container so it has access to mongodump.

```docker exec <containername>  

## Links

https://github.com/Pizzaface/Alexa-Chromecast-Skill-2.0


- crosswords

https://github.com/jasonphillips/react-crossword-generator THIS ONE also no editing

https://github.com/satchamo/Crossword-Generator - nice software but no editing



- mongo-express for developers to manipulate the databse

The login system is provided using an Open Auth server based on https://github.com/oauthjs/node-oauth2-server and the excellent v3 example https://github.com/slavab89/oauth2-server-example-mongodb for using mongodb as a back end.


# TODO
- refresh on access token timeout
- trial authenticate


// to insteall npm packages on live sserver (when non starting)
docker run -v /var/docker/mnemolibrary:/usr/src/app --entrypoint=/bin/bash -it syntithenai/nemo

http://nivo.rocks/line

# crosswords JS
https://github.com/richardrulach/js-xwords


Content AI
https://medium.com/search?q=Mycroft


Content Tech


Content Kids

# MONGO BACKUP/RESTORE TO S3
https://gist.github.com/tokudu/1d2ecb7356aca631a984  
https://gist.github.com/tokudu/e3424175e82488a077ca

# AWS NOTIFICATION ON UPLOAD
https://stackoverflow.com/questions/46670029/get-emails-whenever-a-file-is-uploaded-on-s3-bucket-using-serverless


# LINKS

https://www.npmjs.com/package/react-confirm-alert

https://github.com/reactjs/react-autocomplete

# swipe react
https://github.com/dogfessional/react-swipeable

MAIL
https://www.npmjs.com/package/nodemailer-direct-transport
https://github.com/namshi/docker-smtp

https://github.com/janl/mustache.js

OAUTH
https://tools.ietf.org/html/rfc6749#section-2


server library
https://github.com/slavab89/oauth2-server-example-mongodb

https://www.npmjs.com/package/express-oauth-server


?? prebuilt server using server library express-oauth-server => https://www.npmjs.com/package/flows-gateway



https://github.com/mulesoft/js-client-oauth2 - replace GoogleLogin

# problem installing mongoose -> require not found
FIX npm install -g npm-install-peers

TO SUPPORT ACCOUNT LINKING - google actions and alexa
https://github.com/oauthjs/express-oauth-server/blob/master/examples/mongodb/model.js

https://www.npmjs.com/package/react-google-login-component

https://gorangajic.github.io/react-icons/fa.html

https://github.com/mevdschee/php-crud-api/blob/master/examples/client_auth.php


http://www.convertcsv.com/csv-to-json.htm


https://www.npmjs.com/package/react-d3-cloud


https://fontawesome.com/icons?d=gallery&q=search&m=free

https://medium.appbase.io/how-to-implement-authentication-for-your-react-app-cf09eef3bb0b

https://www.robinwieruch.de/conditional-rendering-react/

--


https://hackernoon.com/building-a-serverless-rest-api-with-node-js-and-mongodb-2e0ed0638f47




## Alexa Dialog
Welcome to Mnemo's Library where you can discover the world through questions and mnemonics.
.......
Would you like to learn something new/discover new facts/hear a question?
[Discover|Learn|new facts]
Who was Le Verrier? .... {mnemonic}.....   Le verrier was ...... {shortanswer}
.....
Would you like another question?
[Yes|Next Question]
What is the capital of North Korea? .... {mnemonic}.  ..
[Stop|Cancel]
Would you like another question?
[Previous Question]
Who was Le Verrier? .... {mnemonic}.....   Le verrier was ...... {shortanswer}
[More information?]
{answer}
[Give me questions about science]
What is fission? .... {mnemonic} .....{shortanswer}
[Next question]
What is fusion? .... {mnemonic} .....{shortanswer}
Quiz Me



