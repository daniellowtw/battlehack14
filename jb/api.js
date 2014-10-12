var config = module.parent.exports.config;
var serverAddress = config.cserver;
var Mopidy = require("mopidy");

var API = function (config) {

    this.mopidy = new Mopidy(config);
    this.ready = false;
    var parent = this;
    this.mopidy.on("state:online", function () {
        parent.ready = true;
    });
    
    this.upvote = function(id, cb) {
        console.log("upvoting id " + id);
        //TODO: Check with ca whether user have credit (NOT FOR DEMO)
        //TODO reorder list
    };

    this.test = function() {
        return {
            a: 2
        };
    };

    this.add = function (uri, callback) {
        if (this.ready) {
            var parent = this;
            this.mopidy.tracklist.add({uri:uri}).done(function(track) {
                parent.mopidy.tracklist.getLength().done(function(l) {
                    if (l==1) {
                        parent.mopidy.playback.play();
                    }
                    callback({
                        success:true,
                        track: track
                    });
                });
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
            this.mopidy.tracklist.getTracks().done(function(tracks) {
                callback({
                    "success": true,
                    "tracks" : tracks
                });
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

    this.move = function (start, to_position, callback) {
        if (this.ready) {
            this.mopidy.tracklist.move(start, start+1, to_position)
                .catch(function(e){
                    callback({success:false, error: e});
                })
                .done(function() {
                    callback({success:true});
                });
        } else {
            callback({success: false, error: "not ready to move"});
        }
    };

};

module.exports = API;