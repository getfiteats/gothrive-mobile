angular.module('gothrive.bag', ['ui.router'])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('bag', {
          templateUrl: 'bag/bag.tpl.html',
          controller: 'Bag',
          data: {
            pageTitle: 'Bag'
          },
          cache: false
      });
}])
.controller('Bag', function ($scope, $stateParams, $ionicPopup, userService, bag) {
  
  userService.seenLogin = false;

  $scope.bag = bag;

  $scope.$watch(function(){
    $scope.costBreakdown = bag.getCostBreakdown();
  });

  $scope.onDishClick = function(event, mealReference) {
    if (!/quantity/.test(event.srcElement.getAttribute('class'))) {
      return;
    } 

    event.preventDefault();
    // force curstor to end of input
    mealReference.quantity = mealReference.quantity;
    $scope.onQuantityChange(mealReference);
  }

  $scope.onQuantityChange = function(mealReference) {
    
    mealReference.quantity = parseInt(mealReference.quantity);
    bag.update();

    if (!isNaN(mealReference.quantity) && mealReference.quantity) {
      return;
    }

    $ionicPopup.confirm({
      title: 'Remove Meal',
      template: 'Are you sure you want to remove this meal from your bag?'
    }).then(function(res){
        if (res) {
          bag.remove(mealReference);
        } else {
         mealReference.quantity = 1; 
        }
    });
      
  }
});