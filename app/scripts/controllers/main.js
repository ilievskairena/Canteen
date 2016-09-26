'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MainCtrl', function ($http, utility) {
    var vm = this;


    vm.getCostCenters = function(){
        utility.getAllCostCenters().then(function(result) {
            vm.costCeters = result.data.length;
        });
    };

    vm.getUsers = function(){
        utility.getUsers().then(function(result) {
            vm.users = result.data.length;
        });
    };

    vm.getCostCenters();
    vm.getUsers();
  });
