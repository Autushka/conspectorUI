viewControllers.controller('clientDetailsWrapperView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider) {
		$scope.bDisplayContactsList = false;
		$scope.bDisplayActivitiesList = false;

		$scope.onDisplayContactsList = function() {
            $scope.bDisplayContactsList === false ? $scope.bDisplayContactsList = true : $scope.bDisplayContactsList = false;     
        };

		$scope.onDisplayActivitiesList = function() {
            $scope.bDisplayActivitiesList === false ? $scope.bDisplayActivitiesList = true : $scope.bDisplayActivitiesList = false;     
        };

		$scope.$on("$destroy", function() {
			if(historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName){ //current state was already put to the history in the parent views
				return;
			}			
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: angular.copy($rootScope.oStateParams)
			});
		});
	}
]);