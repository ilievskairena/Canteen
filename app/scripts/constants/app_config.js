'use strict';
/**
 * @ngdoc service
 * @name canteenApp.SERVICE_URLS
 * @description
 * # SERVICE_URLS
 * Constant in the canteenApp.
 */

 angular.module('canteenApp').constant('APP_CONFIG', {
 	BASE_URL: "http://localhost:59710",
 	token: "/token",
 	client_orders: "/api/client/orders",
 	config: "/api/config",
 	config_save: "/api/config/save",
 	costcenter: "/api/costcenter",
 	costcenter_update: "/api/costcenter/update",
 	costcenter_insert: "/api/costcenter/update",
 	client_orders_save: "/api/client/save",
 	charts_order_cost_centers: "/api/reports/ordersCenter",
 	charts_realization_ratio: "/api/reports/realizationRatio",
 	charts_realization_by_cost_center: "/api/reports/realizationCostCenter",
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
 	meals_default: "/api/meals/default",
 	mealtype: "/api/mealtype",
 	mealtype_insert: "/api/mealtype/insert",
 	menu: "/api/meals/menu",
 	orders: "/api/orders",
 	orders_existing: "/api/orders/existing",
 	orders_delete: "/api/orders/delete/",
 	orders_thidshift: "/api/orders/thirdshift",
 	orders_workers: "/api/orders/workers",
 	reports_orders_period : "/api/reports/ordersPeriod",
 	reports_orders_cost_center: "/api/reports/ordersPerCostCenter",
 	reports_orders_next_week: "/api/reports/orderPlan",
 	reports_realized_ratio: "/api/reports/realizedUnrealized",
 	reports_planned_unplanned: "/api/reports/plannedUnplanned",
 	reports_realized_ratio_full: "/api/reports/realizationRatioFull",
 	reports_workers_guests: "/api/reports/workersGuests",
 	reports_workers_guests_full: "/api/reports/workersGuestsFull",
 	reports_employees_plan: "/api/reports/employeesPlanning",
 	thirdShiftPlan: "/api/orders/thirdShiftPlanning",
 	orders_realized: "/api/orders/realized",
 	unplanedMeal: "/api/orders/unplaned",
 	users: "/api/users",
 	users_insert: "/api/users/insert",
 	user_properties: "/api/account/properties"
 });
