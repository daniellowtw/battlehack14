angular.module('Controllers', []).controller('MainController', function ($scope, $location, $timeout, $rootScope, $http) {

  $scope.deductCredit = function(amount){
    $http.get('/danger/deduct/'+$scope.user.getSessionToken()).success(function(x){
      console.log("successfully added "+amount);
      $scope.$emit('updateUserCredit', 1);
      // $scope.user = Parse.User.current();
    }).error(function(e,f){console.log(e,f)})
  }

$scope.$on('updateUserCredit', function(e,value){
  $scope.user.fetch().then(function(x){
    $scope.user = x;
    $scope.$apply()
  });
})

  // on new message or new user updates, simply update our list of users
  // socketService.on('nowPlayingUpdate', function(track) {
  //   console.log(track);
  // });
  $scope.adminMode =false;
  $scope.adminButton = function(){
    $scope.adminMode = !$scope.adminMode;
    console.log('user', $scope.user)
    console.log('admin mode');
  };

  $scope.$on('$locationChangeSuccess', function () {
    $scope.user = Parse.User.current();
    Parse.User.current().fetch().then(function(user){
      $scope.user = user;
      $scope.$apply();
    });
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
    }, 1000);
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


}).controller('HomeController', function ($scope, $location, $resource) {
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
            $resource('reg/' + user.id).save(null,function(res){
              console.log(res);
            });
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

}).controller('BTController', function ($scope, $location, $routeParams, clientTokenR) {
  $scope.$on('$routeChangeSuccess', function () {
    $scope.amount = $routeParams.amount;
    clientTokenR.get({id:$scope.user.id},function (res) {
      console.log(res);
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

  $scope.getClass = function (uri) {
    if (uri.substring(0,3) == "spo") {
      return "fa-spotify";
    } else if (uri.substring(0,3) == "sou") {
      return "fa-soundcloud";
    } else if (uri.substring(0,3) == "loc") {
      return "fa-file-audio-o";
    } else {
      return "";
    }
  };

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
    }, 100)

    $scope.limitFilter = function (obj) {
      var re = new RegExp($scope.search, 'i');
      return !$scope.search || re.test(obj.headline) || re.test(obj.tagline) || re.test(obj.text);
    };
  };

  $scope.playlist = [];
  $scope.nowPlaying = null;

  $resource("http://" + $scope.$parent.server + "/track").get(null, function (x) {
    console.log(x);

    if (x.success) {
      console.log("Successful");
      $scope.nowPlaying = x;
    }
  });


  $resource("http://" + $scope.$parent.server + "/queue").get(null, function (x) {
    if (x.success) {
      $scope.playlist = x.tracks;
    }
  });

  $scope.updateData = function(){

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
  }

  window.setInterval($scope.updateData, 5000);

  $scope.addTrack = function (uri) {
    $http.post("http://" + $scope.$parent.server + "/track",{uri:uri}).success(function(x) {
        $resource("http://" + $scope.$parent.server + "/queue").get(null, function (x2) {
          if (x2.success) { 
            $scope.playlist = x2.tracks;
          }
        });
          $resource("http://" + $scope.$parent.server + "/track").get(null, function (x) {
    console.log(x);

    if (x.success) {
      console.log("Successful");
      $scope.nowPlaying = x;
    }
  });
    });
  };

  $scope.skip = function() {
    console.log("Skipping");
    $resource("http://" + $scope.$parent.server + "/skipvote/" + $scope.$parent.user.id + "/").save(null, function (x) {
      console.log("Trying");
      if (x.success) {
        console.log("Succeeded");
        $scope.nowPlaying.skipcount = x.skipcount;
      }
    });
  };

  $scope.upvote = function (x) {
    $resource("http://" + $scope.$parent.server + "/upvote/" + x + "/" + $scope.$parent.user.id).save(null, function (x) {
      if (x.success) {
        $http.get('/danger/deduct/'+$scope.user.getSessionToken()).success(function(x){
          $scope.$emit('updateUserCredit', 1);
          }).error(function(e,f){console.log(e,f)})

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
}).controller('PrefController', function ($http, $scope, clientTokenR, $location, $routeParams) {

  $scope.$on('$routeChangeSuccess',function(){
    console.log($routeParams);
    $scope.success = $routeParams.success;
  });

  $scope.logout = function () {
    Parse.User.logOut();
    $location.path('/');
  }
});