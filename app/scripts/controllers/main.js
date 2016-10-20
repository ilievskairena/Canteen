'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MainCtrl', function ($http, utility, $rootScope, $filter, $location, roleService, AuthenticationService, APP_CONFIG) {
    var vm = this;

    $rootScope.isLogin = false;
    if(!utility.isAuthenticated()) {
        $location.path('/login');
    }
    vm.loggedInUser = utility.getLoggedInUser();
    var path = $location.path();
    if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) $location.path("/");

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

    vm.getCostCenters = function(){
        utility.getAllCostCenters().then(function(result) {
            vm.costCeters = result.data.length;
        },
        function(error) {
            AuthenticationService.logOut();
        });
    };

    vm.getUsers = function(){
        utility.getUsers().then(function(result) {
            vm.users = result.data.length;
        },
        function(error) {
            AuthenticationService.logOut();
        });
    };

    vm.chartPieOrders = function() {
        $http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.charts_order_cost_centers
        }).
        success(function(data) {
            for(var i in data) {
                vm.chartOrder.data.push(data[i].Orders);
                vm.chartOrder.label.push(data[i].CostCenter);
            }
        }).
        error(function(data, status, headers, config) {
            
        });
    };

    vm.chartLineRatio = function() {
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
        }).
        success(function(data) {
            for(var i in data) {
                vm.chartRatio.data[0].push(data[i].Realized);
                vm.chartRatio.data[1].push(data[i].Unrealized);
                var date = $filter("shortdate")(dateTo);
                vm.chartRatio.label.push(date);
            }
        }).
        error(function(data, status, headers, config) {
            
        });
    };

    vm.chartCenterRatio = function() {
        $http({
            method: 'GET',
            crossDomain: true,
            url: APP_CONFIG.BASE_URL + APP_CONFIG.charts_realization_by_cost_center
        }).
        success(function(data) {
            for(var i in data) {
                vm.chartCCRatio.data[0].push(data[i].Realized);
                vm.chartCCRatio.data[1].push(data[i].Unrealized);
                vm.chartCCRatio.label.push(data[i].CostCenter);
            }
        }).
        error(function(data, status, headers, config) {
            
        });
    };


    vm.getCostCenters();
    vm.getUsers();
    vm.chartPieOrders();
    vm.chartLineRatio();
    vm.chartCenterRatio();
  });
