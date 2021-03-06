(function(){

  'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:CostcenterCtrl
 * @description
 * # CostcenterCtrl
 * Controller of the canteenApp
 */

 /* jshint latedef:nofunc */
 
  angular.module('canteenApp')
  .controller('CostcenterCtrl', CostcenterCtrl);

  CostcenterCtrl.$inject = ['$scope', 'roleService', 'ngDialog', '$http', 'utility', '$location', 'APP_CONFIG', 'ngTableParams', 'toastr', 'ngProgressFactory', '$rootScope'];

  function CostcenterCtrl($scope, roleService, ngDialog, $http, utility, $location, APP_CONFIG, ngTableParams, toastr, ngProgressFactory, $rootScope) {
/* jshint validthis: true */
    var vm = this;
    
    vm.progressBar = ngProgressFactory.createInstance();
    vm.isEditing = false;
    vm.editIndex = null;
    vm.editModel = null;
    vm.loading = false;

    // Functions
    vm.cancel = cancel;
    vm.edit = edit;
    vm.getAllCostCenters = getAllCostCenters;
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
    
    getAllCostCenters();
    
    // Define functions here

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

    function getAllCostCenters(){
      vm.loading = true;
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.costcenter
      }).then(function successCallback(response){
        /*console.log("Success getting cost centers");*/
        var data = response.data;
        vm.allCostCenters = data;
        vm.table = new ngTableParams({
          page: 1,
          count: 5
        }, 
        {
          total: data.length,
          //Hide the count div
          counts: [],
          getData: function($defer, params) {
            var count = params.count();
            var page = params.page();
            //var filteredData = filter ? $filter('filter')(vm.data, filter) : vm.data

            $defer.resolve(data.slice((page - 1) * count, page * count));
          }
        });
        vm.loading = false;
      }, function errorCallback(response){
        toastr.error('Грешка при превземање на трошковните места. Обидете се повторно.');
        console.log(response);
      });
    }

    function insert(){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      var newCostCenter = {
        "Name": vm.title,
        "Code": vm.code
      };
      $http({
        method: 'POST',
        contentType:'application/json',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.costcenter_insert,
        data: newCostCenter
      }).then(function successCallback(response){
        toastr.success("Успешно додадено трошковно место!");
        getAllCostCenters();
        vm.title = "";
        vm.code = "";
        vm.progressBar.complete();
      }, function errorCallback(response){
        toastr.error("Грешка при додавање на трошковно место. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
        console.log(response);
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

    function removeItem(costCenterId){
      $http({
        method:"DELETE",
        url: APP_CONFIG.BASE_URL + APP_CONFIG.costcenter + "/"+ costCenterId,
        crossDomain: true

      }).then(function successCallback(response){
        toastr.success("Успешно избришано трошковно место!");
        getAllCostCenters();
      }, function errorCallback(response){
        toastr.error("Грешка при бришење на трошковното место. Можеби записот е веќе референциран и не може да биде отстранет.");
        console.log(response);
      });
    }

    function update(){
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      var editCCenter = {
        "Name": vm.editModel.Name,
        "Code": vm.editModel.Code
      };
      $http({
        method: 'PUT',
        data: editCCenter,
        contentType:'application/json',
        crossDomain: true,
        url: APP_CONFIG.BASE_URL + APP_CONFIG.costcenter +"/" + vm.editModel.ID
      }).then(function successCallback(response){

        toastr.success("Успешно променето трошковно место!");
        cancel();
        getAllCostCenters();
        vm.progressBar.complete();

      }, function errorCallback(response){

        toastr.error("Грешка при промена на трошковно место. Ве молиме обидете се повторно!");
        vm.progressBar.reset();
        console.log(response);

      });
    }
  }
})();