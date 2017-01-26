(function(){

	'use strict';

/**
 * @ngdoc filter
 * @name canteenApp.filter:dayoftheweek
 * @function
 * @description
 * # dayoftheweek
 * Filter in the canteenApp.
 */
 
 /* jshint latedef:nofunc */
 
	angular.module('canteenApp')
  	.filter('dayoftheweek', dayoftheweek);

  	dayoftheweek.$inject = ['$filter'];

  	function dayoftheweek($filter) {

	  	var filter = function (input){
	  		var days = {
		      1: "Понеделник",
		      2: "Вторник",
		      3: "Среда",
		      4: "Четврток",
		      5: "Петок",
		      6: "Сабота",
		      0: "Недела"
		    };
		    var dateString = $filter('date')(input, "yyyy-MM-dd HH:mm:ss.sss");
		    var date = new Date(dateString);
		    return days[date.getDay()];
	  	};

	    return filter;
  	}
})();