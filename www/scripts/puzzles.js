/* Define our namespace for Puzzles */
var PUZZLES = PUZZLES || {};
var database = "mongodb://localhost:27017/storybook-road";
/* Puzzle is an abstract class which describes the key components of a Puzzle */
PUZZLES.Puzzle = function(problem_number, question_id, text_id, problem_info){
  /* Holds what string should be displayed to the user for the problem */
  this.problem = problem_info.question;
  this.story_text = problem_info.story_text;
  this.failed_attempts = 0;
  this.puzzle_id = problem_info.puzzle_id;
  this.story_instance_id = problem_info.story_instance_id;
  this.problem_number = problem_number;
  this.question_id = $("#" + question_id)[0];
  this.text_id = $("#" + text_id)[0];
  this.character = problem_info.character;
  this.background = problem_info.background;
  console.log(this.character);
}
/* Displays the problem and the Puzzle to the user through a canvas*/
PUZZLES.Puzzle.prototype.display = function (canvas_id){
    //Need basic code, likely to be filled in more depth by children
}

/* Generates a Puzzle from a list of words specified in the database */
PUZZLES.Puzzle.prototype.generate_puzzle = function(canvas_id)
{
  //Develops the Puzzle to display on the fly from a list provided in the
  //database.
}

PUZZLES.Puzzle_1 = function(problem_number, question_id, text_id, problem_info)
{
  //Make Puzzle_1 inherit from Puzzle
  PUZZLES.Puzzle.call(this, problem_number, question_id, text_id, problem_info);
  var shuffled_answer = shuffle_string(problem_info.answer);
  /* make sure the string is actually shuffled */
  while(shuffled_answer == problem_info.answer){
      shuffled_answer = shuffle_string(problem_info.answer);
  }
  this.shuffled = shuffled_answer;
  this.story_text = this.story_text.replace("#answer", "<input id=\"problem\" name=\"problem\" value=\""+shuffled_answer+"\"></input>");
  this.story_text = this.story_text.replace("#character", this.character.name);
}
/* Displays the problem and the Puzzle to the user through a canvas*/
PUZZLES.Puzzle_1.prototype.display = function (canvas_id){
    var canvas = $("#"+canvas_id)[0].getContext('2d');
    //Need to figure out a decent way to load images
    var image = new Image(500,500);
    var character = new Image(350,350);
    image.src = "./assets/" + this.background.image;

    //Clear canvas and draw on the background and other images
    canvas.clearRect(0,0,canvas.width,canvas.height);
    image.onload = function(){
      canvas.drawImage(image,0,0);
    }
    character.src = "./assets/" + this.character.image;

    character.onload = function(){
      canvas.drawImage(character, 200, 0);
    }
    //Assign the text for the puzzle to the page
    //this.question_id.innerHTML = this.problem;
    this.text_id.innerHTML = this.story_text;

}

/* Generates a Puzzle from a list of words specified in the database */
PUZZLES.Puzzle_1.prototype.generate_puzzle = function(canvas_id)
{
  this.display(canvas_id);
  //Develops the Puzzle to display on the fly from a list provided in the
  //database.
}
PUZZLES.Puzzle_2 = function(problem_number, question_id, text_id, problem_info){
  PUZZLES.Puzzle.call(this,problem_number, question_id, text_id, problem_info);
  //Generate 3 different shuffled words
  var possible_answers = [problem_info.answer];
  var problems_to_generate = problem_info.answer.length > 3 ? 3 : problem_info.answer.length;

  while(problems_to_generate)
  {
    var shuffled = shuffle_string(problem_info.answer);
    if($.inArray(shuffled, possible_answers) == -1)
    {
      possible_answers[possible_answers.length] = shuffled;
      problems_to_generate--;
    }
  }
  //Shuffle our array, to provide randomization for our words
  shuffle_array(possible_answers);
  this.shuffled = possible_answers;

  //Generate our html string to replace the answer with
  var replace_string = "<select id=\"problem\">"
  for(var i = 0; i < possible_answers.length; i++)
  {
    replace_string += "<option value=\""+possible_answers[i]+"\">"+possible_answers[i]+"</option>";
  }
  replace_string += "</select>"
  this.story_text = this.story_text.replace("#answer", replace_string);
  this.story_text = this.story_text.replace("#character", this.character.name);
}

PUZZLES.Puzzle_2.prototype.generate_puzzle = function (canvas_id){
  this.display(canvas_id);
}
PUZZLES.Puzzle_2.prototype.display = function (canvas_id){
  var canvas = $("#"+canvas_id)[0].getContext('2d');
  //Need to figure out a decent way to load images
  var image = new Image(500,500);
  var character = new Image(350,350);
  image.src = "./assets/" + this.background.image;
  character.src="./assets/" + this.character.image;
  //Clear canvas and draw on the background and other images
  canvas.clearRect(0,0,canvas.width,canvas.height);
  image.onload = function(){
    canvas.drawImage(image,0,0);
  }
  character.onload = function(){
    canvas.drawImage(character, 200, 0);
  }

  //Assign the text for the puzzle to the page
  //this.question_id.innerHTML = this.problem;
  this.text_id.innerHTML = this.story_text;
}

//Helper function to shuffle an array, particularly important for puzzle 2
function shuffle_array(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex !== 0) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

//Shuffles a string, used for shuffling answers received from the database
function shuffle_string(unshuffled_str) {
    var a = unshuffled_str.split("")
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
