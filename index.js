/**
A server for Storybook Road.
@author Jeremy Dormitzer
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
});

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
				console.log('inserting account info');
				assert.equal(null, err);
				callback(result);
			});
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
