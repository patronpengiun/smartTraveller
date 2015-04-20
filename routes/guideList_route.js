// created by Hongda Jiang
// 4-19-2015
// may be merged to index.js later
var express = require('express');
var guideList_router = express.Router();

var Guide = require('../models/guide');

module.exports = function() {
	guideList_router.get('/guidelist', function(req, res) {
		console.log('function called');
		Guide.find({}, function(err, guides) {
	    var guideMap = {};

	    guides.forEach(function(guide) {
	      guideMap[guide.username] = guide;
	    });

	   // res.send(guideMap);
	    res.render('guidelist');  
	  });
	});

	return guideList_router;
}