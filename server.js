const express = require('express')
const bodyParser= require('body-parser')
const app = express()
const path = require('path')
const fs = require('fs')
var timeout = express.timeout // express v3 and below
var timeout = require('connect-timeout'); //express v4

app.use(timeout(120000));


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/api',require('./routes/api'));
app.use('/login',require('./routes/signup'));
app.use('/oauth',require('./publicapi/routes/oauth'));
//app.use('/signup',require('./publicapi/routes/signup'));
var config=require('./config')
var router = express.Router();

router.get('/proxy', (req, res) => {
    if (req.query.url) {
        var request = require('request');
        request.get(req.query.url).pipe(res);
    }
});

router.use('/s3', require('./s3router')({
    bucket: config.s3Bucket,
    region: config.s3Region, //optional
    //signatureVersion: 'v4', //optional (use for some amazon regions: frankfurt and others)
    headers: {'Access-Control-Allow-Origin': '*'}, // optional
    ACL: 'public-read', // this is default
    uniquePrefix: false // (4.0.2 and above) default is true, setting the attribute to false preserves the original filename in S3
}));

router.get('/worker', (req, res) => {
    if (req.query && req.query.worker) {
        
        let workerPath = path.join(__dirname, './workers/ffmpeg-'+req.query.worker+".js");
        if (fs.existsSync(workerPath)) {
            res.sendFile(workerPath);
        }
        
    }
});

app.use('/uploader',router)

server.timeout = 120000;
app.use(haltOnTimedout);

function haltOnTimedout(req, res, next){
  if (!req.timedout) next();
}
const port = 5000;
app.listen(port, () => console.log(`Listening on port ${port}`));
