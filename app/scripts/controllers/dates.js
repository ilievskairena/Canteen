'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:DatesCtrl
 * @description
 * # DatesCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('DatesCtrl', function ($rootScope, roleService, $location, $scope, $filter, $http, MaterialCalendarData, APP_CONFIG, ngTableParams, toastr, utility) {
    var vm = this;

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
        $location.path('/login');
    }

    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

    //Keep the dates that were set as holidays
    vm.dates = [];
    //Keeps list of dates objest that are set as holidays
    vm.dateObjectList = [];

    //Original GET data
    vm.originalData = [];
    //Flag whether there were changes to the holiday list
    vm.changes = false;
    vm.watchArrays = false;
    //Keeps the current year and the next
    var today = new Date();
    vm.selectedYear = today.getFullYear();
    vm.availableYears = [today.getFullYear(), (today.getFullYear()+1)];



    vm.setDirection = function(direction) {
      vm.direction = direction;
    };
    	
    vm.dayClick = function(date) {
      if(vm.dates[date]==undefined)
      	vm.dates[date] = 0;
      vm.setOpen(date);
    };

    vm.setDayContent = function(date,content="") {
        //console.log(date.dayOfTheWeek);
        if(date.getDay() == 0 || date.getDay() == 6) 
            content = '<p>Викенд</p>';
    	return content;
    };
	
    vm.setOpen = function(date) {
        //Validate the selected year
        var minDate = new Date();
        minDate.setDate(1);
        minDate.setMonth(0);
        minDate.setFullYear(vm.selectedYear);
        var maxDate = new Date();
        maxDate.setDate(31);
        maxDate.setMonth(12);
        maxDate.setFullYear(vm.selectedYear+1);
        console.log(maxDate);
        if(minDate > date || maxDate < date) {
            toastr.error("Не смеете да внесувате за оваа календарска година. Одберете календарска година од понудените!");
            return;
        }

    	//check if the date is already set as Holiday, if not add the date as holiday to the list
	    if(vm.dates[date] == 0) {
	    	vm.dates[date] = 1;

	      	vm.dateObjectList.push({date:$filter('date')(new Date(date), "yyyy-MM-dd HH:mm:ss.sss")});
		    MaterialCalendarData.setDayContent(date, '<p>Празник</p>');
	    } else {
			vm.dates[date] = 0;
	      //remove the date that was set as Holiday from the list of dates
	      	var tempObjectList = vm.dateObjectList.filter(function(el) {
		      	if(el.date !== $filter("date")(date, "yyyy-MM-dd HH:mm:ss.sss"))
			    	return el;
			});
			vm.dateObjectList = tempObjectList;
            if(date.getDay() == 0 || date.getDay() == 6) {
                MaterialCalendarData.setDayContent(date, '<p>Викенд</p>');
            }
            else
	      	    MaterialCalendarData.setDayContent(date, '<p></p>');
	      	
	    }
        vm.checkChanges();
	};

	vm.saveDates = function(){
        //If the intial request did not return any results
        //then the action must be a POST
		if(vm.originalData.length == 0) {
            vm.createDates();
        }
        //If the initial request had results 
        //then the action must be PUT
        else {
            vm.updateDates();
        }
	};

	vm.getAllDates = function(){
		$http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.dates_by_year + "?year=" + vm.selectedYear
        }).
        success(function(data) {
            vm.dates = [];
            vm.dateObjectList = [];
            vm.originalData = [];

            for(var i in data) {
                var dateObj = data[i];
                var date = new Date(dateObj.Date);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                vm.dates[date] = 1;
                MaterialCalendarData.setDayContent(date, '<p>Празник</p>');
                vm.dateObjectList.push({date:$filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")});
                vm.originalData.push({date:$filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")});
            }

            vm.datesTable = new ngTableParams({
                page: 1,
                count: 10
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
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting dates");
        });
	};

	vm.sortDates = function(){
		var tempList = $filter('orderBy')(vm.dateObjectList, "date");
		vm.dateObjectList = tempList;
	};


    vm.setAvailableYears = function() {
        var currentYear = (new Date()).getFullYear();
        vm.availableYears.push(currentYear);
        vm.availableYears.push(currentYear+1);
        vm.selectedYear = vm.availableYears[0];
    };

    vm.checkChanges = function() {
        vm.changes = !utility.compareArrays(vm.dateObjectList, vm.originalData);
    };


    vm.createDates = function() {
        vm.sortDates();
        console.log(vm.dateObjectList);
        $http({
            method: 'POST',
            data: vm.dateObjectList,
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.dates_insert
        }).
        success(function(data) {
            toastr.success("Податоците се успешно внесени.");
            vm.getAllDates();
        }).
        error(function(data, status, headers, config) {
            console.log("Error inserting dates");
        });
    };

    vm.updateDates = function() {
        vm.sortDates();
        console.log(vm.dateObjectList);
        $http({
            method: 'PUT',
            data: vm.dateObjectList,
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.dates_update
        }).
        success(function(data) {
            toastr.success("Празниците се успешно променети.")
            vm.getAllDates();
        }).
        error(function(data, status, headers, config) {
            console.log("Error inserting dates");
        });
    };

	vm.getAllDates();
  });
