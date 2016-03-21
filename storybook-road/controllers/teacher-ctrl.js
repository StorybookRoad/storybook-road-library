var express = require('express');
var router = express.Router();
var assert = require('assert');

var teacher = require('../models/teacher');
var classModel = require('../models/class');
var auth = require('../middlewares/auth');

router.get('/', auth, function(req, res, next) {
	var email = req.session.user.email;
	teacher.get(email, function(err, result) {
		assert.equal(null, err);
		console.log(result);
		res.render('teacher', {user: result});
	});
});

router.post('/classes-request', function(req, res, next) {
	var email = req.session.user.email;
	classModel.getByTeacher(email, function(err, result) {
		assert.equal(null, err);
		var response = {};
		for (item in result) {
			var classObj = result[item];
			response[classObj._id] = classObj.name;
		}
		res.send(response);
	});
});

router.post('/new-class', function(req, res, next) {
	var email = req.session.user.email;
	var class_name = req.body.class_name;
	classModel.create(class_name, email, function(err, result) {
		assert.equal(null, err);
		res.send(result); //'SUCCESS' or 'CLASS_ALREADY_EXISTS'
	});
});

module.exports = router;