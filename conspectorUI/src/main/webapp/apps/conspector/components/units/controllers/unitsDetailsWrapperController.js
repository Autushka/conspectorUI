// viewControllers.controller('contactDetailsWrapperView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider',
// 	function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider) {
// 		$scope.$on("$destroy", function() {
// 			if(historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName){ //current state was already put to the history in the parent views
// 				return;
// 			}

// 			historyProvider.addStateToHistory({
// 				sStateName: $rootScope.sCurrentStateName,
// 				oStateParams: angular.copy($rootScope.oStateParams)
// 			});
// 		});
// 	}
// ]);