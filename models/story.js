var db = require('../db');
var theme = require('./theme');

var STORY_LENGTH = 2 //the number of 'middle' phrases used to create the story

//function to create a new story - the heavy lifting is done by generate_story()
exports.create = function (student, theme, difficulty) {
	var story = generate_story(student, theme, difficulty);
};

//helper function to generate a story
function generate_story(student, theme, difficulty) {
	
}