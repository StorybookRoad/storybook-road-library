var fs = require('fs');
var templatePath = '../models/template.json'

//function to get a template based on theme(string) and difficulty(int)
exports.getTemplate = function (theme, difficulty, done) {
	fs.readFile(templatePath, function (err, data) {
		if (err) return done(err, undefined);
		var template_title = theme + "-" + difficulty;
		done(undefined, data[template_title]);
	});
};