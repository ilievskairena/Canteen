'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:CostcenterCtrl
 * @description
 * # CostcenterCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('CostcenterCtrl', function ($scope, roleService, ngDialog, $http, APP_CONFIG, ngTableParams, toastr, ngProgressFactory) {
    
    var vm = this;

    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

    vm.progressBar = ngProgressFactory.createInstance();
    vm.isEditing = false;
    vm.editIndex = null;
    vm.editModel = null;


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

    vm.insert = function(){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      var newCostCenter = {
        "Name": vm.title,
        "Code": vm.code
      };
      $http({
          method: 'POST',
          contentType:'application/json',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.costcenter,
          data: newCostCenter
      }).
      success(function(data) {
          toastr.success("Успешно додадено трошковно место!")
          vm.getAllCostCenters();
          vm.title = "";
          vm.code = "";
          vm.progressBar.complete();
      }).
      error(function(data, status, headers, config) {
          toastr.error("Грешка при додавање на трошковно место. Ве молиме обидете се повторно!");
          vm.progressBar.reset();
      });
    };

    vm.update = function(){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      var editCCenter = {
          "Name": vm.editModel.Name,
          "Code": vm.editModel.Code
      };
      $http({
          method: 'PUT',
          data: editCCenter,
          contentType:'application/json',
          crossDomain: true,
          url: APP_CONFIG.BASE_URL + APP_CONFIG.costcenter + vm.editModel.ID
      }).
      success(function(data) {
          toastr.success("Успешно променето трошковно место!");
          vm.cancel();
          vm.getAllCostCenters();
          vm.progressBar.complete();
      }).
      error(function(data, status, headers, config) {
          toastr.error("Грешка при промена на трошковно место. Ве молиме обидете се повторно!");
          vm.progressBar.reset();
      });
    };

    vm.getAllCostCenters = function(){
      $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.costcenter
      }).
      success(function(data) {/*
        console.log("Success getting cost centers");*/
        vm.allCostCenters = data;
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
          console.log("Error getting cost centers");
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

    vm.removeItem = function(costCenterId){
      console.log(costCenterId);
      $http({
          method:"DELETE",
          url: APP_CONFIG.BASE_URL + APP_CONFIG.costcenter + "/"+ costCenterId,
          crossDomain: true
          
      }).
      success(function(data){
          toastr.success("Успешно избришано трошковно место!");
          vm.getAllCostCenters();
      }).
      error(function(data){
          toastr.error("Грешка при бришење на трошковното место. Можеби записот е веќе референциран и не може да биде отстранет.");
      });
    };

    vm.getAllCostCenters();

  });
