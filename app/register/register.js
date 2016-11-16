angular.module('app').controller('RegisterController', ["$scope", "$rootScope", "api", "$location", "$stateParams", function($scope, $rootScope, api, $location, $stateParams){
	//Redirect if user is already logged in
	$rootScope.$watch("user", function(){
		if($rootScope.user && $rootScope.user.username){
			$location.path("/");
		}
	}, true); 

	$scope.register = function(){

	}


	$scope.activate = function(){
		$scope.activation_loading = true;
		$scope.activation_success = false;
		$scope.activation_error = false;
		
		console.log($stateParams.code);
		//TODO: Activate request
	}
}]);