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

var Guide = require('../models/guide');
var Place = require('../models/place');
var Review = require('../models/review');
var User = require('../models/user');
var Message = require('../models/message');
var Request = require('../models/request');

module.exports = function(passport) {
	router.get('/', function(req, res) {
		if (req.isAuthenticated()) {
			res.render('index', {user: req.user});
		} else {
			res.render('index', {user: {username: "旅橙网"}});
		}
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
						res.render('guide_page', {guide: guides[0], reviewList: reviews, avgRating: avg});
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
	router.get('/guide/dashboard/:guide_id', function(req, res) {
		Guide.find({_id:req.params.guide_id}, function(err, guides) {
			if (err || guides.length == 0) {
				res.send("Oops...No such page, perhaps wrong guide id >_<");
			} else {

				// guide hasn't been used yet, maybe useful for other nav sections.......
				res.render('guide_dashboard', {guide: guides[0], guideId: req.params.guide_id});
			}
		});
	});

	// For dashboard nav sections
	router.get('/dashboard_review/:guide_id', function(req, res) {
		Review.find({reviewee_id:req.params.guide_id}, function(err, reviews) {
			if (err) {
				res.send("Oops...No such page, perhaps wrong guide id >_<");
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

	router.get('/dashboard_setting/:guide_id', function(req, res) {
		Guide.find({_id:req.params.guide_id}, function(err, guides) {
			if (err || guides.length == 0) {
				res.send("Oops...No such page, perhaps wrong guide id >_<");
			} else {
				res.render('dashboard_nav_page/dashboard_setting', {guide: guides[0]});
			}
		});
	});

	router.get('/dashboard_request/:guide_id', function(req, res) {
		res.render('dashboard_nav_page/dashboard_request');
	});
	
/*************routers for inbox*****************************************************************/
	router.get('/inbox', function(req, res){
		if (req.isAuthenticated()){
			Message.find({user:req.user._id}, function(err, messages) {
				if(err){
					res.send("inbox error");
				} else{
					var contactTable = [];
					var me = req.user._id.valueOf();
					for(var i = 0; i < messages.length; i++){
						message = messages[i];
						if(!contactTable[message.guide]){
								contactTable[message.guide] = [message.guideName, message.timeStamp, message.isRead];
						}
						else if(contactTable[message.guide][1] < message.timeStamp){
								contactTable[message.guide][1] = message.timeStamp;
						}
						else if(!message.isRead){
							contactTable[message.guide][2] = false;
						}
					}
					var contacts = [];
					for(var rec in contactTable){
						contacts.push([contactTable[rec][0], contactTable[rec][1], rec, contactTable[rec][2]]);
					}
					console.log(contacts);
					contacts.sort(function(a, b){return b[1] - a[1]});
					res.render('inbox', {contacts : contacts});
				}
			});
		} else {
			res.redirect('/');
		}
	});
	router.get('/inbox/:mailee_id', function(req, res){
		if (req.isAuthenticated()){
			Guide.find({_id:req.params.mailee_id}, function(err, usr) {
				if (err || usr === 'undefined') {
					res.send("Oops...No such person can be mailed");
				} else {
					var mailee = usr[0];
					Message.find({user:req.user._id.valueOf()}, function(err, messages) {
						if(err){
							res.send("inbox error");
						} else{
							var contactTable = [];
							var theMessages = [];
							for(var i = 0; i < messages.length; i++){
								message = messages[i];
								if(message.guide === req.params.mailee_id){
									if(!message.isRead){
										message.isRead = true;
										message.save(function(err) {});
									}
									if(message.sender === mailee.id.valueOf()){
										theMessages.push([mailee.name, false, message.content, message.timeStamp]);
									}
									else{
										theMessages.push([req.user.username, true, message.content, message.timeStamp]);
									}
								}
								if(!contactTable[message.guide] || contactTable[message.guide][1] < message.timeStamp){
										contactTable[message.guide] = [message.guideName, message.timeStamp];
									}
							}
							var contacts = [];
							for(var rec in contactTable){
								contacts.push([contactTable[rec][0], contactTable[rec][1], rec]);
							}
							contacts.sort(function(a, b){return b[1] - a[1]});
							res.render('inbox', {contacts: contacts, messages: theMessages, mailee_id : req.params.mailee_id, mailee_name:mailee.name})
						}
					}).sort( { timeStamp: -1 } );
				}
			});
		} else {
			res.redirect('/');
		}
	});
	router.post('/inbox/send/', function(req, res) {
		if (req.isAuthenticated()){
			var temp = req.body;
			temp["user"] = req.user._id;
			temp["sender"] = req.user._id;
			var newMsg = new Message(temp);
			newMsg.save(function(err) {
				res.redirect('/inbox/'+temp["guide"]);
			});
		}
		else{
			res.redirect('/');
		}
	});

	return router;
}