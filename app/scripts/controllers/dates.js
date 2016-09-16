'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:DatesCtrl
 * @description
 * # DatesCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('DatesCtrl', function ($scope, $filter, $http, MaterialCalendarData,APP_CONFIG) {
  	var numFmt = function(num) {
        num = num.toString();
        if (num.length < 2) {
            num = "0" + num;
        }
        return num;
    };

    var vm = this;

    vm.dates = [];//keep the dates that were set as holidays
    vm.dateObjectList = [];//keep list of dates objest that are set as holidays

    vm.selectedDate = [];
    vm.firstDayOfWeek = 1;
    vm.setDirection = function(direction) {
      vm.direction = direction;
    };
    	
    vm.dayClick = function(date) {
      //vm.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
      if(vm.dates[date]==undefined)
      	vm.dates[date] = 0;
      vm.setOpen(date);
      //console.log(vm.dates);
    };
    vm.prevMonth = function(data) {
      //vm.msg = "You clicked (prev) month " + data.month + ", " + data.year;
    };
    vm.nextMonth = function(data) {
      //$scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
    };
    vm.setDayContent = function(date,content="") {
    	return content;
    };
	
    vm.setOpen = function(date) {
    	//check if the date is already set as Holiday, if not add the date as holiday to the list
	    if(vm.dates[date] == 0) {
	    	vm.dates[date] = 1;

	      	vm.dateObjectList.push({date:new Date(date)});
		    MaterialCalendarData.setDayContent(date, '<p>Празник</p>');
	    } else {
			vm.dates[date] = 0;
	      //remove the date that was set as Holiday from the list of dates
	      	var tempObjectList = vm.dateObjectList.filter(function(el) {
		      	if(el.date !== $filter("date")(date, "dd.MM.y"))
			    	return el;
			});
			vm.dateObjectList = tempObjectList;
	      	MaterialCalendarData.setDayContent(date, '<p></p>');
	      	
	    }

        //console.log(vm.dateObjectList);
	};

	vm.saveDates = function(){
		$http({
            method: 'POST',
            data: vm.dateObjectList,
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL +"/api/dates"
        }).
        success(function(data) {
            console.log("Success inserting dates");
        }).
        error(function(data, status, headers, config) {
            console.log("Error inserting dates");
        });
	};

	vm.getAllDates = function(){
		$http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL +"/api/dates"
        }).
        success(function(data) {
            console.log("Success getting dates");
            vm.dateObjectList = data;
            //need to set vm.dates list
        }).
        error(function(data, status, headers, config) {
            console.log("Error getting dates");
        });
	};

	vm.sortDates = function(){
		var tempList = $filter('orderBy')(vm.dateObjectList, "date");
		vm.dateObjectList = tempList;
	};

	//vm.getAllDates();
  });
