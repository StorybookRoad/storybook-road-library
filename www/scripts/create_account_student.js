var url='http://localhost:8080';
var socket = io.connect(url);

$(document).ready(function() {
	socket.emit('get_school_list');
	$('#school').prop('disabled', true);
	$('#teacher').prop('disabled', true);
	$('#class').prop('disabled', true)
	
	socket.on('school_list', function(schools) {
		$('#school').html("");
		for (doc in schools) {
			$('#school').append($('<option>' + doc + '</option>').attr('value', doc));
		}
		$('#school').prop('disabled', false)
		$('#school').prop('selectedIndex', -1);
	});
	
	$('#school').change(function() {
		var school = $('#school').val();
		socket.emit('get_teacher_list', school);
	});
	
	socket.on('teacher_list', function(teachers) {
		$('#teacher').html("");
		for (doc in teachers) {
			var name = teachers[doc].fname + " " + teachers[doc].lname;
			$('#teacher').append($('<option>' + name + '</option>').attr('value', teachers[doc].email));
		}
		$('#teacher').prop('disabled', false);
		$('#teacher').prop('selectedIndex', -1);
	});
	
	$('#teacher').change(function() {
		var teacher = $('#teacher').prop('value');
		socket.emit('get_student_classes', teacher);
	});
	
	socket.on('student_classes', function(classes) {
		$('#class').html("");
		for (doc in classes) {
			var class_name = classes[doc].class_name;
			var grade = classes[doc].grade;
			$('#class').append($('<option>' + class_name + ' - Grade ' + grade + '</option>').attr('value', class_name));
		}
		$('#class').prop('disabled', false);
		$('#class').prop('selectedIndex', -1);
	});
	
	function form_acceptable() {
		if ($('#password').val() != $('#confirm_password').val()) {
			console.log("Passwords don't match!");
			$('#confirm_password').val();
			$('#confirm_password').placeholder("Password must match!");
			return false;
		}
		return true;
	}

	$('#create_form').submit(function(event) {
		event.preventDefault();
		if ($('#password').val() != $('#confirm_password').val()) {
			console.log("Passwords don't match!");
			$('#confirm_password').val("");
			$('#confirm_password').attr("placeholder", "Password must match!");
		}
		else {
			var account_info = {
				'fname':$('#fname').val(),
				'lname':$('#lname').val(),
				'password':$('#password').val(),
				'email':$('#email').val(),
				'school':$('#school').val(),
				'teacher':$('#teacher').val(),
				'class':$('#class').val(),
				'statement':$('#statement').val(),
				'type':'student'
			};
			socket.emit('create_account_student', account_info);
		}
	});
	
	socket.on('account_created', function() {
		window.location.href = './index.html';
	});
	
	socket.on('server_error', function(err) {
		if (err.message == 'email_already_taken') {
			$('#warning').html('Email already taken!');
		}
	});	
	
	$('#cancel').click(function() {
		window.location.href = './index.html';
	});
});