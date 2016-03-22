var express = require('express');
var router = express.Router();
var assert = require('assert');

var teacher = require('../models/teacher');
var student = require('../models/student');
var classModel = require('../models/class');
var auth = require('../middlewares/auth');

router.get('/', auth, function(req, res, next) {
	var email = req.session.user.email;
	teacher.get(email, function(err, result) {
		assert.equal(null, err);
		res.render('teacher', {user: result});
	});
});

//handle requests for class list
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

//handle requests for class info and student list
router.post('/class-info-request', function (req, res, next) {
	var email = req.session.user.email;
	var class_name = req.body.class_name;
	student.getByClass(class_name, email, function (err, result) {
		assert.equal(err, null);
		res.send({ class_stats: 'Statistics for ' + class_name + ' go here.', student_list: result });
	});
});

//handle requests for student statistics - PLACEHOLDER
router.post('/student-info-request', function (req, res, next) {
	var email = req.body.email;
	student.get(email, function (err, result) {
		assert.equal(err, null);
		res.send(result);
	});
});

//handle requests to add a class
router.post('/new-class', function(req, res, next) {
	var email = req.session.user.email;
	var class_name = req.body.class_name;
	classModel.create(class_name, email, function(err, result) {
		assert.equal(null, err);
		res.send(result); //'SUCCESS' or 'CLASS_ALREADY_EXISTS'
	});
});

module.exports = router;