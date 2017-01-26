(function(){
  'use strict';

/**
 * @ngdoc directive
 * @name canteenApp.directive:header
 * @description
 * # header
 */

 /* jshint latedef:nofunc */
 
  angular.module('canteenApp')
  .directive('header', header);

   function header() {
    return {
      templateUrl:'scripts/directives/header.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope, localStorageService, roleService, AuthenticationService, $location, $rootScope){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 1;

        $scope.userName = $rootScope.userName;
        $scope.role = $rootScope.roleName;
        $scope.roleId = $rootScope.roleId;

        $scope.check = function(x){

          if(x === $scope.collapseVar){
            if(x > 9) {
              $scope.collapseVar = x/10;
            }
            else{
                $scope.collapseVar = 0;
            } 
          }
          else {
            $scope.collapseVar = x;
          }
        };

        $scope.logout = function() {
          AuthenticationService.logOut();
        };

        $scope.hasPermission = function(route) {
          return roleService.hasPermission(route, $rootScope.roleId);
        };
      }
    };
  }
})();