app.controller('mainController', ['$scope', '$rootScope', '$state', 'apiProvider', 'servicesProvider', 'cacheProvider', 'CONSTANTS', 'utilsProvider', 'cfpLoadingBar',
	function($scope, $rootScope, $state, apiProvider, servicesProvider, cacheProvider, CONSTANTS, utilsProvider, cfpLoadingBar) {
		var sUserName = apiProvider.getCurrentUserName();

		if (sUserName) {
			servicesProvider.onF5WithCurrentUserHandler(sUserName);
		} 

		$rootScope.$on('LOAD', function() {
			cfpLoadingBar.start();
			$rootScope.showSpinner = true;
		});
		$rootScope.$on('UNLOAD', function() {
			cfpLoadingBar.complete();
			$rootScope.showSpinner = false;
		});

		$rootScope.bIsGalleryHidden = true;

		$rootScope.hideGallery = function() {
			$rootScope.bIsGalleryHidden = true;
		};
	}
]);