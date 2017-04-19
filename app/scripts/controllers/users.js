(function(){

    'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:UsersCtrl
 * @description
 * # UsersCtrl
 * Controller of the canteenApp
 */

 /* jshint latedef:nofunc */
 
    angular.module('canteenApp')
    .controller('UsersCtrl', UsersCtrl);

    UsersCtrl.$inject = ['$rootScope', '$location', 'roleService', '$scope', '$http', 'ngDialog', 'APP_CONFIG', 'utility', 'ngTableParams', 'toastr', '$filter', 'ngProgressFactory'];

    function UsersCtrl($rootScope, $location, roleService, $scope, $http, ngDialog, APP_CONFIG, utility, ngTableParams, toastr, $filter, ngProgressFactory) {
/* jshint validthis: true */
        var vm = this;

        vm.progressBar = ngProgressFactory.createInstance();
        vm.isEditing = false;
        vm.isLoading = false;
        vm.isInserting = false;
        vm.editModel = null;
        vm.editIndex = null;
        vm.showFilters = false;
        vm.returnedUser = {};
        vm.loading = false;
        vm.filters = {
            PersonNumber: undefined,
            Name: undefined,
            Username: undefined,
            CardNumber: undefined
        };
        vm.regex = {
            number: "[0-9]{8}",
            username: ".+",
            card: "[0-9]+"
        };

        // Functions
        vm.cancel = cancel;
        vm.clearFilters = clearFilters;
        vm.clearForm = clearForm;
        vm.edit = edit;
        vm.getCostCenters = getCostCenters;
        vm.getRoles = getRoles;
        vm.getUser = getUser;
        vm.getUsers = getUsers;
        vm.openRemoveDialog = openRemoveDialog;
        vm.removeItem = removeItem;
        vm.reset = reset;
        vm.save = save;
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

        getUsers();
        getRoles();
        getCostCenters();

        // Define functions here

        function cancel() {
          vm.isEditing = false;
          vm.editModel = null;
          vm.editIndex = null;
        }

        function clearFilters(){
            if(angular.isUndefined(vm.filters)){
                return;
            }
            vm.filters.PersonNumber = "";
            vm.filters.Name = "";
            vm.filters.Username = "";
            vm.filters.CardNumber = "";
        }

        function clearForm(){
           // vm.username = vm.name = vm.costCenter = vm.personNumber = vm.role = vm.isEmployee = vm.cardNumber = vm.cardType = null;
           vm.isInserting = false;
        }

        function edit(row, index){
          vm.editModel = angular.copy(row);
          vm.isEditing = true;
          vm.editIndex = index;      
        }

        function getCostCenters(){
            utility.getAllCostCenters().then(function(result) {
                // console.log(result);
                vm.allCostCenters = result.data;
            });
        }

        function getRoles(){
            $http({
                method: 'GET',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL +"/api/roles"
            }).then(function successCallback(response){
                vm.Roles = response.data;
            }, function errorCallback(response){
                toastr.error('Грешка при превземање на улогите. Освежете ја страната и обидете се повторно!');
                console.log(response);
            });
        }

        function getUser(user){
            utility.getUserPerID(user.ID).then(function(result) {
                
                vm.returnedUser = result.data;

            });
        }

        function getUsers() {
            vm.loading = true;
            $http({
                method: 'GET',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL + "/api/users"
            }).then(function successCallback(response){
                //console.log(response.data);
                var data = angular.copy(response.data);
                //vm.userTable = data;
                vm.table = new ngTableParams({
                  page: 1,
                  count: 5,
                  filter: vm.filters
                }, {
                  total: data.length,
                  //Hide the count div
                  counts: [],
                  getData: function($defer, params) {
                    var orderedData = params.sorting() ? $filter('orderBy')(data, params.orderBy()) : data;
                    orderedData = $filter('filter')(orderedData, params.filter());
                    params.total(orderedData.length);
                    $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                  }
              });
                vm.loading = false;
            }, function errorCallback(response){
                toastr.error('Грешка при превземање на корисниците. Освежете ја страната и обидете се повторно!');
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

        function removeItem(userId){
            $http({
                method:"DELETE",
                url: APP_CONFIG.BASE_URL +"/api/users/"+ userId,
                crossDomain: true          
            }).then(function successCallback(response){
                toastr.success('Корисникот е успешно деактивиран.');
                vm.getUsers();
            }, function errorCallback(response){
                toastr.error('Грешка при деактивирање на корисник. Ве молиме обидете се повторно!');
                console.log(response);
            });
        }

        function reset() {
            vm.username = "";
            vm.name = "";
            vm.costCenter = null;
            vm.personNumber = "";
            vm.role = null;
            vm.isEmployee = false;
            vm.cardNumber = "";
            vm.cardType = "";
            vm.WorksHolidays = false;
        }

        function save(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            var newUser = {
                Username:vm.username,
                Name:vm.name,
                CostCenterID: vm.costCenter,
                CostCenterName: "", //Because the model can't be null
                PersonNumber: vm.personNumber,
                RoleID: vm.role,
                RoleName: "", //Because the model can't be null
                isEmployee: vm.isEmployee,
                CardNumber: vm.cardNumber,
                CardType: vm.cardType,
                CardID: null,
                WorksHolidays: vm.worksHolidays
            };
            //console.log(newUser);
            $http({
                method: 'POST',
                data: newUser,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.users_insert
            }).then(function successCallback(response){
                vm.progressBar.complete();
                getUsers();
                clearForm();
                reset();
                toastr.success("Успешно внесен корисник!");
            }, function errorCallback(response){
                vm.progressBar.setColor('red');
                vm.progressBar.reset();
                toastr.error("Грешка при додавање на корисник. Ве молиме обидете се повторно!");
                console.log(response);
            });
        }

        function update(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            var editUser = {
                Username: vm.editModel.Username,
                Name:vm.editModel.Name,
                CostCenterID:vm.editModel.CostCenterID,
                RoleID: vm.editModel.RoleID,
                PersonNumber:vm.editModel.PersonNumber,
                IsEmployee: vm.editModel.IsEmployee,
                IsActive: vm.editModel.IsActive,
                CardNumber: vm.editModel.CardNumber,
                CardType: vm.editModel.CardType,
                CardID: vm.editModel.CardID,
                WorksHolidays: vm.editModel.WorksHolidays
            };

            $http({
                method: 'PUT',
                data: editUser,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL +"/api/users/" + vm.editModel.ID
            }).then(function successCallback(response){
                toastr.success("Успешно променет корисник!");
                vm.progressBar.complete();
                getUsers();
                cancel();
            }, function errorCallback(response){
                vm.progressBar.setColor('red');
                vm.progressBar.reset();
                toastr.error("Грешка при промена на корисник. Ве молиме обидете се повторно!");
                console.log(response);
            });
        }
    }
})();

