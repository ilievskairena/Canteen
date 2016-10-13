'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the canteenApp
 */
angular.module('canteenApp')
.controller('LoginCtrl', function (AuthenticationService, localStorageService, $http, $rootScope, $location, $cookieStore, ngProgressFactory, toastr, APP_CONFIG, utility) {
  var vm = this;
	vm.progressBar = ngProgressFactory.createInstance();
 	vm.user = {
 		username: "",
 		password: ""
 	};

  $rootScope.isLogin = true;
 	if(utility.isAuthenticated()) {
 		$location.path('/');
 	}


  vm.login = function() {
    vm.progressBar.setColor('#8dc63f');
    vm.progressBar.start();
  	AuthenticationService.login(vm.user).then(
  	function(response)
  	{
  		vm.profileProperties();
  	},
  	function(error) {
	    vm.progressBar.setColor('red');
	    vm.progressBar.reset();
	    toastr.error("Погрешно корисничко име или лозинка!");
  	});
  };

	vm.profileProperties = function() {
		$http({
      method: 'GET',
      crossDomain: true,
      url:  APP_CONFIG.BASE_URL + APP_CONFIG.user_properties
  	}).
  	success(function(data) {
  		console.log(data);
      localStorageService.set('user', data);
	    vm.progressBar.complete();
  		$rootScope.isLogin = false;
  		$rootScope.userName = data.Name;
      $rootScope.roleName = data.RoleName;
      $rootScope.roleId = data.RoleID;
  		$location.path('#/');
  	}).
  	error(function(data, status, headers, config) {
	    vm.progressBar.setColor('red');
	    vm.progressBar.reset();
	    toastr.error("Грешка при најава, ве молиме обидете се повторно!");
  	});
  }; 
});
