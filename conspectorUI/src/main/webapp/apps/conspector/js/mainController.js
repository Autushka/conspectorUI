app.controller('mainController', ['$scope', '$rootScope', '$state', 'apiProvider', 'servicesProvider',
	function($scope, $rootScope, $state, apiProvider, servicesProvider) {
		var sUserName = apiProvider.getCurrentUserName();

		if (sUserName) {
			servicesProvider.onF5WithCurrentUserHandler(sUserName);
		}else{
			$state.go("signIn");
		}

		$rootScope.$on('LOAD', function() {
			$rootScope.showSpinner = true;
		});
		$rootScope.$on('UNLOAD', function() {
			$rootScope.showSpinner = false;
		});

		$rootScope.$on('$stateChangeSuccess', function (ev, to, toParams, from, fromParams) {
			$rootScope.sFromState = from.name;
			$rootScope.oFromStateParams = fromParams;
		});		
	}
]);