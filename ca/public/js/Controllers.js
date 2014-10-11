angular.module('Controllers', []).controller('MainController', function($scope) {

  $scope.tagline = 'To the moon and back!'; 

}).controller('HomeController', function($scope) {

  // $scope.createNewUser = function() {
  //   var user = new Parse.User();
  //   user.set("username", $scope.user);
  //   user.set("password", $scope.password);
  //   user.set("credit", 9);
  //   // user.set("email", "daniellowtw@hotmail.com");
  //   user.signUp(null, {
  //     success: function(user) {
  //     },
  //     error: function(user, error) {
  //     }
  //   });
  // }

  // $scope.userLogin = function() {
  //   Parse.User.logIn($scope.user, $user.password, {
  //     success: function(user) {
  //         // Do stuff after successful login.
  //     },
  //     error: function(user, error) {
  //         // The login failed. Check error to see why.
  //     }
  //   });
  // }

  $scope.logReg = function(){
    console.log($scope.username, $scope.password);
    Parse.User.logIn($scope.username, $scope.password, {
      success: function(user){
        console.log(user);
      },
      error: function(user, error) {
        console.log(user);
        console.log(error);
        var nUser = new Parse.User();
        nUser.set("username", $scope.username);
        nUser.set("password", $scope.password);
        nUser.set("credit", 10);
        nUser.signUp(null, {
          success: function(user){
            console.log(user);
          },
          error: function(user, error){
            console.log(user);
            console.log(error);
          }
        })
      }
    })
  }

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