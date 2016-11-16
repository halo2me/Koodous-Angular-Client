angular.module('rulesets', ['ui.codemirror','filters', 'ui.bootstrap']);

/**
Controlador listado rulesets
*/
angular.module('rulesets').controller('RulesetsCtrl', ["$scope", "$stateParams", "$rootScope", "$timeout", "api", "$uibModal", "$location", "$state", function($scope, $stateParams, $rootScope, $timeout, api, $uibModal, $location, $state){
	var scope = $scope;

	$scope.rulesets = {};
	$rootScope.section = "rulesets";
	$rootScope.sidebar_sub_section = "community_rulesets";
	$scope.itemsPerPage = 20;
	$scope.currentPage = 1;
	$scope.filters = {social:''};
	$rootScope.search = $stateParams.search ? $stateParams.search : '';

	$scope.$watch("filters", function(newVal, oldVal){
		$scope.filters.search = $rootScope.search;
		$scope.currentPage = 1;
		if(!$scope.loading){
			$scope.getRulesets();
		}
	}, true);
	$scope.$on("$destroy", function() {
        $rootScope.sidebar_sub_section = null;
    });

	$scope.pageChanged = function(){
		$scope.getRulesets();
	};

	$scope.maxSize = 5;
	
	$scope.getRulesets = function(){
		$scope.loading = true;
		api.getPublicRulesets($scope.currentPage, $scope.itemsPerPage, $scope.filters).success(function(data){
			$scope.rulesets = data.results;
			$scope.totalItems = data.count;
		}).finally(function(){
			$scope.loading = false;
		});
	};
	$rootScope.searchRulesets = function()
	{
		if($rootScope.search !== ''){
			$scope.filters.search = $rootScope.search;
		}
		else{
			delete $scope.filters.search;
		}

		if($rootScope.search){
			$location.search('search', $rootScope.search);
		}
		else{
			$location.search('search', null);
		}
		$scope.getRulesets();
	};
}]);

angular.module('rulesets').controller('RulesetController', ["$scope", "$rootScope", "$stateParams", "api", function($scope, $rootScope, $stateParams, api){
	$rootScope.section = "rulesets";
	$scope.subSection = "main";
	$scope.userVoted = false;
	$scope.userVote = null;
	
	$scope.getRuleset = function(){
		api.getPublicRuleset($stateParams.id).success(function(response){
			$scope.ruleset = response;

			//CodeMirror Options
			$scope.editorOptions = {
		        lineWrapping : true,
		        lineNumbers: true,
		        indentWithTabs: true,
		        mode: 'yara',
		        readOnly: true,
		    };
		}).error(function(){
			$location.path('/rulesets');
		});
	};
	$scope.getRuleset();

	//Figure out if current user already vote this apk
	$scope.getUserVote = function(){
		api.getUserRulesetVote($stateParams.id).success(function(response){
			$scope.userVoted = true;
			$scope.userVote = response;
		}).error(function(){
			$scope.userVoted = false;
		});
	};
	$scope.getUserVote();

	$scope.voteUp = function(){
		//Simulate vote
		$scope.userVoted = true;
		$scope.userVote = {kind:'positive'};
		$scope.ruleset.rating = $scope.ruleset.rating + 1;

		api.voteRuleset($stateParams.id, 'positive').success(function(data){
		});
	};

	$scope.voteDown = function(){
		//Simulate vote
		$scope.userVoted = true;
		$scope.userVote = {kind:'negative'};
		$scope.ruleset.rating = $scope.ruleset.rating - 1;

		api.voteRuleset($stateParams.id, 'negative').success(function(data){
		});
	};
}]);

angular.module('rulesets').controller('RulesetMainController', ["$scope", "$rootScope", "$stateParams", "api", function($scope, $rootScope, $stateParams, api){
	$scope.codeCollapsed = true;
	$scope.$parent.subSection = "main";
}]);

