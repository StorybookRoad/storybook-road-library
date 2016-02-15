/**
  *A server for Storybook Road.
  *@author Jeremy Dormitzer
  */

var MongoClient = require('mongodb').MongoClient;
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

server.listen(port);
