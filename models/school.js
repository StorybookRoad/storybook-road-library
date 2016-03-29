var db = require('../db');
var collection = 'school';

exports.create = function(name, done) {
	//school names must be unique
	db.find(collection, {name: name}, undefined, function(err, result) {
		if (err) return done(err, undefined);
		if (result == 'EMPTY_RESULT') { //the school does not yet exist
			var school = {
				name: name
			};

			db.save(collection, school, function(err, school, result) {
				done(err, school);
			});
		}
		else {
			done(undefined, "SCHOOL_ALREADY_EXISTS");
		}
	});
}

exports.get = function(name, done) {
	db.find(collection, {name: name}, undefined, function(err, result) {
		if (err) return done(err, undefined);
		done(undefined, result);
	});
}

exports.all = function(done) {
	db.find(collection, undefined, undefined, function(err, result) {
		if (err) return done(err, undefined);
		done(undefined, result);
	});
}
