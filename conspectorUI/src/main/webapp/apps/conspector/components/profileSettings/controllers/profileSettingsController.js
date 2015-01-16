viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider', 'historyProvider',
	function($scope, $state, servicesProvider, $cookieStore, cacheProvider, historyProvider) {
		historyProvider.removeHistory();// because current view doesn't have a back button				
		$scope.onProfileDetails = function() {
			$state.go('app.profileSettings.profileDetails');
		};
		$scope.onChangePassword = function() {
			$state.go('app.profileSettings.changePassword');
		};
	}
]);