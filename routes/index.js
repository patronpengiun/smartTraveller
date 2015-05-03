var express = require('express');
var router = express.Router();
var multer = require('multer');
var AWS = require('aws-sdk');
var mongoose = require('mongoose');

var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
var AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
AWS.config.update({
	accessKeyId: AWS_ACCESS_KEY,
	secretAccessKey: AWS_SECRET_KEY,
});
var s3 = new AWS.S3();
var fs = require('fs');

var Guide = require('../models/guide');
var Place = require('../models/place');
var Review = require('../models/review');
var User = require('../models/user');
var Request = require('../models/request');

var path = require('path');
var root_dir = path.dirname(require.main.filename);	// '..../smartTraveller'

module.exports = function(passport) {
	router.get('/', function(req, res) {
		res.render('index', {user: req.user});
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
		res.render('guide_signup', {user: req.user});
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
		function(req, res, next) {
			var temp = req.body;
			if (!req.isAuthenticated()) {
				passport.authenticate('signup', function(err, user, info) {
					if (err) {
						return next(err);
					} else if (!user) {
						return res.send(info);
					} else {
						req.login(user, function(err) {
							if (err) { return next(err); }
						});
					}
				})(req, res, next);
			} else {
				temp.username = req.user.username;
			}
			
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
				User.update({username: newGuide.username}, {role: "guide"}, function(err) {
					if (err) {
						res.sendStatus(500);
					} else {
						res.render('signup_complete');
					}
				});
			});
			
			
		}
		);

	// guide page, with guide_id given by guide list page
	router.get('/guidepage/:guide_id', function(req, res) {
		Guide.find({_id:req.params.guide_id}, function(err, guides) {
			// guides is an array with guide objects
			if (err || guides.length == 0) {
				res.send("Oops...No such page, perhaps wrong guide id >_<");
			} else {
				// Query review information
				Review.find({reviewee_id:req.params.guide_id}, function(err, reviews) {
					if (err) {
						res.send("Oops...No such page, perhaps wrong guide id >_<");
					} else {
						var sum = 0;
						for (var i = reviews.length - 1; i >= 0; i--) {
							sum += reviews[i].rating;
						};
						var avg = sum / reviews.length;	
						res.render('guide_page', {guide: guides[0], reviewList: reviews, avgRating: avg, user:req.user});
					}
				});
			} 
		});
	});

	// ------------ Pages just for creating review and test! -----------
	router.get('/review/create', function(req, res) {
		res.render('create_review');
	});
	router.post('/review/create', _multer, function(req, res) {
		console.log("submit create review request!");
		console.log(req.body);
		var info = req.body;
		var newReview = new Review(info);
		newReview.save(function(err) {
			res.render('create_review');
		});
	});



	// Place page, with place_id given by .
	router.get('/places/:place_id', function(req, res) {
		Place.find({_id:req.params.place_id}, function(err, places) {
			if (err || places.length == 0) {
				res.send("No such place.");
			} else if (places) {
				// TODO: places[0]?
				res.render('place_page', {place: places[0]}); 
			}
		});
	});
	
	// ------------ for request page ----------------
	router.post('/request/:guide_id', function(req, res) {
		console.log(req.params.guide_id);
		// check if the user is loged in, if not, send warning and return
		if(req.user == undefined){
			res.send('Please login first.');
			return;
		}

		Guide.find({_id:req.params.guide_id}, function(err, guides) {
			// check if the guide can be found with guide id
			// if not, send warning and return
			if (err || guides.length == 0) {
				res.send("Oops...No such guide, perhaps wrong guide id >_<");
				return;
			} 
			// 
			else {
				var newRequest = new Request(req.body);
				newRequest.customer_Username = req.user.username;	
				newRequest.guideId = req.params.guide_id;
				newRequest.save(function(err) {
					res.send("Request successfully submitted.");
				});
			} 
		});
	});

	// Dashboard page
	router.get('/guide/dashboard/:user_id', function(req, res) {
		User.find({_id: req.params.user_id}, function(err, users) {
			if (err || users.length == 0) {
				res.send("Oops...No such page, perhaps wrong user id >_<");
				return;
			} else if (typeof req.user == 'undefined') {
				res.send("Please go to main page and log in first :)");
				return;
			}
			
			var user = users[0];
			if (user.role == 'guide') {
				Guide.find({username:user.username}, function(err, guides) {
					if (err || guides.length == 0) {
						res.send("Oops...No such page, perhaps wrong user id >_<");
						return;
					}
					res.render('guide_dashboard', {user: user, guide: guides[0]});
				});
			} else {
				res.render('guide_dashboard', {user: user, guide: null});
			}
		});
	});

	// For dashboard nav sections
	router.get('/dashboard_review/:user_id', function(req, res) {
		Review.find({reviewee_id:req.params.user_id}, function(err, reviews) {
			if (err) {
				res.send("Oops...No such page, perhaps wrong user id >_<");
			} else {
				var sum = 0;
				for (var i = reviews.length - 1; i >= 0; i--) {
					sum += reviews[i].rating;
				};
				var avg = (sum / reviews.length).toPrecision(3);	
				res.render('dashboard_nav_page/dashboard_review', {reviewList: reviews, avgRating: avg});
			}
		});
	});

	router.get('/dashboard_setting/:user_id', function(req, res) {
		User.find({_id:req.params.user_id}, function(err, users) {
			if (err || users.length == 0) {
				res.send("Oops...No such page, perhaps wrong user id >_<");
				return;
			} 
			
			var user = users[0];
			if (user.role == 'guide') {
				Guide.find({username:user.username}, function(err, guides) {
					if (err || guides.length == 0) {
						res.send("Oops...No such page, perhaps wrong user id >_<");
						return;
					}
					// console.log(guides[0]);
					res.render('dashboard_nav_page/dashboard_setting', {user: user, guide: guides[0]});
				});
			} else {
				res.render('dashboard_nav_page/dashboard_setting', {user: user, guide: null});
			}
		});
	});

	router.get('/dashboard_request/:user_id', function(req, res) {
		res.render('dashboard_nav_page/dashboard_request');
	});


	// For dashboard settings edit info
	router.post('/dashboard/settings/updateinfo', _multer, function(req, res) {
		console.log("Submit edit info to update guide...");

		if (!req.user) {
			res.send("Please log in first.");
		} else {
			var query = {username: req.user.username};
			var update = req.body;
			if (req.files && req.files.photo_portrait) {
				update.photo_portrait = req.files.photo_portrait.name;
				Guide.find(query, function(err, guides) {
					var oldName = guides[0].photo_portrait;
					Guide.update(query, update, function(err) {

						fs.unlink(root_dir + '/upload/' + oldName, function(err) {
							// If file path doesn't exist, throws error here
							// If delete fail, old pic still exits, but page will only display new pic user just uploaded
							if (err) throw err;		
	  						console.log('successfully deleted old avatar: ' + oldName);
						});
					});
				});

			} else {
				Guide.update(query, update, function(err) {
					res.send(200);
				});
			}
		}
	});


	return router;
}