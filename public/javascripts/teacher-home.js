$(document).ready(function() {
	$('#new_class_form').hide();
	//load class list
	update_class_list();
	
	//load student list for selected class
	$(document).on('click', '.class-li', function (e) {
		load_class_info($(this).html());
	});

	//load student info for selected student
	$(document).on('click', '.student', function (e) {
		load_student_info($(this).data('email'));
	});

	//show class creation form
	$('#new_class').click(function(e) {
		$('#new_class_form').show();
	});
	
	//hide class creation form
	$('#hide_class_form').click(function(e) {
		$('#warning').html(""); //clear out warning if necessary
		$('#new_class_form').hide();		
	});
	
	//handle class creation form submission
	$('#new_class_form').submit(function(e) {
		e.preventDefault();
		var params = $('#new_class_form').serialize();
		$.post('teacher/new-class', params, function(result) {
			if (result == 'CLASS_ALREADY_EXISTS') {
				$('#warning').html('A class with that name already exists');
			}
			else {
				update_class_list();
				$('#new_class_form').hide();
			}
		});
	});
});

//helper function to load the class list
function update_class_list() {
	$('#class_list').html(""); //clear out list;
	$.post('teacher/classes-request', function(result) {
		for (item in result) {
			var class_name = result[item];
			$('#class_list').append($('<li>').prop('class', 'class-li').html(class_name));
		}
	});	
}

//helper function to load and display information about a class
function load_class_info(class_name) {
	if ($('#enrolled_header')) $('#enrolled_header').remove();
	$('#class_stats').html("");
	$('#student_list').html("");
	$('#student_info').html("");
	$.post('teacher/class-info-request', { class_name: class_name }, function (result) {
		//load class stats
		$('#class_stats').html(result.class_stats);
		//load student list
		if (result.student_list == 'EMPTY_RESULT') {
			$('#student_list').append('No students are enrolled in this class');
		}
		else {
			$('#student_list').before($('<h4>', { id: 'enrolled_header',text: 'Enrolled Students:' }));
			for (item in result.student_list) {
				var student = result.student_list[item];
				var name = student.fname + " " + student.lname;
				var email = student.email;
				$('#student_list').append($('<li>').data('email', email).prop('class', 'student').html(name));
			}
		}
	});
}

//helper function to load student info -- PLACEHOLDER
function load_student_info(student_email) {
	$('#student_info').html("");
	$.post('/teacher/student-info-request', {email: student_email}, function (result) {
		$('#student_info').append(
			$('<div>', {
				id: 'student_details',
				text: result.fname + " " + result.lname + "'s information:"
			}).append($('<ul>', {id: 'student_detail_list'})).append($('<li>Email: ' + result.email + '</li>')),
			$('<div>', {
				id: 'student_stats',
				text: result.fname + "'s statistics will go here."
			})
		);
	});
}