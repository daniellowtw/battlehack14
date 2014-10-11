// modules =================================================
var express        = require('express');
var app            = express();
var mongoose       = require('mongoose');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');
var Parse          = require('parse').Parse;
var config         = require('./jambox');
var port = config.port;
// mongoose.connect(process.env.MONGOHQ_URL); // connect to our mongoDB database (commented out after you enter in your own credentials)

// Set up parse stuff
Parse.initialize(config.appID, config.javascriptKey);
 
// expose these for other files to use
module.exports.config = config;
module.exports.Parse = Parse;
module.exports.express = express;
module.exports.app = app;

// To test server API for parse
var api_route      = require('./api_route')


// get all data/stuff of the body (POST) parameters
app.use(bodyParser.json()); // parse application/json 
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded

app.use(methodOverride('X-HTTP-Method-Override')); // ;loverride with the X-HTTP-Method-Override header in the request. simulate DELETE/PUT
app.use(express.static(__dirname + '/public')); // set the static files location /public/img will be /img for users

// routes ==================================================
require('./app/routes')(app); // pass our application into our routes

// start app ===============================================
app.listen(port);	
console.log('Serving on ' + port); 			// shoutout to the user
exports = module.exports = app; 						// expose app
