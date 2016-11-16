angular.module('app').directive('addCommentWidget', function(){
	return {
		restrict: 'E',
		templateUrl: 'app/common/directives/add_comment_widget.html',
		replace: true,
		controller: ["$scope", "api", function($scope, api){
			$scope.people = [];
			$scope.searchUser = function(term){
				if(term.length > 1){
					api.getAnalysts(1,5, {search:term}).success(function(response){
						$scope.people = response.results;
					});
				}
				else{
					$scope.people = [];
				}
			}
		}],
	};
});