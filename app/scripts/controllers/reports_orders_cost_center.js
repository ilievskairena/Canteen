(function(){

    'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:ReportsOrdersCostCenterCtrl
 * @description
 * # ReportsOrdersCostCenterCtrl
 * Controller of the canteenApp
 */

 /* jshint latedef:nofunc */
 
    angular.module('canteenApp')
    .controller('ReportsOrdersCostCenterCtrl', ReportsOrdersCostCenterCtrl);

    ReportsOrdersCostCenterCtrl.$inject = ['$rootScope', '$filter', 'roleService', '$location', '$http', 'APP_CONFIG', 'toastr', 'utility', 'ngProgressFactory', 'ngTableParams'];

    function ReportsOrdersCostCenterCtrl($rootScope, $filter, roleService, $location, $http, APP_CONFIG, toastr, utility, ngProgressFactory, ngTableParams) {
    /* jshint validthis: true */
        var vm = this;

        vm.progressBar = ngProgressFactory.createInstance();
        
        vm.Orders = [];
        vm.availableDates = [];
        vm.costCenters =[];

        vm.exportButtonDisabled = true;


        // Whenever GetOrdersPerCostCenter is called, store the dates and costCenter so when
        // an export is needed, the same report is exported to Excel in case the user changed the input in between.

        var params = {
            dateFrom: undefined,
            dateTo: undefined,
            costCenterID: undefined
        };

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

        // Functions
        vm.exportToExcel = exportToExcel;
        vm.getCostCenters = getCostCenters;
        vm.getDates = getDates;
        vm.getOrdersPerCostCenter = getOrdersPerCostCenter;
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
        
        getCostCenters();

        // Define functions here

        function exportToExcel(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();

            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_orders_cost_center_export,
                params: params
            }).then(function successCallback(response){

                vm.progressBar.complete();
                var data = angular.copy(response.data);
                for(var i in data){
                    data[i].Date = $filter('shortdate')(data[i].Date);
                }

                return utility.downloadStatistics(data, 'Orders_Per_Cost_Center');

            }, function errorCallback(response){

                vm.progressBar.reset();
                toastr.error("Грешка при преземање податоци. Обидете се повторно!");
                console.log(response);

            });
        }

        function getCostCenters(){
            $http({
              method: 'GET',
              crossDomain: true,
              url:  APP_CONFIG.BASE_URL + APP_CONFIG.costcenter
            }).then(function successCallback(response){

                /*console.log("Success getting cost centers");*/
                vm.costCenters = response.data;

            }, function errorCallback(response){
                console.log("Error getting cost centers");
            });
        }

        function getOrdersPerCostCenter(){
            vm.progressBar.setColor('#8dc63f');
            vm.progressBar.start();
            params.dateFrom = $filter('date')(vm.dateFrom.selected, "yyyy-MM-dd HH:mm:ss.sss");
            params.dateTo = $filter('date')(vm.dateTo.selected, "yyyy-MM-dd HH:mm:ss.sss");
            params.costCenterID = vm.costCenter;


            if(vm.costCenter !== null && vm.costCenter !== undefined && vm.costCenter !== ""){
                params.costCenterID = vm.costCenter;
            }

            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.reports_orders_cost_center,
                params: params
            }).then(function successCallback(response){
                vm.progressBar.complete();
                var data = response.data;
                vm.orders = angular.copy(data);
                //console.log(vm.orders);

                for(var i in data) {
                    var date = data[i];
                    var total = 0;
                    for(var j in date.CostCenters) {
                        var center = date.CostCenters[j];

                        var centerSpan = center.ShiftOne.length + center.ShiftTwo.length + center.ShiftThree.length;
                        center.span = centerSpan * 2;
                        total += centerSpan * 2;
                    }
                    date.span = total + date.CostCenters.length * 2;
                }

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

        function openDateFrom() {
            vm.dateFrom.open = !vm.dateFrom.open;
        }

        function openDateTo() {
            vm.dateTo.open = !vm.dateTo.open;
        }
    }
})();