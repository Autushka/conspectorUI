viewControllers.controller('appView', ['$scope', '$rootScope', '$state', '$window', 'servicesProvider', '$translate', '$timeout', 'cacheProvider', 'rolesSettings', '$cookieStore',
	function($scope, $rootScope, $state, $window, servicesProvider, $translate, $timeout, cacheProvider, rolesSettings, $cookieStore) {
		var sCurrentUser = cacheProvider.oUserProfile.sUserName;
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
		var aSelectedPhases = [];
		$scope.sCurrentUser = sCurrentUser;

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

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].adminPanel) {
			$scope.bDisplayAdminPanel = true;
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].profileSettings) {
			$scope.bDisplayProfileSettings = true;
		}

		if (cacheProvider.oUserProfile.aUserCompanies && cacheProvider.oUserProfile.aUserCompanies.length > 1) {
			$scope.bDisplaySwitchCompanies = true;
		}

		if (cacheProvider.oUserProfile.aUserRoles && cacheProvider.oUserProfile.aUserRoles.length > 1) {
			$scope.bDisplaySwitchRoles = true;
		}

		$scope.aTabs = [];

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].deficiencies) {
			$scope.aTabs.push({
				iIndex: 0,
				sTitle: $translate.instant("app_deficienciesTab"),
				sState: "app.deficienciesList" //"#/app/deficienciesList"
			});
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].units) {
			$scope.aTabs.push({
				iIndex: 1,
				sTitle: $translate.instant("app_unitsTab"),
				sState: "app.unitsList" //"#/app/unitsList"
			});
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].contractors) {
			$scope.aTabs.push({
				iIndex: 2,
				sTitle: $translate.instant("app_contractorsTab"),
				sState: "app.contractorsList" //"#/app/contractorsList"
			});
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].clients) {
			$scope.aTabs.push({
				iIndex: 3,
				sTitle: $translate.instant("app_clientsTab"),
				sState: "app.clientsList" //"#/app/clientsList"
			});
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].contacts) {
			$scope.aTabs.push({
				iIndex: 4,
				sTitle: $translate.instant("app_contactsTab"),
				sState: "app.contactsList" //"#/app/clientsList"
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

		var tabSelectionBasedOnHash = function() {
			if ($window.location.hash.indexOf("#/app/adminPanel") > -1 || $window.location.hash.indexOf("#/app/profileSettings") > -1  || $window.location.hash.indexOf("#/app/clientDetails") > -1 ||  $window.location.hash.indexOf("#/app/contractorDetails") > -1  || $window.location.hash.indexOf("#/app/contactDetails") > -1) {
				$scope.selectedTabIndex = -1;
				$scope.$broadcast("$mdTabsPaginationChanged");
				return;
			}

			if ($window.location.hash.indexOf("deficienc") > -1) {
				$scope.selectedTabIndex = 0;
			}

			if ($window.location.hash.indexOf("unit") > -1) {
				$scope.selectedTabIndex = 1;
			}
			if ($window.location.hash.indexOf("contractor") > -1) { 
				$scope.selectedTabIndex = 2;
			}
			if ($window.location.hash.indexOf("client") > -1) {
				$scope.selectedTabIndex = 3;
			}
			if ($window.location.hash.indexOf("contact") > -1) {
				$scope.selectedTabIndex = 4;
			}			
		};

		$timeout(tabSelectionBasedOnHash, 100);

		$scope.onTabSelect = function(oTab) {
			var sCurrentSelectedTab = "";
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

			// if (oTab.iIndex === 1 && sCurrentSelectedTab === "Units") {
			// 	return;
			// }
			// if (oTab.iIndex === 2 && sCurrentSelectedTab === "Contractors") {
			// 	return;
			// }
			// if (oTab.iIndex === 3 && sCurrentSelectedTab === "Clients") {
			// 	return;
			// }

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
	}
]);