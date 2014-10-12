// 'use strict';

var sleep = require('sleep');

var express = require('express');
module.exports.express = express;
var app = express();

var config = require("./config");
module.exports.config = config;

module.exports.app = app;

var API = require("./api");

// start mopidy server
var exec = require('child_process').exec;
exec('/usr/bin/mopidy', function (error, stdout, stderr) {
  console.log("MOPIDY: server started");
});

sleep.sleep(6);

var api = new API({
	webSocketUrl: "ws://localhost:6680/mopidy/ws/",
	callingConvention: "by-position-or-by-name",
	// consume:true
});
module.exports.api = api;

require("./routes");

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
 });

// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
    res.send("404 Page not found");
});

// set the default directory for templated pages
app.set("views", __dirname + "/client");

// listen on selected port
app.listen(config.port);
console.log("Music server running on port " + config.port );
