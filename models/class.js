var db = require('../db');
var collection = 'class';

//teacher field is teacher's email
exports.create = function(name, teacher, difficulty, themes, done) {
	db.find(collection, {name: name, teacher: teacher}, undefined, function(err, result) {
		if (err) return done(err, undefined);
		if (result == 'EMPTY_RESULT') { //the class is not already created
			var classObj = {
				name: name,
				teacher: teacher,
				difficulty: difficulty,
				themes: themes
			};
			console.log(classObj);
			db.save(collection, classObj, function(err, saved_class, result) {
				done(err, saved_class);
			});
		}
		else {
			done(undefined, 'CLASS_ALREADY_EXISTS');
		}
	});
};

exports.get = function(name, teacher, done) {
	db.find(collection, {name: name, teacher: teacher}, undefined, function(err, result) {
		if (result == 'EMPTY_RESULT') return done(err, result);
		for (class_obj in result) break; //there will only be one result, which is stored in result[class_obj]
		done(err, result[class_obj]);
	});
};

exports.getByTeacher = function(teacher, done) {
	db.find(collection, {teacher: teacher}, undefined, function(err, result) {
		done(err, result);
	});
};