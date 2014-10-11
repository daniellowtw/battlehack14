/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, require, process, console */

var express = require("express");
var bodyParser = require('body-parser');
var app = express();
var MopidyQueue = require("./mopidy-server");
var mopidy = new MopidyQueue();
// use body parser to interpret json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

// serve an html page on the root url
app.get('/', function(req, res) {
	res.send("No API method here. Consider a subpath!");
});

var notImplemented = {
	success: false,
	error: "Not Implemented"
};

// get search results for the given source
app.get('/search/:source', function(req, res) {
	res.json(notImplemented);
});

// post a new track submission
app.post('/track', function(req, res) {
	res.json(notImplemented);
});

// get current track
app.get('/track', function(req, res) {
	mopidy.getCurrentTrack(function(result) {
		res.json(result);
	});
});

// get current queue
app.get('/queue', function(req, res) {
	res.json(notImplemented);
});

// serve static files in the 'assets' folder directly from the root
app.use('/', express.static(__dirname + '/assets'));
// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
	res.send("404 Page not found");
});

// listen on port 8000
app.listen(process.env.PORT || 8080);
console.log("Music server running on port " +(process.env.PORT || 8080) );