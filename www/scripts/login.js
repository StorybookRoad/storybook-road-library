var url = "http://localhost:8080";
var socket = io.connect(url);

$(document).ready(function() {
	
	var account_type_visible = false;
	$('#account_type').hide();
	$('#create_account_button').click(function(event) {
		if (!account_type_visible) {
			$('#account_type').show();
			account_type_visible = true;
		}
		else {
			$('#account_type').hide();
			account_type_visible = false;
		}
	});
	
	$('#teacher').click(function(event) {
		window.location.href = './create_account_teacher.html';
	});
	
	$('#student').click(function(event) {
		window.location.href = './create_account_student.html';
	});
	
	$('#login_form').submit(function(event) {
		event.preventDefault();
		if ($('#email').val() != "" && $('#password').val() != "") {
			var credentials = {'email':$('#email').val(), 'password':$('#password').val()};
			socket.emit('login', credentials);
		}
	});
	
	socket.on('credentials_accepted', function (login_info) {
		document.cookie = "email=" + login_info.email;
		if (login_info.type == 'teacher') {
			window.location.href = './teacher_home.html';
		}
		else if (login_info.type == 'student') {
			window.location.href = './student_home.html';
		}
	});
	
	socket.on('server_error', function(err) {
		if (err.message == 'credentials_do_not_match' || err.message == 'email_does_not_exist') {
			$('#warning').html('Password and email do not match!');
		}
	});
});