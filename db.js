//the MongoDB client
var MongoClient = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID; //for finding an object by id
var URL = 'mongodb://localhost:27017/storybook_road';

//this stores the state of the database - currently only the database object but we may want to change that later
var state = {
	db: null
};

//function to connect to the db
exports.connect = function (done) {
	if (state.db) return done(); //if the connection is already open return
	
	MongoClient.connect(URL, function(err, db) {
		if (err) return done(err);
		state.db = db;
		done();
	});
}

//function that returns the database object
exports.get = function() {
	return state.db;
}

//function to put something into the database
exports.save = function(collection, item, done) {
	state.db.collection(collection).insertOne(item, function(err, result) {
		done(err, result);
	});
}

//Function to find database objects
//If a query or projection is not needed, they must be declared as 'undefined' in the function call
exports.find = function(collection, query, projection, done) {
	state.db.collection(collection).find(query, projection, function(err, docs) {
		if (err) return done(err, undefined); //callback in the format done(err, docs)
		docs.count(function(countErr, count) {
			if (countErr) return done(countErr, undefined);
			if (count <= 0) {
				done(undefined, 'EMPTY_RESULT');
			}
			else {
				var result = {};
				docs.each(function(error, doc) {
					if (error) return done(error, undefined);
					if (doc == null) {//we've reached the end of the cursor
						done(undefined, result);
					}
					else
						result[doc._id] = doc;
				});
			}
		});
	});
}

//function to find database objects by id
exports.findById = function(collection, id, projection, done) {
	var o_id = new ObjectID(id);
	exports.find(collection, {_id: o_id}, projection, function(err, docs) {
		done(err, docs);
	});
}

//function to close the database connection
exports.close = function(done) {
	if (state.db) {
		state.db.close(function(err, result) {
			state.db = null;
			done(err); //this will be done(null) if there was no error
		});
	}
}