angular.module('gothrive.dish', ['ui.router'])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('dish', {
          templateUrl: 'dish/dish.tpl.html',
          controller: 'Dish',
          data: {
            pageTitle: 'Dish'
          },
          params: {dish: null},
          cache: false
      });
}])
.controller('Dish', function ($scope, $stateParams, bag) {
  var dish = $stateParams.dish;

  $scope.bag = bag;
  $scope.dish = dish;
  $scope.quantityAdded = 0;

  $scope.$watch(function(){
    $scope.quantityAdded = bag.getQuantity(dish.id);
  });

  $scope.addToBag = function(item) {
    bag.add(item);
  }
});
