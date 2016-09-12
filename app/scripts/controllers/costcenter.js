'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:CostcenterCtrl
 * @description
 * # CostcenterCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('CostcenterCtrl', function ($scope, ngDialog, $http, APP_CONFIG) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.editCostCenter = function(data){
        console.log(data);
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/editCostCenterDialog.html",
            className:'ngdialog-theme-default',
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.addCostCenter = function(data){
      var newCostCenter = {
        "Name": data.Title,
        "Code": data.CostCenterNum
      };
      $http({
          method: 'POST',
          contentType:'application/json',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL +"/api/costcenter",
          data: newCostCenter
      }).
      success(function(data) {
          /*console.log("Success adding cost center");*/
          vm.getAllCostCenters();
          /*console.log(data);*/
      }).
      error(function(data, status, headers, config) {
          console.log("Error adding cost center");
      });
    };

    vm.getAllCostCenters = function(){
      $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL +"/api/costcenter"
      }).
      success(function(data) {/*
          console.log("Success getting cost centers");*/
          vm.allCostCenters = data;
      }).
      error(function(data, status, headers, config) {
          console.log("Error getting cost centers");
      });
    };

    vm.openRemoveDialog = function(data){
        console.log(data.ID);
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
            url: APP_CONFIG.BASE_URL +"/api/costcenter/"+ costCenterId,
            crossDomain: true
            
        }).success(function(data){
            console.log("Successfully deleted cost center");
        }).error(function(data){
            console.log(data);
        });
    };

    vm.getAllCostCenters();

  });
