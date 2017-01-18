(function(){

    'use strict';

    /**
     * @ngdoc function
     * @name canteenApp.controller:EmployeespershiftCtrl
     * @description
     * # EmployeespershiftCtrl
     * Controller of the canteenApp
     */

     angular.module('canteenApp')
     .controller('EmployeespershiftCtrl', EmployeespershiftCtrl);

     EmployeespershiftCtrl.$inject = ['$rootScope', 'roleService', '$location', '$scope', '$filter', 'ngDialog', '$http', 'utility', 'APP_CONFIG', 'toastr', 'ngProgressFactory'];

     function EmployeespershiftCtrl($rootScope, roleService, $location, $scope, $filter, ngDialog, $http, utility, APP_CONFIG, toastr, ngProgressFactory) {

        var vm = this;

        $rootScope.isLogin = false;
        if(!utility.isAuthenticated()) {
            $location.path('/login');
        }
        vm.loggedInUser = utility.getLoggedInUser();
        var path = $location.path();
        if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)){
            $location.path("/");  
        } 

        utility.getAllCostCenters().then(function(result) {
            vm.costCenters = result.data;
        });

        vm.progressBar = ngProgressFactory.createInstance();
        vm.employeesPerShift = [];
        vm.costCenters = [];
        vm.availableDates = [];
        vm.model = {
            costCenter: vm.loggedInUser.CostCenterID
        };

        vm.dateOptions = {
            formatYear: 'yyyy',
            maxDate: new Date(2020, 5, 22),
            minDate: new Date(2016, 1, 1),
            startingDay: 1
        };

        vm.dateFrom = {
            selected: null,
            open: false
        };

        vm.dateTo = {
            selected: null,
            open: false
        };

        // Functions
        vm.confirmSave = confirmSave;
        vm.formatModel = formatModel;
        vm.getDates = getDates;
        vm.getEmployeesPerShift = getEmployeesPerShift;
        vm.getWeekDay = getWeekDay;
        vm.openDateFrom = openDateFrom;
        vm.openDateTo = openDateTo;
        vm.save = save;
        vm.showAlert = showAlert;
        vm.toShortDate = toShortDate;

        // Init

        utility.getAvailableDates().then(function(result) {
            vm.availableDates = result.data;
            vm.dateOptions.minDate = new Date(vm.availableDates[0].Date);
            vm.dateOptions.maxDate = new Date(vm.availableDates[1].Date);
        });

        // Define functions here

        function confirmSave() {
            var confirmDialog = ngDialog.openConfirm({
                template: "../../views/partials/confirmSaveThirdShift.html",
                scope: $scope,
                data: null
            });

            // NOTE: return the promise from openConfirm
            return confirmDialog;   
        }

        function formatModel() {
            var model = [];
            for(var i in vm.employeesPerShift) {
                var item = vm.employeesPerShift[i];
                model.push({
                    "CostCenterID":vm.model.costCenter,
                    "DateID": (item.DateID === null || item.DateID === undefined) ? item.ID : item.DateID,
                    "Date":item.Date,
                    "firstShift":item.firstShift,
                    "secondShift":item.secondShift,
                    "thirdShift":item.thirdShift
                });
            }
            return model;
        }

        function getDates() {
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            vm.employeesPerShift = [];
            var dateFrom = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
            var dateTo = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");
            $http({
                method: 'GET',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL + APP_CONFIG.dates_range + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo
            }).then(function successCallback(response){
                vm.employeesPerShift = response.data;
                vm.progressBar.complete();
            }, function errorCallback(response){
                vm.progressBar.reset();
                if(response.status === 404) {
                    toastr.info("Нема внесено датуми. Обратете се на администраторот да внесе година!");
                }
                else{
                    toastr.error("Грешка при преземање на податоците. Ве молиме обратете се кај администраторот!");  
                } 
            });
        }

        function getEmployeesPerShift() {
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            var dateFrom = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
            var dateTo = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");

            $http({
                method: 'GET',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL + APP_CONFIG.employees_per_shift_existing + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo + "&centerId=" + vm.model.costCenter
            }).then(function successCallback(response){
                vm.employeesPerShift = response.data;
                vm.progressBar.complete();
            }, function errorCallback(response){
                vm.progressBar.reset();
                if(response.status === 404) {
                    getDates();
                }
            });
        }

        function openDateFrom() {
            vm.dateFrom.open = !vm.dateFrom.open;
        }

        function openDateTo() {
            vm.dateTo.open = !vm.dateTo.open;
        }

        function getWeekDay(dateString) {
            var days = {
              1: "Понеделник",
              2: "Вторник",
              3: "Среда",
              4: "Четврток",
              5: "Петок",
              6: "Сабота",
              0: "Недела"
          };
          var date = new Date(dateString);
          return days[date.getDay()];
        }

        function toShortDate(dateString) {
            var date = new Date(dateString);
            var day = date.getDate();
            var month = date.getMonth() + 1;
            var year = date.getFullYear();
            var fullDate = day + "." + month + "." + year;
            return fullDate;
        }

        function showAlert() {
            if(vm.employeesPerShift.length > 0) {   
                var dateFrom = new Date(vm.employeesPerShift[0].Date);
                var dateTo = new Date(vm.employeesPerShift[vm.employeesPerShift.length - 1].Date);
                vm.dateFrom.selected.setHours(0,0,0,0);
                vm.dateTo.selected.setHours(0,0,0,0);
                dateFrom.setHours(0,0,0,0);
                dateTo.setHours(0,0,0,0);
                //console.log(dateFrom);
                //console.log(vm.dateFrom.selected);
                //console.log(dateTo);
                //console.log(vm.dateTo.selected);
                //console.log(vm.dateFrom.selected != dateFrom || vm.dateTo.selected != dateTo);
                return vm.dateFrom.selected !== dateFrom || vm.dateTo.selected !== dateTo;
            }
            else{
              return false;  
            }  
        }

        function save() {
            var data = vm.formatModel();
            $http({
                method: 'POST',
                contentType:'application/json',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL + APP_CONFIG.employeespershift,
                data: data
            }).then(function successCallback(response){
                toastr.success("Успешно крeиран распоред!");
                vm.progressBar.complete();
                getEmployeesPerShift();
            }, function errorCallback(response){
                toastr.error("Грешка при креирање на распоредот. Ве молиме обидете се повторно!");
                vm.progressBar.reset();
            });
        }
    }
})();