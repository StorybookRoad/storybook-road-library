var express = require('express');
var router = express.Router();
var assert = require('assert');

var teacher = require('../models/teacher');
var student = require('../models/student');
var classModel = require('../models/class');
var theme = require('../models/theme');
var auth = require('../middlewares/auth');

router.get('/', auth.authTeacher, function(req, res, next) {
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
		if (result === 'EMPTY_RESULT') res.send(result);
		else {
			var response = {};
			for (item in result) {
				var classObj = result[item];
				response[classObj._id] = classObj;
			}
			res.send(response);
		}
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

//handle requests for theme list
router.post('/themes-request', function (req, res, next) {
	theme.all(function (err, response) {
		assert.equal(err, null);
		var themeRes = {};
		for (item in response) {
			var theme = response[item];
			themeRes[item] = { 'name': theme.name }; //only send name to avoid sending huge amounts of data
		}
		res.send(themeRes);
	});
});

//handle requests to add a class
router.post('/new-class', function(req, res, next) {
	var email = req.session.user.email;
	var themes = JSON.parse(req.body.themes); //themes have been stringified to ensure correct request
	var class_name = req.body.class_name;
	var difficulty = req.body.difficulty;
	classModel.create(class_name, email, difficulty, themes, function(err, result) {
		assert.equal(null, err);
		res.send(result); //'SUCCESS' or 'CLASS_ALREADY_EXISTS'
	});
});

//handle requests to update student difficulty
router.post('/update-student-difficulty', function (req, res, next) {
	var email = req.body.student;
	var new_difficulty = req.body.difficulty;
	student.updateDifficulty(email, new_difficulty, function (err, status) {
		assert.equal(err, null);
		res.send(status);
	});
});

module.exports = router;
