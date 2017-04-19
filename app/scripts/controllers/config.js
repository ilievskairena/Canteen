(function(){
  'use strict';
  /**
  * @ngdoc function
  * @name canteenApp.controller:ConfigCtrl
  * @description
  * # ConfigCtrl
  * Controller of the canteenApp
  */

  /* jshint latedef:nofunc */
  angular.module('canteenApp')
  .controller('ConfigCtrl', ConfigCtrl);

  ConfigCtrl.$inject = ['$http', '$filter', '$location', '$rootScope', 'roleService', 'utility', 'toastr', 'ngProgressFactory', 'APP_CONFIG'];

  function ConfigCtrl($http, $filter, $location, $rootScope, roleService, utility, toastr, ngProgressFactory, APP_CONFIG) {
/* jshint validthis: true */
    var vm = this;

    vm.progressBar = ngProgressFactory.createInstance();
    vm.meals = null;
    vm.config = {
      id: 1,
      firstShift: null,
      secondShift: null,
      thirdShift: null,
      mealId: null
    };

    // Functions
    vm.getConfig = getConfig;
    vm.getMeals = getMeals;
    vm.returnDateTime = returnDateTime;
    vm.save = save;    


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
    
    getMeals();

    // Define functions here

    function getConfig() {
      utility.getConfig().then(function(response) {
        vm.config.firstShift = vm.returnDateTime(response.data.firstShiftStart);
        vm.config.secondShift = vm.returnDateTime(response.data.secondShiftStart);
        vm.config.thirdShift = vm.returnDateTime(response.data.thirdShiftStart);
        vm.config.mealId = response.data.defaultMeal;//$filter('filter')(vm.meals, { MealID: response.data.defaultMeal});
      });
    }

    function getMeals() {
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals
      }).then(function successCallback(response){
        /*console.log("Success getting cost centers");*/
        vm.meals = response.data;
        getConfig();
      }, function errorCallback(response){
        toastr.error('Грешка при превземање на оброците!');
        console.log(response);
      });
    }

    function returnDateTime(timeString) {
      var timeArray = timeString.split(":");
      var d = new Date();
      d.setHours(parseInt(timeArray[0]));
      d.setMinutes(parseInt(timeArray[1]));
      return d;
    }
    
    function save() {
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
      }).then(function successCallback(response){

        toastr.success("Успешно зачувана конфигурација!");
        getConfig();
        vm.progressBar.complete();

      }, function errorCallback(response){

        toastr.error("Грешка при зачувување. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
      });
    }   
  }
})();

