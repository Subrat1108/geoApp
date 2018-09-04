"use strict";
var app = angular.module('augApp', ['ngRoute']);
app.controller("mainController", function($scope,$http){

	$scope.fetch_coordinates = function(){
		$http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+$scope.first+'&key=AIzaSyAOKdl_94CDrw07Sz3uX8SHpzJFagopRgs').then(function(res){
			$scope.coordinates1 = res.data.results[0].geometry.location;
			$http.get('https://maps.googleapis.com/maps/api/geocode/json?address='+$scope.sec+'&key=AIzaSyAOKdl_94CDrw07Sz3uX8SHpzJFagopRgs').then(function(res){
			$scope.coordinates2 = res.data.results[0].geometry.location;
			$scope.coordinates3={};
			$scope.coordinates3.lat=($scope.coordinates2.lat+$scope.coordinates1.lat)/2;
			$scope.coordinates3.lng=($scope.coordinates2.lng+$scope.coordinates1.lng)/2;
			$http.get('https://maps.googleapis.com/maps/api/geocode/json?latlng='+$scope.coordinates3.lat+','+$scope.coordinates3.lng+'&key=AIzaSyAOKdl_94CDrw07Sz3uX8SHpzJFagopRgs').then(function(res){
				$scope.coordinates3.formatted_address = res.data.results[0].formatted_address;
			});
		});
		});
	}
});
app.service('loadGoogleMapAPI', ['$window', '$q', 
    function ( $window, $q ) {

        var deferred = $q.defer();

        // Load Google map API script
        function loadScript() {  
            // Use global document since Angular's $document is weak
            var script = document.createElement('script');
            script.src = '//maps.googleapis.com/maps/api/js?key=AIzaSyDT_SZX9qDRkhUxfU6htemGWL0QuKJbEjY&sensor=false&language=en&callback=initMap';
            document.body.appendChild(script);
        }

        // Script loaded callback, send resolve
        $window.initMap = function () {
            deferred.resolve();
        }

        loadScript();

        return deferred.promise;
		}]);
		
		// Google Map
app.directive('googleMap', ['$rootScope', 'loadGoogleMapAPI', 
function( $rootScope, loadGoogleMapAPI ) {  

		return {
				restrict: 'C', // restrict by class name
				scope: {
						mapId: '@id', // map ID
						lat: '@',     // latitude
						long: '@'     // longitude
				},
				link: function( $scope, elem, attrs ) {

						// Check if latitude and longitude are specified
						if ( angular.isDefined($scope.lat) && angular.isDefined($scope.long) ) {

								// Initialize the map
								$scope.initialize = function() {                                        
										$scope.location = new google.maps.LatLng($scope.lat, $scope.long);

										$scope.mapOptions = {
												zoom: 12,
												center: $scope.location
										};

										$scope.map = new google.maps.Map(document.getElementById($scope.mapId), $scope.mapOptions);

										new google.maps.Marker({
												position: $scope.location,
												map: $scope.map,
										});
								}

								// Loads google map script
								loadGoogleMapAPI.then(function () {
										// Promised resolved
										$scope.initialize();
								}, function () {
										// Promise rejected
								});
						}
				}
		};
}]);
