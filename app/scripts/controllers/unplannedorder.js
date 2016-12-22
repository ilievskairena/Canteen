'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:UnplannedorderCtrl
 * @description
 * # UnplannedorderCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('UnplannedorderCtrl', function ($rootScope, roleService, $location, $scope, $filter, utility, ngDialog, $http, APP_CONFIG, ngTableParams, toastr, ngProgressFactory) {
    
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
    /*
	0 - Choose date
	1 - Choose person
	2 - Choose shift
	3 - Choose meal
    */
  vm.step = 0;
  vm.meals = null;
  vm.shift = null;
  vm.selectedMeal = null;
	vm.numberWorker = null;
	vm.isInsert = true;

	//How many orders there are to delete (Sync requests)
	vm.deleteCount = 0;
	//Has an error occurred
	vm.hasError = false;
	//Flag whether to send a request
	vm.sendRequest = false;

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

    vm.personChange = function() {
    	vm.step = 2;
    	vm.selectedMeal = null;
    	vm.getOrder();
    };

    //OnShiftChange Event
    $scope.$watch('vm.shift', function(oldValue, newValue) {
    	if(oldValue != newValue) {
	    	vm.selectedMeal = null;
	    	if(vm.order != null && vm.order != undefined) {
	    		for(var i in vm.meals.Meals) {
	    			var meal = vm.meals.Meals[i];
	    			if(meal.MealID == vm.order[0].MealPerDayID){
	    				vm.selectedMeal = meal;
	    				break;
	    			}
	    		}
	    	}
    	}
    });

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

    vm.selectMeal = function(meal) {
    	vm.selectedMeal = meal;
    	vm.step = 4;	
    };

    vm.getOrder = function() {
    	vm.showMealChoices = null;
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      
      var url = APP_CONFIG.BASE_URL + APP_CONFIG.orders_existing;
      url += "?dateId=" + vm.meals.DateId;
      if(vm.person.ID != 0) url += "&userId=" + vm.person.ID;
    	$http({
          method: 'GET',
          crossDomain: true,
          url:  url
	    }).
	    success(function(data) {
	    	vm.order = data;
	      vm.progressBar.complete();
	    	vm.step = 4;
	    	if(vm.person.ID == 0) {
	    		vm.numberWorker = data.length;
	    	}
	    	vm.shift = data[0].Shift;
	    	vm.isInsert = false;
      	}).
      error(function(data, status, headers, config) {
      	if(status != 500) {
	    		vm.step = 3;
	    		vm.isInsert = true;
       	}
      	else toastr.error("Грешка при преземање на податоци за нарачка. Ве молиме обратете се кај администраторот!");
        vm.progressBar.reset();
      });
    };

    vm.insert = function() {
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
    	var data = {
    		IsWorker: vm.person.ID == 0,
    		UserID: vm.person.ID,
    		DateID: vm.meals.DateId,
    		MealPerDayID: vm.selectedMeal.MealID,
    		Shift: parseInt(vm.shift),
    		Count: parseInt(vm.numberWorker)
    	};
    	$http({
            method: 'POST',
            data: data,
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.unplanedMeal
        }).
        success(function(data) {
        	vm.progressBar.complete();
        	vm.reset();
            toastr.success("Нарачката е успешно внесена!");
        }).
        error(function(data, status, headers, config) {
            vm.progressBar.reset();
            toastr.error("Грешка при внес на нарачката. Обратете се кај администраторот.")
        });
    };

    vm.update = function() {
		  vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
    	var data = {
    		OrderID: vm.order[0].OrderID,
    		IsWorker: vm.person.ID == 0,
    		UserID: vm.person.ID,
    		DateID: vm.meals.DateId,
    		MealPerDayID: vm.selectedMeal.MealID,
    		Shift: parseInt(vm.shift),
    		Count: parseInt(vm.numberWorker)
    	};
    	$http({
            method: 'PUT',
            data: data,
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.unplanedMeal
        }).
        success(function(data) {
        	vm.progressBar.complete();
        	vm.reset();
            toastr.success("Нарачката е успешно внесена!");
        }).
        error(function(data, status, headers, config) {
            vm.progressBar.reset();
            toastr.error("Грешка при внес на нарачката. Обратете се кај администраторот.")
        });
    };

    vm.delete = function(orderId) {
    	$http({
          	method:"DELETE",
          	url: APP_CONFIG.BASE_URL + APP_CONFIG.orders_delete + orderId,
          	crossDomain: true
      	}).
      	success(function(data){
      		vm.deleteCount--;
      		if(vm.deleteCount < 0) {
	    		if(vm.hasError){
		    		vm.progressBar.reset();
		    		toastr.error("Се случи грешка при бришење на нарачката. Можеби постојат нарачки за ангажирани работници, ве молиме обратете се кај администраторот!");
		    	}
		    	else {
		    		vm.progressBar.complete();
		    		toastr.success("Успешно е избришана нарачката!")
		    	}
		    	vm.reset();
	    	}
			else vm.delete(vm.order[vm.deleteCount].OrderID);
      	}).
      	error(function(data){
          	vm.hasError = true;
      		vm.deleteCount--;
      		if(vm.deleteCount < 0) {
	    		if(vm.hasError){
		    		vm.progressBar.reset();
		    		toastr.error("Се случи грешка при бришење на нарачката. Можеби постојат нарачки за ангажирани работници, ве молиме обратете се кај администраторот!");
		    	}
		    	else {
		    		vm.progressBar.complete();
		    		toastr.success("Успешно е избришана нарачката!")
		    	}
		    	vm.reset();
	    	}
			else vm.delete(vm.order[vm.deleteCount].OrderID);
       	});
    };

    vm.removeItem = function() {
    	console.log(vm.order);
		  vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
    	
		  vm.deleteCount = vm.order.length - 1;
		  vm.delete(vm.order[vm.deleteCount].OrderID);
    };

    vm.confirmDelete = function() {
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/removeDialog.html",
            scope: $scope,
            data: null
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.reset = function() {
    	vm.step = 0;
    	vm.person = null;
    	vm.selectedMeal = null;
    	vm.shift = null;
    	vm.numberWorker = null;
    	vm.date.selected = null;
    };

    utility.getUsers().then(function(result) {
        vm.users = result.data;
        /*vm.users.splice(0, 0, {
        	ID: 0,
    			Name: "Ангажиран работник",
    			Username: "",
    			CostCenterID: 0,
    			CostCenterName: "",
    			PersonNumber: "",
    			IsEmployee: null,
    			RoleID: null,
    			RoleName: "",
    			CardNumber: "",
    			CardType: "",
    			CardID: null,
    			IsActive: null
        });*/
    });

  });
