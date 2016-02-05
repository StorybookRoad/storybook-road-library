var url = "http://localhost:8080";
var socket = io.connect(url);

$(document).ready(function() {
  var puzzle = new PUZZLES.Puzzle_1(1, "storytext", "user_answer");
  puzzle.generate_puzzle(this.connection, "test_canvas");
});
