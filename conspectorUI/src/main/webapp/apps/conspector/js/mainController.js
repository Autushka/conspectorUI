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

		// var pubnub = PUBNUB.init({
		// 	publish_key: 'pub-c-59bd66cf-9992-42d5-af04-87ec537c73bb',
		// 	subscribe_key: 'sub-c-7606f63c-9908-11e4-a626-02ee2ddab7fe'
		// });

	}
]);