$(document).ready(function() {

});

//helper function to update the story list
function update_story_list() {
	$('#story_list').empty();
	$.post('/student/stories-request', function (result) {
		if (result == 'EMPTY_RESULT') {
			$('#story_list').append($('<p>', { text: "You haven't started any stories yet!" }));
		}
		else {
			for (item in result) {
				var story = result[item];
				$('#story_list').append($('<li>', {
					text: story.character + "'s Story",
					class: "story_item",
					"data-id": story._id
				}));
			}
		}
	});
}