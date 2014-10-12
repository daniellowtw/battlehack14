/* jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global console, require, module */


// this function is called when a new user connects. 
// socket is a connection particularly to this user
module.exports = function(socket) {


	// // tell the client about it's assigned users, and the other connected users
	// socket.emit('init', {
	// 	user: user,
	// 	users: connectedUsers
	// });
	this.sendNowPlaying = function(track) {
		socket.emit('nowPlayingUpdate', track);
	};
	// like for the initial connection, notify everyone else and update our representation
	socket.on('disconnect', function() {
	});
};