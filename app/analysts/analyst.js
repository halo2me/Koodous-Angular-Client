angular.module('analysts', []);

angular.module('analysts').controller('AnalystController', ["$scope", "$rootScope", "$stateParams", "$location", "api", function($scope, $rootScope, $stateParams, $location, api) {
    $scope.username = $stateParams.username;
    $scope.isFollowed = false;
    $scope.loadingRelInfo = true;
    $scope.isCurrentUser = false;
    $rootScope.section = 'analyst';

    $rootScope.$watch('user', function(){
        if(!$rootScope.user){
            $scope.isCurrentUser = false;
        }
        else{
            $scope.isCurrentUser = ($rootScope.user.username == $stateParams.username) ? true : false;
        }
    }, true);

    api.getAnalyst($scope.username).success(function(data){
        $scope.analyst = data;
        //Check if its followed by current user
        api.getUserFollowers($scope.analyst.username, 1, 1,{username:$rootScope.user.username}).success(function(data){
            $scope.isFollowed = data.results.length ? true:false;
            // $scope.getInvitations();
            // $scope.getAnalystActivity();
        }).error(function(){
            $scope.isFollowed = false;
        }).finally(function(){
            $scope.loadingRelInfo = false;
        });
    }).error(function(){$location.path("/");});

    $scope.follow = function(){
        api.followUser($scope.username).success(function(data){
            $scope.isFollowed = true;
            $scope.analyst.total_followers++;
        });
    };
    $scope.unFollow = function(){
        api.unFollowUser($scope.username).success(function(data){
            $scope.isFollowed = false;
            $scope.analyst.total_followers--;
        });
    };
}]);
angular.module('analysts').controller('AnalystMainController', ["$scope", "$rootScope", "$stateParams", "$location", "api", function($scope, $rootScope, $stateParams, $location, api) {
    $scope.new_invitation = {email:""};
    $rootScope.profile_section = "main";

    $scope.$parent.$watch('analyst', function(){
        if($scope.$parent.analyst){
            $scope.getAnalystActivity();
            $scope.getInvitations();
        }
    }, true);

    $scope.getAnalystActivity = function(){
        api.getAnalystActivity($scope.analyst.username).success(function(response){
            $scope.activity = response.results;
        });
    };
    $scope.getInvitations = function(){
        api.getInvitations().success(function(response){
            $scope.invitations = response;
        });
    };
    $scope.sendInvitation = function(){
        $scope.sending = true;
        api.createInvitation($scope.new_invitation).success(function(response){
            $scope.getInvitations();
            $scope.new_invitation = {};
        }).finally(function(){
            $scope.sending = false;
        });
    };
    $scope.deleteInvitation = function(invitation){
        api.deleteInvitation(invitation).success(function(response){
            $scope.getInvitations();
        });
    };
}]);
angular.module('analysts').controller('AnalystRulesetsController', ["$scope", "$rootScope", "$stateParams", "$location", "api", function($scope, $rootScope, $stateParams, $location, api) {
    $scope.rulesetsCurrentPage = 1;
    $scope.rulesetsItemsPerPage = 10;
    $scope.rulesetsMaxSize = 5;
    $rootScope.profile_section = "rulesets";

    $scope.$parent.$watch('analyst', function(){
        if($scope.$parent.analyst){
            $scope.getUserRulesets();
        }
    }, true);

    $scope.getUserRulesets = function(){
        api.getUserRulesets($scope.analyst.username, $scope.rulesetsCurrentPage, $scope.rulesetsItemsPerPage,  {ordering:'-created_on'}).success(function(response){
            $scope.rulesets = response.results;
            $scope.rulesetsTotalItems = response.count;
        });
    };
    $scope.rulesetPageChange = function(){
        $scope.getUserRulesets();
    };
}]);
angular.module('analysts').controller('AnalystCommentsController', ["$scope", "$rootScope", "$stateParams", "$location", "api", function($scope, $rootScope, $stateParams, $location, api) {
    $scope.itemsPerPage = 10;
    $scope.currentPage = 1;
    $scope.maxSize = 5;
    $rootScope.profile_section = "comments";
    $scope.totalComments = 0;

    $scope.$parent.$watch('analyst', function(){
        if($scope.$parent.analyst){
            $scope.getUserComments();
        }
    }, true);

    $scope.getUserComments = function(){
        api.getUserComments($scope.analyst.username, false, {ordering:'-created_on'}).success(function(response){
            $scope.comments = response.results;
            $scope.totalComments = response.count;
        });
    };
    $scope.pageChanged = function(){
        $scope.getUserComments();
    };
    $scope.getRefLink = function(comment) {
        if(comment.apk){
            return "/apks/" + comment.apk;
        }
        else if(comment.ruleset){
            return "/rulesets/" + comment.ruleset;
        }
    };
}]);
angular.module('analysts').controller('AnalystFollowingController', ["$scope", "$rootScope", "$stateParams", "$location", "api", function($scope, $rootScope, $stateParams, $location, api) {
    $rootScope.profile_section = "following";
    $scope.following = [];
    $scope.next = null;

    $scope.$parent.$watch('analyst', function(){
        if($scope.$parent.analyst){
            $scope.getUserFollowing();
        }
    }, true);

    $scope.getUserFollowing = function(){
       api.getUserFollowingInifite($scope.analyst.username, $scope.next).success(function(response){
           $scope.following = $scope.following.concat(response.results);
           $scope.next = response.next;
       });
    };
}]);
angular.module('analysts').controller('AnalystFollowersController', ["$scope", "$rootScope", "$stateParams", "$location", "api", function($scope, $rootScope, $stateParams, $location, api) {
    $rootScope.profile_section = "followers";
    $scope.followers = [];
    $scope.next = null;

    $scope.$parent.$watch('analyst', function(){
        if($scope.$parent.analyst){
            $scope.getUserFollowers();
        }
    }, true);
    
    $scope.getUserFollowers = function(){
        api.getUserFollowersInifite($scope.analyst.username, $scope.next).success(function(response){
            $scope.followers = $scope.followers.concat(response.results);
            $scope.next = response.next;
        });
    };
}]);