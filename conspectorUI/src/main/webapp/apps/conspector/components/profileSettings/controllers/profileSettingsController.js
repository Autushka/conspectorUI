viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider', '$window', '$mdSidenav', 'historyProvider', '$translate', 'rolesSettings',
	function($scope, $state, servicesProvider, $cookieStore, cacheProvider, $window, $mdSidenav, historyProvider, $translate, rolesSettings) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$scope.toggleLeftSidenav = function() {
			$mdSidenav('left').toggle();
		};

		var navigateToCustomizing = function(sStateName, oStateParams) {
			if ($mdSidenav('left'))  {
				$mdSidenav('left').close();
			}

			if (oStateParams) {
				$state.go(sStateName, oStateParams);
			} else {
				$state.go(sStateName);
			}
		};

		$scope.onMenuItemSelected = function(oMenuItem) {
			navigateToCustomizing(oMenuItem.sStateName, oMenuItem.oStateParams);
		};

		$scope.aMenuItems = [];
		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesProfileMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowContactDetails",
			}),
			sStateName: "app.profileSettings.contactDetails",
			sMenuLabel: "profileSettings_contactDetails",
			oStateParams: {
				sMode: "display",
				sAccountGuid: cacheProvider.oUserProfile.sUserAccountGuid,
				sContactGuid: cacheProvider.oUserProfile.sUserContactGuid,
			}
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesProfileMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowProfileDetails",
			}),
			sStateName: "app.profileSettings.profileDetails",
			sMenuLabel: "profileSettings_profileDetails",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesProfileMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowChangePassword",
			}),
			sStateName: "app.profileSettings.changePassword",
			sMenuLabel: "profileSettings_changePassword",
		});

		var oWindow = angular.element($window);

		oWindow.bind('resize', function() {
			if ($mdSidenav('left')) {
				$mdSidenav('left').close();
			}
		});
	}
]);