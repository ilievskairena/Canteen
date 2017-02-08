(function(){

  'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:UnplannedorderCtrl
 * @description
 * # UnplannedorderCtrl
 * Controller of the canteenApp
 */
 
 /* jshint latedef:nofunc */
 
  angular.module('canteenApp')
  .controller('UnplannedorderCtrl', UnplannedorderCtrl);

  UnplannedorderCtrl.$inject = ['$rootScope', 'roleService', '$location', '$scope','$filter', 'utility', 'ngDialog','$http', 'APP_CONFIG', 'toastr', 'ngProgressFactory'];

  function UnplannedorderCtrl($rootScope, roleService, $location, $scope, $filter, utility, ngDialog, $http, APP_CONFIG, toastr, ngProgressFactory) {
/* jshint validthis: true */
    var vm = this;

    vm.progressBar = ngProgressFactory.createInstance();
    vm.users = null;
      /*
    0 - Choose date
    1 - Choose person
    2 - Choose shift
    3 - Choose meal
    */
    vm.step = 0;
    vm.meals = null;
    vm.shift = null;
    vm.selectedMeal = null;
    vm.numberWorker = null;
    vm.isInsert = true;
    vm.person = null;
    vm.cancelShiftUsers = [];
    vm.cancelShiftUsersOrders = undefined;

    //How many orders there are to delete (Sync requests)
    vm.deleteCount = 0;
    //Has an error occurred
    vm.hasError = false;
    //Flag whether to send a request
    vm.sendRequest = false;

    var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 5);
    vm.dateOptions = {
      formatYear: 'yyyy',
      maxDate: endDate,
      minDate: tomorrow,
      startingDay: 1
    };

    vm.date = {
      selected: null,
      open: false
    };

    vm.guests = false;
    vm.noOfGuests = 0;

    // Functions
    vm.cancelShift = cancelShift;
    vm.checkValidity = checkValidity;
    vm.confirmDelete = confirmDelete;
    vm.delete = Delete;
    vm.getMealsForDay = getMealsForDay;
    vm.getOrder = getOrder;
    vm.getOrdersForUsers = getOrdersForUsers;
    vm.insert = insert;
    vm.openDate = openDate;
    vm.personChange = personChange;
    vm.removeItem = removeItem;
    vm.reset = reset;
    vm.selectMeal = selectMeal;
    vm.update = update;

    // Init

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
      $location.path('/login');
    }
    
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)){
      $location.path("/");
    } 

    utility.getUsers().then(function(result) {
      vm.users = result.data;
        /*vm.users.splice(0, 0, {
          ID: 0,
          Name: "Ангажиран работник",
          Username: "",
          CostCenterID: 0,
          CostCenterName: "",
          PersonNumber: "",
          IsEmployee: null,
          RoleID: null,
          RoleName: "",
          CardNumber: "",
          CardType: "",
          CardID: null,
          IsActive: null
        });*/
      });

    // Define functions here

    function cancelShift(){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();

      var ordersId = [];
      for(var order in vm.cancelShiftUsersOrders){
        ordersId.push(vm.cancelShiftUsersOrders[order].OrderId);
      }

      var data = {
        OrdersId: ordersId
      };

      $http({
        method: 'PUT',
        data: data,
        contentType:'application/json',
        crossDomain: true,
        url: APP_CONFIG.BASE_URL + APP_CONFIG.orders_cancelShift
      }).then(function successCallback(response){
        vm.progressBar.complete();
        toastr.success("Смената е успешно откажана!");
        vm.cancelShiftUsersOrders = undefined;
        vm.cancelShiftUsers = [];
      }, function errorCallback(response){
        vm.progressBar.reset();
        toastr.error("Грешка при откажување на смената. Ве молиме обидете се повторно или обратете се кај администраторот.");
      });

    }

    function checkValidity(){
      return vm.cancelShiftUsers.length !== 0 && vm.date.selected !== null && vm.date.selected !== undefined;
    }

    function confirmDelete() {
      var nestedConfirmDialog = ngDialog.openConfirm({
        template: "../../views/partials/removeDialog.html",
        scope: $scope,
        data: null
      });

      // NOTE: return the promise from openConfirm
      return nestedConfirmDialog;   
    }

    function Delete(orderId) {
      $http({
        method:"DELETE",
        url: APP_CONFIG.BASE_URL + APP_CONFIG.orders_delete + orderId,
        crossDomain: true
      }).then(function successCallback(response){
        vm.deleteCount--;
        if(vm.deleteCount < 0) {
          if(vm.hasError){
            vm.progressBar.reset();
            toastr.error("Се случи грешка при бришење на нарачката. Можеби постојат нарачки за ангажирани работници, ве молиме обратете се кај администраторот!");
          }
          else {
            vm.progressBar.complete();
            toastr.success("Успешно е избришана нарачката!");
          }
          reset();
        }
        else {
          Delete(vm.order[vm.deleteCount].OrderID);
        }
      }, function errorCallback(response){
        vm.hasError = true;
        vm.deleteCount--;
        if(vm.deleteCount < 0) {
          if(vm.hasError){
            vm.progressBar.reset();
            toastr.error("Се случи грешка при бришење на нарачката. Можеби постојат нарачки за ангажирани работници, ве молиме обратете се кај администраторот!");
          }
          else {
            vm.progressBar.complete();
            toastr.success("Успешно е избришана нарачката!");
          }
          reset();
        }
        else{
          Delete(vm.order[vm.deleteCount].OrderID);
        } 
      });
    }

    function getMealsForDay() {
      vm.showMealChoices = null;
      vm.person = null;
      vm.selectedMeal = null;
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      var date = $filter("date")(vm.date.selected, "yyyy-MM-dd HH:mm:ss.sss");
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" +  date + "&dateTo=" + date
      }).then(function successCallback(response){
        vm.step = 1;
        vm.shift = 0;
        vm.meals = response.data[0];
        vm.progressBar.complete();
      }, function errorCallback(response){
        if(response.status === 404){
          toastr.info("За овој ден не се пронајдени оброци. Обратете се до администрацијата да се внесе мени!");
        }
        else{
          toastr.error("Грешка при преземање на податоците!");
        }
        vm.progressBar.reset();
      });
    }

    function getOrder() {
      vm.showMealChoices = null;
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();

      var url = APP_CONFIG.BASE_URL + APP_CONFIG.orders_existing;
      url += "?dateId=" + vm.meals.DateId;
      if(vm.person.ID !== 0){
        url += "&userId=" + vm.person.ID;
      } 
        
      $http({
        method: 'GET',
        crossDomain: true,
        url:  url
      }).then(function successCallback(response){
        var data = response.data;
        vm.order = data;
        vm.progressBar.complete();
        vm.step = 4;
        if(vm.person.ID === 0) {
          vm.numberWorker = data.length;
        }
        vm.isInsert = false;
      }, function errorCallback(response){
        if(response.status !== 500) {
          vm.step = 3;
          vm.isInsert = true;
        }
        else {
          toastr.error("Грешка при преземање на податоци за нарачка. Ве молиме обратете се кај администраторот!");
        } 
          
        vm.progressBar.reset();
      });
    }

    function getOrdersForUsers(){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();

      var users = [];
      for(var user in vm.cancelShiftUsers){
        users.push(vm.cancelShiftUsers[user].ID);
      }

      var data = {
        Date: $filter("date")(vm.date.selected, "yyyy-MM-dd HH:mm:ss.sss"),
        Users: users
      };

      $http({
        method: 'POST',
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_existing,
        data: data,
        contentType:'application/json',
        crossDomain: true,
      }).then(function successCallback(response){
        vm.progressBar.complete();
        var data = response.data;
        vm.cancelShiftUsersOrders = data;
        
      }, function errorCallback(response){
        toastr.error("Грешка при преземање на податоците за нарачките. Ве молиме обратете се кај администраторот!");
        vm.progressBar.reset();
      });
    }

    function insert() {
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      var data = {
        IsWorker: vm.person.ID === 0,
        UserID: vm.person.ID,
        DateID: vm.meals.DateId,
        MealPerDayID: vm.selectedMeal.MealID,
        Shift: parseInt(vm.shift),
        Count: parseInt(vm.numberWorker)
      };
      $http({
        method: 'POST',
        data: data,
        contentType:'application/json',
        crossDomain: true,
        url: APP_CONFIG.BASE_URL + APP_CONFIG.unplanedMeal
      }).then(function successCallback(response){
        vm.progressBar.complete();
        reset();
        toastr.success("Нарачката е успешно внесена!");
      }, function errorCallback(response){
        vm.progressBar.reset();
        toastr.error("Грешка при внес на нарачката. Обратете се кај администраторот.");
      });
    }

    function openDate() {
      vm.date.open = !vm.date.open;
    }

    function personChange() {
      vm.step = 2;
      vm.selectedMeal = null;
      getOrder();
    }

    function removeItem() {
      console.log(vm.order);
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();

      vm.deleteCount = vm.order.length - 1;
      Delete(vm.order[vm.deleteCount].OrderID);
    }

    function reset() {
      vm.step = 0;
      vm.person = null;
      vm.selectedMeal = null;
      vm.shift = null;
      vm.numberWorker = null;
      vm.date.selected = null;
    }

    function selectMeal(meal) {
      vm.selectedMeal = meal;
      vm.step = 4;  
    }

    function update() {
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      var data = {
        OrderID: vm.order[0].OrderID,
        IsWorker: vm.person.ID === 0,
        UserID: vm.person.ID,
        DateID: vm.meals.DateId,
        MealPerDayID: vm.selectedMeal.MealID,
        Shift: parseInt(vm.shift),
        Count: parseInt(vm.numberWorker),
        Guests: vm.guests === true? vm.noOfGuests : null
      };
      console.log(data);
      $http({
        method: 'PUT',
        data: data,
        contentType:'application/json',
        crossDomain: true,
        url: APP_CONFIG.BASE_URL + APP_CONFIG.unplanedMeal
      }).then(function successCallback(response){
        vm.progressBar.complete();
        reset();
        toastr.success("Нарачката е успешно внесена!");
      }, function errorCallback(response){
        vm.progressBar.reset();
        toastr.error("Грешка при внес на нарачката. Обратете се кај администраторот.");
      });
    }

    //OnShiftChange Event
    $scope.$watch('vm.shift', function(oldValue, newValue) {
      if(oldValue !== newValue) {
        vm.selectedMeal = null;
        if(vm.order !== null && vm.order !== undefined) {
          for(var i in vm.meals.Meals) {
            var meal = vm.meals.Meals[i];
            if(meal.MealID === vm.order[0].MealPerDayID){
              vm.selectedMeal = meal;
              break;
            }
          }
        }
      }
    });
  }
})();