app.config(["$stateProvider", "$urlRouterProvider", function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise("/")

    $stateProvider
    // Dashboard
    .state('home', {url: "^/", templateUrl: "app/dashboard/dashboard.html", controller: "DashboardCtrl"})
    .state('dashboard', {url: "^/dashboard", templateUrl: "app/dashboard/dashboard.html", controller: "DashboardCtrl"})

    .state('login', {url: "^/login", templateUrl: "app/signinup/signinup.html", controller: "SignInUpController"})
    .state('register', {url: "^/register", templateUrl: "app/signinup/signinup.html", controller: "SignInUpController"})
    .state('activate', {url: "^/activate/:token", templateUrl: "app/signinup/signinup.html", controller: "SignInUpController"})
    .state('forgot_password', {url: "^/forgot_password", templateUrl: "app/signinup/signinup.html", controller: "SignInUpController"})
    .state('reset_password', {url: "^/reset_password?uid&token", templateUrl: "app/signinup/signinup.html", controller: "SignInUpController"})
    // Rulesets
    .state('rulesets', {url:"^/rulesets?search&page", templateUrl: "app/rulesets/rulesets.html", controller: "RulesetsCtrl"})
    .state('ruleset', {abstract: true, url:"^/rulesets/:id", templateUrl: "app/rulesets/ruleset.html", controller: "RulesetController"})
    .state('ruleset.main', {url:"^/rulesets/:id", templateUrl: "app/rulesets/ruleset.main.html", controller: "RulesetMainController"})
    .state('ruleset.detections', {url:"/detections?search&page", templateUrl: "app/rulesets/ruleset.detections.html", controller: "RulesetDetectionsController"})
	
	.state('my_rulesets', {url:"^/my_rulesets", templateUrl: "app/my_rulesets/rulesets.html", controller: "MyRulesetsCtrl"})
	.state('my_rulesets_detail', {url:"^/my_rulesets/:id", templateUrl: "app/my_rulesets/ruleset_detail.html", controller: "MyRuleSetDetailController"})

    // APKs
	.state('apks', {url:"^/apks?search&page", templateUrl: "app/apks/apks.html", controller: "APKsCtrl"})
	.state("ruleset_apks", {url:"^/rulesets/:ruleset_id/apks?search&page",templateUrl: "app/apks/apks.html", controller: "APKsCtrl"})
	.state("device_apks", {url:"^/devices/:android_id/apks?search&page", templateUrl: "app/apks/apks.html", controller: "APKsCtrl"})
	
	//APK Detail
	.state("apk", {abstract: true, url:"^/apks/{sha256:[A-Fa-f0-9]{64}}", templateUrl: "app/apks/apk.html", controller: "APKDetailCtrl"})
	.state("apk.main", {url:"^/apks/{sha256:[A-Fa-f0-9]{64}}", templateUrl: "app/apks/apk.main.html", controller: "APKMainController"})
	.state("apk.comments", {url:"^/apks/{sha256:[A-Fa-f0-9]{64}}/comments", templateUrl: "app/apks/apk.comments.html" + window.appVersion, controller: "APKCommentsController"})
	.state("apk.analysis", {url:"^/apks/{sha256:[A-Fa-f0-9]{64}}/analysis", templateUrl: "app/apks/apk.analysis.html" + window.appVersion, controller: "APKAnalysisController"})
	.state("apk.metada", {url:"^/apks/{sha256:[A-Fa-f0-9]{64}}/metadata", templateUrl: "app/apks/apk.metadata.html" + window.appVersion, controller: "APKMetadataController"})

	// Analyst profile
	.state('analyst', {abstract: true, url:"^/analysts/:username", templateUrl: "app/analysts/analyst.html", controller: "AnalystController"})
	.state('analyst.main', {url:"", templateUrl: "app/analysts/analyst.main.html", controller: "AnalystMainController"})
	.state('analyst.rulesets', {url:"/rulesets", templateUrl: "app/analysts/analyst.rulesets.html", controller: "AnalystRulesetsController"})
	.state('analyst.comments', {url:"/comments", templateUrl: "app/analysts/analyst.comments.html", controller: "AnalystCommentsController"})
	.state('analyst.following', {url:"/following", templateUrl: "app/analysts/analyst.following.html", controller: "AnalystFollowingController"})
	.state('analyst.followers', {url:"/followers", templateUrl: "app/analysts/analyst.followers.html", controller: "AnalystFollowersController"})

	// Ranking
	.state('ranking', {url:"^/ranking", templateUrl: "app/ranking/ranking.html", controller: "RankingCtrl"})

	// Settings
	.state("settings", {abstract: true, url:"^/settings", templateUrl: "app/settings/settings.html", controller: "SettingsController"})
	.state("settings.profile", {url:"/profile", templateUrl: "app/settings/settings.profile.html", controller: "ProfileController"})
	.state("settings.account", {url:"/account", templateUrl: "app/settings/settings.account.html", controller: "AccountController"})
	.state("settings.notifications", {url:"/notifications", templateUrl: "app/settings/settings.notifications.html", controller: "NotificationsController"})
	.state("settings.link_device", {url:"/link_device", templateUrl: "app/settings/settings.link_device.html", controller: "DevicesController"})

	// Notifications
	.state('notifications', {url:"^/notifications", templateUrl: "app/notifications/notifications.html", controller: "NotificationsCtrl"})
	.state('notifications_search', {url:"^/notifications/:notification_type", templateUrl: "app/notifications/notifications.html", controller: "NotificationsCtrl"})

	.state('about', {url:"^/about", templateUrl: 'app/static_views/about.html', controller: "StaticViewController"})
	.state('terms', {url:"^/terms", templateUrl: 'app/static_views/terms.html', controller: "StaticViewController"})
	.state('press', {url:"^/press", templateUrl: 'app/static_views/press.html', controller: "StaticViewController"})
}]);

angular.module('app').config(["$locationProvider", function($locationProvider){
    $locationProvider.html5Mode({
        enabled: true,
        requireBase: false,
    });
}]);