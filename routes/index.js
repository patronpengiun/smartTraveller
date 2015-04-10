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
		res.render('q_a');
	});

	router.get('/signup/guide_apply', function(req, res){
		res.render('guide_signup');
	});
	
	router.post('/signup/guide', multer({
				dest: './upload', 
				rename: function (fieldname, filename, req, res) {	
    						//return req.user.username + '_' + filename + '_' + Date.now();
							return filename + '_' + Date.now();
  						},
			}), function(req, res) {
				console.log(req.files);
				var temp = req.body;
				//temp.username = req.user.username;
				
				// TODO: refactor
				temp.photo_portrait = req.files.photo_portrait.name;
				temp.photo_view = [];
				for (var i=0;i<req.files.photo_view.length;i++) {
					temp.photo_view.push(req.files.photo_view[i].name);
				}
				if (req.files.photo_view.name) {
					temp.photo_view.push(req.files.photo_view.name);
				}
				temp.photo_life = [];
				for (var i=0;i<req.files.photo_life.length;i++) {
					temp.photo_life.push(req.files.photo_life[i].name);
				}
				if (req.files.photo_life.name) {
					temp.photo_life.push(req.files.photo_life.name);
				}
				
				var newGuide = new Guide(temp);
				newGuide.save(function(err) {
					res.send("saved successfully");
				});
			}
		);
	
	return router;
}