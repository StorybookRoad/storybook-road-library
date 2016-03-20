var express = require('express');
var router = express.Router();
var assert = require('assert');

var teacher = require('../models/teacher');
var auth = require('../middlewares/auth');

router.get('/', auth, function(req, res, next) {
	var id = req.query.id;
	teacher.getById(id, function(err, result) {
		assert.equal(null, err);
		var name = result.fname + " " + result.lname;
		res.render('teacher', {name: name});
	});
});

module.exports = router;