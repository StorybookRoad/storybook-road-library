$(document).ready(function() {
	//fill in student select fields
    if (type == 'student') {
		//fill in school field
		$.post('./school-req', function(response) {
			$('#school').empty();
			for (item in response) {
				var school = response[item];
				$('#school').append('<option value="' + school.name + '">' + school.name + '</option>');
			}
			$('#school').prop('selectedIndex', -1); //make default selected blank
		});
		//fill in teacher field
		$('#school').change(function() {
			$.post('./teacher-req', {school: $('#school').val()}, function(response) {
				$('#teacher').empty();
				for (item in response) {
					var teacher = response[item];
					var name = teacher.fname + " " + teacher.lname;
					var email = teacher.email;
					$('#teacher').append('<option value="' + email + '">' + name + '</option>');
				}
				$('#teacher').prop('selectedIndex', -1);
			});	
		});
		//fill in class field
		$('#teacher').change(function() {
			$.post('./class-req', {teacher: $('#teacher').val()}, function(response) {
				$('#class').empty();
				$('#class').prop('disabled', false); //in case the field was disabled from an empty result
				if (response == 'EMPTY_RESULT') { //make sure teacher has created some classes
					$('#class').append('<option selected disabled>No classes available</option>');
					$('#class').prop('disabled', true);
				}
				else {
					for (item in response) {
						var classObj = response[item];
						var name = classObj.name;
						$('#class').append('<option value="' + name + '">' + name + '</option>');
					}
					$('#class').prop('selectedIndex', -1);
				}
			});
		});
	}
	
	//handle form submission
	$('#create_form').submit(function(e) {
		//check that passwords match
		if ($('#password').val() == $('#confirm_password').val()) {
			var body = $('#create_form').serialize();
			$.ajax('./submit', {
				type: 'POST',
				data: body,
				success: function(response) {
					if (response == 'SUCCESS') {
						document.location.href = '/login';
					}
					else if (response == 'USER_ALREADY_EXISTS') {
						$('#email_warning').html("This email address is already in use.");
					}
				}
			});
		}
		else { //passwords do not match
			$('#password_warning').html("Passwords do not match.");
		}
		e.preventDefault();
	});
});