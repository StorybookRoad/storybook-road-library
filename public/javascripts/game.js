var puzzle = undefined;
var grid_size = 10;

function parse_puzzle(puzzle_data)
{
  var puzzle;
  if(puzzle_data.progress >= puzzle_data.phrases.length){
    console.log("DONE");
    $("#user_answer").html("Congratulations! You completed the story!");
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
});
