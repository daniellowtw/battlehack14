/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
var app = module.parent.exports.app;
var express = module.parent.exports.express;
var api = module.parent.exports.api;
var bodyParser = require('body-parser')
var request = require('request');
var config = module.parent.exports.config;


app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({
    extended: true
})); // to support URL-encoded bodies

/* APPLICATION ROUTES */

app.get('/', function(req, res) {
    res.json(api.test());
});

app.post('/add_track', function(req, res) {
    // TODO: tidy object received before marshalling to MS?
    if (req.body)
        console.log("adding track " + req.body);
    request.post(config.ms.address + "/track/", req.body, function(e, r, b) {
        if (e) {
            console.log(e)
        }
        if (!e && r.statusCode == 200) {
            // TODO: handle success
            res.send('ok')
        }
    });
});

app.get('/get_queue', function(req, res) {
    api.getQueue(function(x) {
        res.json(x)
    })
});

app.get('/upvote/:id', function(req, res) {
    api.upvote(req.params.id, function(x) {
        res.json(x)
    });
});

app.get('/search/:source/:term', function(req, res) {
    api.search(req.params.source, req.params.term, function(x) {
        res.json(x)
    });
});

app.get('/now_playing', function(req, res) {
    api.nowPlaying(function(x) {
        res.json(x)
    });
});

app.post('/api/responses/', function(req, res) {

});

app.use('/', express.static(__dirname + '/assets'));
