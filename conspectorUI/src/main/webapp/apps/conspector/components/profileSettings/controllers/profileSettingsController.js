viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider',
	function($scope, $state, servicesProvider, $cookieStore, cacheProvider) {
		$scope.onRefreshCookedSettings = function() {
			var sCurrentUser = cacheProvider.oUserProfile.sUserName;
			var sCompany = cacheProvider.oUserProfile.sCurrentCompany;

			$cookieStore.remove("userPhases" + sCurrentUser + sCompany);
		};
	}
]);