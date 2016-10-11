'use strict';
/**
 * @ngdoc service
 * @name canteenApp.SERVICE_URLS
 * @description
 * # SERVICE_URLS
 * Constant in the canteenApp.
 */

 angular.module('canteenApp').constant('APP_CONFIG', {
 	BASE_URL: "http://localhost:59700",
 	users: "/api/users",
 	meals: "/api/meals",
 	mealsByDate: "/api/meals/MealByDate",
 	orders: "/api/orders",
 	orders_delete: "/api/orders/delete/",
 	thirdShiftPlan: "/api/orders/thirdShiftPlanning",
 	unplanedMeal: "/api/orders/unplaned"
 });
