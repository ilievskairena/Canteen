(function(){
    'use strict';

    /**
     * @ngdoc directive
     * @name canteenApp.directive:onFinishRender
     * @description
     * # onFinishRender
     */

     /* jshint latedef:nofunc */
     
    angular.module('canteenApp')
    .directive('onFinishRender', onFinishRender);

    onFinishRender.$inject = ['$timeout'];

    function onFinishRender($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element, attr) {
                if (scope.$last === true) {
                    $timeout(function () {
                        scope.$emit(attr.onFinishRender);
                    });
                }
            }
        };
    }
})();