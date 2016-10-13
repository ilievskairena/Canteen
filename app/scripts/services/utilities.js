'use strict';

/**
 * @ngdoc service
 * @name canteenApp.utility
 * @description
 * # utility
 * Service in the canteenApp.
 */

 angular.module('canteenApp').service('utility', function ($http, APP_CONFIG, localStorageService, $location, $rootScope) {

 	this.getAllCostCenters = function() {
        return $http.get(APP_CONFIG.BASE_URL+"/api/costcenter").then(function(result) {
            return result;
        });
    };

    this.getUserPerID = function(userID) {
        return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.users+"/"+userID).then(function(result) {
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

    this.getUsers = function() {
        return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.users).then(function(result) {
            return result;
        });
    };

    this.getWeekNumber = function(d) {
         // Copy date so don't modify original
        d = new Date(+d);
        d.setHours(0,0,0);
        // Set to nearest Thursday: current date + 4 - current day number
        // Make Sunday's day number 7
        d.setDate(d.getDate() + 4 - (d.getDay()||7));
        // Get first day of year
        var yearStart = new Date(d.getFullYear(),0,1);
        // Calculate full weeks to nearest Thursday
        var weekNo = Math.ceil(( ( (d - yearStart) / 86400000) + 1)/7);
        // Return array of year and week number
        return [d.getFullYear(), weekNo];
    };

    this.getAvailableDates = function() {
        return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.dates_allowed).then(function(result) {
            return result;
        });
    };

    this.getConfig = function() {
        return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.config).then(function(result) {
            return result;
        });
    }; 

    this.isAuthenticated = function() {
        var user = localStorageService.get('user');
        if(user == null || user == undefined) {
            return false;
        }
        else {
            $rootScope.userName = user.Name;
            $rootScope.roleName = user.RoleName;
            $rootScope.roleId = user.RoleID;
            return true;
        }
    };

    this.getLoggedInUser = function() {
        var user = localStorageService.get('user');
        if(user == null || user == undefined) {
            $location.path('/login');
            return null;
        }
        else {
            $rootScope.isLogin = false;
            return user;
        }
    }
 });