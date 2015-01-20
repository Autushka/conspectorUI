viewControllers.controller('clientDetailsWrapperView', ['$scope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider',
	function($scope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider) {
		//$scope.sMode = "";
		$scope.sViewName = "clientDetailsWrapperView";
		$scope.sCurrentStateName = $state.current.name;
		$scope.oStateParams = angular.copy($stateParams);

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $scope.sCurrentStateName,
				oStateParams: angular.copy($scope.oStateParams)
			});
		});
	}
]);