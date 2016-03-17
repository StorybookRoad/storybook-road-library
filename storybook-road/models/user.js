var db = require('../db.js');
var collection = "users";

//user data object: {email, password, fname, lname, school, role}
//role is an object representing the type of user (student or teacher). It contains role-specific data
exports.create = function(userData, done) {
	//first check if user already exists
	db.find(collection, {email: userData.email}, undefined, function(err, cursor) {
		if (err) return done(err);
		cursor.count(function(err, count) {
			if (err) return done(err);
			if (count > 0) return done("user already exists");
			//implied else
			insertUser();
		});
	});
	//helper function to avoid excessive callbacks
	function insertUser() {
		db.save(collection, userData, function(result) {
			done(result);
		});
	}
};