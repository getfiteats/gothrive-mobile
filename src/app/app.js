angular.module('gothrive', [
  'ionic',
  'ngCordova',
  'ngResource',
  'ngStorage',
  'payment',
  'angucomplete-alt',
  'google.places',
  
  'templates-app',
  'templates-common',

  'gothrive.auth',
  'gothrive.home',
  'gothrive.dish',
  'gothrive.profile',
  'gothrive.login',
  'gothrive.filters',
  'gothrive.bag',
  'gothrive.checkout',
  'gothrive.order',
  'gothrive.location',

  'gothrive.pseudoClass',
  'gothrive.prompt',
  'gothrive.api'
])

.run(function ($ionicPlatform, $cordovaSplashscreen) {
  $ionicPlatform.ready(function () {
      $cordovaSplashscreen.hide();
  });
})
.config(function(LoopBackResourceProvider, initData) {
  LoopBackResourceProvider.setUrlBase(initData.apiUri);
})
.config(function ($urlRouterProvider, $locationProvider) {
  //$locationProvider.html5Mode(true);
  $urlRouterProvider.otherwise("/location");
})
.config(function($compileProvider){
  $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|geo|tel):/);
})
.config(function($ionicConfigProvider){
  $ionicConfigProvider.backButton.text('').icon('gt-icon-back-btn');
  $ionicConfigProvider.backButton.previousTitleText(false);
  //$ionicConfigProvider.views.transition('none');
})
.controller('AppController', function ($scope, $rootScope, $timeout, $state, User, initData, LoopBackAuth) {
    $rootScope.apiUri = initData.apiUri;
    $rootScope.apiBaseUri = initData.apiBaseUri;
    $rootScope.CLOUDINARY_BASE_URL = initData.cloudinaryBaseUrl;

    if (LoopBackAuth.accessTokenId) {
      $rootScope.accessTokenId = LoopBackAuth.accessTokenId;
    }

    $scope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams) {
      if (!User.isAuthenticated() && ($state.current.name != "login" && $state.current.name != "auth callback")) { 
      //  return $state.go('login');
      }
      if (angular.isDefined(toState.data.pageTitle)) {
        $scope.pageTitle = toState.data.pageTitle + ' | GoThrive' ;
      }
    });
    
});


