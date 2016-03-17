var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	res.render('login');
});

//handle requests to create accounts
router.post('/login-request', function(req, res, next) {
	var type = req.query.type;
	res.send({redirect: '/create-account?type=' + type});
});

module.exports = router;