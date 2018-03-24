const express = require('express');
var router = express.Router();
const bodyParser = require('body-parser');
const bluebird = require('bluebird');
const config = require('../../config');
const oauthMiddlewares = require('../../oauth/oauthServerMiddlewares');
const usersController = require('../../oauth/controllers/users');
const clientsController = require('../../oauth/controllers/clients');
const logger = require('morgan');
const database = require('../../oauth/database');
database.connect(config.databaseConnection+config.database);

global.Promise = bluebird;

router.use(logger('dev'));

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: false }));

router.all('/token', oauthMiddlewares.token);

router.get('/authorize', oauthMiddlewares.authorize);
router.post('/authorize', oauthMiddlewares.authorize);

router.get('/secure', oauthMiddlewares.authenticate, (req, res) => {
res.json({ message: 'Secure data' });
});

router.post('/users', usersController.createUser);
router.get('/users', usersController.getUsers);
router.post('/clients', clientsController.createClient);
router.get('/clients', clientsController.getClient);


router.use((req, res, next) => {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
});

router.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: err
  });
});


module.exports = router
//curl  -X POST http://localhost:5000/clients
