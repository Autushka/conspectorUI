viewControllers.controller('deficiencyDetailsWrapperView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider',
	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider) {
		$rootScope.bDataHasBeenModified = false;
		$scope.bDisplayAttachmentsList = false;
		$scope.bDisplayCommentsList = false;

		$scope.onDisplayAttachmentsList = function() {
            $scope.bDisplayAttachmentsList === false ? $scope.bDisplayAttachmentsList = true : $scope.bDisplayAttachmentsList = false;     
        };

		$scope.onDisplayCommentsList = function() {
            $scope.bDisplayCommentsList === false ? $scope.bDisplayCommentsList = true : $scope.bDisplayCommentsList = false;     
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