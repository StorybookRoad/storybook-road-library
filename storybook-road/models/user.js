var db = require('../db.js');
var collection = "user";

//user data object: {email, password, fname, lname, school, role}
//role is an object representing the type of user (student or teacher). It contains role-specific data
exports.create = function(userData, done) {
	//first check if user already exists
	db.find(collection, {email: userData.email}, undefined, function(err, result) {
		if (err) return done(err, undefined);
		if (result == 'EMPTY_RESULT') //the user does not yet exist
			insertUser(userData, done);
		else
			done(undefined, "USER_ALREADY_EXISTS");
		
	});
	//helper function to avoid excessive callbacks
	function insertUser(userData, done) {
		db.save(collection, userData, function(result) {
			done(undefined, 'SUCCESS');
		});
	}
};