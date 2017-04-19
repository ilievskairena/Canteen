(function(){

    'use strict';

/**
 * @ngdoc service
 * @name canteenApp.AuthenticationService
 * @description
 * # AuthenticationService
 * Service in the canteenApp.
 */
 
 /* jshint latedef:nofunc */
 
    angular.module('canteenApp')
    .service('AuthenticationService', AuthenticationService);

    AuthenticationService.$inject = ['$http', '$q', 'localStorageService', 'APP_CONFIG', '$location'];

    function AuthenticationService($http, $q, localStorageService, APP_CONFIG, $location) {
 
        var serviceBase = APP_CONFIG.BASE_URL;
        var authServiceFactory = {
            login: _login,
            logOut: _logOut,
            fillAuthData: _fillAuthData,
            authentication: _authentication
        };
     
        var _authentication = {
            isAuth: false,
            userName : ""
        };

        return authServiceFactory;
 
        function _login(loginData) {
 
            var data = "grant_type=password&username=" + loginData.username + "&password=" + encodeURIComponent(loginData.password);
     
            var deferred = $q.defer();
     
            $http.post(serviceBase + APP_CONFIG.token, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
            .then(function successCallback(response){
                localStorageService.set('authorizationData', { token: response.data.access_token, userName: loginData.userName });
     
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;
     
                deferred.resolve(response.data);
            }, function errorCallback(response){
                _logOut();
                deferred.reject(response.data);
            });
     
            return deferred.promise;
        }
 
        function _logOut() {
 
            localStorageService.remove('authorizationData');
            localStorageService.remove('user');
            _authentication.isAuth = false;
            _authentication.userName = "";

            $location.path("/login");
        }
 
        function _fillAuthData() {
 
            var authData = localStorageService.get('authorizationData');
            if (authData)
            {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
            }
        }
    }
})();
