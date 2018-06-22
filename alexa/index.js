var express = require("express");

//var alexa = require("alexa-app");

var express_app = express();
let app = require('./mnemoslibrary')
//app.schemas.askcli("Mnemo's Library") ;



// EXPRESS

// setup the alexa app and attach it to express before anything else
app.express({ expressApp: express_app 
  // verifies requests come from amazon alexa. Must be enabled for production.
  // You can disable this if you're running a dev environment and want to POST
  // things to test behavior. enabled by default.
  //checkCert: false,
  // sets up a GET route when set to true. This is handy for testing in
  // development, but not recommended for production. disabled by default
  //debug: true
});
express_app.listen(3000, () => console.log('Mnemo listening on port 3000!'))


//const http = require('http')
//const port = 3000

//const requestHandler = (request, response) => {
  //console.log(request.url)
  //response.end('Hello Node.js Server!')
//}

//const server = http.createServer(requestHandler)

//server.listen(port, (err) => {
  //if (err) {
    //return console.log('something bad happened', err)
  //}

  //console.log(`server is listening on ${port}`)
//})
