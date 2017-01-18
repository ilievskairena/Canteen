(function(){

    'use strict';

/**
 * @ngdoc service
 * @name canteenApp.authInterceptorService
 * @description
 * # authInterceptorService
 * Service in the canteenApp.
 */
 
    angular.module('canteenApp')
    .service('authInterceptorService', authInterceptorService);

    authInterceptorService.$inject = ['$q', '$location', 'localStorageService'];

    
    function authInterceptorService($q, $location, localStorageService) {
 
        var authInterceptorServiceFactory = {
            request: _request,
            responseError: _responseError
        };

        return authInterceptorServiceFactory;
     
        function _request(config) {
     
            config.headers = config.headers || {};
     
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;
            }
     
            return config;
        }
     
        function _responseError(rejection) {
            if (rejection.status === 401) {
                $location.path('/login');
            }
            return $q.reject(rejection);
        }
    }
})();

