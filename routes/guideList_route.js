// created by Hongda Jiang
// 4-19-2015
// may be merged to index.js later
var AWS = require('aws-sdk');
var express = require('express');
var guideList_router = express.Router();

var Guide = require('../models/guide');
var url = require('url');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
AWS.config.update({
	accessKeyId: AWS_ACCESS_KEY,
	secretAccessKey: AWS_SECRET_KEY,
	region: 'us-west-2',
});
var s3Policy = require('s3policy');
var myS3Account = new s3Policy(AWS_ACCESS_KEY, AWS_SECRET_KEY);

module.exports = function() {
	guideList_router.get('/', function(req, res) {
		var filter = createFilter(req.query);
		Guide.find(filter, function(err, guides) {
		    var guideMap = [];
		    guides.forEach(function(guide) {
		      guideMap.push(guide);
		    });
		    res.render('guide_list', {guideList: generateImageUrl(guideMap), user: req.user, city: req.query.city});

		    function generateImageUrl(guideMap){
		    	for(var i=0; i < guideMap.length; i++){
		    		guideMap[i].photo_portrait = myS3Account.readPolicy(guideMap[i].photo_portrait, 'lvcheng', 60).replace('s3.amazonaws.com/lvcheng', 'lvcheng.s3.amazonaws.com');
		    	}
		    	return guideMap;
		    }
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
		
		if (query.url) {
			var city = url.parse(query.url,true).query.city;
			if (city) {
				query.city = city
			}
		}
		
		return filter;
	}

	return guideList_router;
}