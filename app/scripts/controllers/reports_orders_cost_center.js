'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:ReportsOrdersCostCenterCtrl
 * @description
 * # ReportsOrdersCostCenterCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('ReportsOrdersCostCenterCtrl', function ($rootScope,$filter, roleService, $location, $scope, $http, APP_CONFIG,toastr, utility,ngProgressFactory,ngTableParams) {
    
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
    vm.costCenters =[];

    //for dates form
    vm.dateOptions = {
        formatYear: 'yyyy',
        maxDate: new Date(2020, 5, 22),
        minDate: new Date(2016, 1, 1),
        startingDay: 1
    };

    vm.dateFrom = {
        selected: ((new Date()).setDate((new Date()).getDate() - 20)),
        open: false

    };

    vm.dateTo = {
        selected: ((new Date()).setDate((new Date()).getDate() + 20)),
        open: false
    };

	vm.GetOrdersPerCostCenter = function(){
		vm.progressBar.setColor('#8dc63f');
	    vm.progressBar.start();
    	var dateF = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	var dateT = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");

    	var params = {
        	dateFrom : dateF,
        	dateTo: dateT,
    	};

    	if(vm.costCenter != null && vm.costCenter != undefined && vm.costCenter != "")
    		params.costCenterID = vm.costCenter;

		$http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_orders_cost_center,
            params: params
        }).
        success(function(data) {
        	vm.progressBar.complete();
            vm.orders = data;

            for(var i in data) {
            	var date = data[i];
            	var total = 0;
            	for(var j in date.CostCenters) {
            		var center = date.CostCenters[j];

            		var centerSpan = center.ShiftOne.length + center.ShiftTwo.length + center.ShiftTwo.length;
            		center.span = centerSpan;
            		total += centerSpan;
            	}
                date.span = total;
            }

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

    vm.getCostCenters = function(){
    	$http({
	          method: 'GET',
	          crossDomain: true,
	          url:  APP_CONFIG.BASE_URL + APP_CONFIG.costcenter
	    }).
	    success(function(data) {/*
	        console.log("Success getting cost centers");*/
	        vm.costCenters = data;
	    }).
	    error(function(data, status, headers, config) {
	        console.log("Error getting cost centers");
	    });
    };
	
	vm.getCostCenters();
  });
