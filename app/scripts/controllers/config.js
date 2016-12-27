'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:ConfigCtrl
 * @description
 * # ConfigCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
.controller('ConfigCtrl', function ($http, $filter, $location, $rootScope, roleService, utility, toastr, ngProgressFactory, APP_CONFIG) {
    var vm = this;

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
        $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

    vm.progressBar = ngProgressFactory.createInstance();
    vm.meals = null;
    vm.config = {
    	id: 1,
    	firstShift: null,
    	secondShift: null,
    	thirdShift: null,
      mealId: null
    };

    vm.returnDateTime = function(timeString) {
    	var timeArray = timeString.split(":");
    	var d = new Date();
	    d.setHours(parseInt(timeArray[0]));
	    d.setMinutes(parseInt(timeArray[1]));
	    return d;
    };

    vm.getConfig = function() {
    	utility.getConfig().then(function(response) {
	    	vm.config.firstShift = vm.returnDateTime(response.data.firstShiftStart);
	    	vm.config.secondShift = vm.returnDateTime(response.data.secondShiftStart);
	    	vm.config.thirdShift = vm.returnDateTime(response.data.thirdShiftStart);
        vm.config.mealId = response.data.defaultMeal;//$filter('filter')(vm.meals, { MealID: response.data.defaultMeal});
	    });
    };

    vm.getMeals = function() {
      $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals
      }).
      success(function(data) {/*
          console.log("Success getting cost centers");*/
          console.log(data);
          vm.meals = data;
          vm.getConfig();
          
      }).
      error(function(data, status, headers, config) {
          console.log("Error getting meals");
      });
    };
    
    vm.save = function() {
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      vm.config.firstShift = $filter("date")(vm.config.firstShift, "yyyy-MM-dd HH:mm:ss.sss");
      vm.config.secondShift = $filter("date")(vm.config.secondShift, "yyyy-MM-dd HH:mm:ss.sss");
      vm.config.thirdShift = $filter("date")(vm.config.thirdShift, "yyyy-MM-dd HH:mm:ss.sss");
		  $http({
          	method: 'POST',
          	contentType:'application/json',
          	crossDomain: true,
          	url:  APP_CONFIG.BASE_URL + APP_CONFIG.config_save,
          	data: vm.config
      	}).
      	success(function(data) {
          	toastr.success("Успешно зачувана конфигурација!")
          	vm.getConfig();
          	vm.progressBar.complete();
      	}).
      	error(function(data, status, headers, config) {
          	toastr.error("Грешка при зачувување. Ве молиме обидете се повторно!");
          	vm.progressBar.reset();
      	});
    };
    vm.getMeals();
});
