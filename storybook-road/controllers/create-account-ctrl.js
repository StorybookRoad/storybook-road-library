var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
	var type = req.query.type;
	res.render('create-account', {type: type});
});

module.exports = router;