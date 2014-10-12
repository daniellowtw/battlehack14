/* jshint unused:true, bitwise:true, eqeqeq:true, undef:true, latedef:true, eqnull:true */
/* global console, require, module */

// this function is called when a new user connects. 
// socket is a connection particularly to this user
var s = function(real_socket) {
	this.foo = function() {
		socket.emit('event', {foo:'bar'});
	}
	console.log("initialised socket");
	console.log(this);
};

module.exports = s;