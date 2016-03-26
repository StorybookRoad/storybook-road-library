var db = require('../db');
var collection = 'story';

//Retrieve all stories
exports.all = function(done) {
	db.find(collection, undefined, undefined, function(err, result) {
		done(err, result);
	});
};

//Retrives all stories for a single user
exports.get = function(user, done){
  db.find(collection, {"user": user}, undefined, function(err, result){
    done(err, result);
  });
}

//Retrieves a single story by its story id
exports.getById = function(id, done) {
	db.findById(collection, id, undefined, function(err, result) {
    for(story in result) break;
		done(err, result[story]);
	});
};
//May be possible to create a story using this model
/*exports.create = function(userData, done) {
	if (!userData.role == 'student') return done(undefined, 'NOT_A_STUDENT');
	user.create(userData, function(err, result) {
		done(err, result);
	});
};*/
//Update a single stories status
exports.updateById = function(id, to_update, done){
  db.updateById(collection, id, to_update, done,function(err, result){
    done(err, result)
  });
}
