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

		.when('/find', {
			templateUrl: 'views/find.html'
			// controller: 'GeekController'	
		})

		.when('/prefs', {
			templateUrl: 'views/prefs.html'
			// controller: 'GeekController'	
		});


	$locationProvider.html5Mode(true);

}]);