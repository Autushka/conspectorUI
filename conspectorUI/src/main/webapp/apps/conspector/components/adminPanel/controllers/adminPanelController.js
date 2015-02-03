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

		$scope.onMenuItemSelected = function(oMenuItem) {
			navigateToCustomizing(oMenuItem.sStateName);
		}

		$scope.aMenuItems = [];
		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowCompaniesManagement",
			}),
			sStateName: "app.adminPanel.companiesList",
			sMenuLabel: "adminPanel_companies",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowUsersManagement"
			}),
			sStateName: "app.adminPanel.usersList",
			sMenuLabel: "adminPanel_userManagement",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowRolesManagement"
			}),
			sStateName: "app.adminPanel.rolesList",
			sMenuLabel: "adminPanel_roles",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowProjectsManagement"
			}),
			sStateName: "app.adminPanel.projectsList",
			sMenuLabel: "adminPanel_projects",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowPhasesManagement"
			}),
			sStateName: "app.adminPanel.phasesList",
			sMenuLabel: "adminPanel_phases",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowDeficiencyStatusesManagement"
			}),
			sStateName: "app.adminPanel.deficiencyStatusesList",
			sMenuLabel: "adminPanel_deficiencyStatuses",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowDeficiencyPrioritiesManagement"
			}),
			sStateName: "app.adminPanel.deficiencyPrioritiesList",
			sMenuLabel: "adminPanel_deficiencyPriorities",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowSystemFilesManagement"
			}),
			sStateName: "app.adminPanel.systemFiles",
			sMenuLabel: "adminPanel_systemFiles",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowOperationLogs"
			}),
			sStateName: "app.adminPanel.operationLogsList",
			sMenuLabel: "adminPanel_operationLogs",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowAccountTypesManagement"
			}),
			sStateName: "app.adminPanel.accountTypesList",
			sMenuLabel: "adminPanel_accountTypes",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowContactTypesManagement"
			}),
			sStateName: "app.adminPanel.contactTypesList",
			sMenuLabel: "adminPanel_contactTypes",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowUnitOptionSetManagement"
			}),
			sStateName: "app.adminPanel.unitOptionSetList",
			sMenuLabel: "adminPanel_unitOptionSet",
		});

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowUnitOptionValuesManagement"
			}),
			sStateName: "app.adminPanel.unitOptionValuesList",
			sMenuLabel: "adminPanel_unitOptionValues",
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