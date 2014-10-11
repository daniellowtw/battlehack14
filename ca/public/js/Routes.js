angular.module('Routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'MainController'
		})

		.when('/braintree', {
			templateUrl: 'views/braintree.html',
			controller: 'BTController'
		})

		.when('/queue', {
			templateUrl: 'views/queue.html',
			// controller: 'GeekController'	
		});

		// .when('/geeks', {
		// 	templateUrl: 'views/geek.html',
		// 	controller: 'GeekController'	
		// });

	$locationProvider.html5Mode(true);

}]);