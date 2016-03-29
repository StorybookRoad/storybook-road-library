var fs = require('fs');
var themePath = './json/theme.json'

//function to get a theme based on name string
exports.get = function (name, done) {
	fs.readFile(themePath, function (err, data) {
		if (err) return done(err, undefined);
		var theme = JSON.parse(data)[name];
		if (!theme) return done(err, 'EMPTY_RESULT');
		done(err, theme);
	});
};

// function to get a list of themes
// @param names is an array of theme names
exports.getList = function (names, done) {
	fs.readFile(themePath, function (err, data) {
		if (err) return done(err, undefined);
		var themes = JSON.parse(data);
		var result = {};
		names.forEach(function (arg, i) {
			var theme = themes[arg];
			if (!theme) return done(arg + ' is not a theme', undefined);
			result[arg] = theme;
		});
		done(undefined, result);
	});
}

//function to return all available themes
exports.all = function (done) {
	fs.readFile(themePath, function (err, data) {
		if (err) return done(err, undefined);
		var themes = JSON.parse(data);
		done(err, themes);
	});
};