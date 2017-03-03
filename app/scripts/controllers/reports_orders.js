(function(){

    'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:ReportsOrdersCtrl
 * @description
 * # ReportsOrdersCtrl
 * Controller of the canteenApp
 */
 
 /* jshint latedef:nofunc */
 
    angular.module('canteenApp')
    .controller('ReportsOrdersCtrl', ReportsOrdersCtrl);

    ReportsOrdersCtrl.$inject = ['$rootScope', '$filter', 'roleService', '$location', '$http', 'APP_CONFIG', 'toastr', 'utility', 'ngProgressFactory', 'ngTableParams'];

    function ReportsOrdersCtrl($rootScope, $filter, roleService, $location, $http, APP_CONFIG, toastr, utility, ngProgressFactory, ngTableParams) {
/* jshint validthis: true */
        var vm = this;

        vm.progressBar = ngProgressFactory.createInstance();
        
        vm.Orders = [];
        vm.availableDates = [];

        //for dates form

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

        vm.exportButtonDisabled = true;

        // Functions
        vm.exportToExcel = exportToExcel;
        vm.getDates = getDates;
        vm.getOrdersPerEmployee = getOrdersPerEmployee;
        vm.openDateFrom = openDateFrom;
        vm.openDateTo = openDateTo;

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

        // Define functions here

        function exportToExcel(){
            var ord = vm.orders;
            return utility.downloadStatistics(ord, 'All_Orders');
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

        function getOrdersPerEmployee(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            var dateF = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
            var dateT = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");

            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_orders_period,
                params: 
                {
                    dateFrom: dateF,
                    dateTo: dateT
                }
            }).then(function successCallback(response){
                var data = response.data;
                vm.progressBar.complete();
                vm.orders = angular.copy(data);
                vm.table = new ngTableParams({
                  page: 1,
                  count: 5
              }, {
                  total: data.length,
                  //Hide the count div
                  //counts: [],
                  getData: function($defer, params) {
                    var filter = params.filter();
                    var sorting = params.sorting();
                    var count = params.count();
                    var page = params.page();
                    $defer.resolve(data.slice((page - 1) * count, page * count));
                }
            });
                vm.exportButtonDisabled = false;
            }, function errorCallback(response){
                vm.progressBar.reset();
                toastr.error("Грешка при преземање податоци. Обидете се повторно!");
            });
        }

        function openDateFrom() {
            vm.dateFrom.open = !vm.dateFrom.open;
        }

        function openDateTo() {
            vm.dateTo.open = !vm.dateTo.open;
        }
    }
})();