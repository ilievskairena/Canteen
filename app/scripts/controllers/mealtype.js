(function(){

  'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MealtypeCtrl
 * @description
 * # MealtypeCtrl
 * Controller of the canteenApp
 */
 
  angular.module('canteenApp')
  .controller('MealtypeCtrl', MealtypeCtrl);

  MealtypeCtrl.$inject = ['$rootScope', '$location', 'roleService', '$scope', '$http', 'ngDialog', 'APP_CONFIG', 'utility', 'ngTableParams', 'toastr'];

  function MealtypeCtrl($rootScope, $location, roleService, $scope,$http, ngDialog, APP_CONFIG, utility, ngTableParams, toastr) {

    var vm = this;

    vm.isEditing = false;
    vm.editModel = null;
    vm.editIndex = null;

    // Functions

    vm.cancel = cancel;
    vm.edit = edit;
    vm.getAllMealTypes = getAllMealTypes;
    vm.insert = insert;
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
    
    getAllMealTypes();

    // Define functions here

    function cancel() {
      vm.isEditing = false;
      vm.editModel = null;
      vm.editIndex = null;
    }

    function edit(row, index){
      vm.editModel = angular.copy(row);
      vm.isEditing = true;
      vm.editIndex = index;
    }

    function getAllMealTypes(user){
      utility.getMealTypes().then(function(result) {
        vm.allMealTypes = result.data;
        vm.table = new ngTableParams(
        {
          page: 1,
          count: 10
        }, 
        {
          total: result.data.length,
          //Hide the count div
          counts: [],
          getData: function($defer, params) {
            var count = params.count();
            var page = params.page();
            //var filteredData = filter ? $filter('filter')(vm.data, filter) : vm.data

            $defer.resolve(result.data.slice((page - 1) * count, page * count));
          }
        }
        );
      });
    }

    function insert(){
      var newMealType = {
        "Name": vm.MealTypeTitle
      };
      $http({
        method: 'POST',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.mealtype_insert,
        data: newMealType
      }).then(function successCallback(response){
        toastr.success("Успешно додаден тип!");
        getAllMealTypes();
        vm.MealTypeTitle = "";
      }, function errorCallback(response){
        toastr.error("Грешка при додавање на тип! Ве молиме обидете се повторно.");
      });
    }

    function openRemoveDialog(data){
      var nestedConfirmDialog = ngDialog.openConfirm({
        template: "../../views/partials/removeDialog.html",
        scope: $scope,
        data: data
      });

      // NOTE: return the promise from openConfirm
      return nestedConfirmDialog;   
    }

    function removeItem(mealTypeId){
      $http({
        method:"DELETE",
        url: APP_CONFIG.BASE_URL + APP_CONFIG.mealtype +"/"+ mealTypeId,
        crossDomain: true
      }).then(function successCallback(response){
        toastr.success("Успешно избришан тип на оброк.");
        getAllMealTypes();
      }, function errorCallback(response){
        toastr.error("Грешка при бришење на тип на оброк. Ве молиме обидете се повторно!");
        console.log(response);
      });
    }

    function update(){
      var mealType = {
        "Name": vm.editModel.Name,
      };
      $http({
        method: 'PUT',
        data: mealType,
        contentType:'application/json',
        crossDomain: true,
        url: APP_CONFIG.BASE_URL + APP_CONFIG.mealtype +  "/" + vm.editModel.ID
      }).then(function successCallback(response){
        toastr.success("Успешно променет тип!");
        cancel();
        getAllMealTypes();
      }, function errorCallback(response){
        toastr.error("Грешка при промена на тип! Ве молиме обидете се повторно.");
      });
    }
  }
})();

