var express = require('express');
var router = express.Router();
var assert = require('assert');

var student = require('../models/student');
var story = require('../models/story');
var auth = require('../middlewares/auth');

router.get('/', auth.authStudent, function(req, res, next) {
	var email = req.session.user.email;
	student.get(email, function(err, result) {
		assert.equal(null, err);
		res.render('student', {user: result});
	});
});

//handle request for story list
router.post('/stories-request', function (req, res, next) {
	var student = req.session.user.email;
	story.getByStudent(student, function (err, result) {
		assert.equal(err, null);
		res.send(result);
	});
});

//handle request to create a new story

module.exports = router;