var express = require('express');
var router = express.Router();
var assert = require('assert');

var student = require('../models/student');
var auth = require('../middlewares/auth');

router.get('/', auth.authStudent, function(req, res, next) {
	var email = req.session.user.email
	student.get(email, function(err, result) {
		assert.equal(null, err);
		res.render('student', {user: result});
	});
});

module.exports = router;