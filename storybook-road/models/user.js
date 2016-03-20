var db = require('../db');
var crypto = require('../crypto');
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
		//hash the password
		crypto.encrypt(userData.password, function(err, hash) {
			if (err) return done(err, undefined);
			userData.password = hash;
			db.save(collection, userData, function(result) {
				done(undefined, 'SUCCESS');
			});	
		});
	}
};

exports.get = function(email, done) {
	db.find(collection, {email: email}, undefined, function(err, result) {
		if (err) return done (err, undefined);
		if (result == 'EMPTY_RESULT') return done (undefined, 'USER_NOT_FOUND');
		for (user in result) break; //this sets 'user' to be the returned user (since result will only have one object)
		done (undefined, result[user]);
	});
}

exports.find = function(query, projection, done) {
	db.find(collection, query, projection, function(err, result) {
		done(err, result);
	});
};

exports.findById = function(id, projection, done) {
	db.findById(collection, id, projection, function(err, result) {
		for (user in result) break; //this sets 'user' to be the returned user (since result will only have one object)
		done (undefined, result[user]);
	});
};