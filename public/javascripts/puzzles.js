/* Define our namespace for Puzzles */
var PUZZLES = PUZZLES || {};
/* Puzzle is an abstract class which describes the key components of a Puzzle */
PUZZLES.Puzzle = function( question_id, text_id, problem_info){
  /* Holds what string should be displayed to the user for the problem */
  this.story_text = problem_info.story_text;
  this.question_id = $("#" + question_id)[0];
  this.text_id = $("#" + text_id)[0];
  this.character = problem_info.character;
  this.supporting = problem_info.supporting;
  this.place = problem_info.place;
  this.background = problem_info.background;
  this.images = [];

  this.parse_tags = function(){
    var regex = /(#[a-zA-Z0-9]+)/g;
    var matches = this.story_text.match(regex);
    for(var i = 0; i < matches.length; i++)
    {
      var prop_name = matches[i].substr(1,matches[i].length);
      if(prop_name == "answer")
        continue;
      this.story_text = this.story_text.replace(matches[i], this[prop_name]);
      this.images.push("./public/images/" + this[prop_name] + ".png");
      this.images.push("./public/images/" + this[prop_name] + ".gif");
    }
  }

  this.drawPuzzle = function (){

  }

  this.generate_puzzle = function(canvas_id, grid){
    //For now, ignore the grid

    this.display(canvas_id);
  }

  this.display  = function(canvas_id){
    var canvas = $("#"+canvas_id)[0].getContext('2d');
    canvas.clearRect(0,0,canvas.width,canvas.height);


    for(var i = 0; i < this.images.length; i++)
    {
      var image = new Image();
      image.src = this.images[i];

      image.onerror = function(){

      }

      image.onload = function(canvas_id){
        console.log("This is an image");

        console.log(this);
      }

    }


    this.text_id.innerHTML = this.story_text;
  }
}

PUZZLES.Puzzle_1 = function(question_id, text_id, problem_info)
{
  //Make Puzzle_1 inherit from Puzzle
  PUZZLES.Puzzle.call(this, question_id, text_id, problem_info);
  var shuffled_answer = shuffle_string(problem_info.answer);
  /* make sure the string is actually shuffled */
  while(shuffled_answer == problem_info.answer){
      shuffled_answer = shuffle_string(problem_info.answer);
  }
  this.shuffled = shuffled_answer;
  this.parse_tags();
  this.story_text = this.story_text.replace("#answer", "<input id=\"problem\" name=\"problem\" value=\""+shuffled_answer+"\"></input>");
  console.log(this.story_text)
}

PUZZLES.Puzzle_2 = function(question_id, text_id, problem_info){
  PUZZLES.Puzzle.call(this, question_id, text_id, problem_info);
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
  this.parse_tags();
}

PUZZLES.Puzzle_3 = function(question_id, text_id, problem_info){
  PUZZLES.Puzzle.call(this, question_id, text_id, problem_info);

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
  this.story_text = this.story_text.replace("#answer", replace_string)
  this.parse_tags();

  this.generate_puzzle = function(canvas_id, grid){

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

//Shuffles a string, used for shuffling answers
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
