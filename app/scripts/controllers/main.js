'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MainCtrl', function ($http, utility, $rootScope, $location, roleService, AuthenticationService) {
    var vm = this;

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
        $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

    vm.getCostCenters = function(){
        utility.getAllCostCenters().then(function(result) {
            vm.costCeters = result.data.length;
        },
        function(error) {
            AuthenticationService.logOut();
        });
    };

    vm.getUsers = function(){
        utility.getUsers().then(function(result) {
            vm.users = result.data.length;
        },
        function(error) {
            AuthenticationService.logOut();
        });
    };

    vm.getCostCenters();
    vm.getUsers();
  });
