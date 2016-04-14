var db = require('../db');
var theme = require('./theme');
var collection = 'story'

var STORY_LENGTH = 1; //the number of 'middle' phrases used to create the story
var NUM_PUZZLES = 3; //the total number of possible puzzles

//generate an array of the possible puzzle ids
var puzzles = [];
for (var i = 1; i <= NUM_PUZZLES; i++)
	puzzles.push(i);

//function to create a new story - the heavy lifting is done by generate_story()
exports.create = function (student, theme_name, difficulty, done) {
	generate_story(student, theme_name, difficulty, function (err, story) {
		if (err) return done(err, undefined);
		db.save(collection, story, function (err, result) {
			done(err, result);
		});
	});
};

//function to get a story by id
exports.get = function (id, done) {
	db.findById(collection, id, undefined, function (err, story) {
		done(err, story);
	});
}

//function to get all stories for a given student
exports.getByStudent = function (student, done) {
	db.find(collection, { student: student }, undefined, function (err, stories) {
		done(err, stories);
	});
};

//helper function to generate a story
function generate_story(student, theme_name, difficulty, done) {
	var difficulty_str = "level_" + difficulty; //difficulty are stored in the format level_1, etc. in theme.json

	//story object
	var story = {
		theme: "",
		student: student, //email of student
		progress: 0, //question # of current question
		phrases: [], //array of phrases (one for each puzzle)
		words: { //available words
			character: null,
			supporting: null,
			places: [],
			adjectives: [],
			answers: []
		},
		puzzles: [], //array of puzzle ids (must be in same order as phrases)
		statistics: {}, //to store statistics such as # of wrong answers, etc.
		background: {}
	};

	// get the theme to populate the story object
	theme.get(theme_name, function (err, theme_obj) {
		if (err) return done(err, undefined);
		// get theme name
		story.theme = theme_obj.name.toLowerCase();
		// container to hold phrase objects
		var temp_phrase = [];
		// get beginning phrase
		temp_phrase.push(choose_list_items(1, theme_obj.phrases.beginning));
		story.phrases.push(temp_phrase[0].phrase);
		// get middle phrases
		var middles = choose_list_items(STORY_LENGTH, theme_obj.phrases.middle);
		if(typeof !Array.isArray(middles))
			middles = [middles];
		middles.forEach(function (phrase) {
			temp_phrase.push(phrase);
			story.phrases.push(phrase.phrase);
		});

		// get end phrase
		temp_phrase.push(choose_list_items(1, theme_obj.phrases.end));
		story.phrases.push(temp_phrase[temp_phrase.length - 1].phrase); // push the last item of temp_phrase to phrases

		//get character and supporting
		story.words.character = choose_list_items(1, theme_obj.characters);
		story.words.supporting = choose_list_items(1, theme_obj.supporting);

		//get places
		theme_obj.places.forEach(function (place, i) { story.words.places.push(place) });

		//get adjectives
		theme_obj.adjectives.forEach(function (adj, i) { story.words.adjectives.push(adj) });

		//get answers at the correct difficulty level
		temp_phrase.forEach(function (phrase) { 
			story.words.answers.push(choose_list_items(1, phrase.answers[difficulty_str]));
		});	

		//generate puzzle numbers
		var puzzle_list = choose_list_items(story.phrases.length, puzzles); //one puzzle for each phrase
		puzzle_list.forEach(function (puzzle_id, i) { story.puzzles.push(puzzle_id) });

		//generate placeholder statistics
		story.phrases.forEach(function (phrase, i) {
			var stat_key = "question_" + (i + 1);
			var placeholder_text = "Placeholder statistics for question " + (i + 1);
			story.statistics[stat_key] = { placeholder: placeholder_text };
		});
		
		// get background object
		story.background = theme_obj.background;

		done(undefined, story);
	});
}

//helper function to choose a random item from a list
function choose_list_items(amount, list) {
	if (!Array.isArray(list)) throw list + " must be an array";
	if (amount > list.length) throw "amount must be less than or equal list length";
	var used_indicies = [];
	var chosen_items = [];
	for (var i = 0; i < amount; i++) {
		var index = Math.floor((Math.random() * list.length));
		while (used_indicies.indexOf(index) != -1) index = Math.floor((Math.random() * list.length));
		used_indicies.push(index);
		chosen_items.push(list[index]);
	}
	if (amount == 1) {
		return chosen_items[0];
	}
	return chosen_items;
}
