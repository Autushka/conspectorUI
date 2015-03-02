viewControllers.controller('deficienciesListHybridView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout',
    function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout) {
        historyProvider.removeHistory();	

		servicesProvider.constructLogoUrl();

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation    
        
        $scope.onMainMenu = function(){
            $state.go("mainMenuHybrid");
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