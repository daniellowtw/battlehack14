/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global __dirname, module, console, require */
var app = module.parent.exports.app;
var express = module.parent.exports.express;
var Parse = module.parent.exports.Parse;
var api = require('./api')(Parse);
var config = module.parent.exports.config;


/* APPLICATION ROUTES */

app.get('/add/:name/:address', function(req, res) {
    api.saveJukebox(req.params.name, req.params.address, function(x) {
        res.json(x)
    });
});

app.get('/find_jukebox/:name', function(req, res) {
    // TODO Check duplicate
    api.findJukebox(req.params.name, function(x) {
        res.json(x)
    });
});

app.get('/jukes', function(req, res) {
    api.listJukeboxes(function(x) {
        res.json(x)
    });
});
app.get('/delete/:id', function(req, res) {
    api.deleteJukebox(req.params.id, function(x) {
        res.json(x)
    });
});

app.get('/danger/me', function(req, res) {
    Parse.User.logIn("dan1", "password123", {
        success: function(user) {
            res.json(user.getSessionToken())
                // Do stuff after successful login.
        },
        error: function(user, error) {
            res.json(error)

            // The login failed. Check error to see why.
        }
    });
})

app.get('/danger/new', function(req, res) {
    var user = new Parse.User();
    user.set("username", "dan1");
    user.set("password", "password123");
    user.set("credit", 9);
    // user.set("email", "daniellowtw@hotmail.com");
    user.signUp(null, {
        success: function(user) {
            console.log("user created", user)
            res.send(user)
        },
        error: function(user, error) {
            // Show the error message somewhere and let the user try again.
            res.send("Error: " + error.code + " " + error.message);
        }
    });
})

app.get('/danger/deduct/:id', function(req, res) {
    api.addCredit(req.params.id, -2, function(x) {
        res.json(x)
    })
})

app.get('/danger/add/:id', function(req, res) {
    api.addCredit(req.params.id, 10, function(x) {
        res.json(x)
    })
})
