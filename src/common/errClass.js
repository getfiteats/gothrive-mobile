angular.module('gothrive')
  .directive('errClass', function factory () {
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        var scopePath = $attrs['errClassScope'];
        var $inputScope = $scope.$eval(scopePath);
        var $inputEl = angular.element(document.querySelector($attrs['errClassEl']));

        $scope.$watch(scopePath + '.$invalid', validate);
        $scope.$watch(scopePath + '.$dirty', validate);

        $inputEl.bind('blur', function(){
          if ($inputScope) {
            $inputScope.blur = true;
          }
          $element.addClass('err-blur');
          $element.removeClass('err-focus');
          validate();
        });

        $inputEl.bind('focus', function(){
          if ($inputScope) {
            $inputScope.blur = false;
          }
          $element.addClass('err-focus');
          $element.removeClass('err-blur');
          validate();
        });

        function validate() {
          var invalid = $inputScope && $inputScope.$invalid && $inputScope.$dirty && $inputScope.blur;

          if (invalid) {
            $element.addClass('err-invalid');
          } else {
            $element.removeClass('err-invalid');
          }
          
        }
      
      }
    };
  });
