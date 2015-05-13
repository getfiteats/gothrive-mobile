angular.module( 'gothrive.login', [])
.config(function config( $stateProvider) {

  $stateProvider
    .state('login', {
      url: '/login',
      controller: 'Login',
      templateUrl: 'login/login.tpl.html',
      data:{ pageTitle: 'Login' },
      params: { postLoginStateParams: null },
      cache: false
    });

})
.controller('Login', function Login( $scope, $state, $stateParams, $localStorage, $ionicHistory, User, AuthService, initData, userService ) {
  var showHeader = true;

  userService.seenLogin = true;

  if ($localStorage.loggedIn) {
    return authenticate($localStorage.accessToken, $localStorage.userId);
  } else {
    $scope.showLogin = true;
  }

  $scope.register = {};

  $scope.signUp = function() {
    User.signUp({ email: $scope.register.email, password: $scope.register.password }).$promise
      .then(function(response){
        console.log('success', response);
        authenticate(response.accessToken, response.userId);
      })
      .catch(function(err){
        console.log(err, 'error authenticating!');
      });
  }

  $scope.facebookLogin = function() {
    facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess, fbLoginError);
  }

  function fbLoginSuccess(response) {
    console.log(response);
    User.facebookLogin({ provider: "mobile-facebook-login", facebookAccessToken: response.authResponse.accessToken }).$promise
      .then(function(response){
        console.log('success', response);
        authenticate(response.accessToken, response.userId);
      })
      .catch(function(err){
        console.log(err, 'error authenticating!');
      });
  }

  function fbLoginError(err) {
    console.log('err', err);
  }

  function authenticate(accessToken, userId) {
    var postLoginStateParams = $stateParams.postLoginStateParams || {};
 
    postLoginStateParams.postLogin = true;
    postLoginStateParams = [initData.postLoginState, postLoginStateParams];
    AuthService.login(accessToken, userId);
    userService.setCurrent(function(){
      $state.go.apply($state, postLoginStateParams);
    });
  }

})
.controller('Logout', function Logout($scope, $rootScope, $state, $timeout, User){
  User.logout()
    .$promise.then(function(){
      console.log('inpromise::logged out!');
      $rootScope.accessTokenId = null;
      $state.go('main');
    }).catch(function(){
      console.log('error logging out');
    });
});
