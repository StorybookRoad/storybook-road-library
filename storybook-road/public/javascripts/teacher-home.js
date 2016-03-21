$(document).ready(function() {
	$('#new_class_form').hide();
	//load class list
	update_class_list();
	
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
			$('#class_list').append($('<li>').html(class_name));
		}
	});	
}