angular.module('Services', []).factory('clientTokenR', ['$resource', function($resource) {
	return $resource('api/ctoken', {}, {
		get: {method:'GET'}
	});
}]);