angular.module('rulesets').controller('RulesetCommentsController', ["$scope", "$rootScope", "$stateParams", "api", function($scope, $rootScope, $stateParams, api){
	$scope.totalComments = 0;
	$scope.comments = [];
	$scope.newComment = {};
	$scope.nextPage = false;
	$scope.loading = false;

	$scope.pageChanged = function() {
		$scope.getComments();
	};
	$scope.getComments = function(){
		$scope.loading = true;
		api.getRulesetComments($stateParams.id, $scope.nextPage).success(function(data){
			$scope.comments = $scope.comments.concat(data.results);
			$scope.nextPage = data.next;
		}).finally(function(){
			$scope.loading = false;
		});
	};
	$scope.deleteComment = function(comment){
		if(confirm("Are you sure?")){
			api.deleteComment(comment).success(function(){
				for(var i in $scope.comments){
					if(comment.id == $scope.comments[i].id){
						$scope.comments.splice(i, 1);
						break;
					}
				}
			});
		}
	};
	$scope.updateComment = function(comment){
		comment.text = comment.newtext;
		api.updateComment(comment);
		comment.editing = false;
	};
	$scope.addComment = function(){
		api.addRulesetComment($stateParams.id, $scope.newComment)
		.success(function(data){
			$scope.comments.push(
				{
					author: $rootScope.user,
					created_on: Math.floor(Date.now() / 1000),
					modified_on: Math.floor(Date.now() / 1000),
					text: data.text
				}
			);
		})
		.error(function(data, statusCode){
			//TODO: Alertar
		});

		$scope.newComment = {};
	};
	$scope.getComments();
}]);

angular.module('rulesets').controller('RulesetDetectionsController', ["$scope", "$rootScope", "$stateParams", "api", "$state", function($scope, $rootScope, $stateParams, api, $state){
	$scope.$parent.subSection = "detections";
	$scope.maxSize = 5;
	$scope.apks = [];
	$scope.nextPage = false;
	$scope.currentPage = false;
	$rootScope.section = "rulesets";
	$scope.showFilters = false;
	$scope.filters = {analyzed:$stateParams.analyzed ? $stateParams.analyzed : '',
					 repo:$stateParams.repo ? $stateParams.repo : ''};
	$rootScope.search = $stateParams.search ? $stateParams.search : '';

	$scope.$watch('filters', function(newVal, oldVal){
		$scope.filters.search = $rootScope.search;
		$scope.nextPage = false;
		if(!$scope.loading){
			$scope.getAPKS();
		}
	}, true);

	//Loading on scroll
	$(window).scroll(function() {
		if($(window).scrollTop() + $(window).height() == $(document).height()) {
			if(!$scope.loading && $scope.nextPage)
			{
				$scope.getAPKS();
			}
		}
	});
	$scope.$on("$destroy", function(event){
		$(window).unbind("scroll");
	});

	$scope.pageChanged = function() {
		$scope.getAPKS();
	};

	$scope.getAPKS = function(){
		$scope.loading = true;
		$rootScope.searchError = false;
		var filters = $scope.filters;

		function processResponse(data){
			$scope.currentPage = $scope.nextPage;
			$scope.nextPage = data.next;
			if(filters && (filters.sha256 || filters.sha1 || filters.md5)){
				if(data.results.length){
					$location.path("/apks/" + data.results[0].sha256);
				}
				else{
					$scope.apks = $scope.apks.concat(data.results);
				}
			}
			else{
				$scope.apks = $scope.apks.concat(data.results);
			}
		}
		api.getRulesetDetections($stateParams.id, $scope.nextPage, filters).success(processResponse).error(function(data){
			$rootScope.searchError = data.error;
			$scope.apks = [];
			$scope.totalItems = 0;
		}).finally(function(){
			$scope.loading = false;
		});
	};
	$rootScope.searchApks = function()
	{
		$state.go($state.current.name, {search:$rootScope.search});
	};

	$scope.removeMatches = function(){
		$scope.removingMatches = true;
		api.removeRulesetMatches($stateParams.id, {search:$rootScope.search}).success(function(response){
			$scope.getAPKS();
		}).finally(function(){
			$scope.removingMatches = false;
		});
	};
	$scope.removeMatch = function(apk){
		api.removeRulesetMatch($stateParams.id, apk.sha256).success(function(response){
			$scope.nextPage = $scope.currentPage;
			$scope.getAPKS();
		});
	};
}]);