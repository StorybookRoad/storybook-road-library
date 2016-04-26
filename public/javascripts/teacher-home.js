$(document).ready(function () {
	//initialize tooltip
	$('[data-toggle="tooltip"]').tooltip();
	
	//initialize modal
	$('#new_class_modal').modal({ show: false });

	//hide necessary elements
	$('#class_panel').hide();
	$('#student_info').hide();
	//load class list
	update_class_list();

	//load student list for selected class
	$(document).on('click', '.class-li', function (e) {
		$('.class-li').removeClass('active');
		$(this).addClass('active');
		load_class_info($(this).html());
	});

	//load student info for selected student
	$(document).on('click', '.student', function (e) {
		$('.student').removeClass('active');
		$(this).addClass('active');
		load_student_info($(this).data('email'));
	});

	//show class creation form
	$('#new_class').click(function (e) {
		$('#warning').empty(); //clear out warning if necessary

		//load available themes
		load_themes();

		//show modal
		$('#new_class_modal').modal('show');
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

			$('#warning').html('<h5>You must make at least one story available.</h5>')
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
					$('#warning').html('<h5>A class with that name already exists</h5>');
				}
				else {
					update_class_list();					
					$('#new_class_modal').modal('hide');
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
				$('#class_list').append($('<a>', {href: '#'}).addClass('class-li list-group-item').html(class_name));

			}
		}
		$('#class_list').children().first().click();
	});
}

//helper function to load and display information about a class
function load_class_info(class_name) {
	if ($('#enrolled_header')) $('#enrolled_header').remove();
	if ($('.class-panel-remove')) $('.class-panel-remove').remove();
	$('#class_stats').empty();
	$('#student_list').empty();
	$('#student_info').hide();
	$('#student_info').empty();
	$.post('teacher/class-info-request', { class_name: class_name }, function (result) {
		//load panel
		$('#class_panel').show();
		//load student list
		if (result.student_list == 'EMPTY_RESULT') {
			$('#student_list').before($('<div>', { id: 'enrolled_header' }).addClass('panel-heading').append($(
				'<h3>', { text: 'Enrolled Students:' }).addClass('panel-title')));
			$('#student_list').before($('<div>').addClass('panel-body class-panel-remove').html('No students are enrolled in this class.'));
		}
		else {
			$('#student_list').before($('<div>', { id: 'enrolled_header'}).addClass('panel-heading').append($(
				'<h3>', {text: 'Enrolled Students:' }).addClass('panel-title')));

			for (item in result.student_list) {
				var student = result.student_list[item];
				var name = student.fname + " " + student.lname;
				var email = student.email;
				$('#student_list').append($('<a>', { href: '#' }).data('email', email).addClass('student list-group-item').html(name));
			}
		}
		if (result.class_stats) {
			//load class stats
			$('#class_panel').append(($('<div>').addClass('panel-heading class-panel-remove').html(
				$('<h3>', { text: "Class Statistics" }).addClass('panel-title'))));
			$('#class_panel').append($('<div>', { text: result.class_stats }).addClass('panel-body class-panel-remove'));
		}
		if (result.student_list !== "EMPTY_RESULT")
			// load first student
			$('#student_list').children().first().click();
	});
}

//helper function to load student info
function load_student_info(student_email) {
	$('#student_info').empty();
	$('#student_info').show();
	$.post('/teacher/student-info-request', { email: student_email }, function (result) {
		$('#student_info').append(
			$('<div>').addClass('panel-heading').html(
			$('<h3>', {
				id: 'student_details',
				text: result.student.fname + " " + result.student.lname + "'s Information:"
			}).addClass('panel-title')));
		$('#student_info').append(
			$('<ul>', { id: 'student_detail_list' }).addClass('list-group'));
		$('#student_info').append($('<div>').addClass('panel-heading').append(
			$('<h3>', {text: result.student.fname + ' ' + result.student.lname + "'s Statistics"}).addClass('panel-title')));
		$('#student_info').append($('<div>', {
			id: 'student_stats',
			text: result.statistics
		}).addClass('panel-body'));
		//fill student details list
		$('#student_detail_list').append(
			$('<li>', { 'text': 'Puzzle difficulty level: ' + result.student.difficulty }).addClass('list-group-item').append(
				$('<button>', {
					'class': 'btn btn-primary btn-xs btn-inline pull-right minus_difficulty',
					'data-student': result.student.email, 'data-difficulty': result.student.difficulty
				}).append(
					$('<span>', {
						'class': 'glyphicon glyphicon-minus',
						'aria-label': 'Decrement Difficulty', 'aria-hidden': 'true'
					})),
				$('<button>', {
					'class': 'btn btn-primary btn-xs btn-inline pull-right plus_difficulty',
					'data-student': result.student.email, 'data-difficulty': result.student.difficulty
				}).append(
					$('<span>', {
						'class': 'glyphicon glyphicon-plus',
						'aria-label': 'Increment Difficulty', 'aria-hidden': 'true'
				}))
			));
		//disable difficulty buttons when appropriate
		if (result.student.difficulty === '1') {
			$('.minus_difficulty').prop('disabled', true);
		}
		else if (result.student.difficulty === '5') {
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
					$('<div>').addClass('checkbox').append(
					$('<label>').html(
						($('<input />').prop({ 'type': 'checkbox', 'name': theme_key, 'value': theme_key }))
					).append(theme_name)
				))

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
