'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MenuspercategoryCtrl
 * @description
 * # MenuspercategoryCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('ThirdShiftPlanCtrl', function ($rootScope, roleService, $location, utility, $scope, $filter, ngDialog, $http, APP_CONFIG, ngTableParams, toastr, ngProgressFactory) {
  
  var vm = this;

  $rootScope.isLogin = false;
  if(!utility.isAuthenticated()) {
      $location.path('/login');
  }
  vm.loggedInUser = utility.getLoggedInUser();
  var path = $location.path();
  if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");
  
  vm.progressBar = ngProgressFactory.createInstance();
  //Plan
  vm.thirdShiftData = [];
  vm.thirdShiftModel = [];
  //Is POST Method
  vm.isPost = true;

  //Realized
  vm.realizedData = [];
  vm.notRealizedOriginal = 0;
  vm.notRealized = 0;

  vm.getThirdShiftPlan = function() {  
    var date = new Date();
    date.setHours(0,0,0,0);
    $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_thidshift + "?date=" + $filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")
    }).
    success(function(data) {
      vm.thirdShiftData = data;
      vm.thirdShiftModel = angular.copy(data);
    }).
    error(function(data, status, headers, config) {
      if(status == 404) {
        vm.thirdShiftData = [];
      }
    });
  };

  vm.getRealized = function() {  
    vm.notRealizedOriginal = 0;
    vm.notRealized = 0;
    var date = new Date();
    date.setHours(0,0,0,0);
    date.setDate(date.getDate() + 8);
    $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_realized + "?date=" + $filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")
    }).
    success(function(data) {
      vm.realizedData = data;
      for(var i in data) {
        var order = data[i];
        if(!order.IsRealized) {
          vm.notRealized++;
          vm.notRealizedOriginal++;
        }
      }
    }).
    error(function(data, status, headers, config) {
      if(status == 404) {
        vm.realizedData = [];
        vm.notRealized = 0;
        vm.notRealizedOriginal = 0;
      }
    });
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

  //Checks whether there is a modification of the data
  //Validates whether is POST (true) or PUT(false)
  vm.validateMethod = function() {
    var result = true;
    for(var i = 0; i < vm.thirdShiftData.length; i++) {
      var dateOriginal = vm.thirdShiftData[i];
      var dateModel = vm.thirdShiftModel[i];
      if(dateOriginal.Count !== dateModel.Count) {
        result = false;
        break;
      }
      else if (dateOriginal.Note !== dateModel.Note) {
        result = false;
        break;
      }
      else if(dateOriginal.Count !== 0) {
        result = false;
        break;
      }
      else if(dateOriginal.Node !== "") {
        result = false;
        break;
      }
    }
    return result;
  };

  //Validate
  vm.insertPlan = function() {
    vm.progressBar.setColor('#8dc63f');
    vm.progressBar.start();
    $http({
        method: 'POST',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.thirdShiftPlan,
        data: vm.thirdShiftModel
    }).
    success(function(data) {
        toastr.success("Успешно креирани нарачки за трета смена!")
        vm.progressBar.complete();
        vm.getThirdShiftPlan();
    }).
    error(function(data, status, headers, config) {
        toastr.error("Грешка при креирање на нарачки за трета смена. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
    });
  };

  vm.updatePlan = function() {
    vm.progressBar.setColor('#8dc63f');
    vm.progressBar.start();
    var date = new Date();
    date.setHours(0,0,0,0);
    $http({
        method: 'PUT',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.thirdShiftPlan + "?date=" + $filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss"),
        data: vm.thirdShiftModel
    }).
    success(function(data) {
        toastr.success("Успешно променети нарачки за трета смена!")
        vm.progressBar.complete();
        vm.getThirdShiftPlan();
    }).
    error(function(data, status, headers, config) {
        toastr.error("Грешка при промена на нарачки за трета смена. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
    });
  };

  vm.updateRealized = function() {
    vm.progressBar.setColor('#8dc63f');
    vm.progressBar.start();
    var date = new Date();
    date.setDate(date.getDate() + 8);
    date.setHours(0,0,0,0);
    $http({
        method: 'PUT',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_realized + "?count=" + vm.notRealized + "&date=" + $filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss"),
        data: []
    }).
    success(function(data) {
        toastr.success("Успешно ажурирани нереализирани оброцис!")
        vm.progressBar.complete();
        vm.getRealized();
    }).
    error(function(data, status, headers, config) {
        toastr.error("Грешка при промена на нереализирани оброци за трета смена. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
    });
  };

  vm.getThirdShiftPlan();
  vm.getRealized();
});
