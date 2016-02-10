var email = getCookie('email');

var url = "http://localhost:8080";
var socket = io.connect(url);

$(document).ready(function() {
	$('#new_class').click(function(event) {
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
			$('#class_div').append("<div class='class_item'>" + classes[item].class_name + "</div>");
		}
	});
});