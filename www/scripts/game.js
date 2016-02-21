/* Create our globals */
var url = "http://localhost:8080";
var socket = io.connect(url);
var puzzle;

$(document).ready(function() {
  /* Will need to maintain basic data about the game here */
  //Previously was {"puzzle_id": 2}
  var user_data = JSON.parse(getCookie("storybook_road_data"));
  console.log(user_data);
  socket.emit("game", user_data);

  /* Retrieve our game from the database */
  socket.on("game_info", function(game_info){
    //TODO make function to parse puzzle type to determine which puzzle to use
    puzzle = new PUZZLES.Puzzle_2(1, "storytext", "user_answer", game_info);
    puzzle.generate_puzzle("test_canvas");
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
    //TODO emit data back to the server regarding misses, and retrieve
    //the next puzzle
    //Do something
  });

  socket.on("user_incorrect", function(){
    console.log("failure");
    $("#errors").text("Oops! Looks like you were a little off, try again!");
    $("#success").text("");
    puzzle.failed_attempts++;
  });


  $("#puzzle_status").submit(function(event){
    //Stop our form from being fully submitted
    event.preventDefault();
    var problem_value = $("#problem").val();
    if(problem_value != ""){
      console.log(puzzle)
      var problem =  {
        "puzzle_id": puzzle.puzzle_id,
        "story_id": user_data.story_id,
        "problem_number": puzzle.problem_number,
        "user_answer": problem_value,
        "failed_attempts": puzzle.failed_attempts
      };
      console.log(problem);
      socket.emit("puzzle_ending", problem);
    }
    else {
      $("#errors")[0].innerHTML = "An answer has not been provided for the puzzle"
    }
  });
});
