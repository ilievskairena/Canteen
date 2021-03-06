(function(){

    'use strict';

/**
 * @ngdoc service
 * @name canteenApp.roleService
 * @description
 * # roleService
 * Service in the canteenApp.
 */

/* jshint latedef:nofunc */

    angular.module('canteenApp')
    .service('roleService', roleService);

    function roleService() {
        //Route - [Allowed Roles ID]
        var routes = {
            "/": [1,2,3,4,5,6],
            "/users": [1],
            "/costCenter": [1],
            "/cards": [1],
            "/meals": [1,4,6],
            "/mealType": [1,4,6],
            "/menu/planning": [1,4,6],
            "/dates": [1],
            "/menu/preview": [1,4],
            "/planning/thirdshift": [1,2],
            "/planning/unplanned": [1,2],
            "/planning/workers": [1,2],
            "/employeesPerShift": [1,2],
            "/makeOrdersNextWeek": [1,2,5,6],
            "/config": [1],
            // redundant routes?
            // "/users": [1],
            // "/users": [1],
            // "/users": [1],
            // "/users": [1],
            "/reports/orders" : [1,4,6],
            "/reports/ordersPerCostCenter" : [1,4,6],
            '/reports/nextWeek': [1,4,6],
            '/reports/realizedUnrealized':[1,4,6],
            '/reports/workersGuests' : [1,4,6],
            '/reports/plannedUnplanned' : [1,4,6],
            '/reports/employeesPlan' : [1,4,6],
            //Menu root folder
            "administration": [1],
            "menus": [1,4,6],
            "menus-plan-preview": [1,4,6],
            "planning": [1,2],
            "reports": [1,4,6]
        };

        this.hasPermission = hasPermission;

        // Define functions here

        function hasPermission(route, roleId) {
            return routes[route].indexOf(roleId) !== -1;
        }
    }
})();