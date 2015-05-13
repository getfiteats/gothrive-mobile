angular.module('gothrive')
  .service('bag', function($localStorage){
    //TODO:: possible change, re-query from server to get most recent price
    var mealReferences = $localStorage.bag || [];
    var numItems = parseInt(countItems(mealReferences), 10);
    var EXPERT_FEE = 15/100;
    var TAX = 8.875/100;
    var TIP = 15/100;

    function add(item) {
      var exists = false;

      for (var i = 0; i < mealReferences.length; i++) {
        if (mealReferences[i].mealId === item.id) {
          exists = true;
          mealReferences[i].quantity++;
          break;
        }
      }

      if (!exists) {
        mealReferences.push({ meal: item, id: item.id, mealId: item.id, quantity: 1 });
      }

      numItems = countItems(mealReferences);

      $localStorage.bag = mealReferences;
    }

    function remove(item) {
      for (var i = 0; i < mealReferences.length; i++) {
        if (mealReferences[i].mealId === item.id) {
          mealReferences[i].quantity--;
          if (mealReferences[i].quantity <= 0) {
            mealReferences.splice(i, 1);
            numItems = countItems(mealReferences);
          }
          break;
        }
      }

      numItems = countItems(mealReferences);
    }

    function empty() {
      numItems = 0;
      mealReferences = [];
      $localStorage.bag = mealReferences;
    }

    function countItems(mealReferences) {
      return parseInt(mealReferences.reduce(function(prev, current){
        return prev + parseInt(current.quantity, 10);
      }, 0), 10);
    }

    function getQuantity(mealId) {
      var references = mealReferences.filter(function(mealReference){
        return mealReference.mealId === mealId;
      });
      return parseInt(references.reduce(function(prev, current){
        return prev + parseInt(current.quantity, 10);
      }, 0), 10);
    }

    function getTotal() {
      return mealReferences.reduce(function(prev, currentMealReference){
        return prev + currentMealReference.meal._dishes.reduce(function(prev, currentDish){
          return prev + ((currentDish.price * currentMealReference.quantity) + (currentDish.price * EXPERT_FEE));
        }, 0);
      }, 0);
    }

    function getNumItems() {
      return numItems;
    }

    function getItems() {
      return mealReferences;
    }

    function calculateTotals() {
      var totals = {baseTotal: 0, subTotal: 0};

      mealReferences.forEach(function(mealReference) {
        totals.subTotal += mealReference.meal.expertPrice * mealReference.quantity;
        totals.baseTotal += mealReference.meal.price * mealReference.quantity;
      });

      return totals;
    }

    function calculateTax(baseTotal) {
      return parseFloat((baseTotal * TAX).toFixed(2));
    }

    function calculateTip(baseTotal) {
      return parseFloat((baseTotal * TIP).toFixed(2));
    }

    function getCostBreakdown() {
      var costBreakdown = calculateTotals();
      costBreakdown.tax = calculateTax(costBreakdown.baseTotal);
      costBreakdown.tip = calculateTip(costBreakdown.baseTotal);
      costBreakdown.total = costBreakdown.subTotal + costBreakdown.tax + costBreakdown.tip;
      return costBreakdown;
    }

    function update() {
      numItems = countItems(mealReferences);
    }

    return {
      add: add,
      remove: remove,
      getNumItems: getNumItems,
      empty: empty,
      getQuantity: getQuantity,
      getItems: getItems,
      getTotal: getTotal,
      getCostBreakdown: getCostBreakdown,
      update: update
    };
  });
