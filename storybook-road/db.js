//the MongoDB client
var MongoClient = require('mongodb').MongoClient;
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
		if (err) return done(err);
		done(result);
	});
}

//Overload of exports.find that finds documents in the db using find(query, projection)
//Returns a cursor to the found objects, if any
//If a query or projection is not needed, they must be declared as 'undefined' in the function call
exports.find = function(collection, query, projection, done) {
	state.db.collection(collection).find(query, projection, function(err, docs) {
		if (err) return done(err, undefined); //callback in the format done(err, docs)
		done(undefined, docs);
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