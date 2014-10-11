'use strict';

var express = require('express')
module.exports.express = express;
var app = express()

var config = require("./config");
module.exports.config = config;

module.exports.app = app;

var api = require("./api");
module.exports.api = api;

require("./routes");

// any requested page not routed by the above should result in a 404
app.get('/*', function(req, res) {
    res.send("404 Page not found");
});

// set the default directory for templated pages
app.set("views", __dirname + "/client");

// listen on port 8000
app.listen(config.port);