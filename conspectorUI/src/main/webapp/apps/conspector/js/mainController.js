app.controller('mainController', ['$scope', '$rootScope', '$state', 'apiProvider', 'servicesProvider', 'PubNub',
	function($scope, $rootScope, $state, apiProvider, servicesProvider, PubNub) {
		PubNub.init({
			publish_key: 'pub-c-59bd66cf-9992-42d5-af04-87ec537c73bb',
			subscribe_key: 'sub-c-7606f63c-9908-11e4-a626-02ee2ddab7fe'
		});

		var sChannel = "conspectorPubNub";

		PubNub.ngSubscribe({
			channel: sChannel
		});

		$rootScope.$on(PubNub.ngMsgEv(sChannel), function(event, payload) {
			// payload contains message, channel, env...
			//console.log('got a message event:', payload);
			$rootScope.$broadcast('dataWithCacheShouldBeRefreshed');
		})

		var sUserName = apiProvider.getCurrentUserName();

		if (sUserName) {
			servicesProvider.onF5WithCurrentUserHandler(sUserName);
		} else {
			//servicesProvider.logOut(); // had to move this call to appController.js to make it work...
		}

		$rootScope.$on('LOAD', function() {
			$rootScope.showSpinner = true;
		});
		$rootScope.$on('UNLOAD', function() {
			$rootScope.showSpinner = false;
		});

		$rootScope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
			$rootScope.sFromState = from.name;
			$rootScope.oFromStateParams = fromParams;
		});
	}
]);