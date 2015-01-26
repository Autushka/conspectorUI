viewControllers.controller('unitsListView', ['$scope', '$state', 'servicesProvider', 'historyProvider', 'apiProvider',
	function($scope, $state, servicesProvider, historyProvider, apiProvider) {
		historyProvider.removeHistory();// because current view doesn't have a back button	


	}
]);