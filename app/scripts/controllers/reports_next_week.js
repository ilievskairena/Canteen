(function(){

    'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:ReportsNextWeekCtrl
 * @description
 * # ReportsNextWeekCtrl
 * Controller of the canteenApp
 */
 
    angular.module('canteenApp')
    .controller('ReportsNextWeekCtrl', ReportsNextWeekCtrl);

    ReportsNextWeekCtrl.$inject = ['$rootScope', '$filter', 'roleService', '$location', '$http', 'APP_CONFIG', 'toastr', 'utility', 'ngProgressFactory', 'ngTableParams'];

    function ReportsNextWeekCtrl($rootScope, $filter, roleService, $location, $http, APP_CONFIG, toastr, utility, ngProgressFactory, ngTableParams) {

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

        // Whenever GetOrders is called, store the dates so when
        // an export is needed, the same report is exported to Excel in case the user changed the input in between.

        var params = {
            dateFrom: undefined,
            dateTo: undefined,
        };

        vm.exportButtonDisabled = true;

        // Functions
        vm.exportToExcel = exportToExcel;
        vm.calculateRowSpan = calculateRowSpan;
        vm.getDates = getDates;
        vm.getOrders = getOrders;
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
                url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_orders_next_week_export,
                params: params
            }).then(function successCallback(response){
                vm.progressBar.complete();
                var ord = angular.copy(response.data);
                return utility.downloadStatistics(ord, 'Plan_Next_Week');
            }, function errorCallback(response){
                vm.progressBar.reset();
                toastr.error("Грешка при преземање податоци. Обидете се повторно!");
            });
            
        }

        function calculateRowSpan(order){
            var tmp = 0;
            for (var i = 0; i < order.Meals.length; i++) {
                var obj = order.Meals[i];
                tmp += obj.length*2;
            }
            console.log(tmp);
            return (tmp+order.Meals.length*2);
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

        function getOrders(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            params.dateFrom = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
            params.dateTo = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");

            
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_orders_next_week,
                params: params
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