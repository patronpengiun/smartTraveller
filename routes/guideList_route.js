// created by Hongda Jiang
// 4-19-2015
// may be merged to index.js later
var express = require('express');
var guideList_router = express.Router();

var Guide = require('../models/guide');

module.exports = function() {
	guideList_router.get('/', function(req, res) {
		var filter = {};
		if (req.query && req.query.city) {
			filter.city = req.query.city;
		}


		Guide.find(filter, function(err, guides) {
	    var guideMap = [];

	    guides.forEach(function(guide) {
	      guideMap.push(guide);
	    });
	    res.render('guide_list', {guideList: guideMap, user: req.user});
	  });
	});

	return guideList_router;
}