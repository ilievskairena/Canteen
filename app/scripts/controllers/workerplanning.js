'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:WorkerplanningCtrl
 * @description
 * # WorkerplanningCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
.controller('WorkerplanningCtrl', function ($rootScope, roleService, toastr, utility, $location, ngProgressFactory, $filter, $http, APP_CONFIG, $route) {

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
    //minDate: tomorrow,
    startingDay: 1
	};

  vm.date = {
  	selected: null,
  	open: false
  };

  vm.meals = {
    firstShift: null,
    secondShift: null,
    thirdShift: null
  };

  vm.model = {
    dateId: null,
    firstShift: {
      count: null,
      mealId: null
    },
    secondShift: {
      count: null,
      mealId: null
    },
    thirdShift: {
      count: null,
      mealId: null
    },
  };  

  vm.original = {
    dateId: null,
    firstShift: {
      count: null,
      mealId: null
    },
    secondShift: {
      count: null,
      mealId: null
    },
    thirdShift: {
      count: null,
      mealId: null
    },
  };  



  vm.openDate = function() {
  	vm.date.open = !vm.date.open;
  };


  vm.getMealsForDay = function() {
    vm.progressBar.setColor('#8dc63f');
    vm.progressBar.start();
    var date = $filter("date")(vm.date.selected, "yyyy-MM-dd HH:mm:ss.sss");

  	$http({
      method: 'GET',
      crossDomain: true,
      url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" +  date + "&dateTo=" + date
    }).
    success(function(data) {
      vm.model.dateId = data[0].DateId;
      vm.original.dateId = data[0].DateId;
      vm.step = 1;
      vm.meals.firstShift = $filter('filter')(data[0].Meals, { Shift: 1 });
      vm.meals.secondShift = $filter('filter')(data[0].Meals, { Shift: 2 });
      vm.meals.thirdShift = $filter('filter')(data[0].Meals, { Shift: 3 });
      vm.progressBar.complete();
      utility.getWorkerOrders(date).then(function(data){
        vm.unboxData(data);
      }).
      catch(function(data) {
        vm.original = {
          dateId: null,
          firstShift: {
            count: null,
            mealId: null
          },
          secondShift: {
            count: null,
            mealId: null
          },
          thirdShift: {
            count: null,
            mealId: null
          },
        };  
      });
  	}).
  	error(function(data, status, headers, config) {
  		if(status === 404)
    		toastr.info("За овој ден не се пронајдени оброци. Обратете се до администрацијата да се внесе мени!");
  		else toastr.error("Грешка при преземање на податоците!");
      	vm.progressBar.reset();
  	});
  };

  vm.unboxData = function(data) {
    vm.model.firstShift.count = data.firstCount;
    vm.model.secondShift.count = data.secondCount;
    vm.model.thirdShift.count = data.thirdCount;
    vm.model.firstShift.mealId = data.firstMealId;
    vm.model.secondShift.mealId = data.secondMealId;
    vm.model.thirdShift.mealId = data.thirdMealId;
    //If there are any orders, then make a copy to distinct whether the submit is POST or PUT
    vm.original.firstShift.count = data.firstCount;
    vm.original.secondShift.count = data.secondCount;
    vm.original.thirdShift.count = data.thirdCount;
    vm.original.firstShift.mealId = data.firstMealId;
    vm.original.secondShift.mealId = data.secondMealId;
    vm.original.thirdShift.mealId = data.thirdMealId;
  };

  vm.boxData = function() {
    return {
      DateId: vm.model.dateId,
      firstCount: vm.model.firstShift.count == null ? 0 : vm.model.firstShift.count,
      firstMealId: vm.model.firstShift.mealId == null ? 0 : vm.model.firstShift.mealId,
      secondCount: vm.model.secondShift.count == null ? 0 : vm.model.secondShift.count,
      secondMealId: vm.model.secondShift.mealId == null ? 0 : vm.model.secondShift.mealId,
      thirdCount: vm.model.thirdShift.count == null ? 0 : vm.model.thirdShift.count,
      thirdMealId: vm.model.thirdShift.mealId == null ? 0 : vm.model.thirdShift.mealId
    };
  };

  vm.hasChange = function() {
    return vm.model.firstShift.count == vm.original.firstShift.count && 
    vm.model.secondShift.count == vm.original.secondShift.count &&
    vm.model.thirdShift.count == vm.original.thirdShift.count &&
    vm.model.firstShift.mealId == vm.original.firstShift.mealId &&
    vm.model.secondShift.mealId == vm.original.secondShift.mealId &&
    vm.model.thirdShift.mealId == vm.original.thirdShift.mealId;
  };

  vm.enableDelete = function() {
    return vm.original.firstShift.count != null && vm.original.secondShift.count != null && vm.original.thirdShift.count != null;
  };

  vm.submit = function() {
    if(!vm.enableDelete() && !vm.hasChange()) {
      vm.insert();
    }
    else vm.edit();
  };

  vm.edit = function() {
    vm.progressBar.start();
    $http({
      method: 'PUT',
      crossDomain: true,
      url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_workers,
      data: vm.boxData()
    }).
    success(function(data) {
      vm.progressBar.complete();
      var date = $filter("date")(vm.date.selected, "yyyy-MM-dd HH:mm:ss.sss");
      toastr.success("Успешно ажурирана нарачка!");
      utility.getWorkerOrders(date).then(function(data){
        vm.unboxData(data);
      }).
      catch(function(data) {
        vm.original = {
          dateId: null,
          firstShift: {
            count: null,
            mealId: null
          },
          secondShift: {
            count: null,
            mealId: null
          },
          thirdShift: {
            count: null,
            mealId: null
          },
        };  
      });
    }).
    error(function(data, status, headers, config) {
      vm.progressBar.reset();
      toastr.error("Грешка при ажурирање на нарачката");
    });
  };

  vm.insert = function() {
    vm.progressBar.start();
    $http({
      method: 'POST',
      crossDomain: true,
      url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_workers,
      data: vm.boxData()
    }).
    success(function(data) {
      vm.progressBar.complete();
      toastr.success("Успешно внесена нарачка");
      var date = $filter("date")(vm.date.selected, "yyyy-MM-dd HH:mm:ss.sss");
      utility.getWorkerOrders(date).then(function(data){
        vm.unboxData(data);
      }).
      catch(function(data) {
        vm.original = {
          dateId: null,
          firstShift: {
            count: null,
            mealId: null
          },
          secondShift: {
            count: null,
            mealId: null
          },
          thirdShift: {
            count: null,
            mealId: null
          },
        };  
      });
    }).
    error(function(data, status, headers, config) {
      vm.progressBar.reset();
      toastr.error("Грешка при бришење на нарачката");
    });
  };

  vm.delete = function() {
    vm.progressBar.start();
    $http({
      method: 'DELETE',
      crossDomain: true,
      url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_workers +'?dateId='+vm.model.dateId
    }).
    success(function(data) {
      vm.progressBar.complete();
      toastr.success("Нарачката е успашно избришана");
      $route.reload()  
    }).
    error(function(data, status, headers, config) {
      vm.progressBar.reset();
      toastr.error("Грешка при бришење на нарачката");
    });
  };
});
