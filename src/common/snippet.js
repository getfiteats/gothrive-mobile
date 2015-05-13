angular.module('gothrive')
  .filter('snippet', function(){
    return function(input, length) {
  
      if (screen.width <= 320) {
        length -= 22;
      }

      if (input && input.length > length) {
        input = input.substring(0, length-3).trim() + '...';
      }

      return input;
    }
  });
