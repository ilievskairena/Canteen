'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:EmployeespershiftCtrl
 * @description
 * # EmployeespershiftCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
.controller('EmployeespershiftCtrl', function ($rootScope, roleService, $location, $scope, $filter, ngDialog, $http, utility, APP_CONFIG, ngTableParams, toastr, ngProgressFactory) {
	var vm = this;

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
        $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

  	vm.progressBar = ngProgressFactory.createInstance();
	vm.employeesPerShift = [];
	vm.costCenters = [];
	vm.availableDates = [];

	vm.model = {
		costCenter: null
	}

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

    vm.getWeekDay = function(dateString) {
    	var days = {
	      1: "Понеделник",
	      2: "Вторник",
	      3: "Среда",
	      4: "Четврток",
	      5: "Петок",
	      6: "Сабота",
	      0: "Недела"
	    };
	    var date = new Date(dateString);
	    return days[date.getDay()];
	};

	vm.toShortDate = function(dateString) {
	    var date = new Date(dateString);
	    var day = date.getDate();
	    var month = date.getMonth() + 1;
	    var year = date.getFullYear();
	    return day + "." + month + "." +year;s
	};

	vm.showAlert = function() {
		if(vm.employeesPerShift.length > 0) {	
			var dateFrom = new Date(vm.employeesPerShift[0].Date);
			var dateTo = new Date(vm.employeesPerShift[vm.employeesPerShift.length - 1].Date);
			vm.dateFrom.selected.setHours(0,0,0,0);
			vm.dateTo.selected.setHours(0,0,0,0);
			dateFrom.setHours(0,0,0,0);
			dateTo.setHours(0,0,0,0);
			console.log(dateFrom);
			console.log(vm.dateFrom.selected);
			console.log(dateTo);
			console.log(vm.dateTo.selected);
			console.log(vm.dateFrom.selected != dateFrom || vm.dateTo.selected != dateTo);
			return vm.dateFrom.selected != dateFrom 
			|| vm.dateTo.selected != dateTo;
		}
		else return false;
	};

    vm.getEmployeesPerShift = function() {
	    vm.progressBar.setColor('#8dc63f');
	    vm.progressBar.start();
    	var dateFrom = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	var dateTo = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");

    	$http({
	        method: 'GET',
	        crossDomain: true,
	        url:  APP_CONFIG.BASE_URL + APP_CONFIG.employees_per_shift_existing + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&centerId=" + vm.model.costCenter
	    }).
	    success(function(data) {
	      	vm.employeesPerShift = data;
	      	vm.progressBar.complete();
	    }).
	    error(function(data, status, headers, config) {
		    if(status == 404) {
		        vm.getDates();
		    }
	    });
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

    vm.formatModel = function() {
    	var model = [];
    	for(var i in vm.employeesPerShift) {
    		var item = vm.employeesPerShift[i];
    		model.push({
    			"CostCenterID":vm.model.costCenter,
    			"DateID": (item.DateID == null || item.DateID == undefined) ? item.ID : item.DateID,
    			"Date":item.Date,
    			"firstShift":item.firstShift,
    			"secondShift":item.secondShift,
    			"thirdShift":item.thirdShift
    		});
    	}
    	return model;
    };

    vm.confirmSave = function() {
    	var confirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/confirmSaveThirdShift.html",
            scope: $scope,
            data: null
        });

        // NOTE: return the promise from openConfirm
        return confirmDialog;   
    };

    vm.save = function() {
    	var data = vm.formatModel();
    	$http({
	        method: 'POST',
	        contentType:'application/json',
	        crossDomain: true,
	        url:  APP_CONFIG.BASE_URL + APP_CONFIG.employeespershift,
	        data: data
	    }).
	    success(function(data) {
	        toastr.success("Успешно креирани нарачки за трета смена!")
	        vm.progressBar.complete();
	        vm.getEmployeesPerShift();
	    }).
	    error(function(data, status, headers, config) {
	        toastr.error("Грешка при креирање на нарачки за трета смена. Ве молиме обидете се повторно!");
	        vm.progressBar.reset();
	    });
    };

    utility.getAllCostCenters().then(function(result) {
    	vm.costCenters = result.data;
    });

    utility.getAvailableDates().then(function(result) {
        vm.availableDates = result.data;
        vm.dateOptions.minDate = new Date(vm.availableDates[0].Date);
        vm.dateOptions.maxDate = new Date(vm.availableDates[1].Date);
    });


});
