(function(){
    'use strict';

/**
 * @ngdoc directive
 * @name canteenApp.directive:maxLimit
 * @description
 * # maxLimit
 */

 /* jshint latedef:nofunc */
 
    angular.module('canteenApp')
    .directive('limitTo', limitTo);

    limitTo.$inject = [];

    function limitTo() {
    return {
        restrict: "A",
        link: function(scope, elem, attrs) {
            var limit = parseInt(attrs.limitTo);
            angular.element(elem).on("keypress", function(e) {
                if (this.value.length === limit){
                    e.preventDefault();  
                } 
            });
        }
    };
  }
})();