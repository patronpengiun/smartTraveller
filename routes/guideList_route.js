// created by Hongda Jiang
// 4-19-2015
// may be merged to index.js later
var express = require('express');
var guideList_router = express.Router();

var Guide = require('../models/guide');

module.exports = function() {
	guideList_router.get('/', function(req, res) {
		console.log(req.query);
		
		var filter = {};
		if (req.query) {
			var query = req.query
			if (query.city) {
				filter.city = query.city;
			}
			if (query.drive) {
				filter.car = true;
			}
			if (query.pickup) {
				filter.airport_pickup = true;
			}
			if (query.occupation) {
				filter.occupation = Array.isArray(query.occupation) ? {$in: query.occupation} : query.occupation;
			}
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