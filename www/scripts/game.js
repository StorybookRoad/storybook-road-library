/* Create our globals */
/*TO GET RID OF */
var url = "http://localhost:8080";
var socket = io.connect(url);
var puzzle;
var grid_size = 10;

function parse_puzzle(puzzle_data)
{
  var puzzle;
  switch (puzzle_data.puzzle_type)
  {
    case 1:
      puzzle = new PUZZLES.Puzzle_1(puzzle_data.progress, "storytext", "user_answer", puzzle_data);
      break;
    case 2:
      puzzle = new PUZZLES.Puzzle_2(puzzle_data.progress, "storytext", "user_answer", puzzle_data);
      break;
    case 3:
      puzzle = new PUZZLES.Puzzle_3(puzzle_data.progress, "storytext", "user_answer", puzzle_data);
      break;
  }
  return puzzle;
}

$(document).ready(function() {
  /* Will need to maintain basic data about the game here */
  //Previously was {"puzzle_id": 2}
  var user_data = {"story_instance_id": getCookie("story_instance_id")};
  socket.emit("game", user_data);

  /* Retrieve our game from the database */
  socket.on("game_info", function(game_info){
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
  });
});
