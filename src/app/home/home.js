angular.module('gothrive.home', [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('home', {
        templateUrl: 'home/home.tpl.html',
        url: '/home',
        controller: 'Home',
        data: {
          pageTitle: 'Home'
        },
        params: {place: null}
    });
}])
.controller('Home', function ($scope, $stateParams, $localStorage, $ionicHistory, $ionicLoading, $sce, Meal, bag, userService) {
    var place = $stateParams.place || $localStorage.lastPlace;
    //var errMsg = $sce.parseAsHtml("Looks like there are currently no dishes that match your filters at this address. <br />While we scurry around trying to get more online, feel free to adjust your filters for more options :)");

    $ionicHistory.clearHistory();
    $ionicHistory.clearCache();

    $scope.bag = bag;
    $scope.user = userService.model;
    $localStorage.meals = $stateParams.meals;
    $scope.address = $localStorage.lastPlace.address.street;
    $scope.unit = $localStorage.lastPlace.address.unit;

    $scope.errMsg = '';


    $ionicLoading.show({
        template: "Loading your handpicked menu for<br />" + place.address.street + "..."
    });

    Meal.geoSearch({
        googlePlaceId: place.src.externalId,
        userFilters: userService.getNutritionTags()
    }).$promise
    .then(function(meals){
      var hasDishes = !!meals.data.length;

      $ionicLoading.hide();

      if (hasDishes) {
        $scope.dishes = meals.data;
      } else {
        $scope.errMsg = $sce.trustAsHtml(meals.message);
      }

      if (hasDishes && $scope.dishes.length < 7) {
        $scope.errMsg = $sce.trustAsHtml("Looks like slim pickings in your area... Fear not, we are adding more dishes by the day!");
      }
    })
    .catch(function(err){
      $ionicLoading.hide();
      $scope.errMsg = "An error occurred loading meals";
      console.log("An error occurred loading meals ", err);
    })
    .finally(function(){
        setHeaderText();
    });

    $scope.getDate = function() {
        var date = new Date();
        var day = date.getDate();

        if (day < 10) {
            day = "0"+day;
        }

        return day;
    }

    $scope.getMonth = function() {
        var date = new Date();
        var month = date.getMonth() + 1;
        return month;
    }
    
    function setHeaderText() {
        $scope.headerText = "Hey ";

        if (userService.isAuthenticated()) {
            $scope.headerText +=  userService.model.name.first;
        } else {
            $scope = $scope.headerText += "Thriver";
        }

        if ($scope.dishes) {
            $scope.headerText += ", Your Lunch Menu is Ready";
        }
    }
});
