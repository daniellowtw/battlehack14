angular.module('Controllers', []).controller('MainController', function($scope, $location, $timeout) {

  $scope.$on('$routeChangeSuccess', function () {
    $scope.user = Parse.User.current();
  });

  $scope.$on('loginSuccess',function(e,user){
    $scope.success = true;
    $scope.user = user;
    $timeout(function(){
      $location.path('/find');
      $scope.success = false;
    },1500);
  });

}).controller('HomeController', function($scope) {

  $scope.logReg = function(){
    console.log($scope.username, $scope.password);
    Parse.User.logIn($scope.username, $scope.password, {
      success: function(user){
        $scope.$emit('loginSuccess',user);
        $scope.error = false;
        $scope.$apply();
      },
      error: function(user, error) {
        var nUser = new Parse.User();
        nUser.set("username", $scope.username);
        nUser.set("password", $scope.password);
        nUser.set("credit", 10);
        nUser.signUp(null, {
          success: function(user){
            $scope.$emit('loginSuccess',user);
            $scope.error = false;
            $scope.$apply();
          },
          error: function(user, error){
            $scope.error = true;
            $scope.$apply();
          }
        });
      }
    });
  };

}).controller('BTController', function($scope, $location, clientTokenR){
  $scope.$on('$routeChangeSuccess', function () {
    clientTokenR.get(function(res){
      braintree.setup(res.clientToken, 'dropin', {
        container: 'dropin'
      });
    });
  });
}).controller('FindController', function($http, $scope, clientTokenR){
  $scope.result = [];
  $http.get('/jukes').success(function(x){
    // $scope.$apply($scope.result = x)
    $scope.result = x
  })
  $scope.joinServer = function(name){
    console.log($scope.serverName);
    if (name === undefined && $scope.serverName){
      var name = $scope.serverName;
    }
    console.log(name);
    $http.get('/find_jukebox/'+name).success(function(x){
      console.log(x)
    })
  }
});