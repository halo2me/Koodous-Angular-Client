angular.module('directives.comment', [])

.directive('comment', function(){
	return {
		restrict: 'E',
		templateUrl: 'app/common/directives/comment.html',
		replace: true,

		controller: ["$scope", "$rootScope", function ($scope, $rootScope) {
			$scope.edit = function(){

			};
			$scope.delete = function(){
				
			};
		}],
	};
});