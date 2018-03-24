const express = require('express')
const bodyParser= require('body-parser')
const app = express()

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api',require('./routes/api'));
app.use('/login',require('./routes/signup'));
app.use('/oauth',require('./publicapi/routes/oauth'));

console.log("server  success");
const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
