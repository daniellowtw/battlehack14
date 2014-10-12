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
    api.getQueue(function(result) {
        res.json(result);
    });
});

app.post('/upvote/:track_id/:user_id', function(req, res) {
    api.upvote(req.params.track_id, req.params.user_id, function(result) {
        res.json(result);
    });
});

app.post('/skipvote/:user_id/', function(req, res) {
    api.skipvote(req.params.track_id, req.params.user_id, function(result) {
        res.json(result);
    });
});

// reorder tracks
app.get('/queue/:from/:to', function(req, res) {
    api.move(req.params.from, req.params.to, function(result) {
        res.json(result);
    });
});

// get search results
app.get('/search/:query', function(req, res) {
    var query = req.params.query;
    api.search(query, function(result) {
        res.json(result);
    });
});

// get current track
app.get('/track', function(req, res) {
    api.getCurrentTrack(function(x) {
        res.json(x);
    });
});

app.use('/', express.static(__dirname + '/assets'));
