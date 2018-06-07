var express = require('express'),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose');
var config = require('../config');

var app = express();
const database = require('../oauth/database');
database.connect(config.databaseConnection+config.database);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use('/oauth',require('./routes/oauth'))
app.use('/login',require('./routes/signup'))
app.listen(3000);
