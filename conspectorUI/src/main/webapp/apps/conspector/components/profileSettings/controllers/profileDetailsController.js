viewControllers.controller('profileDetailsView', ['$scope', '$rootScope', '$state', '$translate', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider', 'apiProvider', '$cookieStore',
	function($scope, $rootScope, $state, $translate, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider, apiProvider, $cookieStore) {
		var sCurrentUser = cacheProvider.oUserProfile.sUserName; 
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany; 

		$scope.onRefreshCookedSettings = function() {
			$cookieStore.remove("userPhases" + sCurrentUser + sCompany); 
		};		
	}
]);