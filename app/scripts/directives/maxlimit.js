'use strict';

/**
 * @ngdoc directive
 * @name canteenApp.directive:maxLimit
 * @description
 * # maxLimit
 */
angular.module('canteenApp')
  .directive('limitTo', function () {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length == limit) e.preventDefault();
            });
        }
    }
  });
