var express = require('express');
var router = express.Router();
var assert = require('assert')

router.get('/', function(req, res, next) {
	res.render('login');
});

//handle requests to create accounts
router.post('/login-request', function(req, res, next) {
	var type = req.body.type;
	res.send({redirect: '/create-account/' + type});
});

module.exports = router;