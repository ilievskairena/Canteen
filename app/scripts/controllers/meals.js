'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealsCtrl
 * @description
 * # MealsCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MealsCtrl', function ($scope,ngDialog) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.editMeals = function(data){
		var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/editMealsDialog.html",
            className:'ngdialog-theme-default',
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;  
    };
  });
