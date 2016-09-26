'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('UsersCtrl', function ($scope, $http, ngDialog, APP_CONFIG, utility, ngTableParams, toastr, $filter) {

    var vm = this;
    vm.isEditing = false;
    vm.isLoading = false;
    vm.isInserting = false;
    vm.editModel = null;
    vm.editIndex = null;
    vm.returnedUser = {};

    vm.edit = function(row, index){
      vm.editModel = angular.copy(row);
      vm.isEditing = true;
      vm.editIndex = index;      
    };

    vm.cancel = function() {
      vm.isEditing = false;
      vm.editModel = null;
      vm.editIndex = null;
    };

    vm.getRoles = function(){
        $http({
                method: 'GET',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL +"/api/roles"
            }).
            success(function(data) {
                //console.log("Success getting roles");
                vm.Roles = data;
            }).
            error(function(data, status, headers, config) {
                console.log("Error getting roles");
            });
    };


    vm.addNewUser = function(){
    	var newUser = {
    		Username:vm.Username,
    		Name:vm.Name,
    		CostCenterID: vm.CostCenterSelect,
    		PersonNumber:vm.PersonNumber,
            isEmployee: vm.isEmployee,
            CardNumber: vm.CardNum,
            CardType: vm.CardType,
            CardID: null
    	};
        console.log(newUser);
    	$http({
                method: 'POST',
                data: newUser,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL +"/api/users"
            }).
            success(function(data) {
                //console.log("Success inserting user");
                vm.getUsers();
                vm.Name=vm.PersonNumber=vm.Username=vm.CostCenter=vm.CardNum=vm.CardType="";

            }).
            error(function(data, status, headers, config) {
            	console.log("Error inserting user");
            });

    };

    vm.update = function(){
        var editUser = {
            Username: vm.editModel.Username,
            Name:vm.editModel.Name,
            CostCenterID:vm.editModel.CostCenterID,
            RoleID: vm.editModel.RoleID,
            PersonNumber:vm.editModel.PersonNumber,
            isEmployee: vm.editModel.isEmployee,
            CardNumber: vm.editModel.CardNumber,
            CardType: vm.editModel.CardType,
            CardID: vm.editModel.CardID
        };
        $http({
            method: 'PUT',
            data: editUser,
            contentType:'application/json',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL +"/api/users/" + vm.editModel.ID
        }).
        success(function(data) {
            toastr.success("Успешно променет корисник!");
            vm.getUsers();
            vm.cancel();
        }).
        error(function(data, status, headers, config) {
            toastr.error("Грешка при промена на корисник. Ве молиме обидете се повторно!");
        });
    };
    
    vm.getUsers = function() {
        $http({
            method: 'GET',
            crossDomain: true,
            url:  APP_CONFIG.BASE_URL +"/api/users"
        }).
        success(function(data) {
            //console.log("Success getting users");
            vm.userTable = data;
            vm.table = new ngTableParams({
              page: 1,
              count: 5
            }, {
              total: vm.userTable.length,
              //Hide the count div
              counts: [],
              getData: function($defer, params) {
                var filter = params.filter();
                var sorting = params.sorting();
                var count = params.count();
                var page = params.page();
                  //var filteredData = filter ? $filter('filter')(vm.data, filter) : vm.data
                var data = $filter('orderBy')(vm.userTable, Object.keys(sorting)[0]);
                $defer.resolve(data.slice((page - 1) * count, page * count));
              }
          });
        }).
        error(function(data, status, headers, config) {
        	console.log("Error getting users");
        });
    };

    vm.getUser = function(user){
        utility.getUserPerID(user.ID).then(function(result) {
            /*console.log(result.data);*/
            vm.returnedUser = result.data;
            vm.openEditDialog();
        });
    };


    vm.openRemoveDialog = function(data){
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/removeDialog.html",
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.removeItem = function(userId){
        console.log(userId);
        $http({
            method:"DELETE",
            url: APP_CONFIG.BASE_URL +"/api/users/"+ userId,
            crossDomain: true
            
        }).success(function(data){
            console.log("Successfully deleted user");
            vm.getUsers();
        }).error(function(data){
            console.log(data);
        });
    };

    vm.getCostCenters = function(){
        utility.getAllCostCenters().then(function(result) {
            vm.allCostCenters = result.data;
        });
    };


    vm.getUsers();
    vm.getRoles();
    vm.getCostCenters();
  });
