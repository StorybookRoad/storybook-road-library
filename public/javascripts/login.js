$(document).ready(function () {
	$('#account_type').hide();
	var typeIsShowing = false;
	$('#create_account_button').click(function(e) {
		e.preventDefault();
		if (typeIsShowing) {
			$('#account_type').hide();
			typeIsShowing = false;
		}
		else {
			$('#account_type').show();
			typeIsShowing = true;
		}
	});
	$('.type_button').click(function(e) {
		e.preventDefault();
		var type = undefined;
		if ($(this).attr('id') == 'student')
			type = 'student';
		else
			type = 'teacher';
		
		//result should be the url of the create-account page with the correct type query
		$.post('login/create-request', {type: type}, function(res) {
			document.location.href = res.redirect;
		});
	});
	$('#login_form').submit(function(e) {
		e.preventDefault();
		$.post('login/login-request', {email: $('#email').val(), password: $('#password').val()}, function(response) {
			if (response.message == 'DOES_NOT_MATCH') {
				$('#warning').html('Username and password do not match');
			}
			else if (response.message == 'SUCCESS') {
				document.location.href = response.redirect;
			}
			else //log response if error
				console.log(response);
		});
	});
});