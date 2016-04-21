var puzzle = undefined;
var grid_size = 10;

function parse_puzzle(puzzle_data)
{
  if(puzzle_data.words.answers.length == 0){
    puzzle_data.words.answers = ["Test"];

  }
  if(puzzle_data.progress >= puzzle_data.phrases.length){
    $("#user_answer").html("Congratulations! You completed the story!");
    location.href="/"
    return ;
  }

  switch (puzzle_data.puzzles[puzzle_data.progress])
  {
    case 1:
      puzzle = new PUZZLES.Puzzle_1("storytext", "user_answer", puzzle_data);
      break;
    case 2:
      puzzle = new PUZZLES.Puzzle_2("storytext", "user_answer", puzzle_data);
      break;
    case 3:
      puzzle = new PUZZLES.Puzzle_3("storytext", "user_answer", puzzle_data);
      break;
  }
  return puzzle;
}

function load_puzzle(){
  $("#canvas_grid").html("");
  $(".backspace").remove();
  var grid = [];

  for(var i = 0; i < grid_size; i++)
  {
    if(!grid[i]){
      grid[i] = [];
      $("#canvas_grid").append("<tr class=\"table_"+i+"\">");
    }
    for(var j = 0; j < grid_size; j++){
      grid[i][j] = $("<td class=\"grid_square\"></td>");
      $(".table_"+i).append(grid[i][j]);
    }

    $("#canvas_grid").append("</tr>");
  }


  $("#problem").blur(function(){
    if($("#problem").val() == "" || $("#problem").val() == " "){
      $("#problem").val(puzzle.shuffled);
      $("#problem").css({"color": "gray"});
    }
    else {
      $("#problem").css({"color":"black"})
    }

  });
  puzzle = parse_puzzle(story);
  if(puzzle)
    puzzle.generate_puzzle("story_canvas", grid);
}

$(document).ready(function() {
  load_puzzle();

  $("#puzzle_status").submit(function(event){
    //Stop our form from being fully submitted
    event.preventDefault();
    $("#errors").html("");
    var problem_value = $("#problem").val() || $("#problem").html();
    if(problem_value != ""){
      var problem =  {
        "story_id": puzzle.story_instance_id,
        "user_answer": problem_value
      };

      $.post("/user_story/update_story", problem, function(result){
        if(result.message == "reload"){
          story.progress++;
          load_puzzle();
          console.log("RELOAD");
        }
        else{
          $("#errors").html("Oops, it appears you have something wrong in your answer.");
        }
      });
    }
    else{
      $("#errors").html("An error has occurred in the database");
    }
  });
  /* Will need to maintain basic data about the game here */
  //Previously was {"puzzle_id": 2}


  //socket.emit("game", user_data);

  /* Retrieve our game from the database */
  /*socket.on("game_info", function(game_info){
    //Reset the grid after each puzzle.
    $("#canvas_grid").html("");
    var grid = [];

    for(var i = 0; i < grid_size; i++)
    {
      if(!grid[i]){
        grid[i] = [];
        $("#canvas_grid").append("<tr class=\"table_"+i+"\">");
      }
      for(var j = 0; j < grid_size; j++){
        grid[i][j] = $("<td class=\"grid_square\"></td>");
        $(".table_"+i).append(grid[i][j]);
      }

      $("#canvas_grid").append("</tr>");
    }

    puzzle = parse_puzzle(game_info);
    puzzle.generate_puzzle("story_canvas", grid);
    $("#problem").blur(function(){
      if($("#problem").val() == "" || $("#problem").val() == " "){
        $("#problem").val(puzzle.shuffled);
        $("#problem").css({"color": "gray"});
      }
      else {
        $("#problem").css({"color":"black"})
      }

    });

  });

  socket.on("user_correct", function(){
    console.log("success");
    $("#errors").text("");

  });

  socket.on("user_incorrect", function(){
    console.log("failure");
    $("#errors").text("Oops! Looks like you were a little off, try again!");
    puzzle.failed_attempts++;
  });

  socket.on("page_update",function(){
    socket.emit("game",user_data);
  });

  socket.on("story_finished",function()
  {
    var canvas = $("#story_canvas")[0].getContext("2d");
    canvas.clearRect(0,0,500,500);
    canvas.font = "50px sans-serif";
    canvas.fillText("You Finished!",100,100);
  });

  $("#puzzle_status").submit(function(event){
    //Stop our form from being fully submitted
    event.preventDefault();
    var problem_value = $("#problem").val() || $("#problem").html();
    if(problem_value != ""){
      var problem =  {
        "puzzle_id": puzzle.puzzle_id,
        "story_instance_id": puzzle.story_instance_id,
        "problem_number": puzzle.problem_number,
        "user_answer": problem_value,
        "failed_attempts": puzzle.failed_attempts
      };

      socket.emit("puzzle_ending", problem);
    }
    else {
      $("#errors")[0].innerHTML = "An answer has not been provided for the puzzle"
    }
  });*/
});
