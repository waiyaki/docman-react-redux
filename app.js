var express = require('express');
var logger = require('morgan');
var bodyParser = require('body-parser');
var dotenv = require('dotenv');
dotenv.load();

var app = express();

// Connect to the db.
require('./server/config/db');

// Log all requests to the console.
app.use(logger('dev'));

// Grab post data from the request.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes
require('./server/routes')(app);

module.exports = app;
