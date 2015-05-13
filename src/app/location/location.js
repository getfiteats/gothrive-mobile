angular.module( 'gothrive.location', [])
.config(function config( $stateProvider) {

  $stateProvider
    .state('location', {
      url: '/location',
      controller: 'Location',
      templateUrl: 'location/location.tpl.html',
      data:{ pageTitle: 'Location' },
      params: {hideBackButton: true},
      cache: false
    });

})
.controller('Location', function Location( $scope, $state, $stateParams, $localStorage, $ionicHistory, $ionicLoading, GooglePlace, userService, $ionicPopup) {
    $scope.hideBackButton = $stateParams.hideBackButton === true;
    $scope.location = {place: {}};
    $scope.lastPlace = $localStorage.lastPlace;

    $scope.$watch('location.place', function(newPlace){
      var placeId;

      if (typeof newPlace !== "object") {
        return;
      }

      try {
        var types = newPlace && newPlace.address_components[0].types || [];
        if (types.indexOf("street_number") === -1) {
          $ionicPopup.alert({
            title: 'Error',
            template: 'Please enter a valid street address.'
          });
          return;
        }

        placeId = newPlace.place_id;
      } catch (err) {
        return;
      }

      GooglePlace.findOne({id: placeId}).$promise
        .then(function(place){
          loadMeals(place);
        });
    });

    $scope.useLastPlace = function() {
      if ($localStorage.lastPlace) {
        loadMeals($localStorage.lastPlace);
      }
    }

    function loadMeals(place) {
      $ionicHistory.clearHistory();
      $ionicHistory.clearCache();
      $localStorage.lastPlace = place;
      $state.go('home', {place: place});
    }
});
