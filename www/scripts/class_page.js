var class_name = getCookie("class_name");
var email = getCookie("email");

var url = 'http://localhost:8080';
var socket = io.connect(url);

$(document).ready(function() {
	$('#class_name').html(class_name);
	
	socket.emit('get_students', {'class_name':class_name, 'email':email});
	
	socket.on('student_list', function(students) {
		$('#students').html("");
		for (doc in students) {
			console.log(JSON.stringify(doc));
			var name = students[doc].fname + " " + students[doc].lname;
			$('#students').append('<a class="student" id="' + students[doc].email + '">' + name + '</a');
		}
	});
});