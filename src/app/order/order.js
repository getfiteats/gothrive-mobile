angular.module('gothrive.order', ['ui.router'])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('order', {
          templateUrl: 'order/order.tpl.html',
          controller: 'Order',
          data: {
            pageTitle: 'Order'
          },
          params: { order: null, mealReferences: null, sandBoxError: null },
          cache: false
      });
}])
.controller('Order', function ($scope, $state, $stateParams, $ionicHistory) {
  $scope.order = $stateParams.order;
  $scope.sandBoxError = $stateParams.sandBoxError;
  $scope.mealReferences = $stateParams.mealReferences;
});