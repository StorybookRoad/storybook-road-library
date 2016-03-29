//ensure that there is a user stored in the session to prevent unauthorized access to pages

//authorize teachers
exports.authTeacher = function(req, res, next) {
	if (req.session.user.role == 'teacher') {
		//user is authorized, proceed to next route
		next();
	}
	else {
		//no authorized user, end the route
		res.status(401).render('401');
	}
};

//authorize students
exports.authStudent = function (req, res, next) {
	if (req.session.user.role == 'student') {
		//user is authorized, proceed to next route
		next();
	}
	else {
		//no authorized user, end the route
		res.status(401).render('401');
	}
};