'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealsCtrl
 * @description
 * # MealsCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MealsCtrl', function ($rootScope, $location, roleService, $scope, $http, ngDialog, APP_CONFIG, utility, ngTableParams, toastr, ngProgressFactory) {
    var vm = this;

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
        $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

    vm.isEditing = false;
    vm.editIndex = null;
    vm.editModel = null;     

    vm.progressBar = ngProgressFactory.createInstance();

    vm.edit = function(row, index){
		  vm.isEditing = true;
      vm.editIndex = index;
      vm.editModel = row;
    };

    vm.cancel = function() {
      vm.isEditing = false;
      vm.editIndex = null;
      vm.editModel = null;
    };

    vm.addMeal = function(){
      var newMeal = {
        "Description": vm.MealDescription,
        "TypeId": vm.MealType
      };
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      $http({
          method: 'POST',
          contentType:'application/json',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_insert,
          data: newMeal
      }).
      success(function(data) {
        toastr.success("Успешно додаден оброк");
        vm.getAllMeals();
        vm.progressBar.complete();
        vm.MealDescription = "";
        vm.MealType = "";
        vm.form.$setPristine(true);
      }).
      error(function(data, status, headers, config) {
        vm.progressBar.reset();
        toastr.error("Грешка при креирање на оброк");
      });
    };

    vm.getAllMealTypes = function(user){
        utility.getMealTypes().then(function(result) {
            vm.allMealTypes = result.data;
        });
    };

    vm.update = function(){
      var editMeal = {
        "Description": vm.editModel.MealDescription,
        "TypeID": vm.editModel.TypeID
      };
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();

      $http({
          method: 'PUT',
          data: editMeal,
          contentType:'application/json',
          crossDomain: true,
          url: APP_CONFIG.BASE_URL + APP_CONFIG.meals + "/" + vm.editModel.MealID
      }).
      success(function(data) {
        toastr.success("Успешно променет оброк!")
        vm.getAllMeals();
        vm.cancel();
        vm.progressBar.complete();
      }).
      error(function(data, status, headers, config) {
        vm.progressBar.reset();
        toastr.error("Грешка при промена на оброкот! Ве молиме обидете се повторно.")
      });
    };

    vm.getAllMeals = function(){
      $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals
      }).
      success(function(data) {/*
          console.log("Success getting cost centers");*/
          vm.allMeals = data;
          vm.table = new ngTableParams({
              page: 1,
              count: 15
            }, {
              total: data.length,
              //Hide the count div
              counts: [],
              getData: function($defer, params) {
                  var filter = params.filter();
                  var sorting = params.sorting();
                  var count = params.count();
                  var page = params.page();
                  //var filteredData = filter ? $filter('filter')(vm.data, filter) : vm.data
              
                  $defer.resolve(data.slice((page - 1) * count, page * count));
              }
          });
      }).
      error(function(data, status, headers, config) {
          console.log("Error getting meals");
      });
    };

    vm.openRemoveDialog = function(data){
        console.log(data);
        var item = {
          ID: data.MealID
        };

        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/removeDialog.html",
            scope: $scope,
            data: item
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.removeItem = function(mealId){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      $http({
          method:"DELETE",
          url: APP_CONFIG.BASE_URL + APP_CONFIG.meals + "/"+ mealId,
          crossDomain: true
          
      }).success(function(data){
        toastr.success("Успешно избришан оброк!");
        vm.progressBar.complete();
        vm.getAllMeals();
      }).error(function(data){
          toastr.error("Грешка при бришење на оброк.");
          vm.progressBar.reset();
      });
    };

    vm.getAllMeals();
    vm.getAllMealTypes();
  });
