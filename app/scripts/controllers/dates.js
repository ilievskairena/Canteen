(function(){

    'use strict';

/**
 * @ngdoc function
 * @name canteenApp.controller:DatesCtrl
 * @description
 * # DatesCtrl
 * Controller of the canteenApp
 */

 /* jshint latedef:nofunc */
 
 angular.module('canteenApp')
 .controller('DatesCtrl', DatesCtrl);

 DatesCtrl.$inject = ['$rootScope', 'roleService', '$location', '$filter', '$http', 'MaterialCalendarData', 'APP_CONFIG', 'ngTableParams', 'toastr', 'utility'];

 function DatesCtrl($rootScope, roleService, $location, $filter, $http, MaterialCalendarData, APP_CONFIG, ngTableParams, toastr, utility) {
/* jshint validthis: true */
    var vm = this;

        //Keep the dates that were set as holidays
        vm.dates = [];
        //Keeps list of dates objest that are set as holidays
        vm.dateObjectList = [];

        //Original GET data
        vm.originalData = [];
        //Flag whether there were changes to the holiday list
        vm.changes = false;
        vm.watchArrays = false;
        //Keeps the current year and the next
        var today = new Date();
        vm.selectedYear = today.getFullYear();
        vm.availableYears = [today.getFullYear(), (today.getFullYear()+1)];
        vm.saveButtonDisabled = false;

        // Functions

        vm.checkChanges = checkChanges;
        vm.createDates = createDates;
        vm.dayClick = dayClick;
        vm.getAllDates = getAllDates;
        vm.saveDates = saveDates;
        vm.setAvailableYears = setAvailableYears;
        vm.setDayContent = setDayContent;
        vm.setDirection = setDirection;
        vm.setOpen = setOpen;
        vm.sortDates = sortDates;
        vm.updateDates = updateDates;

        // Init

        $rootScope.isLogin = false;
        if(!utility.isAuthenticated()) {
            $location.path('/login');
        }

        vm.loggedInUser = utility.getLoggedInUser();
        var path = $location.path();
        if(!roleService.hasPermission(path, vm.loggedInUser.RoleID)) 
        {
            $location.path("/");
        }
        
        getAllDates();

        // Define Functions here

        function checkChanges() {
            vm.changes = !utility.compareArrays(vm.dateObjectList, vm.originalData);
        }

        function createDates() {
            sortDates();
            vm.saveButtonDisabled = true;
            $http({
                method: 'POST',
                data: vm.dateObjectList,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.dates_insert
            }).then(function successCallback(response){
                toastr.success("Податоците се успешно внесени.");
                getAllDates();
                vm.changes = false;
                vm.saveButtonDisabled = false;
            }, function errorCallback(response){
                console.log("Error inserting dates");
                vm.saveButtonDisabled = false;
            });
        }

        function dayClick(date) {
            if(vm.dates[date] === undefined){
                vm.dates[date] = 0;
            }
            setOpen(date);
        }



        function getAllDates(){
            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.dates_by_year + "?year=" + vm.selectedYear
            }).then(function successCallback(response){
                var data = response.data;
                //console.log(data);
                vm.dates = [];
                vm.dateObjectList = [];
                vm.originalData = [];

                for(var i in data) {
                    var dateObj = data[i];
                    var date = new Date(dateObj.Date);
                    date.setHours(0);
                    date.setMinutes(0);
                    date.setSeconds(0);
                    vm.dates[date] = 1;
                    MaterialCalendarData.setDayContent(date, '<p>Празник</p>');
                    vm.dateObjectList.push({date:$filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")});
                    vm.originalData.push({date:$filter('date')(date, "yyyy-MM-dd HH:mm:ss.sss")});
                }

                vm.datesTable = new ngTableParams(
                {
                    page: 1,
                    count: 10
                }, 
                {
                    total: data.length,
                    //Hide the count div
                    counts: [],
                    getData: function($defer, params) {
                        // var filter = params.filter();
                        // var sorting = params.sorting();
                        var count = params.count();
                        var page = params.page();
                        //var filteredData = filter ? $filter('filter')(vm.data, filter) : vm.data

                        $defer.resolve(data.slice((page - 1) * count, page * count));
                    }
                }
                );
            }, function errorCallback(response){
                console.log("Error getting dates");
            });
        }

        function saveDates(){

            $http({
                method: 'GET',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.dates_last
            }).then( function successCallback(response){
                if(response.data === null){
                    createDates();
                    return;
                }
                var year = response.data.split('-')[0];
                var createNewDates = 0;
                for(var i = 0; i < vm.dateObjectList.length; i++){
                    var date = vm.dateObjectList[i];
                    var temp_year = date.date.split('-')[0];
                    if(temp_year > year)
                    {
                        createNewDates = 1;
                        break;
                    }
                }

                if(createNewDates === 0){
                    if(today.getFullYear() <= parseInt(year)){
                        updateDates();
                    }
                    else{
                        createDates();
                    }
                }
                else{
                    createDates();
                }

            }, function errorCallback(response){
                toastr.error("Грешка при промена на датумите. Ве молиме обидете се повторно!");
            });
        }

        function setAvailableYears() {
            var currentYear = (new Date()).getFullYear();
            vm.availableYears.push(currentYear);
            vm.availableYears.push(currentYear+1);
            vm.selectedYear = vm.availableYears[0];
        }


        function setDayContent(date,content) {
            content = "";
            //console.log(date.dayOfTheWeek);
            if(date.getDay() === 0 || date.getDay() === 6){
                content = '<p>Викенд</p>';
            }
            return content;
        }
        
        function setDirection(direction) {
            vm.direction = direction;
        }

        function setOpen(date) {
            //Validate the selected year
            var minDate = new Date();
            minDate.setDate(1);
            minDate.setMonth(0);
            minDate.setFullYear(vm.selectedYear);
            minDate.setHours(0,0,0);
            var maxDate = new Date();
            maxDate.setDate(31);
            maxDate.setMonth(12);
            maxDate.setFullYear(vm.selectedYear+1);
            maxDate.setHours(0,0,0);
            if((minDate > date || maxDate < date) && minDate.toString() !== date.toString()) {
                toastr.error("Не смеете да внесувате за оваа календарска година. Одберете календарска година од понудените!");
                return;
            }

            //check if the date is already set as Holiday, if not add the date as holiday to the list
            if(vm.dates[date] === 0) {
              vm.dates[date] = 1;

              vm.dateObjectList.push({date:$filter('date')(new Date(date), "yyyy-MM-dd HH:mm:ss.sss")});
              MaterialCalendarData.setDayContent(date, '<p>Празник</p>');
          } 
          else 
          {
            vm.dates[date] = 0;
                //remove the date that was set as Holiday from the list of dates
                var tempObjectList = vm.dateObjectList.filter(function(el) {
                    if(el.date !== $filter("date")(date, "yyyy-MM-dd HH:mm:ss.sss")){
                        return el;
                    }
                });
                vm.dateObjectList = tempObjectList;
                if(date.getDay() === 0 || date.getDay() === 6) {
                    MaterialCalendarData.setDayContent(date, '<p>Викенд</p>');
                }    
                else
                {
                    MaterialCalendarData.setDayContent(date, '<p></p>');
                }      
            }  
            checkChanges();   
        }

        function sortDates(){
            var tempList = $filter('orderBy')(vm.dateObjectList, "date");
            vm.dateObjectList = tempList;
        }

        function updateDates() {
            sortDates();
            vm.saveButtonDisabled = true;
            $http({
                method: 'PUT',
                data: vm.dateObjectList,
                contentType:'application/json',
                crossDomain: true,
                url: APP_CONFIG.BASE_URL + APP_CONFIG.dates_update
            }).then(function successCallback(response){
                toastr.success("Празниците се успешно променети.");
                getAllDates();
                vm.changes = false;
                vm.saveButtonDisabled = false;
            }, function errorCallback(response){
                toastr.error("Грешка при внесување на датумите. Ве молиме обидете се повторно!");
                console.log("Error inserting dates");
                vm.saveButtonDisabled = false;
            });
        }
    }
})();

