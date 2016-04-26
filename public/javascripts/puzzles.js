
/* Define our namespace for Puzzles */
var PUZZLES = PUZZLES || {};
/* Puzzle is an abstract class which describes the key components of a Puzzle */
PUZZLES.Puzzle = function( question_id, text_id, problem_info){
  /* Holds what string should be displayed to the user for the problem */
  if(problem_info.progress >= problem_info.phrases.length){
    this.phrase = "Congrats on finishing!";
    return;
  }
  var progress = problem_info.progress;
  this.phrase = problem_info.phrases[progress % problem_info.phrases.length];
  this.question_id = $("#" + question_id)[0];
  this.text_id = $("#" + text_id)[0];
  this.character = problem_info.words.character;
  this.supporting = problem_info.words.supporting;
  this.place = problem_info.words.places[progress % problem_info.words.places.length];
  this.adjective = problem_info.words.adjectives[progress % problem_info.words.adjectives.length];
  this.background = problem_info.background;
  this.template = problem_info.theme;
  this.images = [];
  this.found = [];

  //Parses through the tags in a phrase, and adds the need files to the images list
  this.parse_tags = function(answer){
    this.images = [{"name":"./images/"+this.background.image_name, "x": 0, "y":0}];
    //find image names, and give them their position on the canvas
    var regex = /(#[a-zA-Z0-9]+)/g;
    var matches = this.phrase.match(regex);
    var offsetX = -200;
    var offsetY = 400;
    for(var i = 0; i < matches.length; i++)
    {
      var prop_name = matches[i].substr(1,matches[i].length);
      if(prop_name == "answer")
        continue;
      offsetX += 200;
      if(offsetX > 1000)
      {
        offsetX = 0;
        offsetY -= 400;
      }
      this.phrase = this.phrase.replace(matches[i], this[prop_name]);
      var image_name = "/"+this.template+"/"+this[prop_name].toLowerCase().split(" ").join("_");
      if(this.found.indexOf(image_name) == -1){
        this.found.push(image_name);
        //Place should always be located on the top left of the map
        if(prop_name == "place")
        {
          this.images.push({"name":"/images" + image_name + ".png", "x":824, "y":0});
          offsetX -= 200;
        }
        else {
          this.images.push({"name":"/images" + image_name + ".png", "x":offsetX, "y":offsetY});
        }


      }
    }
    this.images.push({"name": "/images/" + this.template + "/" + answer + ".png", "x": offsetX, "y":offsetY});
  }
  //A method overwritten later
  this.generate_puzzle = function(canvas_id){
    //For now, ignore the grid
    this.display(canvas_id);
  }

  //Generic display code to load images and ready them for the canvas
  this.display  = function(canvas_id){
    window.images = [];
    var canvas = $("#"+canvas_id)[0].getContext('2d');
    canvas.clearRect(0,0,canvas.width,canvas.height);
    for(var i = 0; i < this.images.length; i++)
    {
      if(this.images[i].name.indexOf("gif") != -1){
        if(window.isBackgroundSet)
          continue;
        var image = new Image();
        image.src = this.images[i].name;
        $("#story_parts").before(image);
        bookmarklet();
        image.click();
        window.isBackgroundSet = true;
      }
      else{
        var image = new Image();
        image.src = this.images[i].name;
        var x = this.images[i].x;
        var y = this.images[i].y;
        image.setAttribute("x",x);
        image.setAttribute("y",y);
        image.onerror = function(){
          this.ready = true;
        }

        image.onload = function(){
          window.images.push(this);
        }
      }
    }
    this.text_id.innerHTML = this.phrase;
  }
}
// Create simple text based shuffled puzzle
PUZZLES.Puzzle_1 = function(question_id, text_id, problem_info)
{
  //Make Puzzle_1 inherit from Puzzle
  PUZZLES.Puzzle.call(this, question_id, text_id, problem_info);
  this.parse_tags(problem_info.words.answers[problem_info.progress]);
  var shuffled_answer = shuffle_string(problem_info.words.answers[problem_info.progress]);
  /* make sure the string is actually shuffled */
  while(shuffled_answer == problem_info.words.answers[problem_info.progress]){
      shuffled_answer = shuffle_string(problem_info.words.answers[problem_info.progress]);
  }
  this.shuffled = shuffled_answer;
  this.phrase = this.phrase.replace("#answer", "<input id=\"problem\" class=\"form-control resize-height\" name=\"problem\" value=\""+shuffled_answer+"\"></input>");
}

//Create a group of selection based shuffled words
PUZZLES.Puzzle_2 = function(question_id, text_id, problem_info){
  PUZZLES.Puzzle.call(this, question_id, text_id, problem_info);
  this.parse_tags(problem_info.words.answers[problem_info.progress]);
  //Generate 3 different shuffled words
  var possible_answers = [problem_info.words.answers[problem_info.progress]];
  var problems_to_generate = problem_info.words.answers[problem_info.progress].length > 3 ? 3 : problem_info.words.answers[problem_info.progress].length;

  while(problems_to_generate)
  {
    var shuffled = shuffle_string(problem_info.words.answers[problem_info.progress]);
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
  var replace_string = "<select id=\"problem\" class=\"form-control resize-height\">"
  for(var i = 0; i < possible_answers.length; i++)
  {
    replace_string += "<option value=\""+possible_answers[i]+"\">"+possible_answers[i]+"</option>";
  }
  replace_string += "</select>"
  this.phrase = this.phrase.replace("#answer", replace_string);

}
// Create a puzzle that puts the answer and random letters onto the canvas
// These letters then function as the portions of the answer
PUZZLES.Puzzle_3 = function(question_id, text_id, problem_info){
  PUZZLES.Puzzle.call(this, question_id, text_id, problem_info);

  //Generate a list of random characters
  this.shuffled = generate_random_chars(10);
  var str = problem_info.words.answers[problem_info.progress].split('');
  //Add the answer to the shuffled list
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
  this.phrase = this.phrase.replace("#answer", replace_string)
  this.parse_tags(problem_info.words.answers[problem_info.progress]);

  // Override the generate_puzzle to build a grid
  this.generate_puzzle = function(canvas_id){
      var background = this.background;
      var grid_size_x = background.end_point.x - background.start_point.x;
      var grid_size_y = background.end_point.y - background.start_point.y;
      var grid_size = grid_size_x < grid_size_y ? grid_size_x : grid_size_y;
      //Set up a 9x9 or 10x10 grid
      grid_size = grid_size > 200 ? 10 : 9;
      var calculated_points = generate_points(this.shuffled.length, grid_size);
      for(var i = 0; i < this.shuffled.length; i++)
      {
        calculated_points[i][0] = background.start_point.x + (calculated_points[i][0] * 1.5 + 5) * grid_size;
        calculated_points[i][1] = background.start_point.y + (calculated_points[i][1] * 1.25 + 5) * grid_size;
        calculated_points[i][2] = this.shuffled[i];
      }
      //Add our list of possible choices to be drawn by the canvas
      window.letters = calculated_points;
      $("#"+canvas_id).mousemove(function(e){
        //Determine if the user has hovered a letter, and change the cursor
        var cursor = "default"
        for(var i = 0; i < calculated_points.length; i++){
          if(e.offsetX - calculated_points[i][0] < 6 &&
            e.offsetX - calculated_points[i][0] > -6 &&
            e.offsetY - calculated_points[i][1] < 6 &&
            e.offsetY - calculated_points[i][1] > -6 ){
            cursor = "pointer";
          }
        }
        $("#"+canvas_id).css("cursor", cursor);
      });

      $("#"+canvas_id).click(function(e){
        //Add the letter to the answer if it has been clicked
        for(var i = 0; i < calculated_points.length; i++){
          if(e.offsetX - calculated_points[i][0] <= 6 &&
            e.offsetX - calculated_points[i][0] >= -6 &&
            e.offsetY - calculated_points[i][1] <= 6 &&
            e.offsetY - calculated_points[i][1] >= -6 ){
            var answer = $("#problem").html();
            var j = 0;
            while(answer[j] != "_" && j <= answer.length)
            {
              j++;
            }
            if(j > answer.length)
              return;
            answer = answer.substr(0,j) + calculated_points[i][2] + answer.substr(j+1, answer.length);
            $("#problem").html(answer);
          }
        }
      });

      var button = document.createElement("BUTTON");
      button.onclick = function(e){
        e.preventDefault();
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

      var text = document.createTextNode("&#8592");
      button.className = "backspace btn btn-primary";
      button.appendChild(text);
      button.innerHTML = "&#8592;"
      $("#puzzle_status").append(button);

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
    var a = unshuffled_str.split("");
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
