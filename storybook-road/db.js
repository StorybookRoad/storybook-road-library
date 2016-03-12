//the MongoDB client
var MongoClient = require('mongodb').MongoClient;
var URL = 'mongodb://localhost:27017/storybook_road';

//this stores the state of the database
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

//function to close the database connection
exports.close = function(done) {
	if (state.db) {
		state.db.close(function(err, result) {
			state.db = null;
			done(err); //this will be done(null) if there was no error
		});
	}
}