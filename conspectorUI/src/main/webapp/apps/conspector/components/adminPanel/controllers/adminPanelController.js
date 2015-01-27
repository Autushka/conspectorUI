viewControllers.controller('adminPanelView', ['$scope', '$state', 'servicesProvider', '$window', 'CONSTANTS', 'cacheProvider', '$mdSidenav', '$window', 'historyProvider', 'rolesSettings', '$translate',
	function($scope, $state, servicesProvider, $window, CONSTANTS, cacheProvider, $mdSidenav, $window, historyProvider, rolesSettings, $translate) {
		historyProvider.removeHistory(); // because current view doesn't have a back button		
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$scope.toggleLeftSidenav = function() {
			$mdSidenav('left').toggle();
		};

		var navigateToCustomizing = function(sStateName) {
			$mdSidenav('left').close();
			$state.go(sStateName);
		}

		$scope.onMenuItemselected = function(oMenuItem) {
			navigateToCustomizing(oMenuItem.sStateName);
		}

		$scope.aMenuItems = [];
		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowCompaniesManagement",
			}),
			sStateName: "app.adminPanel.companiesList",
			sMenuLabel: $translate.instant('adminPanel_companies')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowUsersManagement"
			}),
			sStateName: "app.adminPanel.usersList",
			sMenuLabel: $translate.instant('adminPanel_userManagement')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowRolesManagement"
			}),
			sStateName: "app.adminPanel.rolesList",
			sMenuLabel: $translate.instant('adminPanel_roles')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowProjectsManagement"
			}),
			sStateName: "app.adminPanel.projectsList",
			sMenuLabel: $translate.instant('adminPanel_projects')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowPhasesManagement"
			}),
			sStateName: "app.adminPanel.phasesList",
			sMenuLabel: $translate.instant('adminPanel_phases')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowDeficiencyStatusesManagement"
			}),
			sStateName: "app.adminPanel.deficiencyStatusesList",
			sMenuLabel: $translate.instant('adminPanel_deficiencyStatuses')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowDeficiencyPrioritiesManagement"
			}),
			sStateName: "app.adminPanel.deficiencyPrioritiesList",
			sMenuLabel: $translate.instant('adminPanel_deficiencyPriorities')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowSystemFilesManagement"
			}),
			sStateName: "app.adminPanel.systemFiles",
			sMenuLabel: $translate.instant('adminPanel_systemFiles')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowOperationLogs"
			}),
			sStateName: "app.adminPanel.operationLogsList",
			sMenuLabel: $translate.instant('adminPanel_operationLogs')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowAccountTypesManagement"
			}),
			sStateName: "app.adminPanel.accountTypesList",
			sMenuLabel: $translate.instant('adminPanel_accountTypes')
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowContactTypesManagement"
			}),
			sStateName: "app.adminPanel.contactTypesList",
			sMenuLabel: $translate.instant('adminPanel_contactTypes')
		});

		var oWindow = angular.element($window);

		oWindow.bind('resize', function() {
			if ($mdSidenav('left')) {
				$mdSidenav('left').close();
			}

		});
	}
]);