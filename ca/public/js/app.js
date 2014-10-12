angular.module('jambox', ['ngRoute', 'ngResource', 'Routes', 'Controllers', 'Services', 'Directives']);
angular.module('jambox').run(function($rootScope, $location, $anchorScroll, $routeParams) {
  $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
    $location.hash($routeParams.scrollTo);
    $anchorScroll();  
  });
});