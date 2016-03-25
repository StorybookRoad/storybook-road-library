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

/* Redraws the entire canvas */
PUZZLES.Puzzle.prototype.drawBackground = function(canvas_id,background, assets){
  var canvas = $("#"+canvas_id)[0].getContext('2d');
  var image = new Image(500,500);
  console.log(background);
  image.src = "./assets/" + background.image;
  var event = new Event("build_canvas");

  document.addEventListener("build_canvas", function(e){
    for(var i = 0;  i < assets.length; i++){
      window.puzzle.prototype.update(canvas_id, assets[i]);
    }

  }, false);

  //Clear canvas and draw on the background and other images
  canvas.clearRect(0,0,canvas.width,canvas.height);
  image.onload = function(){
    canvas.drawImage(image,0,0);
    document.dispatchEvent(event);
  }



}

/* Draw new assets over the background */
PUZZLES.Puzzle.prototype.update = function(canvas_id, asset){
  /* TODO: Need to support drawing based upon the grid provided to the system */
  var canvas = $("#"+canvas_id)[0].getContext('2d');
  var new_asset = new Image(350,350);
  new_asset.src="./assets/" + asset.image;
  new_asset.onload = function(){
    canvas.drawImage(new_asset, 200, 0);
    console.log("Drawing asset");
  }
}
/*Parses the tags it finds in the puzzle text */

PUZZLES.Puzzle.prototype.parse_tags = function(){
  this.story_text = this.story_text.replace("#character", this.character.name);
}

PUZZLES.Puzzle_1 = function(problem_number, question_id, text_id, problem_info)
{
  //Make Puzzle_1 inherit from Puzzle
  PUZZLES.Puzzle.call(this, problem_number, question_id, text_id, problem_info);
  this.prototype= PUZZLES.Puzzle.prototype;
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
  canvas.clearRect(0,0,canvas.width,canvas.height);
  var assets = [this.character]
  this.prototype.drawBackground(canvas_id, this.background, assets);
  this.text_id.innerHTML = this.story_text;
}

/* Generates a Puzzle from a list of words specified in the database */
PUZZLES.Puzzle_1.prototype.generate_puzzle = function(canvas_id, grid)
{
  this.display(canvas_id);
  //Develops the Puzzle to display on the fly from a list provided in the
  //database.
}
PUZZLES.Puzzle_2 = function(problem_number, question_id, text_id, problem_info){
  PUZZLES.Puzzle.call(this,problem_number, question_id, text_id, problem_info);
  this.prototype= PUZZLES.Puzzle.prototype;
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

PUZZLES.Puzzle_2.prototype.generate_puzzle = function (canvas_id, grid){
  this.display(canvas_id);
}
PUZZLES.Puzzle_2.prototype.display = function (canvas_id){
  var canvas = $("#"+canvas_id)[0].getContext('2d');
  canvas.clearRect(0,0,canvas.width,canvas.height);
  var assets = [this.character]
  this.prototype.drawBackground(canvas_id, this.background, assets);
  this.text_id.innerHTML = this.story_text;
}

PUZZLES.Puzzle_3 = function(problem_number, question_id, text_id, problem_info){
  PUZZLES.Puzzle.call(this,problem_number, question_id, text_id, problem_info);
  this.prototype= PUZZLES.Puzzle.prototype;
  this.shuffled = generate_random_chars(10);
  var str = problem_info.answer.split('');
  this.answer_length = str.length;
  var replace_string = "<span id=\"problem\">";
  for(var i = 0; i < str.length; i++)
  {
    this.shuffled[this.shuffled.length] = str[i]
    replace_string += "_";
  }
  this.shuffled = shuffle_array(this.shuffled);
  replace_string.trim();
  replace_string += "</span>"
  //Loop through and add the characters onto the canvas, will need to be gridded at some point
  //break up the answer and add characters to the array
  this.story_text = this.story_text.replace("#character", this.character.name);
  this.story_text = this.story_text.replace("#answer", replace_string)

}

PUZZLES.Puzzle_3.prototype.generate_puzzle = function(canvas_id, grid){

  var calculated_points = generate_points(this.shuffled.length, grid.length);
  console.log(calculated_points)
  for(var i = 0; i < this.shuffled.length; i++)
  {
    var button = document.createElement("BUTTON");
    var text = document.createTextNode(this.shuffled[i]);
    button.className = "puzzle_answer"
    button.value = this.shuffled[i];
    button.appendChild(text);
    button.onclick = function(){
      var answer = $("#problem").html();
      var j = 0;
      while(answer[j] != "_" && j <= answer.length)
      {
        j++;
      }
      if(j > answer.length)
        return;
      answer = answer.substr(0,j) + this.value + answer.substr(j+1, answer.length);
      $("#problem").html(answer);
    }
    button.submit = null;

    grid[calculated_points[i][0]][calculated_points[i][1]].html(button);
  }

  var button = document.createElement("BUTTON");
  button.onclick = function(){
    var answer = $("#problem").html();
    var j = answer.length-1;
    while ((answer[j] == " " || answer[j] == "_") && j >= 0)
    {
      j--;
    }
    if (j < 0)
      return;
    answer = answer.substr(0,j) + "_" + answer.substr(j+1,answer.length);
    $("#problem").html(answer);
  }
  var text = document.createTextNode("<=");
  button.className = "backspace";
  button.appendChild(text);

  $("#story_parts").append(button);
  this.display(canvas_id);
}

PUZZLES.Puzzle_3.prototype.display = function(canvas_id){
  var canvas = $("#"+canvas_id)[0].getContext('2d');
  canvas.clearRect(0,0,canvas.width,canvas.height);
  var assets = [this.character]
  this.prototype.drawBackground(canvas_id, this.background, assets);

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

function generate_random_chars(size){
  var toReturn = [];
  //Generate a character a-z and add to array.
  for(var i = 0; i < size; i++)
  {
    var value = Math.random();
    toReturn[i] = String.fromCharCode(value * (122-97) + 97);
  }

  return toReturn;
}

function generate_points(number_of_items, size_of_grid){
  var points = [];
  var hashed = {};
  for(var i = 0; i < number_of_items; i++)
  {
    hashed = hash_array(points);
    var point = [Math.floor((Math.random() * size_of_grid)), Math.floor((Math.random() * size_of_grid))];
    while(hashed.hasOwnProperty(point))
    {
      point = [Math.floor((Math.random() * size_of_grid)), Math.floor((Math.random() * size_of_grid))];
    }

    points[i] = point;
  }
  return points;
}

function hash_array(array)
{
  var hash = {};
  for(var i = 0 ; i < array.length; i += 1) {
      hash[array[i]] = i;
  }

  return hash;
}
