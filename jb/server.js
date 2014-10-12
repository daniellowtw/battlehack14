// 'use strict';

var sleep = require('sleep');

var express = require('express');
module.exports.express = express;
var app = express();
var http = require('http');

var config = require("./config");
var default_config = {
    port: 80,
    cserver: "http://jambox.tk",
    skip_threshold: 3,
    interface: "wlan0"
};

config.port = config.port || default_config.port;
config.cserver = config.cserver || default_config.cserver;
config.skip_threshold = config.skip_threshold || default_config.skip_threshold;
config.interface = config.interface || default_config.interface;
module.exports.config = config;
if (typeof config.jambox_name === 'undefined')
	throw new Error("config.jambox_name must be set!");
// if (typeof config.host_paypal === 'undefined')
// 	throw new Error("config.host_paypal must be set!");

module.exports.app = app;

var API = require("./api");

// start mopidy server
var exec = require('child_process').exec;
exec('/usr/bin/mopidy', function (error, stdout, stderr) {
  console.log("MOPIDY: server started");
});

sleep.sleep(6);

// select the default interface to provide the address for. 
var os=require('os');
var ifaces=os.networkInterfaces();
var address = '';
for (var i = ifaces[config.interface].length - 1; i >= 0; i--) {
  if (ifaces[config.interface][i].family == 'IPv4') {
    address = ifaces[config.interface][i].address;
  }
};

// setup cleanup code before making a mess
var jukeboxID;

// notify CA that we have a new JamBox over here
var url = config.cserver + "/add/" +
  encodeURIComponent(config.jambox_name) + "/" +
  encodeURIComponent(address);

http.get(url, function(res) {
  console.log("Registered server: " + res.statusCode);
  // console.log(res);
  
  res.on("data", function(chunk) {
    jukeboxID = JSON.parse(chunk).objectId;
  });
}).on('error', function(e) {
  throw new Error("Could not register server");
});

var delServer = function() {
  var url = config.cserver + "/delete/" + jukeboxID;

  http.get(url, function(res) {
    console.log("deregistered server: " + res.statusCode);
    // console.log(res);
    process.exit();
  }).on('error', function(e) {
    throw new Error("Could not delete server");
  });
}

process.stdin.resume();
process.on('SIGINT', delServer);
process.on('exit', delServer);
process.on('uncaughtException', delServer);


var api = new API({
	webSocketUrl: "ws://localhost:6680/mopidy/ws/",
	callingConvention: "by-position-or-by-name",
}, {
	skipThreshold : config.skip_threshold,
});
module.exports.api = api;

app.all('*', function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

require("./routes");

// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
    res.send("404 Page not found");
});

// set the default directory for templated pages
app.set("views", __dirname + "/client");

// listen on selected port
app.listen(config.port);
console.log("Jambox running on port " + config.port );
