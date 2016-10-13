'use strict';

/**
 * @ngdoc service
 * @name canteenApp.AuthenticationService
 * @description
 * # AuthenticationService
 * Service in the canteenApp.
 */
angular.module('canteenApp')
.service('AuthenticationService', ['$http', '$q', 'localStorageService', 'APP_CONFIG', '$location', 
function ($http, $q, localStorageService, APP_CONFIG, $location) {
 
    var serviceBase = APP_CONFIG.BASE_URL;
    var authServiceFactory = {};
 
    var _authentication = {
        isAuth: false,
        userName : ""
    };
 
    var _login = function (loginData) {
 
        var data = "grant_type=password&username=" + loginData.username + "&password=" + loginData.password;
 
        var deferred = $q.defer();
 
        $http.post(serviceBase + APP_CONFIG.token, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
        .success(function (response) {
 
            localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName });
 
            _authentication.isAuth = true;
            _authentication.userName = loginData.userName;
 
            deferred.resolve(response);
 
        })
        .error(function (err, status) {
            _logOut();
            deferred.reject(err);
        });
 
        return deferred.promise;
    };
 
    var _logOut = function () {
 
        localStorageService.remove('authorizationData');
        localStorageService.remove('user');
        _authentication.isAuth = false;
        _authentication.userName = "";

        $location.path("/login");
    };
 
    var _fillAuthData = function () {
 
        var authData = localStorageService.get('authorizationData');
        if (authData)
        {
            _authentication.isAuth = true;
            _authentication.userName = authData.userName;
        }
    };
 
    authServiceFactory.login = _login;
    authServiceFactory.logOut = _logOut;
    authServiceFactory.fillAuthData = _fillAuthData;
    authServiceFactory.authentication = _authentication;
 
    return authServiceFactory;
}]);