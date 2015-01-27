viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider', '$window','$mdSidenav', 'historyProvider', '$translate', 'rolesSettings',
	function($scope, $state, servicesProvider, $cookieStore, cacheProvider, $window, $mdSidenav, historyProvider, $translate, rolesSettings) {
		historyProvider.removeHistory();// because current view doesn't have a back button				
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;		

		$scope.toggleLeftSidenav = function() {
			$mdSidenav('left').toggle();
		};

		var navigateToCustomizing = function(sStateName) {
			$mdSidenav('left').close();
			$state.go(sStateName);
		};

		$scope.onMenuItemSelected = function(oMenuItem) {
			navigateToCustomizing(oMenuItem.sStateName);
		};

		$scope.aMenuItems = [];
		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesProfileMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowContactDetails",
			}),
			sStateName: "app.profileSettings.contactDetails",
			sMenuLabel: $translate.instant('profileSettings_contactDetails')
		});	

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesProfileMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowProfileDetails",
			}),
			sStateName: "app.profileSettings.profileDetails",
			sMenuLabel: $translate.instant('profileSettings_profileDetails')
		});	

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesProfileMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowChangePassword",
			}),
			sStateName: "app.profileSettings.changePassword",
			sMenuLabel: $translate.instant('profileSettings_changePassword')
		});								
		
		var oWindow = angular.element($window);

		oWindow.bind('resize', function() {
			if ($mdSidenav('left')) {
				$mdSidenav('left').close();
			}
		});
	}
]);