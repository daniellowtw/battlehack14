angular.module('Controllers', []).controller('MainController', function($scope) {

  $scope.tagline = 'To the moon and back!'; 

}).controller('BTController', function($scope, $location, clientTokenR){
  $scope.$on('$routeChangeSuccess', function () {
    clientTokenR.get(function(res){
      braintree.setup(res.clientToken, 'dropin', {
        container: 'dropin'
      });
    });
  });
});