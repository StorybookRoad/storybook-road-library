var db = require('../db.js');
var collection = "users";

exports.create = function(email, password, fname, lname, role, done) {
	//first check if user already exists
	db.find(collection, {email: email}, undefined, function(err, cursor) {
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
		var user = {
			email : email,
			password : password,
			fname : fname,
			lname : lname,
			role : role
		}
		db.save(collection, user, function(result) {
			done(result);
		});
	}
};