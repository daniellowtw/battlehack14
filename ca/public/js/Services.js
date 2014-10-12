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
}]);