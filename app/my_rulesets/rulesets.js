angular.module('my_rulesets', ['ui.codemirror','filters', 'ui.bootstrap']);

/**
Controlador listado rulesets
*/
angular.module('my_rulesets').controller('MyRulesetsCtrl', ["$scope", "$rootScope", "$timeout", "api", "$uibModal", "$location", "$state", function($scope, $rootScope, $timeout, api, $uibModal, $location, $state){
	var scope = $scope;

	$scope.rulesets = {};
	$rootScope.section = "rulesets";
	$rootScope.sidebar_sub_section = "my_rulesets";
	$scope.itemsPerPage = 10;
	$scope.currentPage = 1;
	$scope.filters = {active:'', privacy:'', ordering:'-modified_on', social:''};

	$scope.$watch("filters", function(){
		$scope.currentPage = 1;
		$scope.getRulesets();
	}, true);
	$scope.$on("$destroy", function() {
        $rootScope.sidebar_sub_section = null;
    });

	$scope.pageChanged = function() {
		$scope.getRulesets();
	};

	$scope.maxSize = 5;
	
	$scope.getRulesets = function(){
		api.getRulesets($scope.currentPage, $scope.itemsPerPage, $scope.filters).success(function(data){
			$scope.rulesets = data.results;
			$scope.totalItems = data.count;
		});
	};

	$scope.editRuleset = function(ruleset){
		$location.path('/rulesets/' + ruleset.id);
	};
	$scope.newRuleset = function(){
		var rules_example = "import \"androguard\"\nimport \"file\"\nimport \"cuckoo\"\n\n\nrule koodous : official\n{\n\tmeta:\n\t\tdescription = \"This rule detects the koodous application, used to show all Yara rules potential\"\n\t\tsample = \"e6ef34577a75fc0dc0a1f473304de1fc3a0d7d330bf58448db5f3108ed92741b\"\n\n\tstrings:\n\t\t$a = {63 6F 6D 24 6B 6F 6F 64 6F 75 73 24 61 6E 64 72 6F 69 64}\n\n\tcondition:\n\t\tandroguard.package_name(\"com.koodous.android\") and\n\t\tandroguard.app_name(\"Koodous\") and\n\t\tandroguard.activity(/Details_Activity/i) and\n\t\tandroguard.permission(/android\.permission\.INTERNET/) and\n\t\tandroguard.certificate.sha1(\"8399A145C14393A55AC4FCEEFB7AB4522A905139\") and\n\t\tandroguard.url(/koodous\\.com/) and\n\t\tnot file.md5(\"d367fd26b52353c2cce72af2435bd0d5\") and \n\t\t$a and\n\t\tcuckoo.network.dns_lookup(/settings\.crashlytics\.com/) //Yes, we use crashlytics to debug our app!\n\t\t\n}";
		var ruleset = {name:"New Ruleset", rules:rules_example, active:false};
		api.saveRuleSet(ruleset).success(function(response){
			$state.go("my_rulesets_detail", {id:response.id});
		});
	};
}]);
angular.module('my_rulesets').controller('MyRuleSetDetailController', ["$scope", "$rootScope", "$stateParams", "api", "$location", "$timeout", "$interval", "$uibModal", function($scope, $rootScope, $stateParams, api, $location, $timeout, $interval, $uibModal){
	$rootScope.section = "rulesets";
	api.getRuleset($stateParams.id).success(function(response){
		$scope.ruleset = response;

		//CodeMirror Options
		$scope.editorOptions = {
	        lineWrapping : true,
	        lineNumbers: true,
	        indentWithTabs: true,
	        mode: 'yara',
	    };

		$timeout(function(){
			$scope.rulesetChanged = false;
		}, 10);
	}).error(function(){
		$location.path('/rulesets');
	});
	$scope.$watch('ruleset.rules', function(oldValue, newValue){
		if(oldValue != newValue){
			$scope.rulesetChanged = true;
		}
	});
	var autoSaveInterval = $interval(function(){
		if($scope.rulesetChanged && $scope.autosave){
			$scope.save();
			$scope.rulesetChanged = false;
		}
	}, 2000);

	$scope.$on("$destroy", function(event){
		$interval.cancel(autoSaveInterval);
	});

	$scope.autosave = true;

	//Guarda el ruleset seleccionado actualmente
	$scope.save = function(){
		$scope.compilationError = false;
		$scope.saving = true;
		$scope.rulesetChanged = false;
		$scope.previousState = $scope.ruleset.active;
		//Petición API guardado ruleset
		api.saveRuleSet($scope.ruleset).success(function(response){
			$scope.ruleset.active = response.active;
			$scope.ruleset.id = response.id;
			$scope.modified_on = response.modified_on;
			if ($scope.ruleset.social && !response.social){
				$scope.social_revokation = true
			}
			$scope.ruleset.social = response.social;
		}).error(function(data, status){
			$scope.ruleset.active = data.active;
			$scope.ruleset.id = data.id;
			
			if (status == 406){
				//El ruleset no ha compilado correctamente
				$scope.compilationError = true;
				$scope.compilationErrorText = data.error;
			}
		})
		.finally(function(){
			$scope.saving = false;
		});
	};
	//Cancela los cambios del ruleset seleccionado actualmente
	$scope.cancel = function(){
		api.getRuleset($scope.ruleset.id).success(function(response){
			$scope.ruleset = response;
			$scope.rulesetChanged = false;
		});
	};
	$scope.delete = function(){
		if(confirm("Are you sure?")){
			api.deleteRuleset($scope.ruleset).success(function(data){
				$location.path("/rulesets");
			});
		}
	};
	$scope.openHelpDialog = function(){
		var modalInstance = $uibModal.open({
			templateUrl: window.ANGULAR_TEMPLATES_URLS['frontend/app/my_rulesets/about_social_ruleset_dialog.html'],
			controller: 'AboutSocialRulesetDialogController',
			// size: "lg",
		});
	};
	$scope.openSocialPromotionDialog = function(){
		var modalInstance = $uibModal.open({
			templateUrl: window.ANGULAR_TEMPLATES_URLS['frontend/app/my_rulesets/promote_social_dialog.html'],
			controller: 'SocialPromotionDialogController',
			resolve:{
				scope : function(){
					return $scope;
				},
			}
		});
	};
}]);
angular.module('my_rulesets').controller('AboutSocialRulesetDialogController', ["$uibModalInstance", "$scope", function($uibModalInstance, $scope){
	$scope.ok = function () {
    	$uibModalInstance.close();
  	};
}]);
angular.module('my_rulesets').controller('SocialPromotionDialogController', ["$uibModalInstance", "$scope", "api", "scope", "$stateParams", function($uibModalInstance, $scope, api, scope, $stateParams){
	$scope.checked = false;
	$scope.valid = false;
	$scope.ruleset = scope.ruleset;

	$scope.close = function () {
    	$uibModalInstance.close();
  	};
	$scope.ok = function () {
		$scope.checking = true;
		$scope.ruleset.pending_social = true;
		api.promoteRuleset($scope.ruleset);
		$uibModalInstance.close();
  	};
}]);