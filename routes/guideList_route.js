// created by Hongda Jiang
// 4-19-2015
// may be merged to index.js later
var express = require('express');
var guideList_router = express.Router();

var Guide = require('../models/guide');

module.exports = function() {
	guideList_router.get('/', function(req, res) {
		var filter = createFilter(req.query);
		Guide.find(filter, function(err, guides) {
		    var guideMap = [];
		    guides.forEach(function(guide) {
		      guideMap.push(guide);
		    });
		    res.render('guide_list', {guideList: guideMap, user: req.user});
	 	});
	});
	
	guideList_router.get('/list', function(req, res) {
		var filter = createFilter(req.query);
		Guide.find(filter, function(err, guides) {
		    var guideMap = [];
		    guides.forEach(function(guide) {
		      guideMap.push(guide);
		    });
		    res.render('guide_list_page/list', {guideList: guideMap});
	 	});
	});
	
	var createFilter = function(query) {
		var filter = {};
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
		if (query.language) {
			var language = Array.isArray(query.language) ? query.language : new Array(query.language);
			filter.language = {$all: language};
		}
		if (query.sex) {
			filter.sex = Array.isArray(query.sex) ? {$in: query.sex} : query.sex;
		}
		return filter;
	}

	return guideList_router;
}