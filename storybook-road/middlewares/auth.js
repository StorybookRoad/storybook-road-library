//ensure that there is a user stored in the session to prevent unauthorized access to pages
module.exports = function(req, res, next) {
	console.log(req.session);
	if (req.session.user) {
		console.log('authorized user');
		//user is authorized, proceed to next route
		next();
	}
	else {
		console.log('unauthorized user');
		//no authorized user, end the route
		res.status(401).render('401');
	}
};