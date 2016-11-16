angular.module('notifications', []);

angular.module('notifications').controller('NotificationsCtrl', ["$scope", "$rootScope", "$stateParams", "api", "$location", function($scope, $rootScope, $stateParams, api, $location) {
	$rootScope.section = "notifications";
	$scope.nextPage
	$scope.notifications = [];
	$scope.notification_type = $stateParams.notification_type ? $stateParams.notification_type : "";
	$scope.thereIsMore = true;
	$scope.search = "";
	$scope.nextPage = false;
	$scope.loading = false;

	$scope.$watch('notification_type', function(newValue, oldValue){
		if(newValue != oldValue){
			$scope.nextPage = false;
			$scope.notifications = [];
			$scope.getNotifications();
		}
	});

	$rootScope.$watch("user", function(){
		if($rootScope.user && $rootScope.user.anon){
			$location.path("/");
		}
	}, true);

	//Loading on scroll
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			if(!$scope.loading && $scope.nextPage)
			{
				$scope.getNotifications();
			}
		}
	});
	$scope.$on("$destroy", function(event){
		$(window).unbind("scroll");
	});

	$scope.markAsRead = function(notification){
		notification.read = true;
		api.updateNotification(notification).success(function(){
			$rootScope.getUnreadNotifications();
		});
	};
	$scope.markAllAsRead = function(){
        api.markAllNotificationsAsRead().success(function(){
        	$rootScope.getUnreadNotifications();
        	$scope.nextPage = false;
			$scope.notifications = [];
			$scope.getNotifications();
        });
  };
	$scope.searchNotifications = function(){
		$scope.nextPage = false;
		$scope.notifications = [];
		$scope.getNotifications();
	};
	$scope.getNotifications = function(){
		$scope.loading = true;
		api.getNotifications($scope.nextPage, {search:$scope.search, type:$scope.notification_type}).success(function(data){
			$scope.nextPage = data.next;
			$scope.notifications = $scope.notifications.concat(data.results);
		}).finally(function(){
			$scope.loading = false;
		});
	};

	$scope.getNotifications();
}]);