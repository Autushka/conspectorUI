viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider', '$window', '$mdSidenav', 'historyProvider', '$translate', '$timeout', 'rolesSettings',
	function($scope, $state, servicesProvider, $cookieStore, cacheProvider, $window, $mdSidenav, historyProvider, $translate, $timeout, rolesSettings) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		cacheProvider.clearOtherViewsScrollPosition("");
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$scope.toggleProfileSettingsRightSideNav = function() {
			$timeout($mdSidenav('profileSettingsRightSideNav').toggle, 200);
		};

		var navigateToCustomizing = function(sStateName, oStateParams) {
			
			if (oStateParams) {
				$state.go(sStateName, oStateParams);
			} else {
				$state.go(sStateName);
			}
			$timeout($mdSidenav('profileSettingsRightSideNav').close, 350);
		};

		$scope.onMenuItemSelected = function(oMenuItem) {
			navigateToCustomizing(oMenuItem.sStateName, oMenuItem.oStateParams);
		};

		$scope.aMenuItems = [];

		var sAccountGuid = "";
		var sContactGuid = "";
		if(cacheProvider.oUserProfile.oUserContact && cacheProvider.oUserProfile.oUserContact.AccountDetails){
			sAccountGuid = cacheProvider.oUserProfile.oUserContact.AccountDetails.Guid;
			sContactGuid = cacheProvider.oUserProfile.oUserContact.Guid;
		}

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesProfileMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowContactDetails",
			}),
			sStateName: "app.profileSettings.contactDetails",
			sMenuLabel: "profileSettings_contactDetails",
			oStateParams: {
				sMode: "display",
				sAccountGuid: sAccountGuid,
				sContactGuid: sContactGuid,
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

		$scope.$on("$destroy", function() {
			oWindow.unbind();
		});		
	}
]);