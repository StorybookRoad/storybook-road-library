var express = require('express');
var router = express.Router();
var assert = require('assert');

var teacher = require('../models/teacher');
var student = require('../models/student');
var story = require('../models/story');
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
	var numAttempts = 0;
	var numPuzzles = 0;
	student.getByClass(class_name, email, function (err, result) {
		var numStudents = Object.keys(result).length;
		assert.equal(err, null);
		var stuNum = 0;
		for (stu_id in result) {
			var stu = result[stu_id];
			story.getByStudent(stu.email, function (err, stories) {
				assert.equal(err, null);
				for (story_id in stories) {
					var story = stories[story_id];
					// calculate class statistics
					for (stat in story.statistics) {
						numPuzzles++;
						numAttempts += story.statistics[stat].missed;
					}
				}
				// find the last student
				if (stuNum == numStudents - 1) {
					var attemptsPerPuzzle = numAttempts / numPuzzles;
					res.send({ class_stats: 'Average attempts per puzzle: ' + attemptsPerPuzzle.toPrecision(3), student_list: result });
					return;
				}
				stuNum++;
			});
		}
	});
});

//handle requests for student statistics
router.post('/student-info-request', function (req, res, next) {
	var email = req.body.email;
	var numAttempts = 0;
	var numPuzzles = 0;
	student.get(email, function (err, student) {
		assert.equal(err, null);
		story.getByStudent(email, function (err, stories) {
			assert.equal(err, null);
			for (index in stories) {
				var story = stories[index];
				for (stat in story.statistics) {
					numPuzzles++;
					numAttempts += story.statistics[stat].missed;
				}
			}
			var attemptsPerPuzzle = numAttempts / numPuzzles;
			res.send({ 'student':student, statistics: 'Average attempts per puzzle: ' + attemptsPerPuzzle.toPrecision(3) });
		});
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
