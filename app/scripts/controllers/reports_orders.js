'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:ReportsOrdersCtrl
 * @description
 * # ReportsOrdersCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('ReportsOrdersCtrl', function ($rootScope,$filter, roleService, $location, $scope, $http, APP_CONFIG,toastr, utility,ngProgressFactory,ngTableParams,$timeout,Excel,tableService) {
    
    var vm = this;

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
        $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

  	vm.progressBar = ngProgressFactory.createInstance();
    
    vm.Orders = [];
    vm.availableDates = [];

	vm.GetOrdersPerEmployee = function(){
		vm.progressBar.setColor('#8dc63f');
	    vm.progressBar.start();
    	var dateF = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	var dateT = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");

		$http({
	            method: 'GET',
	            crossDomain: true,
	            url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_orders_period,
	            params:
	            {
	            	dateFrom : dateF,
	            	dateTo: dateT
	            }
	        }).
	        success(function(data) {
	        	vm.progressBar.complete();
	            vm.orders = data;
	            vm.table = new ngTableParams({
	              page: 1,
	              count: 5
	            }, {
	              total: data.length,
	              //Hide the count div
	              //counts: [],
	              getData: function($defer, params) {
	                var filter = params.filter();
	                var sorting = params.sorting();
	                var count = params.count();
	                var page = params.page();
	                $defer.resolve(data.slice((page - 1) * count, page * count));
	              }
	          });
	        }).
	        error(function(data, status, headers, config) {
	        	vm.progressBar.reset();
	            toastr.error("Грешка при преземање податоци. Обидете се повторно!");
	        });
	};

	//for dates form

	vm.dateOptions = {
	    formatYear: 'yyyy',
	    maxDate: new Date(2020, 5, 22),
	    minDate: new Date(2016, 1, 1),
	    startingDay: 1
  	};

    vm.dateFrom = {
    	selected: null,
    	open: false

    };

    vm.dateTo = {
    	selected: null,
    	open: false
    };

    vm.openDateFrom = function() {
    	vm.dateFrom.open = !vm.dateFrom.open;
    };

    vm.openDateTo = function() {
    	vm.dateTo.open = !vm.dateTo.open;
    };

    vm.getDates = function() {
    	vm.progressBar.setColor('#8dc63f');
	    vm.progressBar.start();
	    vm.employeesPerShift = [];
    	var dateFrom = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	var dateTo = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	$http({
	        method: 'GET',
	        crossDomain: true,
	        url:  APP_CONFIG.BASE_URL + APP_CONFIG.dates_range + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo
	    }).
	    success(function(data) {
	      	vm.employeesPerShift = data;
	      	vm.progressBar.complete();
	    }).
	    error(function(data, status, headers, config) {
	      	vm.progressBar.reset();
		    if(status == 404) {
		    	toastr.info("Нема внесено датуми. Обратете се на администраторот да внесе година!");
		    }
		    else toastr.error("Грешка при преземање на податоците. Ве молиме обратете се кај администраторот!");
	    });
    };

    //vm.exportToExcel=function(tableId){ // ex: '#my-table'
   //         var exportHref=Excel.tableToExcel(tableId,'WireWorkbenchDataExport');
    //        $timeout(function(){location.href=exportHref;},100); // trigger download
    //    }

    vm.exportToExcel = function(){
        var ord = vm.orders;
        return utility.downloadStatistics(ord, 'All_Orders');
    };   

});
