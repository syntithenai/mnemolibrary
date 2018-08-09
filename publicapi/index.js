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

var router = express.Router();
router.use('/s3', require('./s3router')({
    bucket: config.s3Bucket,
    region: config.s3Region, //optional
    //signatureVersion: 'v4', //optional (use for some amazon regions: frankfurt and others)
    headers: {'Access-Control-Allow-Origin': '*'}, // optional
    ACL: 'private', // this is default
    uniquePrefix: false // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
}));

app.use('/uploader',router)



app.listen(3000);
