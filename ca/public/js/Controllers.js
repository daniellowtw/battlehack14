angular.module('Controllers', []).controller('MainController', function ($scope, $location, $timeout, $rootScope) {

$scope.adminMode =false;
  $scope.adminButton = function(){
    $scope.adminMode = !$scope.adminMode;
    console.log('user', $scope.user)
    console.log('admin mode');
  }

  $scope.$on('$routeChangeSuccess', function () {
    $scope.user = Parse.User.current();
    if (!$scope.user) {
      // no user, so bring them to log in page
      $location.path('/')
    }
  });

  $scope.$on('loginSuccess', function (e, user) {
    $scope.success = true;
    $scope.user = user;
    $timeout(function () {
      $location.path('/find');
      $scope.success = false;
    }, 0);
  });

  $scope.$on('changeServer', function (e, server) {
    $scope.server = server;
    $timeout(function () {
      $location.path('/queue');
      $scope.success = false;
    }, 0);
  });

  $scope.logOut = function () {
    Parse.User.logOut();
    $scope.user = Parse.User.current();
    $location.path('/');
  }


}).controller('HomeController', function ($scope, $location) {
  // if user is already logged in, redirect to find server
  if ($scope.$parent.user) {
    $location.path('/find')
  }
  $scope.logReg = function () {
    console.log($scope.username, $scope.password);
    Parse.User.logIn($scope.username, $scope.password, {
      success: function (user) {
        $scope.$emit('loginSuccess', user);
        $scope.error = false;
        $scope.$apply();
      },
      error: function (user, error) {
        var nUser = new Parse.User();
        nUser.set("username", $scope.username);
        nUser.set("password", $scope.password);
        nUser.set("credit", 10);
        nUser.signUp(null, {
          success: function (user) {
            $scope.$emit('loginSuccess', user);
            $scope.error = false;
            $scope.$apply();
          },
          error: function (user, error) {
            $scope.error = true;
            $scope.$apply();
          }
        });
      }
    });
  };

}).controller('BTController', function ($scope, $location, clientTokenR) {
  $scope.$on('$routeChangeSuccess', function () {
    clientTokenR.get(function (res) {
      braintree.setup(res.clientToken, 'dropin', {
        container: 'dropin'
      });
    });
  });
}).controller('FindController', function ($http, $scope, clientTokenR) {
  $scope.result = [];
  $http.get('/jukes').success(function (x) {
    $scope.result = x
  })
  $scope.deleteServer = function (server){
    console.log(server);
    $http.get('/delete/'+server.objectId).success(function(x){
      $http.get('/jukes').success(function (x) {
        $scope.result = x
      })
    })
  }
  $scope.joinServer = function (name) {
    if (name === undefined && $scope.serverName) {
      var name = $scope.serverName;
    }
    $http.get('/find_jukebox/' + name).success(function (x) {
      $scope.$emit('changeServer', x.address);
    })
  }
}).controller('QueueController', function ($http, $scope, $location, jukebox, $resource) {
  if (!$scope.$parent.server) {
    $location.path('/find')
  }
  $scope.search = function () {
    if ($scope.oldId) clearTimeout($scope.oldId)

    $scope.oldId = setTimeout(function(){
      $scope.searchingForSong = true;
      jukebox.search.get({ip: $scope.$parent.server, term: $scope.songSearch}, function (res) {
        if (res.success) {
          $scope.res = res.results;
        }
        $scope.searchingForSong = false;
      });
    }, 400)

    $scope.limitFilter = function (obj) {
      var re = new RegExp($scope.search, 'i');
      return !$scope.search || re.test(obj.headline) || re.test(obj.tagline) || re.test(obj.text);
    };
  };
  $scope.playlist = [];
  $scope.nowPlaying = null;

  $resource("http://" + $scope.$parent.server + "/track").get(null, function (x) {
    if (x.success) {
      $scope.nowPlaying = x;
    }
  });


  $resource("http://" + $scope.$parent.server + "/queue").get(null, function (x) {
    if (x.success) {
      $scope.playlist = x.tracks;
    }
  });

  $scope.addTrack = function (uri) {
    $http.post("http://" + $scope.$parent.server + "/track",{uri:uri}).success(function(x) {
        $resource("http://" + $scope.$parent.server + "/queue").get(null, function (x2) {
          if (x2.success) { 
            $scope.playlist = x2.tracks;
          }
        });
    });
  };

  $scope.upvote = function (x) {
    $resource("http://" + $scope.$parent.server + "/upvote/" + x + "/" + $scope.$parent.user.id).save(null, function (x) {
      if (x.success) {
        console.log("does this work?", x.track);
        $resource("http://" + $scope.$parent.server + "/queue").get(null, function (x) {
          if (x.success) {
            $scope.playlist = x.tracks;
          }
        });
      }
    });

  };
}).filter('slice', function () {
  return function (arr, start, end) {
    if (arr) return arr.slice(start, end);
  };
}).controller('PrefController', function ($http, $scope, clientTokenR, $location) {
  $scope.logout = function () {
    Parse.User.logOut();
    $location.path('/');
  }

  $scope.addCredit = function(amount){
    $http.get('/danger/add/'+$scope.user.getSessionToken()+"/"+amount).success(function(x){
      console.log("successfully added "+amount);
      $scope.$apply(
      $scope.user = Parse.User.current();
      )
    }).error(function(e,f){console.log(e,f)})
  }
});