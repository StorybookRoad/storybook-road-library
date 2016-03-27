$(document).ready(function () {
	$('#new_story_form').hide();
	update_story_list();

	//construct and reveal the new story form
	$('#new_story').click(function (event) {
		$('#themes').empty();
		$.post('/student/themes-request', function (result) {
			for (item in result) { //item will be the lower-case id of the theme
				var theme = result[item];
				$('#themes').append($('<option>', {value: item, text: theme.name}));
			}
			$('#new_story_form').show();
		});
	});

	//cancel button for story form
	$('#cancel_new_story').click(function (event) {
		$('#themes').empty();
		$('#new_story_form').hide();
	});
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
					text: story.words.character + "'s Story",
					class: "story_item",
					"data-id": story._id
				}));
			}
		}
	});
}