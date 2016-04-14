var db = require('../db');
var user = require('./user');
var classModel = require('./class');
var collection = 'user';

//function to get all students
exports.all = function(done) {
	user.find({role: 'student'}, undefined, function(err, result) {
		done(err, result);
	});
};

//function to get a student by email
exports.get = function (email, done) {
	user.get(email, function (err, result) {
		done(err, result);
	});
};

//function to update the difficulty field of a student
exports.updateDifficulty = function (email, new_difficulty, done) {
	db.updateOne(collection, { email: email, role: 'student' }, { $set: { difficulty: new_difficulty } }, function (err, status) { 
		done(err, status);
	});
};

//function to get all students in a class
exports.getByClass = function(class_name, teacher, done) {
	user.find({role: 'student', class: class_name, teacher: teacher}, undefined, function(err, result) {
		done(err, result);
	});
};

//function to get a student by their mongodb id
exports.getById = function(id, done) {
	user.findById(id, undefined, function(err, result) {
		if (result.role !== 'student') result = 'NOT_A_STUDENT';
		done (err, result);
	});
};

//function to create a new student
exports.create = function(userData, done) {
	if (!userData.role == 'student') return done(undefined, 'NOT_A_STUDENT');
	
	//get difficulty level from class
	classModel.get(userData.class, userData.teacher, function (err, result) {
		if (err) return done(err, undefined);
		userData.difficulty = result.difficulty;
		user.create(userData, function (err, student, result) {
			done(err, student);
		});	
	});
};