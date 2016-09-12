'use strict';

/**
 * @ngdoc service
 * @name canteenApp.utility
 * @description
 * # utility
 * Service in the canteenApp.
 */

 angular.module('canteenApp').service('utility', function ($http, APP_CONFIG) {
 	
 	var vm = this;

 	this.getAllCostCenters = function() {
            return $http.get(APP_CONFIG.BASE_URL+"/api/costcenter").then(function(result) {
                return result;
            });
        };
 });