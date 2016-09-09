'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:MenusCtrl
 * @description
 * # MenusCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
  .controller('MenusCtrl', function () {
    this.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];

  var weekday = new Array(7);
	weekday[0]=  "Недела";
	weekday[1] = "Понеделник";
	weekday[2] = "Вторник";
	weekday[3] = "Среда";
	weekday[4] = "Четврток";
	weekday[5] = "Петок";
	weekday[6] = "Сабота";
    var vm = this;
    vm.menuForDate = function(){
    	return new Date();
    };
    vm.dayOfWeek = function(){
    	return weekday[new Date().getDay()];
    };

	vm.roles = [
    {id: 1, text: 'guest'},
    {id: 2, text: 'user'},
    {id: 3, text: 'customer'},
    {id: 4, text: 'admin'},
    {id: 5, text: 'soup'},
    {id: 6, text: 'nutela'},
    {id: 7, text: 'tee'},
    {id: 8, text: 'sth'},
    {id: 9, text: 'guest'},
    {id: 10, text: 'user'},
    {id: 11, text: 'customer'},
    {id: 12, text: 'admin'},
    {id: 13, text: 'soup'},
    {id: 14, text: 'nutela'},
    {id: 15, text: 'tee'},
    {id: 16, text: 'sth'}
  ];
  vm.user = {
    roles: [vm.roles[1]]
  };
  vm.checkAll = function() {
    vm.user.roles = angular.copy(vm.roles);
  };
  vm.uncheckAll = function() {
    vm.user.roles = [];
  };
  vm.checkFirst = function() {
    vm.user.roles = [];
    vm.user.roles.push(vm.roles[0]);
  };
  vm.setToNull = function() {
    vm.user.roles = null;
  };

  });
