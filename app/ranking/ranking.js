angular.module('ranking', []);

angular.module('ranking').controller('RankingCtrl', ["$scope", "$rootScope", "api", function($scope, $rootScope, api) {
	$rootScope.section = "ranking";
	$scope.itemsPerPage = 25;
	$scope.currentPage = 1;

	$scope.firstUser = null;
	$scope.secondUser = null;
	$scope.thirdUser = null;

	$scope.getAnalysts = function(){
		api.getAnalysts($scope.currentPage, $scope.itemsPerPage, {ordering:'-total_followers'}).success(function(data){
			$scope.analysts = data.results;
			$scope.totalItems = data.count;

			$scope.firstUser = $scope.firstUser ? $scope.firstUser:data.results[0];
			$scope.secondUser = $scope.secondUser ? $scope.secondUser:data.results[1];
			$scope.thirdUser = $scope.thirdUser ? $scope.thirdUser:data.results[2];
		});
	};
	$scope.getAnalysts();

	$scope.pageChanged = function(){
		$scope.getAnalysts();
	};
}]);