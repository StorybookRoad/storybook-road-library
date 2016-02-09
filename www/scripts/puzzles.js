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
  this.problem_number = problem_number;
  this.question_id = $("#" + question_id)[0];
  this.text_id = $("#" + text_id)[0];
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
  //Make Puzzle_1 inherit from Puzzlef
  PUZZLES.Puzzle.call(this, problem_number, question_id, text_id, problem_info);
  var shuffled_answer = shuffle_answer(problem_info.answer);
  /* make sure the string is actually shuffled */
  while(shuffled_answer == problem_info.answer){
      shuffled_answer = shuffle_answer(problem_info.answer);
  }
  this.shuffled = shuffled_answer;
  this.story_text = this.story_text.replace("#answer", "<input id=\"problem\" name=\"problem\" value=\""+shuffled_answer+"\"></input>");
}
/* Displays the problem and the Puzzle to the user through a canvas*/
PUZZLES.Puzzle_1.prototype.display = function (canvas_id){
    var canvas = $("#"+canvas_id)[0].getContext('2d');
    //Need to figure out a decent way to load images
    var image = $("#game_background")[0];

    //Clear canvas and draw on the background and other images
    canvas.clearRect(0,0,canvas.width,canvas.height);
    canvas.drawImage(image,0,0);

    //Assign the text for the puzzle to the page
    this.question_id.innerHTML = this.problem;
    this.text_id.innerHTML = this.story_text;

}

/* Generates a Puzzle from a list of words specified in the database */
PUZZLES.Puzzle_1.prototype.generate_puzzle = function(canvas_id)
{
  this.display(canvas_id);
  //Develops the Puzzle to display on the fly from a list provided in the
  //database.
}
function shuffle_answer(unshuffled_str) {
    var a = unshuffled_str.split(""),
        n = a.length;

    for(var i = n - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i];
        a[i] = a[j];
        a[j] = tmp;
    }
    return a.join("");
}
