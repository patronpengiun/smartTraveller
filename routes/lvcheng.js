var express = require('express');
var router = express.Router();

var React = require('react');

var DisplayBlock = require('../public/js/react/build/displayBlock');
var displayBlockConfig = require('../config/displayBlock');

var GuidedTour = require('../public/js/react/build/guidedTour');
var guidedTourConfig = require('../config/guidedTour');

var GroupTour = require('../public/js/react/build/groupTour');
var groupTourConfig = require('../config/groupTour');

module.exports = function() {
	router.get('/dests/:region', function(req, res, next) {
		var displayHTML = React.renderToString(React.createElement(DisplayBlock, displayBlockConfig[req.params.region]));
		res.render('lvcheng/dests', {
            displayHTML: displayHTML,
            titleImg: displayBlockConfig[req.params.region].titleImg,
        });
	});
    
    router.get('/guided_tour/:dest', function(req, res, next) {
        var tourHTML = React.renderToString(React.createElement(GuidedTour, guidedTourConfig[req.params.dest]));
        res.render('lvcheng/guidedTour.ejs', {
            tourHTML: tourHTML,
            titleImg: guidedTourConfig[req.params.dest].titleImg,
        });
    });
    
    router.get('/group_tour/:dest', function(req, res, next) {
        console.log(groupTourConfig);
        
        var tourHTML = React.renderToString(React.createElement(GroupTour, groupTourConfig[req.params.dest]));
        
        res.render('lvcheng/groupTour.ejs', {
            tourHTML: tourHTML,
            titleImg: groupTourConfig[req.params.dest].titleImg,
        });
    });

	return router;
}

