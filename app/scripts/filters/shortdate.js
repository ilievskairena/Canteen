'use strict';

/**
 * @ngdoc filter
 * @name canteenApp.filter:shortdate
 * @function
 * @description
 * # shortdate
 * Filter in the canteenApp.
 */
angular.module('canteenApp')
  .filter('shortdate', function () {
    return function (input) {
      	var date = new Date(input);
	    var day = date.getDate();
	    var month = date.getMonth() + 1;
	    var year = date.getFullYear();
	    return day + "." + month + "." +year;
    };
  });
