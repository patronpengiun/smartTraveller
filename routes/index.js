var express = require('express');
var router = express.Router();
var multer = require('multer');
var AWS = require('aws-sdk');
var mongoose = require('mongoose');



var s3 = new AWS.S3({params: {Bucket: S3_BUCKET}});
var s3Policy = require('s3policy');
var myS3Account = new s3Policy(AWS_ACCESS_KEY, AWS_SECRET_KEY);

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
    						//console.log(req);
    						return replaceAll(' ', '-', filename);
    					},
    				});
	} else {
		_multer = multer({
			dest: './upload', 
			//limits : { fileSize: 100*1024*1024 },
			rename: function (fieldname, filename, req, res) {	
						//return req.user.username + '_' + filename + '_' + Date.now();
						return replaceAll(' ', '-', filename);
					},
			// onFileUploadData: function (file, data, req, res) {
			// 	var params = {
			// 		Bucket: S3_BUCKET,
			// 		Key: file.name,
			// 		Body: fs.createReadStream(file.path),
			// 		ContentType: 'application/octet-stream',
			// 	};

			// 	s3.upload(params, function(err, data) {
	  //   			if (err) {
	  //     				console.log("Error uploading data: ", err);
	  //   			} else {
	  //     				console.log("Successfully uploaded");
	  //   			}
  	// 			});
			// },
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
			//TODO: refactor
			temp.photo_portrait = temp.username + '_' + req.files.photo_portrait.name;
			temp.photo_view = [];
			for (var i=0;i<req.files.photo_view.length;i++) {
				temp.photo_view.push(temp.username + '_' + req.files.photo_view[i].name);
			}
			if (req.files.photo_view.name) {
				temp.photo_view.push(temp.username + '_' + req.files.photo_view.name);
			}
			temp.photo_life = [];
			for (var i=0;i<req.files.photo_life.length;i++) {
				temp.photo_life.push(temp.username + '_' + req.files.photo_life[i].name);
			}
			if (req.files.photo_life.name) {
				temp.photo_life.push(temp.username + '_' + req.files.photo_life.name);
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
						var targetGuide = guides[0];
						// update image name to target image path
						if (process.env.MODE == 'dev'){
							targetGuide.photo_portrait = "/"+targetGuide.photo_portrait;
							for(var i=0; i<targetGuide.photo_view.length; i++){
								targetGuide.photo_view[i] = "/" + targetGuide.photo_view[i];
							}
							for(var i=0; i<targetGuide.photo_life.length; i++){
								targetGuide.photo_life[i] = "/" + targetGuide.photo_life[i];
							}
						}
						else {
							//generate new aws url to access picture
							targetGuide.photo_portrait = reGenerateUrl(myS3Account.readPolicy(targetGuide.photo_portrait, 'lvcheng', 60));
							for(var i=0; i<targetGuide.photo_view.length; i++){
								targetGuide.photo_view[i] = reGenerateUrl(myS3Account.readPolicy(targetGuide.photo_view[i], 'lvcheng', 60));
							}
							for(var i=0; i<targetGuide.photo_life.length; i++){
								targetGuide.photo_life[i] = reGenerateUrl(myS3Account.readPolicy(targetGuide.photo_life[i], 'lvcheng', 60));
							}
						}
						res.render('guide_page', {guide: guides[0], reviewList: reviews, avgRating: avg, user:req.user});
					}

					function reGenerateUrl(url){
   						var newNRL = url.replace('s3.amazonaws.com/lvcheng', 'lvcheng.s3.amazonaws.com');
   						return newNRL;
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
		var info = req.body;
		var newReview = new Review(info);
		newReview.date = new Date();
		newReview.save(function(err) {
			Request.update({_id: req.body.request_id}, {status: "reviewed"}, function(err) {
				res.sendStatus(200);
			})
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
			} else {
				var newRequest = new Request(req.body);
				newRequest.customerId = req.user._id;	
				newRequest.guideId = req.params.guide_id;
				newRequest.status = "pending";
				newRequest.save(function(err) {
					res.send("Request successfully submitted.");
				});
			} 
		});
	});

	router.post('/request/update/accept', function(req, res) {
		Request.update({_id: req.body.id}, {status: "accepted"}, function(err) {
			res.sendStatus(200);
		});
		
	});
	
	router.post('/request/update/deny', function(req, res) {
		Request.update({_id: req.body.id}, {status: "denied"}, function(err) {
			res.sendStatus(200);
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
		User.find({_id:req.params.user_id}, function(err, users){
			Guide.find({username: users[0].username}, function(err, guides) {
				if (guides.length == 0) {
					res.send("Review not supported for normal user");
					return;	
				}
				var guideid = guides[0]._id;
				Review.find({reviewee_id:guideid}, function(err, reviews) {
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
		var uid = req.params.user_id;
		Request.find({customerId:uid, status:{$in: ["pending", "denied", "accepted"]}}, function(err, upcomingRequests) {
			Request.find({customerId:uid, status:{$in: ["completed", "reviewed"]}}, function(err, previousRequests) {
				User.find({_id:uid}, function(err, users) {
					Guide.find({username:users[0].username}, function(err, guides) {
						if (guides.length == 0) {
							guides = [{_id:null}];
						}
						Request.find({guideId:guides[0]._id, status:"pending"}, function(err, pendingRequests) {
							mapRequests(upcomingRequests, function(upcomingReqs) {
								mapRequests(previousRequests, function(previousReqs) {
									mapRequests(pendingRequests, function(pendingReqs) {
										res.render("dashboard_nav_page/dashboard_request", {
											upcomingRequests: upcomingReqs,
											previousRequests: previousReqs,
											pendingRequests: pendingReqs
										});
									});
								});
							});
						});
					});
				});
			});
		});
		
		
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
							if (err) {
								console.log('Delete fail, maybe no such avatar: ' + oldName);
							} else {		
	  							console.log('successfully deleted old avatar: ' + oldName);
	  						}
	  						res.send(200);
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
	
	var mapRequests = function(requests, callback) {
		var ret = [];
		
		var helper = function(index) {
			if (index == requests.length) {
				callback(ret);
			} else {
				User.find({_id:requests[index].customerId}, function(err, users) {
					Guide.find({_id:requests[index].guideId}, function(err, guides) {
						Review.find({request_id: requests[index]._id}, function(err, reviews) {
							var result = {
								id: requests[index]._id,
								guestName: users[0].username,
								guideName: guides[0].name,
								guideId: guides[0]._id,
								guestId: users[0]._id,
								dates: requests[index].startDate.toDateString() + " to " + requests[index].endDate.toDateString(),
								status: requests[index].status,
								destination: guides[0].city,
								review: reviews.length == 0 ? null : reviews[0].review_text
							};
							ret.push(result);
							helper(index+1);
						});
					});
				});
			}
		}
		
		helper(0);
	};

	/*
	 * Respond to GET requests to /sign_s3.
	 * Upon request, return JSON containing the temporarily-signed S3 request and the
	 * anticipated URL of the image.
	 */
	router.get('/sign_s3', function(req, res){
	    var myS3 = new AWS.S3(); 
	    var s3_params = { 
	        Bucket: S3_BUCKET, 
	        Key: req.query.username + '_' + replaceAll(' ', '-',req.query.file_name), 
	        Expires: 60, 
	        ContentType: req.query.file_type, 
	        ACL: 'private'
	    }; 
	    myS3.getSignedUrl('putObject', s3_params, function(err, data){ 
	        if(err){ 
	            console.log(err); 
	        }
	        else{ 
	            var return_data = {
	                signed_request: data,
	                url: 'https://'+S3_BUCKET+'.s3.amazonaws.com/'+req.query.file_name 
	            };
	            res.write(JSON.stringify(return_data));
	            res.end();
	        } 
	    });
	});

	function replaceAll(find, replace, str) {
		return str.replace(new RegExp(find, 'g'), replace);
	}

	return router;
}