viewControllers.controller('appView', ['$scope', '$rootScope', '$state', '$window', 'servicesProvider', '$translate', '$timeout', 'cacheProvider', 'rolesSettings', '$cookieStore', 'historyProvider',
	function($scope, $rootScope, $state, $window, servicesProvider, $translate, $timeout, cacheProvider, rolesSettings, $cookieStore, historyProvider) {
		var sCurrentUser = cacheProvider.oUserProfile.sUserName;
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
		var aSelectedPhases = [];
		$scope.sCurrentUser = sCurrentUser;

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation (i.e. switch role/company views)	
		$rootScope.oStateParams = {}; // for backNavigation

		if (!sCurrentUser) {
			servicesProvider.logOut();
		}

		servicesProvider.constructLogoUrl();

		if ($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany) && $cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids) {
			aSelectedPhases = angular.copy($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids);

		} else {
			aSelectedPhases = servicesProvider.getUserPhasesGuids();
		}

		cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aSelectedPhases;

		$scope.globalProjectsWithPhases = servicesProvider.constructUserProjectsPhasesForMultiSelect({
			aSelectedPhases: aSelectedPhases
		});

		$scope.onGlobalUserPhasesChanged = function() {
			var aSelectedPhases = [];
			aSelectedPhases = servicesProvider.getSeletedItemsKeysInMultiSelect({
				sKey: "Guid",
				aData: $scope.globalProjectsWithPhases
			});

			$cookieStore.put("globallySelectedPhasesGuids" + sCurrentUser + sCompany, {
				aPhasesGuids: aSelectedPhases,
			});
			cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aSelectedPhases;

			$scope.$broadcast('globalUserPhasesHaveBeenChanged');
		};

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowAdminPanel"
		})) {
			$scope.bDisplayAdminPanel = true;
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowProfileSettings"
		})) {
			$scope.bDisplayProfileSettings = true;
		}

		if (cacheProvider.oUserProfile.aUserCompanies && cacheProvider.oUserProfile.aUserCompanies.length > 1) {
			$scope.bDisplaySwitchCompanies = true;
		}

		if (cacheProvider.oUserProfile.aUserRoles && cacheProvider.oUserProfile.aUserRoles.length > 1) {
			$scope.bDisplaySwitchRoles = true;
		}

		$scope.aTabs = [];

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowDeficiencies"
		})) {
			$scope.aTabs.push({
				sTitle: "app_deficienciesTab",
				sState: "app.deficienciesList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowUnits"
		})) {
			$scope.aTabs.push({
				sTitle: "app_unitsTab",
				sState: "app.unitsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowContractors"
		})) {
			$scope.aTabs.push({
				sTitle: "app_contractorsTab",
				sState: "app.contractorsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowClients"
		})) {
			$scope.aTabs.push({
				sTitle: "app_clientsTab",
				sState: "app.clientsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowContacts"
		})) {
			$scope.aTabs.push({
				sTitle: "app_contactsTab",
				sState: "app.contactsList"
			});
		}

		if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
			sRole: sCurrentRole,
			sMenuItem: "bShowActivities"
		})) {
			$scope.aTabs.push({
				sTitle: "app_activitiesTab",
				sState: "app.activitiesList"
			});
		}

		$scope.onSwitchCompanies = function() {
			$state.go('companySelection');
		};

		$scope.onSwitchRoles = function() {
			$state.go('roleSelection');
		};

		$scope.onLogOut = function() {
			servicesProvider.logOut();
		};

		var getITabIndexForCurrentState = function(sState) {
			for (var i = 0; i < $scope.aTabs.length; i++) { // can't use static numbering due to hidden tabs scenario (for some user roles)
				if ($scope.aTabs[i].sState === sState) {
					return i;
				}
			};
		}

		var tabSelectionBasedOnHash = function() {
			if ($window.location.hash.indexOf("#/app/adminPanel") > -1 ||
				$window.location.hash.indexOf("#/app/profileSettings") > -1 ||
				$window.location.hash.indexOf("#/app/clientDetails") > -1 ||
				$window.location.hash.indexOf("#/app/contractorDetails") > -1 ||
				$window.location.hash.indexOf("#/app/contactDetails") > -1 ||
				$window.location.hash.indexOf("#/app/deficiencyDetails") > -1) {
				$scope.selectedTabIndex = -1;
				$scope.$broadcast("$mdTabsPaginationChanged");
				return;
			}

			if ($window.location.hash.indexOf("deficienc") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.deficienciesList");
				return;
			}

			if ($window.location.hash.indexOf("unit") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.unitsList");
				return;
			}
			if ($window.location.hash.indexOf("contractor") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.contractorsList");
				return;
			}
			if ($window.location.hash.indexOf("client") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.clientsList");
				return;
			}
			if ($window.location.hash.indexOf("contact") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.contactsList");
				return;
			}
			if ($window.location.hash.indexOf("activity") > -1) {
				$scope.selectedTabIndex = getITabIndexForCurrentState("app.activitiesList");
				return;
			}
		};

		$timeout(tabSelectionBasedOnHash, 100);

		$scope.onTabSelect = function(oTab) {
			var sCurrentSelectedTab = "";
			if ($window.location.hash.indexOf("deficienc") > -1) {
				sCurrentSelectedTab = "Deficiencies";
			}
			if ($window.location.hash.indexOf("unit") > -1) {
				sCurrentSelectedTab = "Units";
			}
			if ($window.location.hash.indexOf("contractor") > -1) {
				sCurrentSelectedTab = "Contractors";
			}
			if ($window.location.hash.indexOf("client") > -1) {
				sCurrentSelectedTab = "Clients";
			}
			if ($window.location.hash.indexOf("contact") > -1) {
				sCurrentSelectedTab = "Contacts";
			}
			if ($window.location.hash.indexOf("activity") > -1) {
				sCurrentSelectedTab = "Activities";
			}

			if ($scope.selectedTabIndex !== undefined) { //($window.location.hash !== oTab.sHash && $scope.selectedTabIndex !== undefined) {
				$state.go(oTab.sState);
			}
		};

		$scope.onAdminPanel = function() {
			$scope.selectedTabIndex = -1;
			$scope.$broadcast("$mdTabsPaginationChanged");
			$state.go('app.adminPanel.usersList');
		};

		$scope.onProfileSettings = function() {
			$scope.selectedTabIndex = -1;
			$scope.$broadcast("$mdTabsPaginationChanged");
			$state.go('app.profileSettings.profileDetails');
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};

		$scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
			$timeout(tabSelectionBasedOnHash, 100);
		});

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: $rootScope.oStateParams
			});
		});
	}
]);