viewControllers.controller('mainMenuHybridView', ['$scope', '$rootScope', '$state', '$stateParams', '$window', 'servicesProvider', '$translate', '$timeout', 'cacheProvider', 'rolesSettings', '$cookieStore', 'historyProvider',
	function($scope, $rootScope, $state, $stateParams, $window, servicesProvider, $translate, $timeout, cacheProvider, rolesSettings, $cookieStore, historyProvider) {
        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation  
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;               

		$scope.aMenuItems = [];

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesHybridMainMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowQuickAdd",
			}),
			sStateName: "deficiencyQuickAddWrapper.quickAdd",
			sMenuLabel: "hybrid_quickAddMenuItem",
		});		
		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesHybridMainMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowDeficienciesList",
			}),
			sStateName: "deficienciesListHybrid",
			sMenuLabel: "hybrid_deficienciesListItem",
		});			

		$scope.onMenuItemSelected = function(oMenuItem) {
			$state.go(oMenuItem.sStateName);
		}   

		$scope.onBack = function() {
			historyProvider.navigateBack({
				oState: $state
			});
		}; 

        $scope.onChangeLanguage = function() {
            servicesProvider.changeLanguage();
        };		

        $scope.onLogOut = function() {
			$rootScope.aProjectsWithPhases = undefined;
			$rootScope.bPhaseWasSelected = undefined;
			$rootScope.aUnits = undefined;
			$rootScope.sUnitFilter = undefined;
			$rootScope.aFilteredUnits = undefined;
			$rootScope.bUnitWasSelected = undefined;
			$rootScope.aStatuses = undefined;
			$rootScope.bStatusWasSelected = undefined;
			$rootScope.aPriorities = undefined;
			$rootScope.bPriorityWasSelected = undefined;
			$rootScope.aUsers = undefined;
			$rootScope.bUserWasSelected = undefined;

			$rootScope.aDescriptionTags = undefined;
			$rootScope.aLocationTags = undefined;
			$rootScope.aContractors = undefined;
			$rootScope.sContractorsFilter = undefined;
			$rootScope.aFilteredContractors = undefined;
			$rootScope.bContractorWasSelected = undefined;
			$rootScope.oDeficiencyAttributes = undefined;
            servicesProvider.logOut();
        };		
		
		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: angular.copy($rootScope.oStateParams)
			});
		});		              		
	}	
]);