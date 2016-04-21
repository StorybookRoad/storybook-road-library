var ObjectID = require('mongodb').ObjectID;
var express = require('express');
var router = express.Router();
var assert = require('assert');
var story = require('../models/user_story');
var auth = require('../middlewares/auth');
var fs = require('fs');
router.get('/', auth.authStudent, function(req, res, next) {
    res.render('user_story', {user: req.session.user, story: req.session.story});
});


router.post('/update_story', function(req, res, next){
  //Process User information from the form, and then update the puzzle if needed
  var user_story = req.session.story;
  var story_id = user_story._id;
  var user_answer = req.body.user_answer;

  //Retrieve the story from the database to check the answer.
  story.getById(story_id, function(err, result){
    assert.equal(null,err);
    //User correctly answered

    var progress = result.progress;
    if(user_answer == result.words.answers[progress]){
      var update = {"$set": {"progress": progress + 1}};

      story.updateById(story_id, update, function(err, results){
        //Update our session amd redraw the page for the next problem
        assert.equal(null, err);
        result.progress++;
        req.session.story = result;
        res.send({message: "reload"});
      });
    }
    else {
      //Alert the current page to update our current number of missses.
      var update_string = "statistics.question_"+(progress+1)+".missed";
      var update_object = {};
      update_object[update_string] = 1;
      var update = {"$inc":update_object};
      story.updateById(story_id, update, function(err, results){
        assert.equal(null);
        res.send({message: "INCORRECT_ANSWER"});
      });

    }
  });
});

function determine_problem_phrase(result, response){
  var progress = result.progress;
  if(progress >= result.phrases.answer.length)
  {
    response["finished"] = "Congratulations! You finished the story.";
    return ;
  }
  for(var prop in result){
    if(result.hasOwnProperty(prop)){
      switch(prop){
        case "phrases":
          for(var phrase in result.phrases){
            if(typeof result.phrases[phrase] == "string")
              response[phrase] = result.phrases[phrase]
            else{
              response[phrase] = result.phrases[phrase][progress];
            }

          }
          break;
        case "puzzles":
        case "statistics":
          response[prop] = result[prop][progress];
          break;
        default:
          response[prop] = result[prop];
          break;

      }
    }
  }
}
module.exports = router;
