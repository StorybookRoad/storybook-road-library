var db = require('../db');
var user = require('./user');
var collection = 'user';

exports.all = function(done) {
	user.find({role: 'student'}, undefined, function(err, result) {
		done(err, result);
	});
};

exports.get = function(email, done) {
	user.find({role: 'student', email: email}, undefined, function(err, result) {
		done(err, result);
	});
};

exports.create = function(userData, done) {
	if (!userData.role == 'student') return done(undefined, 'NOT_A_STUDENT');
	user.create(userData, function(err, result) {
		done(err, result);
	});
};