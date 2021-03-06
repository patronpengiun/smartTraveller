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
/***
app.use(lessMiddleware({
    src: __dirname + '/public/style/less',
    dest: __dirname + '/public/style/css',  
    prefix: '/style/css',
    compress: true
}));
***/

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'upload')));

// configure browserify middleware
var browserify_express = require('browserify-express');
app.use(browserify_express({
    entry: __dirname + '/public/js/custom/index.js',
    watch: __dirname + '/public/js/react/src/',
    mount: '/js/main.js',
    verbose: true,
    minify: false,
    bundle_opts: { debug: true }, // enable inline sourcemap on js files  
    write_file: __dirname + '/public/js/main.js',
}));

var initPassport = require('./passport/init');
initPassport(passport);

var routes = require('./routes/index')(passport);
app.use('/', routes);

var lvcheng_route = require('./routes/lvcheng')();
app.use('/', lvcheng_route);

var api_route = require('./routes/api')();
app.use('/api', api_route);

var server = app.listen((process.env.PORT || 5000), function() {
	var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
});
