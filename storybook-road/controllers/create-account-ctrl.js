var express = require('express');
var router = express.Router();
var assert = require('assert');

var schools = require('../models/school');
var user = require('../models/user');

router.get('/', function(req, res, next) {
	var type = req.query.type;
	res.render('create-account', {type: type});
});

router.post('/school-req', function(req, res, next) {
	schools.all(function(err, result) {
		assert.equal(null, err);
		res.send(result);
	});
});

router.post('/submit', function(req, res, next) {
	var userData = req.body;
	//if school does not exist, create it
	schools.get(userData.school, function(err, result) {
		assert.equal(null, err);
		if (result != 'SCHOOL_ALREADY_EXISTS') schools.create(userData.school, function(err, result){}); //no callback necessary
	});
	user.create(userData, function(err, result) {
		assert.equal(null, err);
		res.send(result);
	});
});

module.exports = router;