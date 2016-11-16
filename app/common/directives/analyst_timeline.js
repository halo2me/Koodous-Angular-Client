/**
Widget for users info and button to follow or unfollow
*/
angular.module('app').directive('analystTimeline', function(){
	return {
		restrict: 'E',
		templateUrl: "app/common/directives/analyst_timeline.html",
		controller: ["$scope", function($scope){}],
	};
});