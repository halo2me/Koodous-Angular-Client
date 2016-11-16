app.controller('SignInUpController', ["$scope", "$state", "$uibModal", "$stateParams", "api", function($scope, $state, $uibModal, $stateParams, api){
	switch($state.current.name){
		case 'register':
			var modalInstance = $uibModal.open({
			    templateUrl: '/app/signinup/register.html',
			    controller: 'RegisterController',
			    backdropClass: 'fullscreen-modal',
			    backdrop: 'static'
			});
			break
		case 'login':
			var modalInstance = $uibModal.open({
			    templateUrl: '/app/signinup/login.html',
			    controller: 'LoginController',
			    backdropClass: 'fullscreen-modal',
			    backdrop: 'static'
			});
			break
		case 'activate':
			//Activate account
			api.activate($stateParams.token).success(function(data){
				document.location.href = "/login";
			}).error(function(){
				document.location.href = "/";
			});
			break;
		case 'forgot_password':
			var modalInstance = $uibModal.open({
			    templateUrl: '/app/signinup/forgot.html',
			    controller: 'ForgotController',
			    backdropClass: 'fullscreen-modal',
			    backdrop: 'static'
			});
			break
		case 'reset_password':
			var modalInstance = $uibModal.open({
			    templateUrl: '/app/signinup/reset.html',
			    controller: 'ResetController',
			    backdropClass: 'fullscreen-modal',
			    backdrop: 'static'
			});
			break
	}
}]);

app.controller('RegisterController', ["$scope", "$uibModalInstance", "api", function($scope, $uibModalInstance, api){
	$scope.user = {};
	$scope.error = false;
	$scope.error_message = "";
	$scope.registration_done = false;
	$scope.register = function(){
		$scope.error = false;
		$scope.error_message = "";

		if ($scope.user.password != $scope.password2){
			$scope.error = true;
			$scope.error_message = "Passwords should be the same";
			return;
		}
		
		if (!$scope.terms_accepted){
			$scope.error = true;
			$scope.error_message = "Terms of use & privacy policy should be accepted";
			return;
		}

		api.register($scope.user).success(function(response){
			$scope.registration_done = true;
		}).error(function(response){
			$scope.error = true;
			$scope.error_message = response.error;
		});
	}
	
	$scope.close = function(goBack){
		if(goBack)
		{
			document.location.href = '/';
		}
		$uibModalInstance.close();
	}
}]);

app.controller('LoginController', ["$scope", "$rootScope", "api", "$location", "$uibModalInstance", function($scope, $rootScope, api, $location, $uibModalInstance){
    $scope.error = false;
    $scope.loading = false;
    $scope.remember = true;
    $scope.error_message = "Incorrect username or password.";

    $rootScope.$watch("user", function(){
    	if($rootScope.user && $rootScope.user.username){
            $scope.close(true);
        }
    }, true);

    $scope.close = function(goBack){
    	if(goBack){
    		document.location.href = '/';
    	}
		$uibModalInstance.close();
	}

    $scope.submit = function(){
        $scope.error = false;
        $scope.loading = true;
        api.getUserToken($scope.username, $scope.password).success(function(data){
            if($scope.remember)
            {
                localStorage.authToken = data.token;
            }
            else
            {
                sessionStorage.authToken = data.token;
            }
            api.getCurrentUser().success(function(data) {
                $rootScope.user = data;
                document.location.href = "/login";
            }).error(function(){
                $rootScope.user = {anon:true};
            });
        }).error(function(){
            $scope.error = true;
        }).finally(function(){
            $scope.loading = false;
        });
    }
}]);

app.controller('ForgotController', ["$scope", "$uibModalInstance", "api", function($scope, $uibModalInstance, api){
	$scope.done = false;
	$scope.close = function(goBack){
    	if(goBack){
    		document.location.href = '/';
    	}
		$uibModalInstance.close();
	}

    $scope.submit = function(){
        $scope.error = false;
        $scope.loading = true;
        $scope.done = false;
        api.forgotPassword($scope.email).success(function(data){
            $scope.done = true;
        }).error(function(){
        	$scope.error_message = "Enter your an valid email address."
            $scope.error = true;
        }).finally(function(){
            $scope.loading = false;
        });
    }
}]);

app.controller('ResetController', ["$scope", "$state", "api", function($scope, $state, api){
	$scope.uid = $state.params.uid;
	$scope.token = $state.params.token;

	$scope.close = function(goBack){
    	if(goBack){
    		document.location.href = "/";
    	}
		$uibModalInstance.close();
	}

    $scope.submit = function(){
        $scope.error = false;
        $scope.loading = true;
        $scope.reset_done = false;
        
        if (!$scope.new_password1){
        	$scope.error = true;
        	$scope.error_message = "All fields are required";
        	return;
        }
        if ($scope.new_password1 != $scope.new_password2){
        	$scope.error = true;
        	$scope.error_message = "Passwords should be the same";
        	return;
        }

        api.resetPassword($scope.uid, $scope.token, $scope.new_password1, $scope.new_password2).success(function(data){
            $scope.reset_done = true;
        }).error(function(){
        	$scope.error_message = "Unexpected error!";
            $scope.error = true;
        }).finally(function(){
            $scope.loading = false;
        });
    }
}]);