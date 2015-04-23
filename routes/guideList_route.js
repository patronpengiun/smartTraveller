// created by Hongda Jiang
// 4-19-2015
// may be merged to index.js later
var express = require('express');
var guideList_router = express.Router();

var Guide = require('../models/guide');

module.exports = function() {
	guideList_router.get('/', function(req, res) {
		Guide.find({}, function(err, guides) {
	    var guideMap = [];

	    guides.forEach(function(guide) {
	      guideMap.push(guide);
	    });
	    //res.send(guideMap);
	    res.render('guide_list', {guideList: guideMap});
	  });
	});


	guideList_router.get('/filter', function(req, res) {
		console.log(req)
		return;
	});

	return guideList_router;
}