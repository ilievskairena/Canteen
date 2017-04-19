(function(){

    'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canteenApp
 */

 /* jshint latedef:nofunc */

    angular.module('canteenApp')
    .controller('MainCtrl', MainCtrl);

    MainCtrl.$inject = ['$http', 'utility', '$rootScope', '$filter', '$location', 'roleService', 'AuthenticationService', 'APP_CONFIG'];

    function MainCtrl($http, utility, $rootScope, $filter, $location, roleService, AuthenticationService, APP_CONFIG) {
    /* jshint validthis: true */
        var vm = this;

        vm.noOfMeals = 0;
        vm.noOfOrders = 0;

        vm.chartOrder = {
            data: [],
            label: []
        };

        vm.chartRatio = {
            data: [[],[]],
            label: [],
            series : ["Реализирани", "Нереализирани"]
        };

        vm.chartCCRatio = {
            data: [[],[]],
            label: [],
            series : ["Реализирани", "Нереализирани"]
        };

        vm.chartCenterRatio = chartCenterRatio;
        vm.chartLineRatio = chartLineRatio;
        vm.chartPieOrders = chartPieOrders;
        vm.getCostCenters = getCostCenters;
        vm.getMeals = getMeals;
        vm.getNumberOfOrders = getNumberOfOrders;
        vm.getUsers = getUsers;


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
        getUsers();
        getMeals();
        getNumberOfOrders();
        chartPieOrders();
        chartLineRatio();
        chartCenterRatio();


        function chartCenterRatio() {
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.charts_realization_by_cost_center
            }).then(function successCallback(response){
                for(var i in response.data) {
                    vm.chartCCRatio.data[0].push(response.data[i].Realized);
                    vm.chartCCRatio.data[1].push(response.data[i].Unrealized);
                    vm.chartCCRatio.label.push(response.data[i].CostCenter);
                }
            }, function errorCallback(response){
                console.log(response);
            });
        }

        function chartLineRatio() {
            var dateFrom = new Date();
            dateFrom.setDate(dateFrom.getDate() - 1);
            dateFrom = $filter("date")(dateFrom, "yyyy-MM-dd 00:00:00.000");

            var dateTo = new Date();
            dateTo.setDate(dateTo.getDate() + 10);
            dateTo = $filter("date")(dateTo, "yyyy-MM-dd 00:00:00.000");

            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.charts_realization_ratio + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo
            }).then(function successCallback(response){
                var data = angular.copy(response.data);
                for(var i in data) {
                    vm.chartRatio.data[0].push(data[i].Realized);
                    vm.chartRatio.data[1].push(data[i].Unrealized);
                    var date = $filter("shortdate")(data[i].Date);
                    vm.chartRatio.label.push(date);
                }
            }, function errorCallback(response){
                console.log("Chart Line Error");
                console.log(response);
            });
        }

        function chartPieOrders() {
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.charts_order_cost_centers
            }).then(function successCallback(response){
                for(var i in response.data) {
                    vm.chartOrder.data.push(response.data[i].Orders);
                    vm.chartOrder.label.push(response.data[i].CostCenter);
                }
            }, function errorCallback(response){
                console.log("Chart pie error");
                console.log(response);
            });
        }

        function getCostCenters(){
            utility.getAllCostCenters().then(function(result) {
                vm.costCenters = result.data.length;
            },
            function(error) {
                AuthenticationService.logOut();
                console.log(error);
            });
        }

        function getMeals(){
            utility.getNoOfMeals().then(function(result){
                vm.noOfMeals = result.length;

            },
            function(error){
                console.log(error);
            });
        }

        function getNumberOfOrders(){
            utility.getNumberOfOrders().then(function(result){
                vm.noOfOrders = result.data;
            },
            function(error){
                console.log(error);
            });
        }

        function getUsers(){
            utility.getUsers().then(function(result) {
                vm.users = result.data.length;
            },
            function(error) {
                AuthenticationService.logOut();
                console.log(error);
            });
        }
    }
})();

