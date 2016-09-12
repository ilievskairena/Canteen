'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealtypeCtrl
 * @description
 * # MealtypeCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MealtypeCtrl', function ($scope, ngDialog) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;
    vm.editMealType = function(data){
    	var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/editMealsTypeDialog.html",
            className:'ngdialog-theme-default',
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };
  });
