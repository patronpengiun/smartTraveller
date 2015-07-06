var express = require('express');
var router = express.Router();
var multer = require('multer');
var AWS = require('aws-sdk');
var mongoose = require('mongoose');

//configuring AWS S3
var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY_ID;
var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
var S3_BUCKET = process.env.S3_BUCKET;
AWS.config.update({
    accessKeyId: AWS_ACCESS_KEY,
    secretAccessKey: AWS_SECRET_KEY,
    region: 'us-west-2',
});

//get s3 and s3Policy instance 
var s3 = new AWS.S3({
    params: {
        Bucket: S3_BUCKET
    }
});
var s3Policy = require('s3policy');
var myS3Account = new s3Policy(AWS_ACCESS_KEY, AWS_SECRET_KEY);

var fs = require('fs');

// set up node mailer
var nodemailer = require("nodemailer");
var smtpTransport = nodemailer.createTransport("SMTP",{
    service: "Gmail",
    auth: {
    user: "hr@lvcheng.us",
    pass: "smart888"
    }
});

var Guide = require('../models/guide');
var Place = require('../models/place');
var Review = require('../models/review');
var User = require('../models/user');
var Request = require('../models/request');

var path = require('path');
var root_dir = path.dirname(require.main.filename); // '..../smartTraveller'

