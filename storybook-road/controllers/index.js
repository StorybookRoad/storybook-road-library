var express = require('express');
var router = express.Router();
var assert = require('assert');

//handle routing
router.use('/login', require('./login-ctrl'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
