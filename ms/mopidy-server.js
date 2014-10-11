
var Mopidy = require("mopidy");



var MopidyQueue = function (config) {
	
	this.mopidy = new Mopidy(config);
	this.ready = false;
	this.mopidy.on("state:online", function () {
		this.ready = true;
	});

	this.add = function () {
		// TODO: add song from spotify to queue
	};

	this.getQueue = function () {
		// TODO: return queue
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
};


module.exports = MopidyQueue;