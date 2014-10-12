angular.module('Controllers', []).controller('MainController', function($scope, $location, $timeout, $rootScope) {
  
  $scope.$on('$routeChangeSuccess', function () {                              
    $scope.user = Parse.User.current();   
    if (!$scope.user){
      // no user, so bring them to log in page
      $location.path('/')
    }                                     
  });  

  $scope.$on('loginSuccess',function(e,user){
    $scope.success = true;
    $scope.user = user;
    $timeout(function(){
      $location.path('/find');
      $scope.success = false;
    },0);
  });

  $scope.$on('changeServer', function(e,server){
    $scope.server = server;
    $timeout(function(){
      $location.path('/queue');
      $scope.success = false;
    },0);
  })



}).controller('HomeController', function($scope, $location) {
  // if user is already logged in, redirect to find server
  if ($scope.$parent.user){
    $location.path('/find')
  }
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
    $scope.result = x
  })
  $scope.joinServer = function(name){
    console.log($scope.serverName);
    if (name === undefined && $scope.serverName){
      var name = $scope.serverName;
    }
    console.log(name);
    $http.get('/find_jukebox/'+name).success(function(x){
      $scope.$emit('changeServer', x.address);
      console.log(x)
    })
  }
}).controller('QueueController', function($http, $scope, clientTokenR, $location){
  if (!$scope.$parent.server){
    console.log('nothing')
        $location.path('/find')
  }
  $scope.playlist = [];
  console.log($scope.$parent.server)
}).controller('PrefController', function($http, $scope, clientTokenR, $location){
  $scope.logout = function(){
    Parse.User.logOut();
    $location.path('/');
  }
});