angular.module('gothrive.prompt', [])

  .directive('prompt', function factory () {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, ngModel) {

        $element.bind('click', changeQuantity);

        function changeQuantity() {
          var quantity = prompt($attrs.prompt, ngModel.$modelValue.quantity);
          ngModel.$modelValue.quantity = parseInt(quantity, 10);
          ngModel.$setViewValue(ngModel.$modelValue);
        }
      }
    };
  });
