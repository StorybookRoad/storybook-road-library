$(document).ready(function() {
	
	//fill in student select fields
	if (type == 'student') {
		//fill in school field
		$.post('create-account/school-req', function(response) {
			for (school in response) {
				$('#school').append('<option value="' + school.name + '">' + school.name + '</option>');
			}
		});
	}
	
	//handle form submission
	$('#create_form').submit(function(e) {
		var body = $('#create_form').serialize();
		$.ajax('create-account/submit', {
			type: 'POST',
			data: body,
			success: function(response) {
				if (response == 'SUCCESS') {
					document.location.href = '/login';
				}
				else if (response == 'USER_ALREADY_EXISTS') {
					$('#warning').html("This email address is already in use.");
				}
			}
		});
		e.preventDefault();
	});
});