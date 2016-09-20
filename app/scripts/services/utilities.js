'use strict';

/**
 * @ngdoc service
 * @name canteenApp.utility
 * @description
 * # utility
 * Service in the canteenApp.
 */

 angular.module('canteenApp').service('utility', function ($http, APP_CONFIG) {

 	this.getAllCostCenters = function() {
            return $http.get(APP_CONFIG.BASE_URL+"/api/costcenter").then(function(result) {
                return result;
            });
        };

    this.getUserPerID = function(userID) {
            return $http.get(APP_CONFIG.BASE_URL+"/api/users/"+userID).then(function(result) {
                return result;
            });
        }; 

    this.getMealTypes = function() {
            return $http.get(APP_CONFIG.BASE_URL+"/api/mealtype").then(function(result) {
                return result;
            });
        };       
 });