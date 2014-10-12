/*jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global module, console, require */
var config = module.parent.exports.config;
var serverAddress = config.cserver;
var Mopidy = require("mopidy");
var Queue = require("./Queue.js");

var API = function (config) {

    this.mopidy = new Mopidy(config);
    this.queue = new Queue();
    this.ready = false;
    var parent = this;
    this.mopidy.on("state:online", function () {
        parent.ready = true;
    });

    this.mopidy.on("event:trackPlaybackEnded", function() {
        // TODO: tell daniel that track has ended
        // TODO: delete first song from tracklist
        parent.onTrackEnd();
    });

    this.mopidy.on("event:trackPlaybackStarted", function() {
        console.log("track started");
    });
    
    this.onTrackEnd = function () {
        if (this.queue.length() > 0) {
            console.log("Going through the queue")
            var track = parent.queue.pop();
            console.log(track);
            this.playTrack(track, function() {
                // don't have anything to particularly announce when we start playing a track...
            });
        } else {
            console.log("Nothing in queue!");   
        }
    };
    
    this.upvote = function(track_id, user_id, callback) {
        //TODO: Check with ca whether user have credit (NOT FOR DEMO)
        this.queue.vote(track_id, user_id);
        callback({success:true});
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
        console.log("Trying to play" );
        var mo = this.mopidy;
        this.mopidy.tracklist.clear().done(function() {
            console.log("  Cleared");
            mo.tracklist.add({tracks:[trackObj.track]}).done(function(track) {
                console.log("    added");
                mo.playback.play().done(function() {
                    console.log("      played");
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
                // var playOnInsert = false;
                // if (parent.queue.length() < 1) {
                //     // we will need to start playing after adding stuff
                //     playOnInsert = true;
                //     console.log("Going to play: " + parent.queue.length());
                // }

                var queueTracks = parent.queue.add(tracks);
                // if (playOnInsert) {
                //     parent.playUri(parent.queue.pop(), function() {
                //         // don't have anything to particularly announce when we start playing a track...
                //     });

                //     // remove the track from the list we're returning
                //     queueTracks.shift();
                // }
                parent.mopidy.playback.getState().done(function(state) {
                    if (state !== "playing")
                        parent.onTrackEnd();
                })
                // N.B. return value may be empty array (if we played immediately)
                callback(queueTracks);
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