(function(){

  'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MakeordersnextweekCtrl
 * @description
 * # MakeordersnextweekCtrl
 * Controller of the canteenApp
 */
 
  angular.module('canteenApp')
  .controller('MakeordersnextweekCtrl', MakeordersnextweekCtrl);

  MakeordersnextweekCtrl.$inject = ['$scope', 'toastr', '$location', '$route', 'APP_CONFIG', '$rootScope', 'roleService', 'ngDialog', '$http', '$filter', 'utility', 'ngProgressFactory'];

  function MakeordersnextweekCtrl($scope, toastr, $location, $route, APP_CONFIG, $rootScope, roleService, ngDialog, $http, $filter, utility, ngProgressFactory) {

    var vm = this;

    vm.progressBar = ngProgressFactory.createInstance();
    vm.options = [];
    vm.model = [];

    vm.flags = {
      showOtherDays: false
    };

    vm.items = {
      startIndex: 0,
      endIndex: 5,
    };

    vm.ordersMade = []; 


    // Functions
    
    vm.confirm = confirm;
    vm.formatData = formatData;
    vm.formatPreviewData = formatPreviewData;
    vm.getMeal = getMeal;
    vm.getOrderPlan = getOrderPlan;
    vm.insert = insert;
    vm.isAlreadyOrdered = isAlreadyOrdered;
    vm.nextWeek = nextWeek;
    vm.reload = reload;
    vm.selectMeal = selectMeal;
    vm.selectShift = selectShift;

    // Init

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
      $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

    if(vm.loggedInUser == null || vm.loggedInUser == undefined) {
      $location.path('/');
    }
    else getOrderPlan();

    // Define functions here

    function confirm() {
      var data = vm.formatPreviewData();
      var confirmDialog = ngDialog.openConfirm({
        template: "../../views/partials/confirmOrder.html",
        scope: $scope,
        data: data
      });

      // NOTE: return the promise from openConfirm
      return confirmDialog;  
    };

    function formatData() {
      var result = [];
      for(var i in vm.options) {
        var date = vm.options[i];
        //console.log(date);
        var dateOrderExists = false;
        //if there is no meal selected for the date
        if(date.selectedMeal==null){
          continue;
        }
        //if the date has already a order from before
        for(var i = 0; i < vm.ordersMade.length; i++){
          if(date.DateID == vm.ordersMade[i].DateID){
            dateOrderExists = true;
            break;
          }
        }

        if(dateOrderExists){
          continue;
        } 

        result.push({
          DateID: date.DateID,
          Date: date.Date,
          MealPerDayID: date.MealPerDateID,
          MealID : date.selectedMeal,
          Guests: date.Guests,
          ChosenShift : date.ChosenShift == null ? date.shift : date.ChosenShift,
          MealChoices : []
        });
      }

      if(result.length == 0) {
        return null;
      }
      return result;
    };

    function formatPreviewData() {
      var result = [];
      for(var i in vm.options) {
        var date = vm.options[i];
        if(date.OrderID != null) continue;
        for(var j in date.MealChoices) {
          var meal = date.MealChoices[j];
          if(meal.MealID == date.selectedMeal) {
            result.push({
              date : date.Date,
              meal : meal.MealDescription,
              type : meal.Type,
              shift : meal.Shift,
              guests: date.Guests
            });
            break;
          }
        }
      }
      return result;
    };

    function getMeal(date){
      for(var i in date.MealChoices) {
        var meal = date.MealChoices[i];
        if(meal.MealID == date.selectedMeal){
          return meal.MealDescription;   
        }
      }

    };

    function getOrderPlan() {
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0,0,0,0);
      var nextWeek = utility.getNextWeekStart();
      nextWeek.setHours(0,0,0,0);
      var dateTo = new Date(nextWeek);
      dateTo.setDate(dateTo.getDate() + 4);
      tomorrow = $filter('date')(tomorrow, "yyyy-MM-dd HH:mm:ss.sss");
      dateTo = $filter('date')(dateTo, "yyyy-MM-dd HH:mm:ss.sss");

      utility.getOrdersByDateRage(tomorrow, dateTo).then(
        function(result) {
          vm.options = result.data;
        for(var i = 0; i< vm.options.length; i++){
          if(vm.options[i].OrderID!=null)
            vm.ordersMade.push(vm.options[i]);
        }
        vm.flags.showOtherDays = result.data.length >= 5;
      }, 
      function(error) {

      });
    };

    function insert() {
      var data = vm.formatData();
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      $http({
        method: 'POST',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.client_orders_save,
        data: data
      }).then(function successCallback(response){
        vm.progressBar.complete();
        toastr.info("Нарачката е успешно извршена!");
        reload();
      }, function errorCallback(response){
        toastr.error("Нарачката не е зачувана. Ве молиме обидете се повторно!");
        vm.progressBar.setColor('red');
        vm.progressBar.reset();
      });
    };

    function isAlreadyOrdered(date) {
      return date.OrderID != null? true: false;
    };

    function nextWeek() {
      if(vm.flags.showOtherDays) {
        vm.items.startIndex += 5;
        vm.items.endIndex +=5;
      }
    };

    function reload() {
      $route.reload();
    };

    function selectMeal(date, meal) {
      if(date.MealPerDateID != null) return;
      date.selectedMeal = meal.MealID
    };

    function selectShift(date, shift) {
      if(date.ChosenShift != null) return;
      date.shift = shift;
      date.selectedMeal = null;
    };
  }
})();