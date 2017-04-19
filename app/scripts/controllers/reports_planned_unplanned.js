 (function(){

    'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:ReportsPlannedUnplannedCtrl
 * @description
 * # ReportsPlannedUnplannedCtrl
 * Controller of the canteenApp
 */

 /* jshint latedef:nofunc */
 
    angular.module('canteenApp')
    .controller('ReportsPlannedUnplannedCtrl', ReportsPlannedUnplannedCtrl); 

    ReportsPlannedUnplannedCtrl.$inject = ['$rootScope', '$filter', 'roleService', '$location', '$http', 'APP_CONFIG', 'toastr', 'utility', 'ngProgressFactory', 'ngTableParams'];

    function ReportsPlannedUnplannedCtrl($rootScope, $filter, roleService, $location, $http, APP_CONFIG, toastr, utility, ngProgressFactory, ngTableParams) {
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
            selected: ((new Date()).setDate((new Date()).getDate() - 20)),
            open: false

        };

        vm.dateTo = {
            selected: ((new Date()).setDate((new Date()).getDate() + 20)),
            open: false
        };

        // Whenever getOrdersRatio is called, store the dates so when
        // an export is needed, the same report is exported to Excel in case the user changed the dates in between.
        var params = {
            dateFrom: undefined,
            dateTo: undefined,
        };

        vm.exportButtonDisabled = true;

        // Functions

        vm.exportToExcel = exportToExcel;
        vm.getDates = getDates;
        vm.getOrdersRatio = getOrdersRatio;
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
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            $http({
                method: 'GET',
                crossDomain: true,
                url:  APP_CONFIG.BASE_URL + APP_CONFIG.reports_planned_unplanned_export,
                params: params
            }).then(function successCallback(response){
                var data = angular.copy(response.data);
                for(var i in data){
                    data[i].Date = $filter('shortdate')(data[i].Date);
                }
                utility.downloadStatistics(data, 'Planned_Unplanned_Orders');
                vm.progressBar.complete();
            }, function errorCallback(response){
                vm.progressBar.reset();
                toastr.error("Грешка при преземање на податоците. Ве молиме обратете се кај администраторот!");
                console.log(response);
            });
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
                console.log(response);
            });
        }

        function getOrdersRatio(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            params.dateFrom = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
            params.dateTo = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");

            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_planned_unplanned,
                params: params
            }).then(function successCallback(response){
                var data = response.data;
                vm.progressBar.complete();
                vm.orders = data;
                vm.table = new ngTableParams({
                  page: 1,
                  count: 5
              }, {
                  total: data.length,
                  //Hide the count div
                  //counts: [],
                  getData: function($defer, params) {
                    // var filter = params.filter();
                    // var sorting = params.sorting();
                    var count = params.count();
                    var page = params.page();
                    $defer.resolve(data.slice((page - 1) * count, page * count));
                }
            });
                vm.exportButtonDisabled = false;
            }, function errorCallback(response){
                vm.progressBar.reset();
                toastr.error("Грешка при преземање податоци. Обидете се повторно!");
                console.log(response);
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

