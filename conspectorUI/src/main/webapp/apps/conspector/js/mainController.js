app.controller('mainController', ['$scope', '$rootScope', '$state', 'apiProvider', 'servicesProvider', 'PubNub', 'cacheProvider',
	function($scope, $rootScope, $state, apiProvider, servicesProvider, PubNub, cacheProvider) {
		var sUserName = apiProvider.getCurrentUserName();

		if (sUserName) {
			servicesProvider.onF5WithCurrentUserHandler(sUserName);

			var sChannel = "";

			PubNub.init({
				publish_key: 'pub-c-59bd66cf-9992-42d5-af04-87ec537c73bb',
				subscribe_key: 'sub-c-7606f63c-9908-11e4-a626-02ee2ddab7fe'
			});
			sChannel = "conspectorPubNub" + cacheProvider.oUserProfile.sCurrentCompany;
			PubNub.ngSubscribe({
				channel: sChannel
			});

			//to do add activities
			$rootScope.$on(PubNub.ngMsgEv(sChannel), function(event, payload) {
				if (payload.message.sUserName !== cacheProvider.oUserProfile.sUserName) {
					cacheProvider.cleanEntitiesCache(payload.message.sEntityName);
					if(payload.message.sEntityName === "oAccountEntity"){
						cacheProvider.cleanEntitiesCache("oAccountTypeEntity");//for cases when accountTypes are readed with Accounts;
					}
				}
				switch (payload.message.sEntityName) {
					case "oAccountEntity":
						if (payload.message.sUserName !== cacheProvider.oUserProfile.sUserName) {
							$rootScope.$broadcast('accountsShouldBeRefreshed');
						}
						break;
					case "oContactEntity":
						if (payload.message.sUserName !== cacheProvider.oUserProfile.sUserName) {
							$rootScope.$broadcast('contactsShouldBeRefreshed');
						}
						break;
				}
			});
		} else {
			//servicesProvider.logOut(); // had to move this call to appController.js to make it work...
		}

		$rootScope.$on('LOAD', function() {
			$rootScope.showSpinner = true;
		});
		$rootScope.$on('UNLOAD', function() {
			$rootScope.showSpinner = false;
		});
	}
]);