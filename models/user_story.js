var db = require('../db');
var collection = 'story';

//Retrieve all stories
exports.all = function(done) {
	db.find(collection, undefined, undefined, function(err, result) {
		done(err, result);
	});
}

//Retrives all stories for a single user
exports.get = function(user, done){
  db.find(collection, {"user": user}, undefined, function(err, result){
    done(err, result);
  });
}

//Retrieves a single story by its story id
exports.getById = function(id, done) {
	db.findById(collection, id, undefined, function(err, result) {
		done(err, result);
	});
}

//Update a single stories status
exports.updateById = function(id, to_update, done){
  db.updateById(collection, id, to_update, done,function(err, result){
    done(err, result);
  });
}

exports.updateByQuery = function(search_params, update_params, done){
	db.update(collection, search_params, update_params, done, function(err, result){
		done(err, result);
	});
}
