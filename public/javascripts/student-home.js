var selected_story = null;

$(document).ready(function () {
	update_story_list();

	//handle story selection
	$(document).on('click', '.story_item', function (event) {
		$('.story_item').removeClass('active');
		$(this).addClass('active');
		selected_story = $(this).data('id');
		$('#continue_button').prop('disabled', false);
	});

	$('#continue_button').click(function (event) {
		$.post('/student/continue-story', { story_id: selected_story }, function (result) {
			document.location.href = result;
		});
	});

	//construct and reveal the new story form
	$('#new_story').click(function (event) {
		$('#themes').empty();
		$.post('/student/themes-request', function (result) {
			for (item in result) { //item will be the lower-case id of the theme
				var theme = result[item];
				$('#themes').append($('<option>', {value: item, text: theme.name}));
			}
			$('#new_story_modal').modal();
		});
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
				$('#story_list').append($('<a>', {
					href: '#',
					class: "story_item list-group-item",
					"data-id": story._id
				}).append(
					$('<h4>', {
						text: story.words.character + "'s Story",
						class: 'list-group-item-heading'
					}), ($('<p>', {
							text: "Completed " + story.progress + " out of " + story.phrases.length + " puzzles.",
							class: "list-group-item-text"
						})
					)
				));
			}
		}
	});
}
