var db = require('../db');
var user = require('./user');
var collection = 'user';

exports.all = function(done) {
	user.find({role: 'student'}, undefined, function(err, result) {
		done(err, result);
	});
};

exports.get = function(email, done) {
	user.get(email, function(err, result) {
		done(err, result);
	});
};

exports.getByClass = function(class_name, done) {
	user.find({role: 'student', class: class_name}, function(err, result) {
		done(err, result);
	});
};

exports.getById = function(id, done) {
	user.findById(id, undefined, function(err, result) {
		if (result.role !== 'student') result = 'NOT_A_STUDENT';
		done (err, result);
	});
};

exports.create = function(userData, done) {
	if (!userData.role == 'student') return done(undefined, 'NOT_A_STUDENT');
	user.create(userData, function(err, result) {
		done(err, result);
	});
};