'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MenuspercategoryCtrl
 * @description
 * # MenuspercategoryCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MenuspercategoryCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

    var vm = this;

    vm.daysOfTheWeek = function(){
    	return weekday;
    };
    var weekday = new Array(7);
	weekday[0]=  "Понеделник";
	weekday[1] = "Вторник";
	weekday[2] = "Среда";
	weekday[3] = "Четврток";
	weekday[4] = "Петок";
	weekday[5] = "Сабота";
	weekday[6] = "Недела";

  });
