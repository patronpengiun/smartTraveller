var express = require('express');
var api_router = express.Router();

var Guide = require('../models/guide');

module.exports = function() {
	api_router.get('/guide/:guide_id', function(req, res) {
		Guide.find({_id:req.params.guide_id}, function(err, guides) {
			if (err || guides.length == 0) {
				res.send("No such guide!");
			} else {
				res.send(JSON.stringify(guides[0]));
			}
		});
	});

	return api_router;
}
