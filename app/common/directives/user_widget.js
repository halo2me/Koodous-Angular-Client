/**
Widget for users info and button to follow or unfollow
*/
angular.module('app').directive('userWidget', function(){
	return {
		restrict: 'E',
		replace: true,
		templateUrl: "app/common/directives/user_widget.html",
		controller: ["$scope", function($scope){
			$scope.follow = function(){
				//TODO:
				// $scope.user
			};
			$scope.unFollow = function(){
				//TODO:
				// $scope.user
			};
		}],
	};
});