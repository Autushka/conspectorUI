app.controller('mainController', ['$scope', '$rootScope', '$state', 'apiProvider', 'servicesProvider', 'cacheProvider', 'CONSTANTS', 'utilsProvider',
	function($scope, $rootScope, $state, apiProvider, servicesProvider, cacheProvider, CONSTANTS, utilsProvider) {
		var sUserName = apiProvider.getCurrentUserName();
		// if(CONSTANTS.bIsHybridApplication){
		// 		$cordovaStatusbar.overlaysWebView(false);			
		// }

		if (sUserName) {
			// alert("pubNub notification....");
			// $rootScope.sSessionGuid = utilsProvider.generateGUID();
			servicesProvider.onF5WithCurrentUserHandler(sUserName);

			// var sChannel = "";

			// PubNub.init({
			// 	publish_key: 'pub-c-59bd66cf-9992-42d5-af04-87ec537c73bb',
			// 	subscribe_key: 'sub-c-7606f63c-9908-11e4-a626-02ee2ddab7fe'
			// });
			// sChannel = "conspectorPubNub" + cacheProvider.oUserProfile.sCurrentCompany;
			// PubNub.ngSubscribe({
			// 	channel: sChannel
			// });

			// $rootScope.$on(PubNub.ngMsgEv(sChannel), function(event, payload) {
			// 	if (payload.message.sSessionGuid === $rootScope.sSessionGuid) {
			// 		return;
			// 	}
			// 	cacheProvider.cleanEntitiesCache(payload.message.sEntityName);
			// 	if (payload.message.sEntityName === "oAccountEntity") {
			// 		cacheProvider.cleanEntitiesCache("oAccountTypeEntity"); //for cases when accountTypes are readed with Accounts;
			// 	}

			// 	switch (payload.message.sEntityName) {
			// 		case "oAccountEntity":
			// 			$rootScope.$broadcast('accountsShouldBeRefreshed');
			// 			break;
			// 		case "oContactEntity":
			// 			$rootScope.$broadcast('contactsShouldBeRefreshed');
			// 			break;
			// 		case "oDeficiencyEntity":
			// 			$rootScope.$broadcast('deficienciesShouldBeRefreshed');
			// 			break;
			// 		case "oUnitEntity":
			// 			$rootScope.$broadcast('unitsShouldBeRefreshed');
			// 			break;	
			// 		case "oActivityEntity":
			// 			$rootScope.$broadcast('unitsShouldBeRefreshed');
			// 			break;												
			// 	}
			// });
		} else {
			//servicesProvider.logOut(); // had to move this call to appController.js to make it work...
		}

		$rootScope.$on('LOAD', function() {
			$rootScope.showSpinner = true;
		});
		$rootScope.$on('UNLOAD', function() {
			$rootScope.showSpinner = false;
		});

		$rootScope.bIsGalleryHidden = true;

		$rootScope.hideGallery = function() {
			$rootScope.bIsGalleryHidden = true;
		};
	}
]);