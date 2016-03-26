var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var bodyParser = require('body-parser');
var assert = require('assert');

var db = require('./db'); //the database
var version = require('./middlewares/version.js'); //middleware to get the version number

var routes = require('./controllers/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
//Might want to update our secret to use a file instead of being hard coded for git safety.
app.use(session({secret: 'f4sBqkHDnX4xkRJBysiip1n4Fb6JqL', resave: false, saveUninitialized: false}));
app.use(express.static(path.join(__dirname, 'public')));
//ensure that create-account/:type gets served static files
app.use('/create-account', express.static(path.join(__dirname, 'public')));

//add version number as global middleware
app.use(version);

app.use('/', routes);

//connect to database
db.connect(function(err) {
	assert.equal(null, err);
});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
