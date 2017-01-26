(function(){

  'use strict';

/**
 * @ngdoc filter
 * @name canteenApp.filter:shortdate
 * @function
 * @description
 * # shortdate
 * Filter in the canteenApp.
 */

 /* jshint latedef:nofunc */
 
	angular.module('canteenApp')
  	.filter('shortdate', shortdate);

  	shortdate.$inject = [];

  	function shortdate() {

  		var filter = function (input) {
    		var date = new Date(input);
		    var day = date.getDate();
		    var month = date.getMonth() + 1;
		    var year = date.getFullYear();
        var fullYear = day + "." + month + "." + year;
		    return fullYear;
		  };
      
    	return filter;
  	}
})();