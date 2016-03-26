var express = require('express');
var router = express.Router();
var assert = require('assert');

var story = require('../models/story');
var auth = require('../middlewares/auth');

router.get('/', function(req, res, next) {
  var story_id = req.session.story.story_id;
	story.getById(story_id, function(err, result) {
		assert.equal(null, err);
		res.render('user_story', {story: result});
	});
});

router.post('/update_story', function(req, res, next){
  //Process User information from the form, and then update the puzzle if needed
  var story = req.session.story;
  var story_id = story.story_id;
  var progress = story.progress;
  var user_answer = story.answer;
  var failed = story.failed_attempts;

  //Retrieve the story from the database to check the answer.
  story.getById(story_id, function(err, result){
    assert.equal(null,err);
    //User correctly answered
    //TODO: Figure out where problem answers are actually stored
    if(user_answer == result.answers[progress]){
      var update = {$set: {"progress": progress + 1}, $push:{"statistics": failed}};

      story.updateById(story_id, update, function(err, results){
        //Update our session amd redraw the page for the next problem
        assert.equal(null, err);
        result.progress++;
        req.session.story = result;
        res.render('user_story', {story: result});
      });
    }
    else {
      //Alert the current page to update our current number of missses.
      res.send({message: "INCORRECT_ANSWER"});
    }
  });
});

module.exports = router;
