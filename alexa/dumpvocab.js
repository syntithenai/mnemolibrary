var config = require("../config")
var Speech = require('ssml-builder');
var AmazonSpeech = require('ssml-builder/amazon_speech');

const database = require('../oauth/database');
const User = database.User;
const OAuthAccessToken = database.OAuthAccessToken;
let db=null;
var ObjectId = require('mongodb').ObjectID;
try {
    // ugg mongoose and raw connections
    database.connect();
    const MongoClient = require('mongodb').MongoClient
    MongoClient.connect(config.databaseConnection, (err, client) => {
        if (err) return console.log(err)
        db = client.db(config.database)       
        

    })
} catch (e) {}


