//ensure that there is a user stored in the session to prevent unauthorized access to pages
module.exports = function(req, res, next) {
	if (req.session.user) {
		//user is authorized, proceed to next route
		next();
	}
	else {
		//no authorized user, end the route
		res.status(401).render('401');
	}
};