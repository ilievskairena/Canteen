'use strict';

/**
 * @ngdoc directive
 * @name canteenApp.directive:header
 * @description
 * # header
 */
angular.module('canteenApp')
  .directive('header', function () {
    return {
      templateUrl:'scripts/directives/header.html',
      restrict: 'E',
      replace: true,
      scope: {
      },
      controller:function($scope){
        $scope.selectedMenu = 'dashboard';
        $scope.collapseVar = 1;
        
        $scope.check = function(x){
          
          if(x === $scope.collapseVar){
            $scope.collapseVar = 0;
          }
          else {
            $scope.collapseVar = x;
          }
        };
      }
    };
  });
