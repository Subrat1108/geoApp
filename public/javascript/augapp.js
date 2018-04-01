"use strict";
var app = angular.module('augApp', ['ngRoute', 'ngCookies']).run(function($http, $rootScope,$cookieStore){

	$rootScope.initApp = function() {
		// Listening for auth state changes.
		// [START authstatelistener]
		firebase.auth().onAuthStateChanged(function(user) {
		  if (user) {
			// User is signed in.
			$cookieStore.put('email', user.email);
			$cookieStore.put('emailVerified', user.emailVerified);
			$cookieStore.put('uid', user.uid);
			$cookieStore.put('authentication', true);
		  } else {
			$cookieStore.put('authentication', false);
		  }
		  
		});

    $rootScope.user_id = $cookieStore.get('uid');
	$rootScope.authenticated = $cookieStore.get('authentication');
	$rootScope.emailVerified = $cookieStore.get('emailVerified');
    };

	window.onload = function(){
		$rootScope.initApp();
		console.log($rootScope.user_id);
		};
	
  
	  $rootScope.signout = function(){
		firebase.auth().signOut();
		$cookieStore.remove('uid');
		$cookieStore.remove('authentication');
		$rootScope.initApp();
	};
});

/* route configuration*/

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

/* controllers*/

app.controller("authController", function($scope,$cookieStore,$rootScope,$location,$route){

	$scope.user = {email: '', password: '', userName: '', company:''};
	$scope.error_message = '';

	$scope.login = function() {
		  
		  firebase.auth().signInWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function(error) {
			// Handle Errors here.
			var  errorCode = error.code;
			 var errorMessage = error.message;
			// [START_EXCLUDE]
			if (errorCode === 'auth/wrong-password') {
			  alert('Wrong password.');
			} else {
			  alert(errorMessage);
			}
			console.log(error);
			// [END_EXCLUDE]
		  }).then(function(){

				$rootScope.initApp();
				window.location.reload();

			});

			$location.path('/');
	  };
	  /**
	   * Handles the sign up button press.
	   */
	  $scope.register = function() {
		if ($scope.user.email.length < 4) {
		  alert('Please enter an email address.');
		  return;
		}
		if ($scope.user.password.length < 4) {
		  alert('Please enter a password.');
		  return;
		}
		// Sign in with email and pass.
		// [START createwithemail]
		firebase.auth().createUserWithEmailAndPassword($scope.user.email, $scope.user.password).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // [START_EXCLUDE]
		  if (errorCode == 'auth/weak-password') {
			alert('The password is too weak.');
		  } else {
			alert(errorMessage);
		  }
		  console.log(error);
		  // [END_EXCLUDE]
		}).then(function() {
			// [START sendemailverification]
			firebase.auth().currentUser.sendEmailVerification().then(function() {
			  // Email Verification sent!
			  // [START_EXCLUDE]
			  alert('Email Verification Sent!');
			  // [END_EXCLUDE]
			});
		}).then(function(){

			$rootScope.initApp();
			window.location.reload();

		});

		$location.path('/');
	  };
	  
	  
		
	  
	  
	   $scope.sendPasswordReset= function() {
		var email = $scope.email
		// [START sendpasswordemail]
		firebase.auth().sendPasswordResetEmail(email).then(function() {
		  // Password Reset Email Sent!
		  // [START_EXCLUDE]
		  alert('Password Reset Email Sent!');
		  // [END_EXCLUDE]
		}).catch(function(error) {
		  // Handle Errors here.
		  var errorCode = error.code;
		  var errorMessage = error.message;
		  // [START_EXCLUDE]
		  if (errorCode == 'auth/invalid-email') {
			alert(errorMessage);
		  } else if (errorCode == 'auth/user-not-found') {
			alert(errorMessage);
		  }
		  console.log(error);
		  // [END_EXCLUDE]
		});
		// [END sendpasswordemail];
	  }

});

app.controller("mainController", function($scope,$cookieStore){
});


/* services*/