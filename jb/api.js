var config = module.parent.exports.config;
var serverAddress = config.cserver;
var request = require('request');

module.exports = {
    getQueue: function(cb) {
        console.log("get queue called");
        //TODO: confirm address
        request(config.ms.address + "/queue", function(e, r, b) {
            if (e) {
                console.log(e)
            }
            if (!e && r.statusCode == 200) {
                // TODO: Modify response
                cb(id)
                    // console.log(id, b);            
            }
        })
    },
    upvote: function(id, cb) {
        console.log("upvoting id " + id);
        //TODO: Check with ca whether user have credit
        //TODO: confirm address
        request(config.ms.address + "/upvote/" + id, function(e, r, b) {
            if (e) {
                console.log(e)
            }
            if (!e && r.statusCode == 200) {
                // TODO: Modify response
                cb(id)
                    // console.log(id, b);            
            }
        })
    },
    search: function(source, term, cb) {
        console.log("searching query: " + source, term);
        //TODO: Check with ca whether user have credit
        //TODO: confirm address
        request(config.ms.address + "/search/" + source + "/" + term, function(e, r, b) {
            if (e) {
                console.log(e)
            }
            if (!e && r.statusCode == 200) {
                // TODO: Modify response
                cb(id)
                    // console.log(id, b);            
            }
        })
    },
    nowPlaying: function(cb) {
        //details about current track
        console.log("Now playing called");
        //TODO: Check with ca whether user have credit
        //TODO: confirm address
        request(config.ms.address + "/track", function(e, r, b) {
            if (e) {
                console.log(e)
            }
            if (!e && r.statusCode == 200) {
                // TODO: Modify response
                cb(b)
            }
        })
    },
    test: function() {
        return {
            a: 2
        }
    }
};
