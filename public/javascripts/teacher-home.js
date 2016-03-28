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
		//load available themes
		load_themes();
	});
	
	//hide class creation form
	$('#hide_class_form').click(function(e) {
		$('#warning').html(""); //clear out warning if necessary
		$('#new_class_form').hide();		
	});

	//handle incrementing student puzzle difficulty
	$(document).on('click', '.plus_difficulty', function (event) {
		var student = $(this).data('student');
		var new_difficulty = $(this).data('difficulty') + 1;
		$.post('teacher/update-student-difficulty', { student: student, difficulty: new_difficulty }, function (result) {
			load_student_info(student);
		});
	});

	//handle decrementing student puzzle difficulty
	$(document).on('click', '.minus_difficulty', function (event) {
		var student = $(this).data('student');
		var new_difficulty = $(this).data('difficulty') - 1;
		$.post('teacher/update-student-difficulty', { student: student, difficulty: new_difficulty }, function (result) {
			load_student_info(student);
		});
	});

	//handle class creation form submission
	$('#new_class_form').submit(function(e) {
		e.preventDefault();
		if (!validate_checked($('#themes_available'))) {
			$('#warning').html('<p>You must make at least one story available.</p>')
		}
		else {
			var params = {
				'class_name': $('#class_name').val(),
				'difficulty': $('#difficulty').val(),
				'themes': []
			}
			$('#themes_available').find('li').find('input:checked').each(function (index) {
				if ($(this).prop('checked', true))
					params.themes.push($(this).val());
			});
			params.themes = JSON.stringify(params.themes) //stringify to ensure correct post request
			$.post('teacher/new-class', params, function (result) {
				if (result == 'CLASS_ALREADY_EXISTS') {
					$('#warning').html('<p>A class with that name already exists</p>');
				}
				else {
					update_class_list();
					$('#new_class_form').hide();
				}
			});
		}
	});
});

//helper function to load the class list
function update_class_list() {
	$('#class_list').empty(); //clear out list;
	if ($('#no_class_warning')) $('#no_class_warning').remove(); //remove no class warning if present
	$.post('teacher/classes-request', function (result) {
		if (result === 'EMPTY_RESULT') {
			$('#class_list').before($('<h4>', { id: 'no_class_warning', text: 'No classes created.' }));
		}
		else {
			for (item in result) {
				var class_name = result[item].name;
				$('#class_list').append($('<li>').addClass('class-li list-group-item').html(class_name));
			}
		}
	});	
}

//helper function to load and display information about a class
function load_class_info(class_name) {
	if ($('#enrolled_header')) $('#enrolled_header').remove();
	$('#class_stats').empty();
	$('#student_list').empty();
	$('#student_info').empty();
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
				$('#student_list').append($('<li>').data('email', email).addClass('student list-group-item').html(name));
			}
		}
	});
}

//helper function to load student info
function load_student_info(student_email) {
	$('#student_info').empty();
	$.post('/teacher/student-info-request', {email: student_email}, function (result) {
		$('#student_info').append(
			$('<div>', {
				id: 'student_details',
				text: result.fname + " " + result.lname + "'s information:"
			}).append($('<ul>', {id: 'student_detail_list'})).addClass('list-group'),
			$('<div>', {
				id: 'student_stats',
				text: result.fname + "'s statistics will go here."
			})
		);
		//fill student details list
		$('#student_detail_list').append(
			$('<li>', { 'text': 'Puzzle difficulty level: ' + result.difficulty }).addClass('list-group-item').append(
				$('<button>', {'class': 'plus_difficulty', 'data-student': result.email, 'data-difficulty': result.difficulty, 'text': '+'}),
				$('<button>', {'class': 'minus_difficulty', 'data-student': result.email, 'data-difficulty': result.difficulty, 'text': '-'})
			));
		//disable difficulty buttons when appropriate
		if (result.difficulty === '1') {
			$('.minus_difficulty').prop('disabled', true);
		}
		else if (result.difficulty === '5') {
			$('.plus_difficulty').prop('disabled', true);
		}
	});
}

//helper function to load available themes into the new class form
function load_themes() {
	$('#themes_available').empty();
	$.post('/teacher/themes-request', function (result) {
		for (item in result) {
			var theme = result[item];
			var theme_name = theme.name;
			var theme_key = item;
			$('#themes_available').append(
				$('<li>').html(
					$('<label>').html(
						($('<input />').prop({ 'type': 'checkbox', 'name': theme_key, 'value': theme_key }))
					).append(theme_name)
				)
			);
		}
	});
}

// helper function to check if at least one checkbox is checked
// @param domObject is a jquery object
function validate_checked(domObject) {
	var oneChecked = false;
	$(domObject).find('input[type="checkbox"]').each(function (i) {
		if ($(this).is(':checked')) {
			oneChecked = true;
		}
	});
	return oneChecked;
}