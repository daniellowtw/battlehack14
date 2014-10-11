/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
var app = module.parent.exports.app;
var express = module.parent.exports.express;
var api = module.parent.exports.api;
var bodyParser = require('body-parser');

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // to support URL-encoded bodies

/* APPLICATION ROUTES */

var notImplemented = {
    success: false,
    error: "Not Implemented"
};

app.get('/', function(req, res) {
    res.json(api.test());
});

// post a new track submission
app.post('/track', function(req, res) {
    if (req.body.uri)
        api.add(req.body.uri, function (result) {
            res.json(result);
        });
    else 
        res.json({success:false, error: "invalid object provided"});
});

// get current queue including now playing
app.get('/queue', function(req, res) {
    res.json(notImplemented);
});

app.get('/upvote/:id', function(req, res) {
    res.json(notImplemented);
});

// get search results for the given source
app.get('/search/:source/:term', function(req, res) {
    res.json(notImplemented);
});

// get current track
app.get('/track', function(req, res) {
    api.getCurrentTrack(function(x) {
        res.json(x);
    });
});

app.use('/', express.static(__dirname + '/assets'));
