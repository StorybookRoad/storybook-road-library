var url = 'http://localhost:8080';
var socket = io.connect(url);
var email = getCookie('email');

$(document).ready(function() {
	$('#new_story').click(function (event) {
		socket.emit('request_templates', email);
	});
	
	socket.on('template_list', function(templates) {
		$('#available_templates').empty();
		for (doc in templates) {
			var template = templates[doc];
			$('#available_templates').append("<div id='" + template._id + "' class='story_template_box'>" + template.character.name + "'s Story </div>");
		}
	});
	
	$(document).on('click', '.story_template_box', function(event) {
		document.cookie = 'story_template_id=' + event.target.id;
		window.location.href = './user_story.html';
	});
});