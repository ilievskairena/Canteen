'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealsCtrl
 * @description
 * # MealsCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MealsCtrl', function ($scope,$http,ngDialog,APP_CONFIG,utility) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.editMeals = function(data){
		var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/editMealsDialog.html",
            className:'ngdialog-theme-default',
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;  
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
          url:  APP_CONFIG.BASE_URL +"/api/meals",
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
    vm.saveMeal = function(data){
        var editMeal = {
          "Description": data.Description,
          "TypeId": data.MealType
        };
        $http({
                method: 'PUT',
                data: editMeal,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL +"/api/meals/" + data.ID
            }).
            success(function(data) {
                console.log("Success editing meal");
                vm.getAllMeals();
            }).
            error(function(data, status, headers, config) {
                console.log("Error editing meal");
            });
    };

    vm.getAllMeals = function(){
      $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL +"/api/meals"
      }).
      success(function(data) {/*
          console.log("Success getting cost centers");*/
          vm.allMeals = data;
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
            url: APP_CONFIG.BASE_URL +"/api/meals/"+ mealId,
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
