viewControllers.controller('clientsListView', ['$scope', '$state', 'servicesProvider', 'historyProvider',
	function($scope, $state, servicesProvider, historyProvider) {
		historyProvider.removeHistory();// because current view doesn't have a back button	
	}
]);