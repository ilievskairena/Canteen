'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MenupreviewCtrl
 * @description
 * # MenupreviewCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp').controller('MenupreviewCtrl', function (APP_CONFIG, $scope, $http, toastr, $filter, ngTableParams) {
    var vm = this;

 	vm.dateOptions = {
	    formatYear: 'yyyy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(2016, 1, 1),
	    startingDay: 1
  	};

    vm.dateFrom = {
    	selected: new Date(),
    	open: false

    };

    vm.dateTo = {
    	selected: new Date(vm.dateFrom.selected.getFullYear(), vm.dateFrom.selected.getMonth() +2, 1),
    	open: false
    };

    vm.isLoading = false;

    vm.openDateFrom = function() {
    	vm.dateFrom.open = true;
    };

    vm.openDateTo = function() {
    	vm.dateTo.open = true;
    };

    vm.showPreview = function() {
    	var from = $filter("date")(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	var to = $filter("date")(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	vm.isLoading = true;
    	$http({
	        method: 'GET',
	        crossDomain: true,
	        url:  APP_CONFIG.BASE_URL +"/api/meals/MealByDate?dateFrom=" + from.toString() + "&dateTo=" + to.toString()
	      }).
	      success(function(data) {
	          vm.meals = data;
	          //Toggle grouping columns to be collapsed
	          for(var i in data) {
	          	data[i].$hideRows = true;
	          }
	            vm.table = new ngTableParams({
	                page: 1,
	                count: 10,
	                group: "Date"
	            }, {
	                total: data.length,
	                //Hide the count div
	                counts: [],
	                getData: function($defer, params) {
	                    var filter = params.filter();
	                    var sorting = params.sorting();
	                    var count = params.count();
	                    var page = params.page();
	                    //var filteredData = filter ? $filter('filter')(vm.data, filter) : vm.data
	                
	                    $defer.resolve(data.slice((page - 1) * count, page * count));
	                }
	            });
    			vm.isLoading = false;
	      }).
	      error(function(data, status, headers, config) {
    		vm.isLoading = false;
	        toastr.error("Грешка при вчитување на оброците. Освежете ја страната и обидете се повторно!");
	      });
    };
});
