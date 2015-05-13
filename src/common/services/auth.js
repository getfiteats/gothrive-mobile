angular.module('gothrive.auth')
.service('AuthService', function (LoopBackAuth, User, $localStorage, $ionicHistory, $state, initData){

  function AuthService() {
  }

  AuthService.prototype.login = function login(accessToken, userId) {
    LoopBackAuth.setUser(accessToken, userId);
    LoopBackAuth.save();
    $localStorage.accessToken = accessToken;
    $localStorage.userId = userId;
    $localStorage.loggedIn = true;
  };

  AuthService.prototype.logout = function logout(cb) {
    var noop = function(){};
    User.logout().$promise.
      then(function(user) {
        $localStorage.$reset();
        $ionicHistory.clearHistory();
        $ionicHistory.clearCache();
        $localStorage.loggedIn = false;
        $state.go(initData.logoutState);
        return (cb || noop)();
      })
      .catch(cb || noop);
  };

  return new AuthService();
});
