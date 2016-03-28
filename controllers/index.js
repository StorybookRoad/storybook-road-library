var express = require('express');
var router = express.Router();
var assert = require('assert');

//handle routing
router.use('/login', require('./login-ctrl'));
router.use('/create-account', require('./create-account-ctrl'));
router.use('/teacher', require('./teacher-ctrl'));
router.use('/student', require('./student-ctrl'));
router.use('/game', require('./game-ctrl.js'));
router.use('/contact', require('./contact-ctrl.js'));
router.use('/about', require('./about-ctrl.js'));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

module.exports = router;