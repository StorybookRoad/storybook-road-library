var express = require('express');
var router = express.Router();
var assert = require('assert');

var auth = require('../middlewares/auth');

router.get('/', auth.authStudent, function (req, res, next) {
	var story = req.session.story;
	res.render('game', { story: story });
});

module.exports = router;