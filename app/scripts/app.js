'use strict';

/**
 * @ngdoc overview
 * @name canteenApp
 * @description
 * # canteenApp
 *
 * Main module of the application.
 */
angular
  .module('canteenApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch',
    'ngDialog',
    'ngMessages',
    'ngMaterial', 
    'materialCalendar',
    'ngTable',
    'toastr',
    'mgo-angular-wizard',
    'ui.select',
    'ui.bootstrap',
    'ngProgress',
    'LocalStorageModule',
    'chart.js',
  ])
  .config(function (ChartJsProvider) {
  ChartJsProvider.setOptions({ colors : [ '#a8b4bd', '#7a92a3', '#2677b5', '#46BFBD', '#FDB45C', '#949FB1', '#4D5360'] });
  }) 
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/users', {
        templateUrl: 'views/users.html',
        controller: 'UsersCtrl',
        controllerAs: 'vm'
      })
      .when('/costCenter', {
        templateUrl: 'views/costcenter.html',
        controller: 'CostcenterCtrl',
        controllerAs: 'vm'
      })
      .when('/meals', {
        templateUrl: 'views/meals.html',
        controller: 'MealsCtrl',
        controllerAs: 'vm'
      })
      .when('/mealType', {
        templateUrl: 'views/mealtype.html',
        controller: 'MealtypeCtrl',
        controllerAs: 'vm'
      })
      .when('/menu/planning', {
        templateUrl: 'views/menus.html',
        controller: 'MenusCtrl',
        controllerAs: 'vm'
      })
      .when('/dates', {
        templateUrl: 'views/dates.html',
        controller: 'DatesCtrl',
        controllerAs: 'vm' 
      })
      .when('/menu/preview', {
        templateUrl: 'views/menupreview.html',
        controller: 'MenupreviewCtrl',
        controllerAs: 'vm'
      })
      .when('/planning/thirdshift', {
        templateUrl: 'views/thirdshiftplan.html',
        controller: 'ThirdShiftPlanCtrl',
        controllerAs: 'vm'
      })
      .when('/planning/unplanned', {
        templateUrl: 'views/unplannedorder.html',
        controller: 'UnplannedorderCtrl',
        controllerAs: 'vm'
      })
      .when('/employeesPerShift', {
        templateUrl: 'views/employeespershift.html',
        controller: 'EmployeespershiftCtrl',
        controllerAs: 'vm'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl',
        controllerAs: 'vm'
      })
      .when('/config', {
        templateUrl: 'views/config.html',
        controller: 'ConfigCtrl',
        controllerAs: 'vm'
      })
      .when('/reports/orders', {
        templateUrl: 'views/reports_orders.html',
        controller: 'ReportsOrdersCtrl',
        controllerAs: 'vm'
      })
      .when('/reports/ordersPerCostCenter', {
        templateUrl: 'views/reports_orders_cost_center.html',
        controller: 'ReportsOrdersCostCenterCtrl',
        controllerAs: 'vm'
      })
      .when('/reports/nextWeek', {
        templateUrl: 'views/reports_next_week.html',
        controller: 'ReportsNextWeekCtrl',
        controllerAs: 'vm'
      })
      .when('/reports/realizedUnrealized', {
        templateUrl: 'views/reports_realized_requested.html',
        controller: 'ReportsRealizedRequestedCtrl',
        controllerAs: 'vm'
      })
      .when('/reports/workersGuests', {
        templateUrl: 'views/reports_workers_guests.html',
        controller: 'ReportsWorkersGuestsCtrl',
        controllerAs: 'vm'
      })
      .when('/reports/plannedUnplanned', {
        templateUrl: 'views/reports_planned_unplanned.html',
        controller: 'ReportsPlannedUnplannedCtrl',
        controllerAs: 'vm'
      })
      .when('/reports/employeesPlan', {
        templateUrl: 'views/reports_employeesplan.html',
        controller: 'ReportsEmployeesplanCtrl',
        controllerAs: 'vm'
      })
      .otherwise({
        redirectTo: '/'
      });
  })
  .config(function($httpProvider) {
      $httpProvider.interceptors.push('authInterceptorService');
  });