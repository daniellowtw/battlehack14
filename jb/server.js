// 'use strict';

var express = require('express');
module.exports.express = express;
var app = express();

var config = require("./config");
module.exports.config = config;

module.exports.app = app;

var API = require("./api");

// TODO: Start mopidy here rather than in advance

var api = new API({
	webSocketUrl: "ws://localhost:6680/mopidy/ws/",
	callingConvention: "by-position-or-by-name"
});
module.exports.api = api;

require("./routes");

// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
    res.send("404 Page not found");
});

// set the default directory for templated pages
app.set("views", __dirname + "/client");

// listen on selected port
app.listen(config.port);
console.log("Music server running on port " + config.port );