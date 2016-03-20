var express = require('express');
var router = express.Router();
var assert = require('assert');

var student = require('../models/student');
var auth = require('../middlewares/auth');

router.get('/', auth, function(req, res, next) {
	var id = req.query.id;
	student.getById(id, function(err, result) {
		assert.equal(null, err);
		var name = result.fname + " " + result.lname;
		res.render('student', {name: name});
	});
});

module.exports = router;