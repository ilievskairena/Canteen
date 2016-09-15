'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealtypeCtrl
 * @description
 * # MealtypeCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MealtypeCtrl', function ($scope,$http, ngDialog, APP_CONFIG,utility) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.editMealType = function(data){
    	var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/editMealsTypeDialog.html",
            className:'ngdialog-theme-default',
            scope: $scope,
            data: data
        });  
        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };


    vm.addMealType = function(){
      var newMealType = {
        "Name": vm.MealTypeTitle
      };
      $http({
          method: 'POST',
          contentType:'application/json',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL +"/api/mealtype",
          data: newMealType
      }).
      success(function(data) {
          console.log("Success adding cost center");
          vm.getAllMealTypes();
          vm.MealTypeTitle = "";
      }).
      error(function(data, status, headers, config) {
          console.log("Error adding cost center");
      });
    };

    vm.saveMealType = function(data){
        var editCCenter = {
            "Name": data.Name,
        };
        $http({
                method: 'PUT',
                data: editCCenter,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL +"/api/mealtype/" + data.ID
            }).
            success(function(data) {
                console.log("Success editing meal type");
                vm.getAllMealTypes();
            }).
            error(function(data, status, headers, config) {
                console.log("Error editing meal type");
            });

    };

    vm.getAllMealTypes = function(user){
        utility.getMealTypes().then(function(result) {
            vm.allMealTypes = result.data;
        });
    };


    vm.openRemoveDialog = function(data){
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/removeDialog.html",
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.removeItem = function(mealTypeId){
        $http({
            method:"DELETE",
            url: APP_CONFIG.BASE_URL +"/api/mealtype/"+ mealTypeId,
            crossDomain: true
        }).success(function(data){
            console.log("Successfully deleted meal type");
            vm.getAllMealTypes();
        }).error(function(data){
            console.log(data);
        });
    };

    vm.getAllMealTypes();
  });
