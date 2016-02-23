var url = 'http://localhost:8080';
var socket = io.connect(url);
var email = getCookie('email');

$(document).ready(function() {
	socket.emit('get_current_stories', email);
	
	socket.on('current_story_list', function (stories) {
		var storycount = 0;
		$('#story_div').empty();
		for (doc in stories) {
			storycount++;
			var story = stories[doc];
			$('#story_div').append("<div id='" + story._id + "' class='story_instance_box'>Story " + storycount + "<br>Progress: " +
			story.progress + "</div>");
		}
	});
	
	var visible = false;
	$('#template_div').hide();
	
	$('#new_story').click(function (event) {
		if (visible) {
			visible = false;
			$('#template_div').hide();
		}
		else {
			socket.emit('request_templates', email);
		}
	});
	
	socket.on('template_list', function(templates) {
		$('#available_templates').empty();
		for (doc in templates) {
			var template = templates[doc];
			$('#available_templates').append("<div id='" + template._id + "' class='story_template_box'>" + template.character.name + "'s Story </div>");
		}
		visible = true;
		$('#template_div').show();
	});
	
	$(document).on('click', '.story_template_box', function(event) {
		document.cookie = 'story_template_id=' + event.target.id;
		socket.emit('start_story', {'email':email, 'story_template_id':event.target.id});
		window.location.href = './user_story.html';
	});
	
	$(document).on('click', '.story_instance_box', function(event) {
		document.cookie = 'story_instance_id=' + event.target.id;
		window.location.href = './user_story.html';
	});
});