var db = require('../db');
var collection = 'class';

//teacher field is teacher's email
exports.create = function(name, teacher, done) {
	db.find(collection, {name: name, teacher: teacher}, undefined, function(err, result) {
		if (err) return done(err, undefined);
		if (result == 'EMPTY_RESULT') { //the class is not already created
			var classObj = {
				name: name,
				teacher: teacher
			};
			db.save(collection, classObj, function(err, result) {
				done(err, result);
			});
		}
		else {
			done(undefined, 'CLASS_ALREADY_EXISTS');
		}
	});
};

exports.get = function(name, teacher, done) {
	db.find(collection, {name: name, teacher: teacher}, undefined, function(err, result) {
		done(err, result);
	});
};

exports.getByTeacher = function(teacher, done) {
	db.find(collection, {teacher: teacher}, undefined, function(err, result) {
		done(err, result);
	});
};