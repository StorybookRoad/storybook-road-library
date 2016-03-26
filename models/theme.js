var fs = require('fs');
var themePath = './json/theme.json'

//function to get a theme based on name string
exports.getTheme = function (name, done) {
	fs.readFile(themePath, function (err, data) {
		if (err) return done(err, undefined);
		var theme = JSON.parse(data)[name];
		done(undefined, theme);
	});
};

//function to return all available themes
exports.all = function (done) {
	fs.readFile(themePath, function (err, data) {
		if (err) return done(err, undefined);
		var themes = JSON.parse(data);
		done(undefined, themes);
	});
};