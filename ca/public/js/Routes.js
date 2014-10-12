angular.module('Routes', []).config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

	$routeProvider

		// home page
		.when('/', {
			templateUrl: 'views/home.html',
			controller: 'HomeController'
		})

		.when('/braintree', {
			templateUrl: 'views/braintree.html',
			controller: 'BTController'
		})


		.when('/queue', {
			templateUrl: 'views/queue.html',
			controller: 'QueueController'	
		})

		// .when('/geeks', {
		// 	templateUrl: 'views/geek.html',
		// 	controller: 'GeekController'	
		// })

		.when('/find', {
			templateUrl: 'views/find.html',
			controller: 'FindController'	
		})

		.when('/prefs', {
			templateUrl: 'views/prefs.html'
			// controller: 'GeekController'	
		});



	$locationProvider.html5Mode(true);

}]);