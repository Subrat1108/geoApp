"use strict";
var app = angular.module('augApp', ['ngRoute', 'ngCookies']).run(function($http, $rootScope,$cookieStore) {

});

app.config(function($routeProvider){
    $routeProvider
    .when('/', {
			templateUrl: 'main.html',
			controller: 'mainController'
		})
		
		.when('/login', {
			templateUrl: 'login.html',
			controller: 'authController'
		})
		
		.when('/register', {
			templateUrl: 'register.html',
			controller: 'authController'
		})

});

app.controller("authController", function($scope,$cookieStore){
});

app.controller("mainController", function($scope,$cookieStore){
});


