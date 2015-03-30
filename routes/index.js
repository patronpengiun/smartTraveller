var express = require('express');
var router = express.Router();
var multer = require('multer');

var Guide = require('../models/guide');

module.exports = function(passport) {
	router.get('/', function(req, res) {		
		if (req.isAuthenticated()) {
			res.render('index', {user: req.user});
		} else {
			res.render('index', {user: {username: "旅橙网"}});
		}
	});
	
	router.get('/location/:place', function(req, res) {
		var place = mongo.find(req.pa)
		res.render('location', place);
	});
	
	router.get('/login', function(req, res) {
		res.render('login');
	});
	
	router.post('/login', function(req, res, next) {
		passport.authenticate('login', function(err, user, info) {
			if (err) {
				return next(err);
			} else if (!user) {
				return res.send({message: "fail"});
			} else {
				req.login(user, function(err) {
				  if (err) { return next(err); }
				  return res.send({message: "success", user: user});
				});
			}
		})(req, res, next);
	});
	
	router.get('/signup', function(req, res) {
		res.render('signup');
	});
	
	router.post('/signup', function(req, res, next) {
		passport.authenticate('signup', function(err, user, info) {
			if (err) {
				return next(err);
			} else if (!user) {
				return res.send(info);
			} else {
				req.login(user, function(err) {
				  if (err) { return next(err); }
				  return res.send({message: "success", user: user});
				});
			}
		})(req, res, next);
	});
	
	router.post('/logout', function(req,res) {
		req.logout();
		res.send({message: "logged out"});
	});
	
	router.get('/signup/guide', function(req, res) {
		res.render('guide_signup');
	});
	
	router.post('/signup/guide', multer({
				dest: './upload', 
				rename: function (fieldname, filename, req, res) {	
    						return req.user.username + '_' + filename + '_' + Date.now();
  						},
				onFileUploadStart: function (file) {
  			  		console.log(file.originalname + ' is starting ...')
				},
			}), function(req, res) {
		//if (req.isAuthenticated()) {
			console.log(req.files);
			var temp = req.body;
			//temp.username = req.user.username;
			temp.photos = [];
			temp.photos.push(req.files.photos.name);
			var newGuide = new Guide(temp);
			newGuide.save(function(err) {
				
			});
			res.send("save successfully");
			/*} else {
			res.send("unauthorized!");
		}*/
	});
	
	return router;
}