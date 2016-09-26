'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MenusCtrl
 * @description
 * # MenusCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MenusCtrl', function ($http, $scope, utility, APP_CONFIG, toastr, $filter, WizardHandler) {

    var vm = this;
    vm.shiftOne = [];
    vm.shiftTwo= [];
    vm.shiftThree = [];

    vm.summary = {
      selectedDates:[],
      shiftOne: [],
      shiftTwo: [],
      shiftThree: []
    };

    vm.getMeals = function(){
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL +"/api/meals/MealsPerType"
      }).
      success(function(data) {
          vm.mealsPerType = data;
          for(var i in data) {
            vm.summary.shiftOne.push([]);
            vm.summary.shiftTwo.push([]);
            vm.summary.shiftThree.push([]);
          }
      }).
      error(function(data, status, headers, config) {
        toastr.error("Грешка при вчитување на оброците. Освежете ја страната и обидете се повторно!");
      });
    }; 

    vm.getByMealTypeId = function(id) {
      for(var i in vm.mealsPerType) {
        if(vm.mealsPerType[i].ID == id) {
          return vm.mealsPerType[i].Name;
        }
      }
    };

    /**
     * @ngdoc function
     * @name canteenApp.controller:MenusCtrl.formatData
     * @description It generated a POST data formated
     */ 
    vm.formatData = function() {
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
        for(var i in vm.summary.shiftOne) {
          var mealType = vm.summary.shiftOne[i];
          for(var j in mealType) {
            var meal = mealType[j];
            if(meal.ID == undefined) continue;
            mealsId.push(meal.ID);
          }
        }
        result.shifts.push({
          shift: 1,
          meals: mealsId
        });

        mealsId = [];
        for(var i in vm.summary.shiftTwo) {
          var mealType = vm.summary.shiftTwo[i];
          for(var j in mealType) {
            var meal = mealType[j];
            if(meal.ID == undefined) continue;
            mealsId.push(meal.ID);
          }
        }
        result.shifts.push({
          shift: 2,
          meals: mealsId
        });

        mealsId = [];
        for(var i in vm.summary.shiftThree) {
          var mealType = vm.summary.shiftThree[i];
          for(var j in mealType) {
            var meal = mealType[j];
            if(meal.ID == undefined) continue;
            mealsId.push(meal.ID);
          }
        }
        result.shifts.push({
          shift: 3,
          meals: mealsId
        });
        console.log(result);
        return result;
    };

    vm.getMealsPerDay = function(date) {
      var formattedDate = $filter("date")(date, "yyyy-MM-dd HH:mm:ss.sss");
      $http({
          method: 'GET',
          crossDomain: true,
          url:  APP_CONFIG.BASE_URL +"/api/meals/MealByDate?date=" + formattedDate.toString()
      }).
      success(function(data) {
          
      }).
      error(function(data, status, headers, config) {
        toastr.error("Грешка при вчитување на оброците. Освежете ја страната и обидете се повторно!");
      });
    };

    vm.submitMenu = function() {
        $http({
            method: 'POST',
            data: vm.formatData(),
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL +"/api/meals/menu"
        }).
        success(function(data) {
            toastr.success("Менијата се успешно запишани.");
            WizardHandler.reset();
            vm.summary = {
              selectedDates:[],
              shiftOne: [],
              shiftTwo: [],
              shiftThree: []
            };
            vm.getMeals();
        }).
        error(function(data, status, headers, config) {
            toastr.error("Грешка при запишување на мениата. Ве молиме обидете се повторно!");
        });
    };

    $scope.$on('ngRepeatFinished', function(ngRepeatFinishedEvent) {
        //you also get the actual event object
        //do stuff, execute functions -- whatever...
        var controls = $('input[type="search"].ui-select-search');
        for(var i in controls) {
          controls.width('100%');
        }
    });

    vm.getMeals();
});
