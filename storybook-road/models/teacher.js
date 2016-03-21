var db = require('../db');
var user = require('./user');
var collection = 'user';

exports.all = function(done) {
	user.find({role: 'teacher'}, undefined, function(err, result) {
		done(err, result);
	});
};

exports.get = function(email, done) {
	user.get(email, function(err, result) {
		done(err, result);
	});
};

exports.getBySchool = function(school, done) {
	user.find({role: 'teacher', school: school}, undefined, function(err, result) {
		done(err, result);
	});
};

exports.getById = function(id, done) {
	user.findById(id, undefined, function(err, result) {
		if (result.role != 'teacher') result = 'NOT_A_TEACHER';
		done (err, result);
	});
};

exports.create = function(userData, done) {
	if (!userData.role == 'teacher') return done(undefined, 'NOT_A_TEACHER');
	user.create(userData, function(err, result) {
		done(err, result);
	});
};