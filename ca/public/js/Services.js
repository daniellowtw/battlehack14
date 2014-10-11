angular.module('Services', []).run(function(){
    Parse.initialize("bK3aALUsSTTrbuKd3kidLlBaFrf4bHMhJQmwtasC", "UXlYbhWnxNYU7JHFSNlUyQUVFQaBzWuqta8OibIv");
}).factory('clientTokenR', ['$resource', function($resource) {
	return $resource('api/ctoken', {}, {
		get: {method:'GET'}
	});
}]);