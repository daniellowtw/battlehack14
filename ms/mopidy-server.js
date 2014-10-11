
var Mopidy = require("mopidy");



var MopidyQueue = function (config) {
	
	this.mopidy = new Mopidy(config);
	this.ready = false;
	this.mopidy.on("state:online", function () {
		this.ready = true;
	});

	this.add = function (callback) {
		// TODO: add song from spotify to queue
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
			return {"success": false, "error" : "not ready to return tracks"};
		}
	};

	this.getCurrentTrack = function(callback) {
		if (this.ready) {
			this.mopidy.playback.getCurrentTrack().done(function(track){
				return track;
			});
		} else {
			return {"error": "not ready to return a track"};
		}
	}

	this.search = function(query, callback) {
		// TODO: return a list of search results
		var words = query.split(" ");
		if (this.ready) {
			mopidy.library.search({'any': words}, uris=['spotify:']).done(function(tracks) {
				callback({
					"success": true,
					"tracks": tracks
				});
			});
		} else {
			return {"success": false, "error": "not ready to search"};
		}
		

	};
};


module.exports = MopidyQueue;