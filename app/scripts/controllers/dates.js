'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:DatesCtrl
 * @description
 * # DatesCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('DatesCtrl', function ($scope, $filter, $http, MaterialCalendarData, APP_CONFIG, ngTableParams) {
    var vm = this;

    //Keep the dates that were set as holidays
    vm.dates = [];
    //Keeps list of dates objest that are set as holidays
    vm.dateObjectList = [];

    vm.selectedDate = [];
    vm.firstDayOfWeek = 1;

    vm.setDirection = function(direction) {
      vm.direction = direction;
    };
    	
    vm.dayClick = function(date) {
      //vm.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
      if(vm.dates[date]==undefined)
      	vm.dates[date] = 0;
      //console.log(date);
      vm.setOpen(date);
      //console.log(vm.dates);
    };

    vm.dates = [{

    },{

    },{

    }]

    vm.setDayContent = function(date,content="") {
        //console.log(date.dayOfTheWeek);
        if(date.getDay() == 0 || date.getDay() == 6) 
            content = '<p>Викенд</p>';
    	return content;
    };
	
    vm.setOpen = function(date) {
        console.log(date);
        console.log(vm.dates);
    	//check if the date is already set as Holiday, if not add the date as holiday to the list
	    if(vm.dates[date] == 0) {
	    	vm.dates[date] = 1;

	      	vm.dateObjectList.push({date:$filter('date')(new Date(date), "yyyy-MM-dd HH:mm:ss.sss")});
		    MaterialCalendarData.setDayContent(date, '<p>Празник</p>');
	    } else {
			vm.dates[date] = 0;
	      //remove the date that was set as Holiday from the list of dates
	      	var tempObjectList = vm.dateObjectList.filter(function(el) {
		      	if(el.date !== $filter("date")(date, "dd.MM.y"))
			    	return el;
			});
			vm.dateObjectList = tempObjectList;
            if(date.getDay() == 0 || date.getDay() == 6) {
                MaterialCalendarData.setDayContent(date, '<p>Викенд</p>');
            }
            else
	      	    MaterialCalendarData.setDayContent(date, '<p></p>');
	      	
	    }
        console.log(vm.dates);
        //console.log(vm.dateObjectList);
	};

	vm.saveDates = function(){
		vm.sortDates();
		console.log(vm.dateObjectList);
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
            vm.dates = [];

            for(var i in data) {
                var dateObj = data[i];
                var date = new Date(dateObj.Date);
                date.setHours(0);
                date.setMinutes(0);
                date.setSeconds(0);
                vm.dates[date] = 1;
                MaterialCalendarData.setDayContent(date, '<p>Празник</p>');
            }

            vm.datesTable = new ngTableParams({
                page: 1,
                count: 10
            }, {
                total: vm.dates.length,
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

	vm.getAllDates();
  });
