'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('UsersCtrl', function ($scope,$http,ngDialog,APP_CONFIG,utility) {

    var vm = this;
    vm.returnedUser = {};

    vm.attachNewCard = function(){
    	var newCardHtml = '<br/><div style="margin-top:10px;"><h4>Прикачи уште една картичка</h4><div><div class="col-md-12"><br/><div class="col-md-3"><label for="CardNum1">Број на картичка</label></div><div class="col-md-6"><input type="text" class="form-control" id="CardNum1" ng-model="vm.CardNum1" placeholder="Внеси картичка..."></div></div></div><div><div class="col-md-12"><br/><div class="col-md-3"><label for="CardType1">Тип на картичка</label></div><div class="col-md-6"><input type="text" class="form-control" id="CardType1" ng-model="vm.CardType1" placeholder="Внеси тип на картичка..."></div></div></div></div>';
   		var divElement = document.getElementById("newCardDiv");
   		divElement.style.display = "block";
   		divElement.style.marginTop = "120px";
   		divElement.innerHTML = newCardHtml;
   		var btnElement = document.getElementById("btnAddCard");
   		btnElement.disabled = true;
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

    vm.saveUser = function(data){
        var editUser = {
            Username:data.Username ==null || data.Username ==undefined ? "": data.Username,
            Name:data.Name,
            CostCenterID:data.CostCenterID,
            PersonNumber:data.PersonNumber,
            isEmployee: data.isEmployee,
            CardNumber: data.UserCards[0].Cards.CardNum,
            CardType: data.UserCards[0].Cards.CardType,
            CardID: data.UserCards[0].CardID
        };
        $http({
                method: 'PUT',
                data: editUser,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL +"/api/users/" + data.ID
            }).
            success(function(data) {
                console.log("Success editing user");
                vm.getUsers();
            }).
            error(function(data, status, headers, config) {
                console.log("Error editing user");
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

    vm.openEditDialog = function(){
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/editUserDialog.html",
            className:'ngdialog-theme-default',
            scope: $scope,
            data: vm.returnedUser
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
