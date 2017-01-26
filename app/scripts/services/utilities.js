(function(){

    'use strict';

/**
 * @ngdoc service
 * @name canteenApp.utility
 * @description
 * # utility
 * Service in the canteenApp.
 */
  /* jshint latedef:nofunc */
    angular.module('canteenApp')
    .service('utility', utility);

    utility.$inject = ['$http', 'APP_CONFIG', 'localStorageService', '$location', '$rootScope', 'tableService', '$q'];

    function utility($http, APP_CONFIG, localStorageService, $location, $rootScope, tableService, $q) {
        /* jshint validthis: true */
        this.getAllCostCenters = getAllCostCenters;
        this.getUserPerID = getUserPerID;
        this.getMealTypes = getMealTypes;
        this.compareArrays = compareArrays;
        this.getUsers = getUsers;
        this.getWeekNumber = getWeekNumber;
        this.getAvailableDates = getAvailableDates;
        this.getConfig = getConfig;
        this.isAuthenticated = isAuthenticated;
        this.getLoggedInUser = getLoggedInUser;
        this.downloadStatistics = downloadStatistics;
        this.statToExcel = statToExcel;
        this.getPlanByDateRage = getPlanByDateRage;
        this.getOrdersByDateRage = getOrdersByDateRage;
        this.getThisWeekEnd = getThisWeekEnd;
        this.getNextWeekStart = getNextWeekStart;
        this.getWorkerOrders = getWorkerOrders;


        function getAllCostCenters() {
            return $http.get(APP_CONFIG.BASE_URL+"/api/costcenter").then(function(result) {
                return result;
            });
        }

        function getUserPerID(userID) {
            return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.users+"/"+userID).then(function(result) {
                return result;
            });
        }

        function getMealTypes() {
            return $http.get(APP_CONFIG.BASE_URL+"/api/mealtype").then(function(result) {
                return result;
            });
        } 

        function compareArrays(arrayOne, arrayTwo) {
            var result = true;
            if(arrayOne.length === arrayTwo.length) {   
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
            else{
              result = false;  
            } 
            return result;
        }  

        function getUsers() {
            return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.users).then(function(result) {
                return result;
            });
        }

        function getWeekNumber(d) {
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
        }

        function getAvailableDates() {
            return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.dates_allowed).then(function(result) {
                return result;
            });
        }

        function getConfig() {
            return $http.get(APP_CONFIG.BASE_URL+APP_CONFIG.config).then(function(result) {
                return result;
            });
        } 

        function isAuthenticated() {
            var user = localStorageService.get('user');
            if(user === null || user === undefined) {
                return false;
            }
            else {
                $rootScope.userName = user.Name;
                $rootScope.roleName = user.RoleName;
                $rootScope.roleId = user.RoleID;
                return true;
            }
        }

        function getLoggedInUser() {
            var user = localStorageService.get('user');
            if(user === null || user === undefined) {
                $location.path('/login');
                return null;
            }
            else {
                $rootScope.isLogin = false;
                return user;
            }
        }

        function downloadStatistics(data, name) {
            var html = tableService.getTable(data, "MK");
            var fileName = name;
            statToExcel(fileName, html);
            
        }

        function statToExcel(fileName, html) {
            var FileName = fileName + ".xls";
            var fileRaw = html;
            var sheetName = FileName;
            fileRaw = fileRaw.split("↑").join("");
            var file = fileRaw.split("↓").join("");
            var uri = 'data:application/vnd.ms-excel;base64,',
            template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><?xml version="1.0" encoding="UTF-8" standalone="yes"?><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--></head><body>{table}</body></html>',
            base64 = function(s) { return window.btoa(unescape(encodeURIComponent(s)));},
            format = function(s, c) { return s.replace(/{(\w+)}/g, function(m, p) { return c[p]; });};

            var toExcel = file;
            var ctx = {
                worksheet: sheetName || '',
                table: toExcel
            };

            var link = document.createElement('a');
            link.download = fileName;
            link.href = uri + base64(format(template, ctx));
            link.click();
        }   


        //extra from client view

        function getPlanByDateRage(dateFrom, dateTo) {
            return $http.get(APP_CONFIG.BASE_URL + APP_CONFIG.meals_by_date + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo).
            then(function(result) {
                return result;
            });
        }

        function getOrdersByDateRage(dateFrom, dateTo) {
            return $http.get(APP_CONFIG.BASE_URL + APP_CONFIG.client_orders + "?dateFrom=" + dateFrom + "&dateTo=" + dateTo).
            then(function(result) {
                return result;
            });
        }

        function getThisWeekEnd(date) {
            var day = date.getDay();
            //0 - Sunday
            //1- Monday
            //...6 - Saturday
            var end = new Date(date);
            if(day === 5) {
                return date;
            }
            else {
                end.setDate(end.getDate() + (5 - day));
            }
            return end;
        }

        function getNextWeekStart() {
            var today = new Date();
            var day = today.getDay();
            //0 - Sunday
            //1- Monday
            //...6 - Saturday
            if(day === 0) {
                today.setDate(today.getDate() + 1);
            }
            else {
                today.setDate(today.getDate() + (8 - day));
            }
            return today;
        }

        function getWorkerOrders(date) {
            var deferred = $q.defer();
            $http({
              method: 'GET',
              crossDomain: true,
              url:  APP_CONFIG.BASE_URL + APP_CONFIG.orders_workers + "?date=" +  date
            }).then(function successCallback(response){
                return deferred.resolve(response.data);
            }, function errorCallback(response){
                deferred.reject(response.data);
            });
            return deferred.promise;
        }
    }
})();