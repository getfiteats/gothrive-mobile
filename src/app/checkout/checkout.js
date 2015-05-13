angular.module('gothrive.checkout', ['ui.router'])
.config(['$stateProvider', function ($stateProvider) {
    $stateProvider
      .state('checkout', {
          templateUrl: 'checkout/checkout.tpl.html',
          controller: 'Checkout',
          data: {
            pageTitle: 'Checkout'
          },
          params: { mealReferences: null, order: null, postLogin: null }
      });
}])
.controller('Checkout', function ($scope, $state, $stateParams, $q, $ionicModal, $ionicLoading, $ionicPopup, $ionicHistory, $localStorage, $timeout, userService, User, Order, bag) {
  var order;
  var placingOrder = false;
  var forwardView = $ionicHistory.forwardView();

  order = {
    userId: userService.model.id,
    instructions: ''
  };

  $scope.forms = {};
  $scope.checkoutValid = false;
  $scope.paymentValid = false;
  $scope.addressValid = false;
  $scope.order = order;
  $scope.savedCardData = {buttonText:'Change Payment Method', clickAction:'changePaymentMethod'};
  $scope.cardInfo = { expiration: {} };
  $scope.cardType = { value: '' };
  $scope.submit = submit;

  if (userService.model.payment && userService.model.payment.customerId) {
    $scope.showAddCardForm = true;
    loadCards();
  } else {
    $scope.showAddCardForm = false;
  }

  $scope.$watchGroup(['paymentValid', 'forms.addressForm.$valid', 'forms.paymentForm.$valid'], function(){
    var paymentValid = $scope.paymentValid || ($scope.forms.paymentForm && $scope.forms.paymentForm.$valid);
    $scope.checkoutValid = paymentValid && $scope.forms.addressForm.$valid;
  });

  $scope.$watch('cardType.value', function(newCardType){
    $scope.ccClass = newCardType ? 'fa fa-cc-' + newCardType : 'icon ion-card';
  });

  $ionicModal.fromTemplateUrl('checkout/saved-cards.tpl.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });

  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });

  prefill();

  if ($stateParams.postLogin) {
    submit();
  }

  function prefill() {
    var cardInfoMap = {
      number: 'cardNumber',
      expiration: 'expiration',
      cvc: 'cvc'
    };

    var addressMap = {
      formatted: 'street',
      unit: 'unit',
      phone: 'phone',
      instructions: 'instructions'
    };

    if (!$localStorage.lastPlace) {
      return;
    }

    order.address = {};

    Object.keys(addressMap).forEach(function(key){
      if (!$localStorage.lastPlace.address[key]) {
        return;
      }
      order.address[addressMap[key]] = $localStorage.lastPlace.address[key];
    });

    if (!$localStorage.cardInfo || $scope.showAddCardForm) {
      return;
    }

    // DOM dependent
    $timeout(function(){
      Object.keys(cardInfoMap).forEach(function(key){
        if (!$localStorage.cardInfo[key]) {
          return;
        }
        $scope.forms.paymentForm[cardInfoMap[key]].$setViewValue($localStorage.cardInfo[key]);
        $scope.forms.paymentForm[cardInfoMap[key]].$render();
      });
      delete $localStorage.cardInfo;
    }, 500);
  }

  // TODO:: Only get default card
  function loadCards() {
    User.getDefaultPaymentMethod({customerId: userService.model.payment.customerId}).$promise
      .then(function(card){
        if (!card) {
          $scope.showAddCardForm = false;
        } else {
          $scope.savedCardData.card = card;
          $scope.paymentValid = true;
        }
      })
      .catch(function(err){
        console.log(err);
      });
  }

  function parseCardInfo() {
    var cardInfo = {};

    try {
     cardInfo.exp_month = $scope.cardInfo.expiration.month;
     cardInfo.exp_year = $scope.cardInfo.expiration.year;
    } catch(err) {
      console.log('error parsing expiration');
    }

    cardInfo.number = $scope.cardInfo.number;
    cardInfo.cvc = $scope.cardInfo.cvc;

    return cardInfo;
  }

  function addPaymentMethod() {
    return $q(function(resolve, reject){

      var cardInfo = parseCardInfo();

      Stripe.card.createToken(cardInfo, function(status, response){
        var token;

        if (response.error) {
          console.log('error adding card to stripe', response.error);
          return;
        }

        token = response.id;

        User.addPaymentMethod({ userId: userService.model.id, token: token }).$promise
          .then(function(card){
            return resolve(card.id);
          })
          .catch(function(err){
            try {
              if (err.data.error.code !== "card_declined") {
                return reject(err);
              }
            } catch(e){}
            console.log('an error occured adding payment method');
            $scope.sandBoxError = true;
            $scope.cardInfo.number = 4111111111111111;
            return addPaymentMethod().then(function(){
              resolve();
            });
          });
      });
    });
  }

  function saveInput() {
    if (!$localStorage.lastPlace) {
      return;
    }

    $localStorage.lastPlace = $localStorage.lastPlace || {};
    $localStorage.lastPlace.address = $localStorage.lastPlace.address || {};
    $localStorage.cardInfo = $localStorage.cardInfo || {};

    $localStorage.lastPlace.address.unit = order.address.unit;
    $localStorage.lastPlace.address.phone = order.address.phone;
    $localStorage.lastPlace.address.instructions = order.instructions;

    if ($scope.showAddCardForm) {
     return; 
    }

    $localStorage.cardInfo.number = $scope.forms.paymentForm.cardNumber.$viewValue;
    $localStorage.cardInfo.expiration = $scope.forms.paymentForm.expiration.$viewValue;
    $localStorage.cardInfo.cvc = $scope.forms.paymentForm.cvc.$viewValue;
  }

  function sendOrder(order, cardId) {
    if (placingOrder) {
      return;
    }
    placingOrder = true;
    order._mealReferences = bag.getItems();
    Order.create(order).$promise.then(function(order){
      console.log('order', order);
      return Order.charge({ orderId: order.id, cardId: cardId }).$promise;
    }).then(function(order){
      $ionicLoading.hide();
      console.log('enjoy your meal!', order);
      // TODO:: possibly requery from server to get most recent data
      var mealReferences = bag.getItems();
      saveInput();

      bag.empty();
      $state.go('order', { order: order, mealReferences: mealReferences, sandBoxError: $scope.sandBoxError });
    }).catch(function(err){
      $ionicLoading.hide();
      $ionicPopup.alert({
        title: 'Error',
        template: 'We had a problem processing your order.'
      });
      console.log('an error occured processing order');
    })
    .finally(function(){
      placingOrder = false;
    });
  }

  $scope.changePaymentMethod = function() {
    console.log('changePaymentMethod');
    $scope.modal.show();
    User.getPaymentMethods({customerId: userService.model.payment.customerId}).$promise
      .then(function(cards){
        $scope.cards = cards;
      })
      .catch(function(err){
        console.log(err);
      });
  };

  $scope.closeModal = function() {
    $scope.modal.hide();
  }

  $scope.addNewCard = function() {
    $scope.modal.hide();
    $scope.showAddCardForm = false;
    $scope.savedCardData.card = null;
    $scope.paymentValid = false;
  }

  $scope.selectCard = function(card) {
    $scope.savedCardData.card = card;
    $scope.showAddCardForm = true;
    $scope.modal.hide();
    $scope.paymentValid = true;
  }

  function submit() {
    if (!$scope.checkoutValid) {
      console.log('checkout invalid');
      return;
    }

    if (placingOrder) {
      console.log('an order is already in progress');
      return;
    }

    if (!userService.isAuthenticated()){
      saveInput();
      return $state.go('login');
    }

    $ionicLoading.show({
      template: 'Placing Order...'
    });

    if ($scope.savedCardData.card) {
      sendOrder($scope.order, $scope.savedCardData.card.id);
    } else {
      addPaymentMethod()
        .then(function(cardId){
          sendOrder($scope.order, cardId);
        })
        .catch(function(err){
          console.log(err);
          $ionicLoading.hide();
        });
    }
  }

});
