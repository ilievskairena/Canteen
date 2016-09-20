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

    this.compareArrays = function(arrayOne, arrayTwo) {
        var result = true;
        if(arrayOne.length == arrayTwo.length) {   
            for (var i = 0; i < arrayOne.length; i++) {
                var value1 = arrayOne[i];
                var isDateFound = false;
                for (var j = 0; j < arrayTwo.length; j++) {
                    var  value2 = arrayTwo[j];
                    if (value1.date === value2.date) {
                        isDateFound = true;
                        break;
                    }
                }
                if(!isDateFound) {
                    result = false;
                    break;
                }
            }
        }
        else result = false;
        return result;
    };  
 });