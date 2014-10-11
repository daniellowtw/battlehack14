var Mopidy = require("mopidy");

var MopidyQueue = function (config) {
	
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

module.exports = MopidyQueue;