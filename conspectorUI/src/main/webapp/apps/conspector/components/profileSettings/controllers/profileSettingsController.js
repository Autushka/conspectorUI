viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider',
	function($scope, $state, servicesProvider, $cookieStore, cacheProvider) {
		$scope.onProfileDetails = function() {
			$state.go('app.profileSettings.profileDetails');
		};
		$scope.onChangePassword = function() {
			$state.go('app.profileSettings.changePassword');
		};
	}
]);