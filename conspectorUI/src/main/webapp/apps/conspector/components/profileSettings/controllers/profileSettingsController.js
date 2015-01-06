viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore',
	function($scope, $state, servicesProvider, $cookieStore) {
		$scope.onRefreshCookedSettings = function(){
			$cookieStore.remove("userPhases");
		};
	}
]);