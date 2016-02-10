/* Create our globals */
var url = "http://localhost:8080";
var socket = io.connect(url);
var puzzle;

$(document).ready(function() {
  /* Will need to maintain basic data about the game here */
  var user_data = {"puzzle_id": 1};
  socket.emit("game", user_data);

  /* Retrieve our game from the database */
  socket.on("game_info", function(game_info){
    puzzle = new PUZZLES.Puzzle_1(1, "storytext", "user_answer", game_info);
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
    $("#success").text("Congrats on completing this puzzle");
    $("#errors").text("");
    //Do something
  });

  socket.on("user_incorrect", function(){
    console.log("failure");
    $("#errors").text("Oops! Looks like you were a little off, try again!");
    $("#success").text("");
  });



  $("#puzzle_status").submit(function(event){
    //Stop our form from being fully submitted
    event.preventDefault();
    var problem_value = $("#problem").val();
    if(problem_value != ""){
      var problem =  {
        "puzzle_id": puzzle.puzzle_id,
        "story":1,
        "problem_number": puzzle.problem_number,
        "user_answer": problem_value,
      };
      socket.emit("puzzle_ending", problem);
    }
    else {
      $("#errors")[0].innerHTML = "An answer has not been provided for the puzzle"
    }

  });

});
