/**
  *A server for Storybook Road.
  *@author Jeremy Dormitzer
  */
var mongo = require("mongodb");
var MongoClient = mongo.MongoClient;
var assert = require('assert');
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var path = require('path');

var port = process.env.PORT || 8080;
var mongo_url = 'mongodb://localhost:27017/storybook_road';

app.use(express.static(path.join(__dirname, '/www')));

app.get('/', function (req, res) {
	res.sendFile(path.join('/index.html'));
});

io.on('connection', function(client) {
	/* Retrieve information regarding the puzzle and possibly the story */

	client.on('game',function(data){
			MongoClient.connect(mongo_url, function(err,db){
			if(err){
				console.log("FAILED");
				client.emit("game_failed");
			}
			var user_data = data;
			var puzzle_data = {};
			generate_game(db, data, function(result){
				if(result != 0){
					puzzle_data.progress = result.progress;
					puzzle_data.story_template_id = result.story_template_id;
					puzzle_data.story_instance_id = user_data.story_instance_id;
					generate_instance_data(db,puzzle_data,function(result)
					{
						if(result != 0)
						{
							puzzle_data.character = result.character;
							puzzle_data.story_text = result.phrases[puzzle_data.progress];
							puzzle_data.puzzle_id = result.problem_ids[puzzle_data.progress];
							puzzle_data.background = result.background;
							if(puzzle_data.progress == result.problem_ids.length)
							{
								client.emit("story_finished");
								db.close();
							}
							retrieve_puzzle(db, puzzle_data,function(result){
								puzzle_data.puzzle_id = result.puzzle_id;
								puzzle_data.answer = result.answer;
								puzzle_data.puzzle_type = result.puzzle_type;
								client.emit("game_info", puzzle_data);
								db.close();
							});
						}
					});

				}
				else {
					client.emit("game_failed");
					db.close();
				}
			});
		});
	});

	client.on('puzzle_ending', function(data){
		MongoClient.connect(mongo_url, function (err, db) {
			if(err){
				console.log("FAILED");
			}
			confirm_puzzle(db, data, function(result){
				if(data.user_answer == result.answer)
				{
					client.emit("user_correct");
					//update_user_error_counts();
					update_story_status(db, data,function(){
						client.emit("page_update");
					});
				}
				else {
					client.emit("user_incorrect");

				}
				db.close();
			});
		});
	});

	client.on('get_story_template', function(data) {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null, err);
			generate_story_template(db, data, function(result) {
				client.emit('story_template_received', result);
				db.close();
			});
		});
	});

	client.on('create_account_student', function (data) {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null,err);
			insert_student_account(db, data, function(result) {
				if (result == 0) {
					client.emit('server_error', {'message':'email_already_taken'});
				}
				else {
					client.emit('account_created');
				}
				db.close();
			});
		});
	});


	client.on('create_account_teacher', function (data) {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null,err);
			insert_teacher_account(db, data, function(result) {
				if (result == 0) {
					client.emit('server_error', {'message':'email_already_taken'});
				}
				else {
					client.emit('account_created');
				}
				db.close();
			});
		});
	});

	client.on('get_school_list', function() {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null,err);
			get_schools(db, function(schools) {
				client.emit('school_list', schools);
				db.close();
			});
		});
	});

	client.on('get_teacher_list', function(school) {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null, err);
			get_teachers(db, school, function(teachers) {
				client.emit('teacher_list', teachers);
				db.close();
			});
		});
	});

	client.on('get_student_classes', function(teacher_email) {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null, err);
			get_class_list(db, teacher_email, function(classes) {
				client.emit('student_classes', classes);
				db.close();
			});
		});
	});

	client.on('get_students', function(args) {
		MongoClient.connect(mongo_url, function(err, db) {
			assert.equal(null, err);
			get_students(db, args, function(students) {
				client.emit('student_list', students);
				db.close();
			});
		});
	});

	client.on('login', function(credentials) {
		MongoClient.connect(mongo_url, function (err,db) {
			assert.equal(null, err);
			login(db, credentials, function(result) {
				if (result == 0) {
					client.emit('server_error', {'message':'email_does_not_exist'});
				}
				else if (result == 1) {
					client.emit('server_error', {'message':'credentials_do_not_match'});
				}
				else {
					var login_info = {
						'email':result.email,
						'type':result.type
					};
					client.emit('credentials_accepted', login_info);
				}
				db.close();
			});
		});
	});

	client.on('create_class', function (data) {
		MongoClient.connect(mongo_url, function (err, db) {
			assert.equal(null, err);
			create_class(db, data, function (result) {
				if (result == 0) {
					client.emit('server_error', {'message':'class_already_exists'});
					db.close();
				}
				else {
					update_client_class_list(data.email, db, function(result) {
						client.emit('update_class_list', result);
						db.close()
					});
				}
			});
		});
	});

	client.on('get_classes', function (email) {
		MongoClient.connect(mongo_url, function (err, db) {
			assert.equal(null, err);
			update_client_class_list(email, db, function(result) {
				client.emit('update_class_list', result);
				db.close();
			});
		});
	});
});

function create_class(db, data, callback) {
	var cursor = db.collection('storybook_road_classes').find( {$and:[{'email':data.email}, {'class_name':data.class_name} ] } );
	cursor.count(function (err, count) {
		assert.equal(null, err);
		if (count > 0) {
			console.log("class already exists");
			callback(0);
		}
		else {
			db.collection('storybook_road_classes').insertOne(data, function (err, result) {
				assert.equal(null, err);
				callback(result);
			});
		}
	});
}

