angular.module('gothrive')
  .directive('endLine', function factory () {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {

        $element.bind('focus', function(){
          $element[0].setSelectionRange(0,9999);
        });
      }
    };
  });
