(function(){

  'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MenusCtrl
 * @description
 * # MenusCtrl
 * Controller of the canteenApp
 */
 
 /* jshint latedef:nofunc */
 
  angular.module('canteenApp')
  .controller('MenusCtrl', MenusCtrl);

  MenusCtrl.$inject = ['$rootScope', '$route', 'roleService', '$location', '$http', '$scope', 'utility', 'APP_CONFIG', 'toastr', '$filter'];

  function MenusCtrl($rootScope, $route, roleService, $location, $http, $scope, utility, APP_CONFIG, toastr, $filter) {
/* jshint validthis: true */
    var vm = this;

    vm.shiftOne = [];
    vm.shiftTwo= [];
    vm.shiftThree = [];
    vm.startMonth = 0;

    vm.summary = {
      selectedDates:[],
      shiftOne: [],
      shiftTwo: [],
      shiftThree: []
    };
    vm.defaultMeals = {};

    // Functions
    vm.formatData = formatData;
    vm.getByMealTypeId = getByMealTypeId;
    vm.getDefaultMeals = getDefaultMeals;
    vm.getMeals = getMeals;
    vm.getMealsPerDay = getMealsPerDay;
    vm.submitMenu = submitMenu;

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
    getDefaultMeals();

    // Define functions here

    function formatData() {
        var result = {
          dates: [],
          shifts: [
          ]
        };

        for(var i in vm.summary.selectedDates) {
          var date = vm.summary.selectedDates[i];
          var parsedDate = $filter("date")(date, "yyyy-MM-dd HH:mm:ss.sss");
          result.dates.push(parsedDate);
        }

        var mealsId = [];
        for( i in vm.summary.shiftOne) {
          var mealType = vm.summary.shiftOne[i];
          for(var j in mealType) {
            var meal = mealType[j];
            if(meal.ID === undefined){
                continue;
            } 
            mealsId.push(meal.ID);
          }
        }
        result.shifts.push({
          shift: 1,
          meals: mealsId
        });

        mealsId = [];
        for( i in vm.summary.shiftTwo) {
          var mealType = vm.summary.shiftTwo[i];
          for( j in mealType) {
            var meal = mealType[j];
            if(meal.ID === undefined){
                continue;
            } 
            mealsId.push(meal.ID);
          }
        }
        result.shifts.push({
          shift: 2,
          meals: mealsId
        });

        mealsId = [];
        for( i in vm.summary.shiftThree) {
          var mealType = vm.summary.shiftThree[i];
          for( j in mealType) {
            var meal = mealType[j];
            if(meal.ID === undefined){
                continue;
            } 
            mealsId.push(meal.ID);
          }
        }
        result.shifts.push({
          shift: 3,
          meals: mealsId
        });
        return result;
    }

    function getByMealTypeId(id) {
      for(var i in vm.mealsPerType) {
        if(vm.mealsPerType[i].ID === id) {
          return vm.mealsPerType[i].Name;
        }
      }
    }

    function getDefaultMeals(){
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_default
      }).then(function successCallback(response){
        if(response.data === null){
          toastr.error("Ве молиме изберете Default-ен оброк во конфигурација пред да продолжите со планирање на менијата!");
        }
        vm.defaultMeals = response.data;
        vm.summary.shiftThree.push([]);
      }, function errorCallback(response){
        toastr.error("Грешка при вчитување на оброците. Освежете ја страната и обидете се повторно!");
        console.log(response);
      });
    }

    function getMeals(){
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_per_type
      }).then(function successCallback(response){
        var data = angular.copy(response.data);
        vm.mealsPerType = data;
        for(var i in data) {
          vm.summary.shiftOne.push([]);
          vm.summary.shiftTwo.push([]);
        }
      }, function errorCallback(response){
        toastr.error("Грешка при вчитување на оброците. Освежете ја страната и обидете се повторно!");
        console.log(response);
      });
    }

    //Used to retreive the options for third shift
      

    /**
     * @ngdoc function
     * @name canteenApp.controller:MenusCtrl.formatData
     * @description It generated a POST data formated
     */ 
    

    function getMealsPerDay(date) {
      var formattedDate = $filter("date")(date, "yyyy-MM-dd HH:mm:ss.sss");
      $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?date=" + formattedDate.toString()
      }).then(function successCallback(response){

      }, function errorCallback(response){
        toastr.error("Грешка при вчитување на оброците. Освежете ја страната и обидете се повторно!");
        console.log(response);
      });
    }

    function submitMenu() {
        $http({
            method: 'POST',
            data: formatData(),
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.menu
        }).then(function successCallback(response){
            if(response.data != ""){
              toastr.info("Едно или повеќе од менија не беа променети. Веќе постојат нарачки за тоа мени за одбраниот/те датум/и!");
            }
            else{
              toastr.success("Менијата се успешно запишани.");
            }
            
            $route.reload();
            vm.summary = {
              selectedDates:[],
              shiftOne: [],
              shiftTwo: [],
              shiftThree: []
            };
            getMeals();
        }, function errorCallback(response){
            toastr.error("Грешка при запишување на менијата. Ве молиме обидете се повторно!");
            console.log(response);
        });
    }

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        //you also get the actual event object
        //do stuff, execute functions -- whatever...
        var controls = $('input[type="search"].ui-select-search');
        for(var i in controls) {
          controls.width('100%');
        }
    });
  }
})();

