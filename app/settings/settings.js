angular.module('settings', ['ja.qr']);

angular.module('settings').controller('SettingsController', ["$scope", "$stateParams", function($scope, $stateParams) {
    var sections = ['profile','account','link_device'];
    $scope.section = $stateParams.section;
    if(sections.indexOf($scope.section) <= -1){
        $scope.section = sections[0];
    }
}]);

angular.module('settings').controller('ProfileController', ["$scope", "$rootScope", "api", function($scope, $rootScope, api){
    $scope.alerts = [];
    $scope.updateAvatar = function(file)
    {
        if(!file.length){
            return false;
        }
        file = file[0];
        api.updateAvatar($rootScope.user.username, file).success(function(response){
            $rootScope.user.avatar_url = response.avatar_url;
            $scope.addAlert("success","Your avatar has been uploaded");
        }).error(function(){
            $scope.addAlert("danger","An error ocurred uploading your avatar");
        });
    };
    $scope.api_token = localStorage.authToken ? localStorage.authToken : sessionStorage.authToken;

    $scope.addAlert = function(type, text) {
        $scope.alerts.push({msg: text, type: type});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };

    $scope.updateUserInfo = function(){
        api.updateUserInfo($rootScope.user).success(function(response){
            $rootScope.user = response;
            $scope.addAlert("success","Your profile information has been saved");
        }).error(function(){
            $scope.addAlert("danger","An error ocurred saving your profile information");
        });
    };
}]);

angular.module('settings').controller('AccountController', ["$scope", "$rootScope", "api", function($scope, $rootScope, api){
    $scope.alerts = [];
    $scope.addAlert = function(type, text) {
        $scope.alerts.push({msg: text, type: type});
    };

    $scope.closeAlert = function(index) {
        $scope.alerts.splice(index, 1);
    };
    $scope.changePassword = function(){
        $scope.alerts = [];
        var data = {old_password:$scope.old_password, new_password:$scope.new_password, new_password2:$scope.new_password2};
        api.changeUserPassword($rootScope.user, data).success(function(response){
            $scope.old_password = $scope.new_password = $scope.new_password2 = "";
            $scope.addAlert("success","Your password has been changed");
        }).error(function(response){
            if(response.error){
                $scope.addAlert("danger", response.error);
            }

            if(response.new_password){
                $scope.addAlert("danger", "New password: " + response.new_password);
            }

            if(response.new_password){
                $scope.addAlert("danger", "New password2: " + response.new_password);
            }

            if(response.non_field_errors){
                $scope.addAlert("danger", response.non_field_errors);
            }
        });
    };
}]);

angular.module('settings').controller('DevicesController', ["$scope", "$rootScope", "api", function($scope, $rootScope, api){
    $scope.title = "Link device";
    $scope.qrcode = "";
    $scope.loading = true;

    $scope.getDevices = function(){
        api.getUserDevices().success(function(response){
            $scope.devices = response.results;
        });
    };
    $scope.getQRCode = function(){
        api.getLinkDeviceToken().success(function(response){
            //Dirty hack para recargar el QR
            setTimeout(function(){
                $scope.qrcode = response.token;
                $scope.loading = false;
                $scope.$digest();
            }, 500);
        });
    };
    $scope.getQRCode();
    $scope.getDevices();
}]);

angular.module('settings').controller('NotificationsController', ["$scope", "$rootScope", "api", function($scope, $rootScope, api){
    $scope.successAlert = false;

    api.getUserSettings().success(function(data){
        $scope.settings = data;
    });
    $scope.updateSettings = function(){
        api.updateUserSettings($scope.settings).success(function(){
            $scope.successAlert = true;
        });
    }
    $scope.closeAlert = function(){
        $scope.successAlert = false;
    }
}]);