function login (db, credentials, callback) {
	var cursor = db.collection('storybook_road_accounts').find({'email':credentials.email});
	cursor.count(function (err, count) {
		assert.equal(null, err);
		if (count == 0) {
			callback(0);
		}
		else {
			cursor.next(function (err, result) {
				assert.equal(null,err);
				if (credentials.password == result.password) {
					callback(result);
				}
				else {
					callback(1);
				}
			});
		}
	});
}

function insert_teacher_account(db, data, callback) {
	var cursor = db.collection('storybook_road_accounts').find({'email':data.email});
	cursor.count(function (err, count) {
		assert.equal(null, err);
		if (count > 0) {
			console.log('account already exists');
			callback(0);
		}
		else {
			db.collection('storybook_road_accounts').insertOne(data, function(err, result) {
				assert.equal(null, err);
				callback(result);
			});
		}
	});
}

function insert_student_account(db, data, callback) {
	var cursor = db.collection('storybook_road_accounts').find({'email':data.email});
	cursor.count(function (err, count) {
		assert.equal(null, err);
		if (count > 0) {
			callback(0);
		}
		else {
			db.collection('storybook_road_accounts').insertOne(data, function(err, result) {
				assert.equal(null, err);
				callback(result);
			});
		}
	});
}

function update_client_class_list(email, db, callback) {
	var result = {};
	var cursor = db.collection('storybook_road_classes').find({'email':email});
	cursor.each(function (err, class_obj) {
		assert.equal(err, null);
		if (class_obj == null) {
			callback(result);
		}
		else {
			result[class_obj._id] = class_obj;
		}
	});
}

function get_schools(db, callback) {
	var schools = {};
	var cursor = db.collection('storybook_road_accounts').find({'type':'teacher'}, {school: 1});
	cursor.each(function (err, doc) {
		assert.equal(err,null);
		if (doc == null) {
			callback(schools);
		}
		else {
			schools[doc.school] = doc.school;
		}
	});
}

function get_teachers(db, school, callback) {
	var teachers = {};
	var cursor = db.collection('storybook_road_accounts').find({'type':'teacher', 'school':school},{fname: 1, lname: 1, email: 1});
	cursor.each(function (err, doc) {
		assert.equal(err, null);
		if (doc == null) {
			callback(teachers);
		}
		else {
			teachers[doc.email] = doc;
		}
	});
}

function get_class_list(db, teacher_email, callback) {
	var classes = {};
	var cursor = db.collection('storybook_road_classes').find({'email':teacher_email});
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc == null) {
			callback(classes);
		}
		else {
			classes[doc._id] = doc;
		}
	});
}

function get_students(db, args, callback) {
	var students = {};
	var class_name = args.class_name;
	var email = args.email;

	var cursor = db.collection('storybook_road_accounts').find({'type':'student', 'teacher':email, 'class':class_name},{'fname': 1, 'lname': 1, 'email': 1});
	cursor.each(function(err, doc) {
		assert.equal(err, null);
		if (doc == null) {
			callback(students);
		}
		else {
			students[doc._id] = doc;
		}
	});
}

function generate_game(db, data, callback){
	var id = new mongo.ObjectID(data.story_instance_id);
	var cursor = db.collection('storybook_road_story_instance').find({"_id":id});
		cursor.count(function(err, count) {
		if(err){
			console.log(err);
		}
		if(count > 0){
			cursor.next(function(err, result){
					assert.equal(null, err);
					callback(result);
			});
		}
		else{
			console.log("Story could not be found");
			callback(0);
		}
		assert.equal(null, err);
	});
}

function generate_instance_data(db, data, callback)
{
	var id = new mongo.ObjectID(data.story_template_id);
	var cursor = db.collection('storybook_road_story_templates').find({"_id": id});
	cursor.count(function(err, count)
	{
		if (err) {
			console.log(err);
		}
		if(count > 0){
			cursor.next(function(err, result){
				assert.equal(null, err);
				callback(result);
			});
		}
		else {
			console.log("Puzzle could not be generated");
			callback(0);
		}
	});
}

function retrieve_puzzle(db, data, callback)
{
	var cursor = db.collection('storybook_road_puzzles').find({"puzzle_id": data.puzzle_id});
	cursor.count(function(err, count) {
		if(err){
			console.log(err);
		}
		if(count > 0){
			cursor.next(function(err, result){
					assert.equal(null, err);
					callback(result);
			});
		}
		else{
			console.log("Puzzle not found");
			callback(0);
		}
		assert.equal(null, err);

	});

}

function confirm_puzzle(db, data, callback){
	var cursor = db.collection('storybook_road_puzzles').find({"puzzle_id": data.puzzle_id});
	cursor.count(function(err, count) {
		if(err){
			console.log(err);
		}
		if(count > 0){
			cursor.next(function(err, result){
					assert.equal(null, err);
					callback(result);
			});
		}
		else{
			console.log("Puzzle not found");
			callback(0);
		}
		assert.equal(null, err);
	});
}

function generate_story_template(db, data, callback) {
	var template_data = {
		'teacher':data.email,
		'problem_ids': [1, 2], //to be pulled from db
		'class_name': data.class_name,
		'character': {'name':'Prickly Pete'}, //to be pulled from db
		'difficulty': data.grade,
		'phrases': [ //to be pulled from db
			"#character needs to find the #answer",
			"#character has to slay with the #answer"
		],
		'background':{'image':'ManInMoon.png'}
	};
	db.collection('storybook_road_story_templates').insertOne(template_data, function(err, result) {
		assert.equal(null, err);
		callback(template_data);
	});
}

function update_story_status(db, data, callback)
{
	var id = new mongo.ObjectID(data.story_instance_id);
	var cursor = db.collection('storybook_road_story_instance').update({"_id": id}, {$set : {"progress":data.problem_number+1}});
	if(cursor.nModified)
	{
		callback(1);
	}
	callback(0);
}

server.listen(port);
