'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealtypeCtrl
 * @description
 * # MealtypeCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MealtypeCtrl', function ($scope,$http, ngDialog, APP_CONFIG, utility, ngTableParams, toastr) {

    var vm = this;
    vm.isEditing = false;
    vm.editModel = null;
    vm.editIndex = null;

    vm.edit = function(row, index){
      vm.editModel = angular.copy(row);
      vm.isEditing = true;
      vm.editIndex = index;
    };

    vm.cancel = function() {
      vm.isEditing = false;
      vm.editModel = null;
      vm.editIndex = null;
    };

    vm.insert = function(){
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
          toastr.success("Успешно додаден тип!");
          vm.getAllMealTypes();
          vm.MealTypeTitle = "";
      }).
      error(function(data, status, headers, config) {
          toastr.error("Грешка при додавање на тип! Ве молиме обидете се повторно.")
      });
    };

    vm.update = function(){
      var mealType = {
          "Name": vm.editModel.Name,
      };
      $http({
          method: 'PUT',
          data: mealType,
          contentType:'application/json',
          crossDomain: true,
          url: APP_CONFIG.BASE_URL +"/api/mealtype/" + vm.editModel.ID
      }).
      success(function(data) {
          toastr.success("Успешно променет тип!");
          vm.cancel();
          vm.getAllMealTypes();
      }).
      error(function(data, status, headers, config) {
          toastr.error("Грешка при промена на тип! Ве молиме обидете се повторно.")
      });
    };

    vm.getAllMealTypes = function(user){
        utility.getMealTypes().then(function(result) {
            vm.allMealTypes = result.data;
            vm.table = new ngTableParams({
                page: 1,
                count: 10
              }, {
                total: result.data.length,
                //Hide the count div
                counts: [],
                getData: function($defer, params) {
                    var filter = params.filter();
                    var sorting = params.sorting();
                    var count = params.count();
                    var page = params.page();
                    //var filteredData = filter ? $filter('filter')(vm.data, filter) : vm.data
                
                    $defer.resolve(result.data.slice((page - 1) * count, page * count));
                }
            });
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
