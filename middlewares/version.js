var fs = require('fs');
var assert = require('assert');

// Get the version number from version.json and pass it to the response
module.exports = function (req, res, next) {
	fs.readFile('./json/version.json', function (err, data) {
		assert.equal(err, null);
		var version = JSON.parse(data)["version-string"];
		res.locals.version = version;
		next()
	});
};