(function(){

  'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MenuspercategoryCtrl
 * @description
 * # MenuspercategoryCtrl
 * Controller of the canteenApp
 */
 
  angular.module('canteenApp')
  .controller('ThirdShiftPlanCtrl', ThirdShiftPlanCtrl);

  ThirdShiftPlanCtrl.$inject = ['$rootScope', 'roleService', '$location', 'utility', '$scope', '$filter', 'ngDialog', '$http', 'APP_CONFIG', 'ngTableParams', 'toastr', 'ngProgressFactory'];

  function ThirdShiftPlanCtrl($rootScope, roleService, $location, utility, $scope, $filter, ngDialog, $http, APP_CONFIG, ngTableParams, toastr, ngProgressFactory) {

    var vm = this;

    vm.progressBar = ngProgressFactory.createInstance();

    vm.loading = true;
    //Plan
    vm.thirdShiftData = [];
    vm.thirdShiftModel = [];
    //Is POST Method
    vm.isPost = true;

    //Realized
    vm.realizedData = [];
    vm.notRealizedOriginal = 0;
    vm.notRealized = 0;

    // Functions
    vm.getRealized = getRealized;
    vm.getThirdShiftPlan = getThirdShiftPlan;
    vm.getWeekDay = getWeekDay;
    vm.insertPlan = insertPlan;
    vm.toShortDate = toShortDate;
    vm.validateMethod = validateMethod;
    vm.updatePlan = updatePlan;
    vm.updateRealized = updateRealized;

    // Init

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
      $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)){
      $location.path("/");  
    }
    
    getThirdShiftPlan();
    getRealized();

    // Define Functions here

    function getRealized() {  
      vm.notRealizedOriginal = 0;
      vm.notRealized = 0;
      var date = new Date();
      date.setHours(0,0,0,0);
      date.setDate(date.getDate() - 1);
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_realized + "?date=" + $filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")
      }).then(function successCallback(response){
        var data = response.data;
        vm.realizedData = data;
        for(var i in data) {
          var order = data[i];
          if(!order.IsRealized) {
            vm.notRealized++;
            vm.notRealizedOriginal++;
          }
        }
      }, function errorCallback(response){
        if(response.status == 404) {
          vm.realizedData = [];
          vm.notRealized = 0;
          vm.notRealizedOriginal = 0;
        }
      });
    };

    function getThirdShiftPlan() {
      vm.loading = true;
      var date = new Date();
      date.setHours(0,0,0,0);
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_thidshift + "?date=" + $filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")
      }).then(function successCallback(response){
        vm.thirdShiftData = response.data;
        vm.thirdShiftModel = angular.copy(response.data);
        vm.loading = false;
      }, function errorCallback(response){
        if(response.status == 404) {
          vm.thirdShiftData = [];
          vm.loading = false;
        }
      });
    };
    

    function getWeekDay(dateString) {
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

    function insertPlan() {
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      $http({
        method: 'POST',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.thirdShiftPlan,
        data: vm.thirdShiftModel
      }).then(function successCallback(response){
        toastr.success("Успешно креирани нарачки за трета смена!")
        vm.progressBar.complete();
        getThirdShiftPlan();
      }, function errorCallback(response){
        toastr.error("Грешка при креирање на нарачки за трета смена. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
      });
    };

    function toShortDate(dateString) {
      var date = new Date(dateString);
      var day = date.getDate();
      var month = date.getMonth() + 1;
      var year = date.getFullYear();
      return day + "." + month + "." +year;s
    };

    //Checks whether there is a modification of the data
    //Validates whether is POST (true) or PUT(false)
    function validateMethod() {
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

    function updatePlan() {
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
      }).then(function successCallback(response){
        toastr.success("Успешно променети нарачки за трета смена!")
        vm.progressBar.complete();
        getThirdShiftPlan();
      }, function errorCallback(response){
        toastr.error("Грешка при промена на нарачки за трета смена. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
      });
    };

    function updateRealized() {
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
      }).then(function successCallback(response){
        toastr.success("Успешно ажурирани нереализирани оброци!")
        vm.progressBar.complete();
        getRealized();
      }, function errorCallback(response){
        toastr.error("Грешка при промена на нереализирани оброци за трета смена. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
      });
    };
  }
})();