module.exports = function(passport) {
    router.get('/', function(req, res) {
        res.render('index', {
            user: req.user
        });
    });
	
	// test react
	router.get('/test', function(req, res, next) {
		res.render('lvcheng/parts/nav');
	});

    router.post('/login', function(req, res, next) {
        passport.authenticate('login', function(err, user, info) {
            if (err) {
                return next(err);
            } else if (!user) {
                return res.send({
                    message: "fail"
                });
            } else {
                req.login(user, function(err) {
                    if (err) {
                        return next(err);
                    }
                    return res.send({
                        message: "success",
                        user: user
                    });
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
                    if (err) {
                        return next(err);
                    }
                    return res.send({
                        message: "success",
                        user: user
                    });
                });
            }
        })(req, res, next);
    });

    router.post('/logout', function(req, res) {
        req.logout();
        res.send({
            message: "logged out"
        });
    });

    router.get('/signup/guide/qa', function(req, res) {
        res.render('q_a');
    });

    router.get('/signup/guide/apply', function(req, res) {
        res.render('guide_signup', {
            user: req.user
        });
    });

    //configuring multer
    var _multer;
    if (process.env.MODE == 'dev') {
        _multer = multer({
            dest: './upload',
            rename: function(fieldname, filename, req, res) {
                return req.body.username + '_' + replaceAll(' ', '-', filename);
            },
        });
    } else {
        _multer = multer({
            dest: './upload',
            rename: function(fieldname, filename, req, res) {
                return req.body.username + '_' + replaceAll(' ', '-', filename);
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
                            if (err) {
                                return next(err);
                            }
                        });
                    }
                })(req, res, next);
            } else {
                temp.username = req.user.username;
            }
            //TODO: refactor
            temp.photo_portrait = req.files.photo_portrait.name;
            temp.photo_view = [];
            for (var i = 0; i < req.files.photo_view.length; i++) {
                temp.photo_view.push(req.files.photo_view[i].name);
            }
            if (req.files.photo_view.name) {
                temp.photo_view.push(req.files.photo_view.name);
            }
            temp.photo_life = [];
            for (var i = 0; i < req.files.photo_life.length; i++) {
                temp.photo_life.push(req.files.photo_life[i].name);
            }
            if (req.files.photo_life.name) {
                temp.photo_life.push(req.files.photo_life.name);
            }

            var newGuide = new Guide(temp);
            newGuide.save(function(err) {
                User.update({
                    username: newGuide.username
                }, {
                    role: "guide"
                }, function(err) {
                    if (err) {
                        res.sendStatus(500);
                    } else {
                        res.sendStatus(200);
                        //res.render('signup_complete');
                    }
                });
            });

        });

    // guide list
    router.get('/guidelist', function(req, res) {
        var filter = createFilter(req.query);
        Guide.find(filter, function(err, guides) {
            var guideMap = [];
            guides.forEach(function(guide) {
                //set guide's portrait image address
                guide.photo_portrait = getImageAddress(guide.photo_portrait);
                guideMap.push(guide);
            });
            res.render('guide_list', {
                guideList: guideMap,
                user: req.user,
                city: req.query.city
            });

        });
    });

    router.get('/guidelist/list', function(req, res) {
        var filter = createFilter(req.query);
        Guide.find(filter, function(err, guides) {
            var guideMap = [];
            guides.forEach(function(guide) {
            	//set guide's portrait image address
                guide.photo_portrait = getImageAddress(guide.photo_portrait);
                guideMap.push(guide);
            });
            res.render('guide_list_page/list', {
                guideList: guideMap
            });
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
            filter.occupation = Array.isArray(query.occupation) ? {
                $in: query.occupation
            } : query.occupation;
        }
        if (query.language) {
            var language = Array.isArray(query.language) ? query.language : new Array(query.language);
            filter.language = {
                $all: language
            };
        }
        if (query.sex) {
            filter.sex = Array.isArray(query.sex) ? {
                $in: query.sex
            } : query.sex;
        }

        if (query.url) {
            var city = url.parse(query.url, true).query.city;
            if (city) {
                query.city = city
            }
        }

        return filter;
    }


    // guide page, with guide_id given by guide list page
    router.get('/guidepage/:guide_id', function(req, res) {
        Guide.find({
            _id: req.params.guide_id
        }, function(err, guides) {
            // guides is an array with guide objects
            if (err || guides.length == 0) {
                res.send("Oops...No such page, perhaps wrong guide id >_<");
            } else {
                // Query review information
                Review.find({
                    reviewee_id: req.params.guide_id
                }, function(err, reviews) {
                    if (err) {
                        res.send("Oops...No such page, perhaps wrong guide id >_<");
                    } else {
                        var sum = 0;
                        for (var i = reviews.length - 1; i >= 0; i--) {
                            sum += reviews[i].rating;
                        };
                        var avg = sum / reviews.length;
                        var targetGuide = guides[0];

                        // update image url
                        targetGuide.photo_portrait = getImageAddress(targetGuide.photo_portrait);
                        for (var i = 0; i < targetGuide.photo_view.length; i++) {
                            targetGuide.photo_view[i] = getImageAddress(targetGuide.photo_view[i]);
                        }
                        for (var i = 0; i < targetGuide.photo_life.length; i++) {
                            targetGuide.photo_life[i] = getImageAddress(targetGuide.photo_life[i]);
                        }
                        res.render('guide_page', {
                            guide: targetGuide,
                            reviewList: reviews,
                            avgRating: avg,
                            user: req.user
                        });
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
            Request.update({
                _id: req.body.request_id
            }, {
                status: "reviewed"
            }, function(err) {
                res.sendStatus(200);
            })
        });
    });



    // Place page, with place_id given by .
    router.get('/places/:place_id', function(req, res) {
        Place.find({
            _id: req.params.place_id
        }, function(err, places) {
            if (err || places.length == 0) {
                res.send("No such place.");
            } else if (places) {
                // TODO: places[0]?
                res.render('place_page', {
                    place: places[0]
                });
            }
        });
    });

    // ------------ for request page ----------------
    router.post('/request/:guide_id', function(req, res) {
        if (req.user == undefined) {
            res.send('Please login first.');
            return;
        }

        Guide.find({
            _id: req.params.guide_id
        }, function(err, guides) {
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
        Request.update({
            _id: req.body.id
        }, {
            status: "accepted"
        }, function(err) {
            res.sendStatus(200);
        });

    });

    router.post('/request/update/deny', function(req, res) {
        Request.update({
            _id: req.body.id
        }, {
            status: "denied"
        }, function(err) {
            res.sendStatus(200);
        });
    });

    // Dashboard page
    router.get('/guide/dashboard/:user_id', function(req, res) {
        User.find({
            _id: req.params.user_id
        }, function(err, users) {
            if (err || users.length == 0) {
                res.send("Oops...No such page, perhaps wrong user id >_<");
                return;
            } else if (typeof req.user == 'undefined') {
                res.send("Please go to main page and log in first :)");
                return;
            }

            var user = users[0];
            if (user.role == 'guide') {
                Guide.find({
                    username: user.username
                }, function(err, guides) {
                    if (err || guides.length == 0) {
                        res.send("Oops...No such page, perhaps wrong user id >_<");
                        return;
                    }
                    res.render('guide_dashboard', {
                        user: user,
                        guide: guides[0]
                    });
                });
            } else {
                res.render('guide_dashboard', {
                    user: user,
                    guide: null
                });
            }
        });
    });

    // For dashboard nav sections
    router.get('/dashboard_review/:user_id', function(req, res) {
        User.find({
            _id: req.params.user_id
        }, function(err, users) {
            Guide.find({
                username: users[0].username
            }, function(err, guides) {
                if (guides.length == 0) {
                    res.send("Review not supported for normal user");
                    return;
                }
                var guideid = guides[0]._id;
                Review.find({
                    reviewee_id: guideid
                }, function(err, reviews) {
                    if (err) {
                        res.send("Oops...No such page, perhaps wrong user id >_<");
                    } else {
                        var sum = 0;
                        for (var i = reviews.length - 1; i >= 0; i--) {
                            sum += reviews[i].rating;
                        };
                        var avg = (sum / reviews.length).toPrecision(3);
                        res.render('dashboard_nav_page/dashboard_review', {
                            reviewList: reviews,
                            avgRating: avg
                        });
                    }
                });
            });
        });
    });

    router.get('/dashboard_setting/:user_id', function(req, res) {
        User.find({
            _id: req.params.user_id
        }, function(err, users) {
            if (err || users.length == 0) {
                res.send("Oops...No such page, perhaps wrong user id >_<");
                return;
            }

            var user = users[0];
            if (user.role == 'guide') {
                Guide.find({
                    username: user.username
                }, function(err, guides) {
                    if (err || guides.length == 0) {
                        res.send("Oops...No such page, perhaps wrong user id >_<");
                        return;
                    }
                    // console.log(guides[0]);
                    res.render('dashboard_nav_page/dashboard_setting', {
                        user: user,
                        guide: guides[0]
                    });
                });
            } else {
                res.render('dashboard_nav_page/dashboard_setting', {
                    user: user,
                    guide: null
                });
            }
        });
    });

    router.get('/dashboard_request/:user_id', function(req, res) {
        var uid = req.params.user_id;
        Request.find({
            customerId: uid,
            status: {
                $in: ["pending", "denied", "accepted"]
            }
        }, function(err, upcomingRequests) {
            Request.find({
                customerId: uid,
                status: {
                    $in: ["completed", "reviewed"]
                }
            }, function(err, previousRequests) {
                User.find({
                    _id: uid
                }, function(err, users) {
                    Guide.find({
                        username: users[0].username
                    }, function(err, guides) {
                        if (guides.length == 0) {
                            guides = [{
                                _id: null
                            }];
                        }
                        Request.find({
                            guideId: guides[0]._id,
                            status: "pending"
                        }, function(err, pendingRequests) {
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
            var query = {
                username: req.user.username
            };
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
                User.find({
                    _id: requests[index].customerId
                }, function(err, users) {
                    Guide.find({
                        _id: requests[index].guideId
                    }, function(err, guides) {
                        Review.find({
                            request_id: requests[index]._id
                        }, function(err, reviews) {
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
                            helper(index + 1);
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
    router.get('/sign_s3', function(req, res) {
        var username;
        if(req.query.username === 'username'){
            username = req.user.username;
        }
        else{
            username = req.query.username;
        }
        var s3_params = {
            //Bucket: S3_BUCKET, 
            Key: username + '_' + replaceAll(' ', '-', req.query.file_name),
            Expires: 60,
            ContentType: req.query.file_type,
            ACL: 'private'
        };
        s3.getSignedUrl('putObject', s3_params, function(err, data) {
            if (err) {
                console.log(err);
            } else {
                var return_data = {
                    signed_request: data,
                    url: 'https://' + S3_BUCKET + '.s3.amazonaws.com/' + req.query.file_name
                };
                res.write(JSON.stringify(return_data));
                res.end();
            }
        });
    });

    router.get('/sendmail', function(req, res) {
        var username;
        if(req.query.email === 'email'){
            username = req.user.username;
        }
        else{
            username = req.query.email;
        }
        Guide.find({username: username}, function(err, guides){
            if(err){
                console.log("Can not find guide " + username);
            }
            else{
                if(guides.length == 0){
                    console.log("No guides found with username: " + username);
                    return;
                }
                var guide_id = guides[0].id;
                var mailTo = 'hr@lvcheng.us';
                var mailSub = 'New Guide Signup Reminding'; 
                var mailText = "Name: " + req.query.name + " \
                        Email: " + username + " \
                        Phone: " + req.query.phone + " \
                        Please see: https://lvcheng.herokuapp.com/guidepage/" + guide_id;
                var mailOptions={
                    to : mailTo,
                    subject : mailSub,
                    text : mailText
                }
                smtpTransport.sendMail(mailOptions, function(error, response){
                if(error){
                    console.log(error);
                    res.end("error");
                }else{
                    console.log("Message sent: " + response.message);
                    res.end("sent");
                }
        });
            } 
        });
    });

    var replaceAll = function(find, replace, str) {
        return str.replace(new RegExp(find, 'g'), replace);
    }

    var getImageAddress = function(image_name) {
        if (process.env.MODE == 'dev') {
            return '/'+image_name;
        } else {
            return myS3Account.readPolicy(image_name, 'lvcheng', 60).replace('s3.amazonaws.com/lvcheng', 'lvcheng.s3.amazonaws.com');
        }
    };

    return router;
}