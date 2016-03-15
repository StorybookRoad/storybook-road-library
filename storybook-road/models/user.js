var db = require('../db.js');

exports.create = function(email, password, fname, lname, role, done) {
	var user = {
		email : email,
		password : password,
		fname : fname,
		lname : lname,
		role : role
	}
	
};