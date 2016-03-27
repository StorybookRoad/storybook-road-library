var express = require('express');
var router = express.Router();
var assert = require('assert');

var student = require('../models/student');
var classModel = require('../models/class');
var theme = require('../models/theme');
var story = require('../models/story');
var auth = require('../middlewares/auth');

router.get('/', auth.authStudent, function(req, res, next) {
	var email = req.session.user.email;
	student.get(email, function(err, result) {
		assert.equal(null, err);
		res.render('student', {user: result});
	});
});

//handle new story request
router.post('/new-story-request', function (req, res, next) {
	var email = req.session.user.email;
	var difficulty = req.session.user.difficulty;
	var theme = req.body.theme;
	story.create(email, theme, difficulty, function (err, result) {
		assert.equal(err, null);
		req.session.story = result;
		res.redirect('/game');
	});
});

//handle request for themes
router.post('/themes-request', function (req, res, next) {
	var class_name = req.session.user.class;
	var teacher = req.session.user.teacher;
	classModel.get(class_name, teacher, function (err, class_obj) {
		assert.equal(err, null);
		theme.getList(class_obj.themes, function (err, result) {
			assert.equal(err, null);
			res.send(result);
		});
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
router.post('/new-story-request', function (req, res, next) { 
	var student = req.session.email;
});

module.exports = router;