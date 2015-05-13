angular.module('gothrive.pseudoClass', [])

  .directive('pseudoClass', function factory () {
    var id = Date.now();
    return {
      restrict: 'A',
      link: function($scope, $element, $attrs) {
        var options = $scope.$eval($attrs.pseudoClass);
        var head = angular.element(document.querySelector('head'));
        var selector = $scope.$eval($attrs.pseudoClassSelector);

        $scope.$watch($attrs.pseudoClass, function(options){
          var selectorId;
          if (!options) {
            return;
          }
          selectorId = selector
                          .replace('#', '-id-')
                          .replace('.', '-class-');
          Object.keys(options).map(function(pseudoSelector){
            injectStyle(id + '-' + pseudoSelector + selectorId, pseudoSelector, options[pseudoSelector]);
          });
        });

        function injectStyle(id, pseudoSelector, value) {
          var oldStyleEl = document.querySelector('#gt-'+id);
          var newStyle = getStyle(id, pseudoSelector, value);
          
          if (oldStyleEl) {
            oldStyleEl.remove();
          }

          head.append(newStyle);
        }

        function getStyle(id, pseudoSelector, value) {
          return "<style id='gt-"+id+"'>"+selector+":"+pseudoSelector+"{content: '"+value+"'}</style>";
        }
      }
    };
  });
