var express = require('express');
var app = express();

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

var dbConfig = require('./db');
var dbURL;
if (process.env.MODE == 'dev') {
	dbURL = dbConfig.dev;
} else {
	dbURL = dbConfig.production;
}

var mongoose = require('mongoose');
// Connect to DB
mongoose.connect(dbURL);

// Configuring Passport
var passport = require('passport');
var expressSession = require('express-session');
app.use(expressSession({secret: '910723'}));
app.use(passport.initialize());
app.use(passport.session());

var path = require('path');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
var lessMiddleware = require('less-middleware');
app.use(lessMiddleware(path.join(__dirname, "public"),{compress : true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'uploads')));

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

//var guideList_route = require('./routes/guideList_route');
//app.use('/', guideList_route);

var server = app.listen((process.env.PORT || 5000), function() {
	var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
