angular.module('gothrive')
  .filter('cloudinaryCrop', function() {
  return function(input, cropMode, width, height) {
    if (!input) {
      return '';
    }

    var cropPath = '/upload/';
    if (width) {
      cropPath += 'w_' + width + ',';
    }
    if (height) {
      cropPath += 'h_' + height + ',';
    }

    cropPath += cropMode;
    return input.replace('/upload', cropPath);
  };
});
