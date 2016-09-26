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
            if(x > 9) {
              $scope.collapseVar = x/10;
            }
            else $scope.collapseVar = 0;
          }
          else {
            $scope.collapseVar = x;
          }
        };
      }
    };
  });
