'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:WorkerplanningCtrl
 * @description
 * # WorkerplanningCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
.controller('WorkerplanningCtrl', function ($rootScope, roleService, utility, $location, ngProgressFactory, $filter, $http, APP_CONFIG) {

    var vm = this;
	$rootScope.isLogin = false;
	if(!utility.isAuthenticated()) {
	    $location.path('/login');
	}
	vm.loggedInUser = utility.getLoggedInUser();
	var path = $location.path();
	if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

	vm.progressBar = ngProgressFactory.createInstance();
	vm.users = null;

	var tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    var endDate = new Date();
    endDate.setDate(endDate.getDate() + 5)
    vm.dateOptions = {
	    formatYear: 'yyyy',
	    maxDate: endDate,
	    minDate: tomorrow,
	    startingDay: 1
  	};

    vm.date = {
    	selected: null,
    	open: false
    };

    vm.openDate = function() {
    	vm.date.open = !vm.date.open;
    };


    vm.getMealsForDay = function() {
    	vm.showMealChoices = null;
      	vm.progressBar.setColor('#8dc63f');
      	vm.progressBar.start();
      	var date = $filter("date")(vm.date.selected, "yyyy-MM-dd HH:mm:ss.sss");
    	$http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" +  date + "&dateTo=" + date
	    }).
	    success(function(data) {
	        vm.step = 1;
	        vm.meals = data[0];
	        vm.progressBar.complete();
      	}).
      	error(function(data, status, headers, config) {
      		if(status === 404)
          		toastr.info("За овој ден не се пронајдени оброци. Обратете се до администрацијата да се внесе мени!");
      		else toastr.error("Грешка при преземање на податоците!");
          	vm.progressBar.reset();
      	});
    };
});
