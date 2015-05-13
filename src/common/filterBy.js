angular.module('gothrive')
  .filter('filterBy', function(){
    return function(list, prop, value, subProp) {
      if (!list) {
        return [];
      }

      return list.filter(function(item){
        if (subProp) {
          item = item[subProp];
        }
        return item[prop] === value;
      });
    }
  });
