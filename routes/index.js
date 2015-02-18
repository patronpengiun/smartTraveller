var express = require('express');
var router = express.Router();

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
	
	router.post('logout', function(req,res) {
		req.logout();
		res.send({message: "logged out"});
	})
	
	return router;
}