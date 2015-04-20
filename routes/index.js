var express = require('express');
var router = express.Router();
var multer = require('multer');
var AWS = require('aws-sdk');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
});
var s3 = new AWS.S3();

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
	
	router.get('/signup/guide/qa', function(req, res) {
		res.render('q_a');
	});

	router.get('/signup/guide/apply', function(req, res){
		res.render('guide_signup');
	});
	
	var _multer;
	if (process.env.MODE == 'dev') {
		_multer = multer({
				dest: './upload', 
				rename: function (fieldname, filename, req, res) {	
    						//return req.user.username + '_' + filename + '_' + Date.now();
							return filename + '_' + Date.now();
  						},
				});
	} else {
		_multer = multer({
			dest: './upload', 
			rename: function (fieldname, filename, req, res) {	
						//return req.user.username + '_' + filename + '_' + Date.now();
						return filename + '_' + Date.now();
					},
			onFileUploadData: function (file, data, req, res) {
			    var params = {
			    	Bucket: S3_BUCKET,
			    	Key: file.name,
			    	Body: data
			    };

			    s3.putObject(params, function (perr, pres) {
			    	if (perr) {
						console.log("Error uploading data: ", perr);
			      	} else {
			        	console.log("Successfully uploaded data");
			      	}
			    });
			},
		});
	}
	
	router.post('/signup/guide/apply', _multer, 
			function(req, res) {
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
					res.render('signup_complete');
				});
			}
		);

	// guide page
	router.get('/guidepage', function(req, res) {
		res.render('guide_page');
	});
	
	router.get('/guidelist', function(req, res) {
		Guide.find({}, function(err, guides) {
	    var guideMap = [];

	    guides.forEach(function(guide) {
	      guideMap.push(guide);
	    });
	    //res.send(guideMap);
	    res.render('guide_list', {guideList: guideMap});
	  });
	});

	return router;
}