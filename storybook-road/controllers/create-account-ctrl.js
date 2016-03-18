var express = require('express');
var router = express.Router();
var assert = require('assert');

var schools = require('../models/school');
var classModel = require('../models/class');
var teacher = require('../models/teacher');
var student = require('../models/student');

router.get('/', function(req, res, next) {
	var type = req.query.type;
	res.render('create-account', {type: type});
});

//get school list
router.post('/school-req', function(req, res, next) {
	schools.all(function(err, result) {
		assert.equal(null, err);
		res.send(result);
	});
});

//get teacher list
router.post('/teacher-req', function(req, res, next) {
	var school = req.body.school;
	teacher.getBySchool(school, function(err, result) {
		assert.equal(null, err);
		res.send(result);
	});
});

//get class list
router.post('/class-req', function(req, res, next) {
	var teacher = req.body.teacher;
	classModel.getByTeacher(teacher, function(err, result) {
		assert.equal(null, err);
		res.send(result);
	});
});

//handle form submit
router.post('/submit', function(req, res, next) {
	var userData = req.body;
	//if school does not exist, create it
	schools.get(userData.school, function(err, result) {
		assert.equal(null, err);
		if (result != 'SCHOOL_ALREADY_EXISTS') schools.create(userData.school, function(err, result){}); //no callback necessary
	});
	//check whether student or teacher
	if (userData.role == 'teacher') {
		teacher.create(userData, function(err, result) {
			assert.equal(null, err);
			res.send(result); //SUCCESS or SCHOOL_ALREADY_EXISTS
		});
	}
	else if (userData.role == 'student') {
		student.create(userData, function(err, result) {
			assert.equal(null, err);
			res.send(result); //SUCCESS or SCHOOL_ALREADY_EXISTS
		});
	}
});

module.exports = router;