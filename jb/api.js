var config = module.parent.exports.config;
var serverAddress = config.cserver;
var request = require('request');
var Mopidy = require("mopidy");

var API = function (config) {
    // this.getQueue = function(cb) {
    //     console.log("get queue called");
    //     //TODO: confirm address
    //     request(config.ms.address + "/queue", function(e, r, b) {
    //         if (e) {
    //             console.log(e);
    //         }
    //         if (!e && r.statusCode == 200) {
    //             // TODO: Modify response
    //             cb(id);
    //                 // console.log(id, b);            
    //         }
    //     });
    // };

    this.upvote = function(id, cb) {
        console.log("upvoting id " + id);
        //TODO: Check with ca whether user have credit
        //TODO: confirm address
        //TODO reorder list
        // request(config.ms.address + "/upvote/" + id, function(e, r, b) {
        //     if (e) {
        //         console.log(e);
        //     }
        //     if (!e && r.statusCode == 200) {
        //         // TODO: Modify response
        //         cb(id);
        //             // console.log(id, b);            
        //     }
        // });
    };

    // this.search =  function(source, term, cb) {
    //     console.log("searching query: " + source, term);
    //     //TODO: Check with ca whether user have credit
    //     //TODO: confirm address
    //     request(config.ms.address + "/search/" + source + "/" + term, function(e, r, b) {
    //         if (e) {
    //             console.log(e);
    //         }
    //         if (!e && r.statusCode == 200) {
    //             // TODO: Modify response
    //             cb(id);
    //                 // console.log(id, b);            
    //         }
    //     });
    // };

    // this.nowPlaying= function(cb) {
    //     //details about current track
    //     console.log("Now playing called");
    //     //TODO: Check with ca whether user have credit
    //     //TODO: confirm address
    //     request(config.ms.address + "/track", function(e, r, b) {
    //         if (e) {
    //             console.log(e);
    //         }
    //         if (!e && r.statusCode == 200) {
    //             // TODO: Modify response
    //             cb(b);
    //         }
    //     });
    // };

    this.test = function() {
        return {
            a: 2
        };
    };


    this.mopidy = new Mopidy(config);
    this.ready = false;
    var parent = this;
    this.mopidy.on("state:online", function () {
        parent.ready = true;
    });

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
            mopidy.library.search({'any': words}, uris=['spotify:']).done(function(tracks) {
                callback({
                    "success": true,
                    "tracks": tracks
                });
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