app.controller('mainController', ['$scope', '$rootScope', 'apiProvider', 'servicesProvider',
	function($scope, $rootScope, apiProvider, servicesProvider) {
		var sUserName = apiProvider.getCurrentUserName();

		if (sUserName) {
			servicesProvider.onF5WithCurrentUserHandler(sUserName);
		}

		$rootScope.$on('LOAD', function() {
			$rootScope.showSpinner = true;
		});
		$rootScope.$on('UNLOAD', function() {
			$rootScope.showSpinner = false;
		});
	}
]);