/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global module, console, require */
var config = module.parent.exports.config;
var serverAddress = config.cserver;
var Mopidy = require("mopidy");
var Queue = require("./Queue.js");

var API = function (config, jambox, io) {
    this.mopidy = new Mopidy(config);
    this.queue = new Queue();
    this.skipvotes = [];
    this.ready = false;
    var sockets = [];
    io.on('connection', function(socket){
        sockets.push(socket);
        console.log('a user connected');
    });
    var parent = this;
    this.mopidy.on("state:online", function () {
        parent.ready = true;
    });
    this.mopidy.on("event:trackPlaybackEnded", function() {
        // TODO: tell daniel that track has ended
        parent.onTrackEnd();
    });

    this.mopidy.on("event:trackPlaybackStarted", function() {
        console.log("track started");
        for (var i = sockets.length - 1; i >= 0; i--) {
            sockets[i].emit("nowPlayingUpdate", {});
        };
    });
    
    this.onTrackEnd = function () {
        // reset the votes to skip
        parent.skipvotes = [];

        // play another track if possible
        if (this.queue.length() > 0) {
            var track = parent.queue.pop();
            console.log(track);
            this.playTrack(track, function() {
                // don't have anything to particularly announce when we start playing a track...
            });
        } else {
            console.log("Nothing in queue!");  
        }

        if (this.queue.length() < 3 && this.queue.length() > 0) {
            //notify users that now would be a good time to add more content
        }
    };
    
    this.upvote = function(track_id, user_id, callback) {
        //TODO: Check with ca whether user have credit (NOT FOR DEMO)
        this.queue.vote(track_id, user_id);
        callback({success:true, track:this.queue[track_id]});
    };

    this.skipvote = function(user_id) {
        console.log("Attempted skip!");
        console.log(skipvotes);
        // TODO*: should check this is a valid user_id
        for (var i = 0; i < this.skipvotes.length; i++) {
            if (this.skipvotes[i] === user_id) {
                // this user has already tried to skip the track
                return;
            }
        }
        this.skipvotes.push(user_id);
        if (this.skipvotes.length > jambox.skipThreshold) {
            this.mopidy.playback.stop([true]).done(function() {
                parent.onTrackEnd();
            });
        }
    };
    this.time = function(callback) {
        this.mopidy.playback.getTimePosition().done(function(t){
            callback(t);
        });
    };

    this.test = function() {
        return {
            a: 2
        };
    };

    this.playTrack = function(trackObj, callback) {
        var mo = this.mopidy;
        this.mopidy.tracklist.clear().done(function() {
            mo.tracklist.add({tracks:[trackObj.track]}).done(function(track) {
                mo.playback.play().done(function() {
                    callback({
                        success:true,
                        track: track
                    });
                });
            });
        });
    };

    this.add = function (uri, callback) {
        if (this.ready) {
            var parent = this;
            this.mopidy.library.lookup({uri:uri}).done(function(tracks) {
                var queueTracks = parent.queue.add(tracks);
                parent.mopidy.playback.getState().done(function(state) {
                    if (state !== "playing")
                        parent.onTrackEnd();
                });
                // N.B. return value may be empty array (if we played immediately)
                callback({"success":"true","tracks":queueTracks});
            });

            
        } else {
            callback({
                success: false,
                error: "not ready to add tracks"
            });
        }
    };

    this.getQueue = function (callback) {
        if (this.ready) {
            callback({
                "success": true,
                "tracks": this.queue.q
            });
        } else {
            callback({
                "success": false,
                "error" : "not ready to return tracks"
            });
        }
    };

    this.getCurrentTrack = function(callback) {
        if (this.ready) {
            this.mopidy.playback.getCurrentTrack().done(function(track){
                callback({
                    success: true,
                    track: track
                });
            });
        } else {
            callback({
                success:false,
                error: "not ready to return a track"
            });
        }
    };

    this.search = function(query, callback) {
        var words = query.split(" ");
        if (this.ready) {
            this.mopidy.library.search({'any': words}).done(function(results) {
                var result = {
                    success: true,
                    results: {}
                };
                for (var i = 0; i < results.length; i++) {
                    var tracks = [];
                    if (results[i].tracks) {
                        tracks = results[i].tracks;//.slice(0,10);
                    }
                    switch (results[i].uri.split(":")[0]) {
                        case "soundcloud":
                            result.results.soundcloud = tracks;
                        break;
                        case "local":
                            result.results.local = tracks;
                        break;
                        case "spotify":
                            result.results.spotify = tracks;
                        break;
                    }
                }
                callback(result);
            });
        } else {
            callback({
                "success": false,
                "error": "not ready to search"
            });
        }
    };

};

module.exports = API;