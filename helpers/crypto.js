var bcrypt = require('bcryptjs');

//hash a password
exports.encrypt = function (password, callback) {
	bcrypt.genSalt(10, function (err, salt) {
		if (err) return callback(err, undefined);
		bcrypt.hash(password, salt, function (error, hash) {
			callback(error, hash);
		});
	});
}

//compare a user-supplied password with a hashed password
exports.compare = function(userPassword, password, callback) {
	bcrypt.compare(userPassword, password, function(err, same) {
		if (err) return callback(err, undefined);
		callback(undefined, same);
	});
}

