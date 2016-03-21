var express = require('express');
var router = express.Router();
var assert = require('assert')

var crypto = require('../helpers/crypto');
var user = require('../models/user');

router.get('/', function(req, res, next) {
	res.render('login');
});

//handle requests to create accounts
router.post('/create-request', function(req, res, next) {
	var type = req.body.type;
	res.send({redirect: '/create-account/' + type});
});

//handle login requests
router.post('/login-request', function(req, res, next) {
	var email = req.body.email;
	var userPassword = req.body.password; //the password given by the user
	user.get(email, function(err, result) {
		assert.equal(null, err);
		if (result == 'USER_NOT_FOUND') res.send({message: 'DOES_NOT_MATCH'});
		else {
			var password = result.password; //the password stored in the database
			crypto.compare(userPassword, password, function(error, same) {
				assert.equal(null, error);
				if (!same) res.send({message: 'DOES_NOT_MATCH'});
				else {
					req.session.user = result;
					var redirect = '/' + result.role// + '?id=' + result._id;
					res.send({message: 'SUCCESS', redirect: redirect});
				}
			});
		}
	});
});

module.exports = router;