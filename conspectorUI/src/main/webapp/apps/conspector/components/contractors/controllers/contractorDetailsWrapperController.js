viewControllers.controller('contractorDetailsWrapperView', ['$scope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider',
	function($scope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider) {
		//$scope.sMode = "";
		$scope.sViewName = "contractorDetailsWrapperView";
		$scope.sCurrentStateName = $state.current.name;
		$scope.oStateParams = {};

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $scope.sCurrentStateName,
				oStateParams: $scope.oStateParams
			});
		});
	}
]);