angular.module('gothrive')
  .service('userService', function(User, UserIdentity, $localStorage, $q){
    
    var defaults = {
      _nutritionTagReferences: []
    };

    function UserService() {
      if (!$localStorage.userData) {
        $localStorage.userData = {};
      }

      this.model = $localStorage.userData;
      this.setDefaults();
      this.authenticated = false;
    }

    UserService.prototype.setDefaults = function() {
      if (!this.model._nutritionTagReferences) {
        this.model._nutritionTagReferences = defaults._nutritionTagReferences;
      }
    };

    UserService.prototype.isAuthenticated = function() {
      return this.authenticated;
    };

    UserService.prototype.logout = function() {
      this.authenticated = false;
      this.model = null;
    };

    UserService.prototype.setCurrent = function(cb) {
      var noop = function(){};
      var deferred = $q.defer();
      var self = this;
      User.getCurrent().$promise.then(function(user){
        user.fullName = user.name.first + ' ' + user.name.last;
        self.model = user;
        self.authenticated = true;
        if (cb) {
          cb(null, self.model);
        } else {
          deferred.resolve(self.model);
        }
      }).catch(cb || deferred.resolve);
      return deferred.promise;
    };

    UserService.prototype.setNutritionTags = function(tags) {
      this.model._nutritionTagReferences = tags;
      return this.save();
    };

    UserService.prototype.setAddress = function() {

    };

    UserService.prototype.getNutritionTags = function() {
      return this.model._nutritionTagReferences;
    };

    UserService.prototype.getAddress = function() {

    };

    UserService.prototype.save = function() {
      var deferred = $q.defer();
      var promise;

      if (this.authenticated) {
        promise = this.model.$save();
      } else {
        promise = deferred.promise;
        deferred.resolve();
      }
      return promise;
    };

    return new UserService();

   });
