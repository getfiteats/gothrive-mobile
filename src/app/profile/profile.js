angular.module('gothrive.profile', [])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider.state('profile', {
        templateUrl: 'profile/profile.tpl.html',
        url: '/profile',
        controller: 'Profile',
        data: {
          pageTitle: 'Profile'
        },
        cache: false
    });
}])
.controller('Profile', function ($scope, $state, bag, userService, NutritionTag, AuthService, $ionicHistory) {
    var selectedTags = {};
    var savedNutritionTags = userService.getNutritionTags();

    $scope.headerText = userService.isAuthenticated() ? userService.model.fullName : 'Profile';
    
    userService.getNutritionTags().forEach(function(nutritionTagReference){
      selectedTags[nutritionTagReference.nutritionTagId] = true;
    });
  
    NutritionTag.find().$promise
      .then(function(nutritionTags){
        nutritionTags.forEach(function(nutritionTag){
          nutritionTag.on = selectedTags[nutritionTag.id];
        });
        $scope.nutritionTags = nutritionTags;
      });

    $scope.user = userService.model;
    $scope.userService = userService;

    $scope.toggleTag = function(tag) {
      tag.on = !tag.on;

      if (tag.on) {
        selectedTags[tag.id] = true;
      } else {
        delete selectedTags[tag.id];
      }

      updateTags();
    }

    function updateTags() {
      var nutritionTagReferences = Object.keys(selectedTags).map(function(tagId){
        return { nutritionTagId: tagId };
      });
      userService.setNutritionTags(nutritionTagReferences)
        .then(function(user){
          console.log('updated tags');
        })
        .catch(function(err){
          console.log('error saving tags');
        })
        .finally(function() {
          $ionicHistory.clearCache();
        });
    }

    $scope.logout = function logout() {
      AuthService.logout(function(err){
        if (err) {
          console.log('Could not logout the user: ', err);
          return;
        }
      });
    };
});
