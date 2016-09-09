'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('UsersCtrl', function ($scope,$http,ngDialog) {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
    var vm = this;

    vm.attachNewCard = function(){
    	var newCardHtml = '<br/><div style="margin-top:10px;"><h4>Прикачи уште една картичка</h4><div><div class="col-md-12"><br/><div class="col-md-3"><label for="CardNum1">Број на картичка</label></div><div class="col-md-6"><input type="text" class="form-control" id="CardNum1" ng-model="vm.CardNum1" placeholder="Внеси картичка..."></div></div></div><div><div class="col-md-12"><br/><div class="col-md-3"><label for="CardType1">Тип на картичка</label></div><div class="col-md-6"><input type="text" class="form-control" id="CardType1" ng-model="vm.CardType1" placeholder="Внеси тип на картичка..."></div></div></div></div>';
   		var divElement = document.getElementById("newCardDiv");
   		divElement.style.display = "block";
   		divElement.style.marginTop = "120px";
   		divElement.innerHTML = newCardHtml;
   		var btnElement = document.getElementById("btnAddCard");
   		btnElement.disabled = true;
    };

    vm.addNewUser = function(data){
    	var newUser = {
    		UserName:data.Username,
    		Name:data.Name,
    		CostCenterID:data.CostCenter,
    		PersonNumber:data.PersonNumber
    	};
    	$http({
                method: 'POST',
                data: newUser,
                contentType:'application/json',
                crossDomain: true,
                url: "http://localhost:59700/api/users"
            }).
            success(function(data) {
                console.log("Success inserting user");
                vm.getUsers();
                vm.Name=vm.PersonNumber=vm.Username=vm.CostCenter=vm.CardNum=vm.CardType="";

            }).
            error(function(data, status, headers, config) {
            	console.log("Error inserting user");
            });

    };
    
    vm.getUsers = function() {
            $http({
                method: 'GET',
                crossDomain: true,
                url: "http://localhost:59700/api/users"
            }).
            success(function(data) {
                console.log("Success getting users");
                vm.userTable = data;
                console.log(data);
            }).
            error(function(data, status, headers, config) {
            	console.log("Error getting users");
            });
        };

    vm.openRemoveDialog = function(data){
        console.log(data.ID);
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/removeDialog.html",
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.openEditDialog = function(data){
        console.log(data.ID);
        var nestedConfirmDialog = ngDialog.openConfirm({
            template: "../../views/partials/editUserDialog.html",
            className:'ngdialog-theme-default',
            scope: $scope,
            data: data
        });

        // NOTE: return the promise from openConfirm
        return nestedConfirmDialog;   
    };

    vm.removeUser = function(userId){
        console.log(userId);
        $http({
            method:"DELETE",
            url:"http://localhost:59700/api/users/"+ userId,
            crossDomain: true
            
        }).success(function(data){
            console.log("Successfully deleted user");
        }).error(function(data){
            console.log(data);
        });
    }

        vm.getUsers();


  });