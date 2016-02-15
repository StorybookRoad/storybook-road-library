var email = getCookie('email');

var url = "http://localhost:8080";
var socket = io.connect(url);

$(document).ready(function() {
	var visible = false;
	$('#class_details').hide();
	$('#new_class').addClass('unselected');
	
	$('#new_class').click(function(event) {
		if (!visible) {
			$('#new_class').addClass('selected');
			$('#new_class').removeClass('unselected');
			$('#new_class').html('-');
			$('#class_details').show('fast');
			visible = true;
		}
		else {
			$('#new_class').removeClass('selected');
			$('#new_class').addClass('unselected');
			$('#new_class').html('+');
			$('#class_details').hide('fast');
			visible = false;
		}
	});
	
	$('#class_details').submit(function(event) {
		event.preventDefault();
		if ($('#class_name').val() == "") {
			$('#warning').show();
		}
		else {
			var data = {
				'class_name':$('#class_name').val(),
				'grade':$('#grade').val(),
				'email':email
			};
			socket.emit('create_class', data);
		}
	});
	
	socket.emit('get_classes', email);
	
	socket.on('update_class_list', function(classes) {
		$('#class_div').html("");
		for (item in classes) {
			$('#class_div').append('<div class="class_item" id="' + classes[item].class_name + '">' + classes[item].class_name + '<br>' + 'Grade ' + classes[item].grade+ '</div>');
		}
	});
	
	$(document).on('click', '.class_item', function(event) {
		document.cookie = "class_name=" + event.target.id;
		window.location.href = './class_page.html';
	});
});