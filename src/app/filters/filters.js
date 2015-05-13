angular.module('gothrive.filters', [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('filters', {
        url: '/filters',
        templateUrl: 'filters/filters.tpl.html',
        controller: 'Filters',
        data: {
          pageTitle: 'Filters'
        }
    });
}])
.controller('Filters', function ($scope) {
    $scope.tags = [
      { name: 'Gluten Free', icon: 'organic' },
      { name: 'Grain Free', icon: 'local' },
      { name: 'Corn Free', icon: 'beef'},
      { name: 'Rice FRee', icon: 'poultry' },
      { name: 'Legume Free', icon: 'organic' },
      { name: 'Soy Free', icon: 'organic' },
      { name: 'Nut Free', icon: 'local' },
      { name: 'Meat Free', icon: 'beef'},
      { name: 'Pork Free', icon: 'poultry'  },
      { name: 'Shellfish Free', icon: 'organic' },
      { name: 'Dairy Free', icon: 'organic' },
      { name: 'Red Meat Free', icon: 'local' },
      { name: 'Beef Free', icon: 'beef'}
    ];

});