
// write a wrapping service simplifying the socket.io api
function SocketService($rootScope) {
	var socket = io.connect('localhost:80'); // TODO: FIX!
	// our service only wraps the on and emit parts of socket.io
	return {
		// we will call this function to register event handlers
		on: function(eventName, callback) {
			socket.on(eventName, function() {

				// we don't know what arguments are passed to this event so use the arguments object
				var args = arguments;
				
				// we call $apply to tell Angular it may need to update templates after running this
				$rootScope.$apply(function () {

					// finally call the actual callback with the event arguments
					callback.apply(socket, args);
				});
			});
		}
		// },
		// // we will call this function to speak to the server
		// emit: function(eventName, data, callback) {
		// 	socket.emit(eventName, data, function() {

		// 		var args = arguments;
		// 		$rootScope.$apply(function() {
					
		// 			// the callback is optional, and is fired after emitting the event
		// 			if (callback) {
		// 				callback.apply(socket.args);
		// 			}
		// 		});
		// 	});
		// }
	};
}

angular.module('Services', []).run(function(){
    Parse.initialize("bK3aALUsSTTrbuKd3kidLlBaFrf4bHMhJQmwtasC", "UXlYbhWnxNYU7JHFSNlUyQUVFQaBzWuqta8OibIv");
}).factory('clientTokenR', ['$resource', function($resource) {
	return $resource('ctoken/:id', {}, {
		get: {method:'GET'}
	});
}]).factory('jukebox', ['$resource', function($resource) {
		var jb = {};
		jb.search = $resource('http://:ip/search/:term', {}, {});

		// return $resource('http://' + ip + '/', {}, {
		//   get: {method:'GET'}
		// });
    return jb;
}]).factory("socketService", SocketService);
