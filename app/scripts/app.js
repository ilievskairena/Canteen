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
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl',
        controllerAs: 'vm'
      })
      .when('/about', {
        templateUrl: 'views/about.html',
        controller: 'AboutCtrl',
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
      .when('/cards', {
        templateUrl: 'views/cards.html',
        controller: 'CardsCtrl',
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
      .when('/menusPerCategory', {
        templateUrl: 'views/menuspercategory.html',
        controller: 'MenuspercategoryCtrl',
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
      .otherwise({
        redirectTo: '/'
      });
  });
