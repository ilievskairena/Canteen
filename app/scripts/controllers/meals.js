(function(){

  'use strict';

/**
* @ngdoc function
* @name canteenApp.controller:MealsCtrl
* @description
* # MealsCtrl
* Controller of the canteenApp
*/

  angular.module('canteenApp')
  .controller('MealsCtrl', MealsCtrl);

  MealsCtrl.$inject = ['$rootScope', '$location', 'roleService', '$scope', '$http', 'ngDialog', 'APP_CONFIG', 'utility', 'ngTableParams', 'toastr', 'ngProgressFactory'];

  function MealsCtrl($rootScope, $location, roleService, $scope, $http, ngDialog, APP_CONFIG, utility, ngTableParams, toastr, ngProgressFactory) {

    var vm = this;

    vm.isEditing = false;
    vm.editIndex = null;
    vm.editModel = null;

    vm.progressBar = ngProgressFactory.createInstance();


    // Functions
    vm.addMeal = addMeal;
    vm.cancel = cancel;
    vm.edit = edit;
    vm.getAllMeals = getAllMeals;
    vm.getAllMealTypes = getAllMealTypes;
    vm.openRemoveDialog = openRemoveDialog;
    vm.removeItem = removeItem;
    vm.update = update;

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
    
    getAllMeals();
    getAllMealTypes();

    // Define functions here

    function addMeal(){
      var newMeal = {
        "Description": vm.MealDescription,
        "TypeId": vm.MealType
      };
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      $http({
        method: 'POST',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals_insert,
        data: newMeal
      }).then(function successCallback(response){
        toastr.success("Успешно додаден оброк");
        getAllMeals();
        vm.progressBar.complete();
        vm.MealDescription = "";
        vm.MealType = "";
      }, function errorCallback(response){
        vm.progressBar.reset();
        toastr.error("Грешка при креирање на оброк");
      });
    }

    function cancel() {
      vm.isEditing = false;
      vm.editIndex = null;
      vm.editModel = null;
    }

    function edit(row, index){
      vm.isEditing = true;
      vm.editIndex = index;
      vm.editModel = row;
    }

    function getAllMeals(){
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.meals
      }).then(function successCallback(response){
        /*console.log("Success getting cost centers");*/
        var data = response.data;
        vm.allMeals = data;
        vm.table = new ngTableParams(
        {
          page: 1,
          count: 15
        }, 
        {
          total: data.length,
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
        }, function errorCallback(response){
          console.log("Error getting meals");
      });
    }

    function getAllMealTypes(user){
      utility.getMealTypes().then(function(result) {
        vm.allMealTypes = result.data;
      });
    }

    function openRemoveDialog(data){
      var item = {
        ID: data.MealID
      };

      var nestedConfirmDialog = ngDialog.openConfirm({
        template: "../../views/partials/removeDialog.html",
        scope: $scope,
        data: item
      });

      // NOTE: return the promise from openConfirm
      return nestedConfirmDialog;   
    }

    function removeItem(mealId){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      $http({
        method:"DELETE",
        url: APP_CONFIG.BASE_URL + APP_CONFIG.meals + "/"+ mealId,
        crossDomain: true
        
      }).then(function successCallback(response){
        toastr.success("Успешно избришан оброк!");
        vm.progressBar.complete();
        getAllMeals();
      }, function errorCallback(response){
        toastr.error("Грешка при бришење на оброк.");
        vm.progressBar.reset();
      });
    }

    function update(){
      var editMeal = {
        "Description": vm.editModel.MealDescription,
        "TypeID": vm.editModel.TypeID
      };
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();

      $http({
        method: 'PUT',
        data: editMeal,
        contentType:'application/json',
        crossDomain: true,
        url: APP_CONFIG.BASE_URL + APP_CONFIG.meals + "/" + vm.editModel.MealID
      }).then(function successCallback(response){
        toastr.success("Успешно променет оброк!");
        getAllMeals();
        cancel();
        vm.progressBar.complete();
      }, function errorCallback(response){
        vm.progressBar.reset();
        toastr.error("Грешка при промена на оброкот! Ве молиме обидете се повторно.");
      });
    }
  }
})();

