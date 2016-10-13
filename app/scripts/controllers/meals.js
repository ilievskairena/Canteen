'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealsCtrl
 * @description
 * # MealsCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MealsCtrl', function ($rootScope, $location, roleService, $scope, $http, ngDialog, APP_CONFIG, utility, ngTableParams, toastr) {
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

    vm.insert = function() {
       console.log({
        "Description": vm.MealDescription,
        "TypeId": vm.MealType
      })
    };      

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
      $http({
          method: 'POST',
          contentType:'application/json',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_insert,
          data: newMeal
      }).
      success(function(data) {
          /*console.log("Success adding cost center");*/
          vm.getAllMeals();
      }).
      error(function(data, status, headers, config) {
          console.log("Error adding cost center");
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
        }).
        error(function(data, status, headers, config) {
            toastr.success("Грешка при промена на оброкот! Ве молиме обидете се повторно.")
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
              count: 5
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
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/removeDialog.html",
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.removeItem = function(mealId){
        $http({
            method:"DELETE",
            url: APP_CONFIG.BASE_URL + APP_CONFIG.meals + "/"+ mealId,
            crossDomain: true
            
        }).success(function(data){
            console.log("Successfully deleted meal");
        }).error(function(data){
            console.log(data);
        });
    };

    vm.getAllMeals();
    vm.getAllMealTypes();
  });
