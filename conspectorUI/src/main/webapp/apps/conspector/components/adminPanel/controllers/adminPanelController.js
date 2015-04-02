viewControllers.controller('adminPanelView', ['$scope', '$state', 'servicesProvider', '$window', 'CONSTANTS', 'cacheProvider', '$mdSidenav', '$window', 'historyProvider', 'rolesSettings', '$translate', '$timeout',
	function($scope, $state, servicesProvider, $window, CONSTANTS, cacheProvider, $mdSidenav, $window, historyProvider, rolesSettings, $translate, $timeout) {
		historyProvider.removeHistory(); // because current view doesn't have a back button		
		cacheProvider.clearOtherViewsScrollPosition("");
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$scope.toggleAdminPanelRightSideNav = function() {
			$timeout($mdSidenav('adminPanelRightSideNav').toggle, 200);
			// $mdSidenav('adminPanelRightSideNav').toggle();
		};

		var navigateToCustomizing = function(sStateName) {
			$state.go(sStateName);
			// $mdSidenav('adminPanelRightSideNav').close();
			$timeout($mdSidenav('adminPanelRightSideNav').close, 350);
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
				sMenuItem: "bShowUnitOptionValueManagement"
			}),
			sStateName: "app.adminPanel.unitOptionValueList",
			sMenuLabel: "adminPanel_unitOptionValue",
		});		

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowTaskTypeManagement"
			}),
			sStateName: "app.adminPanel.taskTypeList",
			sMenuLabel: "adminPanel_taskType",
		});	

		$scope.aMenuItems.push({
			bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
				sRole: sCurrentRole,
				sMenuItem: "bShowActivityTypesManagement"
			}),
			sStateName: "app.adminPanel.activityTypesList",
			sMenuLabel: "adminPanel_activityTypes",
		});		

		$scope.aMenuItems.push({
			// bShouldBeDisplayed: rolesSettings.getRolesAdminPanelMenuItemSettings({
			// 	sRole: sCurrentRole,
			// 	sMenuItem: "bShowActivityTypesManagement"
			// }),
			bShouldBeDisplayed: true,
			sStateName: "app.adminPanel.additionalAttributesList",
			sMenuLabel: "adminPanel_additionalAttributes",
		});			

		// var oWindow = angular.element($window);

		// oWindow.bind('resize', function() {
		// 	if ($mdSidenav('left')) {
		// 		$mdSidenav('left').close();
		// 	}
		// });

		// $scope.$on("$destroy", function() {
		// 	oWindow.unbind();
		// });				
	}
]);