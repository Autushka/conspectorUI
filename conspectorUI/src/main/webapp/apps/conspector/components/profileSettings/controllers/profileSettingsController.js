viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider',
	function($scope, $state, servicesProvider, $cookieStore, cacheProvider) {

		var sCurrentUser = cacheProvider.oUserProfile.sUserName; //should be moved to profile view when ready
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany; //should be moved to profile view when ready

		$scope.onProfileDetails = function() {
			//$window.location.href = "#/app/profileSettings/profileDetails";
			$state.go('app.profileSettings.profileDetails');
		};
		$scope.onChangePassword = function() {
			//$window.location.href = "#/app/profileSettings/passwordChange";
			$state.go('app.profileSettings.changePassword');
		};
		
		$scope.onRefreshCookedSettings = function() {
			$cookieStore.remove("userPhases" + sCurrentUser + sCompany); //should be moved to profile view when ready
		};
	}
]);