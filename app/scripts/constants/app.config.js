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
 	token: "/token",
 	config: "/api/config",
 	config_save: "/api/config/save",
 	costcenter: "/api/costcenter",
 	costcenter_update: "/api/costcenter/update",
 	charts_order_cost_centers: "/api/reports/ordersCenter",
 	charts_realization_ratio: "/api/reports/realizationRatio",
 	charts_realization_by_cost_center: "/api/reports/realizationCostCenter",
 	reports_orders_period : "/api/reports/ordersPeriod",
 	reports_orders_cost_center: "/api/reports/ordersPerCostCenter",
 	dates:"/api/dates",
 	dates_by_year: "/api/dates/GetDates",
 	dates_range: "/api/dates/range",
 	dates_allowed: "/api/dates/allowed",
 	dates_update: "/api/dates/update",
 	dates_insert: "/api/dates/insert",
 	employeespershift: "/api/employeespershift/save",
 	employees_per_shift_existing: "/api/employeespershift/existing",
 	login: "/api/account/login",
 	meals: "/api/meals",
 	meals_insert: "/api/meals/insert",
 	meals_by_date: "/api/meals/MealByDate",
 	meals_per_type: "/api/meals/MealsPerType",
 	mealtype: "/api/mealtype",
 	mealtype_insert: "/api/mealtype/insert",
 	menu: "/api/meals/menu",
 	orders: "/api/orders",
 	orders_existing: "/api/orders/existing",
 	orders_delete: "/api/orders/delete/",
 	orders_thidshift: "/api/orders/thirdshift",
 	thirdShiftPlan: "/api/orders/thirdShiftPlanning",
 	orders_realized: "/api/orders/realized",
 	unplanedMeal: "/api/orders/unplaned",
 	users: "/api/users",
 	users_insert: "/api/users/insert",
 	user_properties: "/api/account/properties"
 });
