(function(){

  'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:LoginCtrl
 * @description
 * # LoginCtrl
 * Controller of the canteenApp
 */
 
  angular.module('canteenApp')
  .controller('LoginCtrl', LoginCtrl);

  LoginCtrl.$inject = ['AuthenticationService', 'localStorageService', '$http', '$rootScope', '$location', '$cookieStore', 'ngProgressFactory', 'toastr', 'APP_CONFIG', 'utility'];

  function LoginCtrl(AuthenticationService, localStorageService, $http, $rootScope, $location, $cookieStore, ngProgressFactory, toastr, APP_CONFIG, utility) {
    
    var vm = this;

    vm.progressBar = ngProgressFactory.createInstance();
    vm.user = {
      username: "",
      password: ""
    };

    // Functions

    vm.login = login;
    vm.profileProperties = profileProperties;

    // Init

    $rootScope.isLogin = true;
    if(utility.isAuthenticated()) {
      $location.path('/');
    }
    
    // Define functions here

    function login() {
      vm.progressBar.setColor('#8dc63f');
      vm.progressBar.start();
      AuthenticationService.login(vm.user).then(
        function(response)
        {
          vm.profileProperties();
        },
        function(error) 
        {
         vm.progressBar.setColor('red');
         vm.progressBar.reset();
         toastr.error("Погрешно корисничко име или лозинка!");
        }
      );
    }

    function profileProperties() {
      $http({
        method: 'GET',
        crossDomain: true,
        url:  APP_CONFIG.BASE_URL + APP_CONFIG.user_properties
      }).then(function successCallback(response){
        var data = response.data;
        localStorageService.set('user', data);
        vm.progressBar.complete();
        $rootScope.isLogin = false;
        $rootScope.userName = data.Name;
        $rootScope.roleName = data.RoleName;
        $rootScope.roleId = data.RoleID;
        $location.path('#/');
      }, function errorCallback(response){
        vm.progressBar.setColor('red');
        vm.progressBar.reset();
        toastr.error("Грешка при најава, ве молиме обидете се повторно!");
      });
    } 
  }
})();
 
