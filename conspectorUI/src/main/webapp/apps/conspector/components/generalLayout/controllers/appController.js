viewControllers.controller('appView', ['$scope', '$rootScope', '$state', '$window', 'servicesProvider', '$translate', '$timeout', 'cacheProvider', 'rolesSettings', '$cookieStore',
	function($scope, $rootScope, $state, $window, servicesProvider, $translate, $timeout, cacheProvider, rolesSettings, $cookieStore) {
		var sCurrentUser = cacheProvider.oUserProfile.sUserName;
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
		var aSelectedPhases = [];

		if(!sCurrentUser) {
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
				sTitle: $translate.instant("app_deficienciesTab"),
				sState: "app.deficienciesList" //"#/app/deficienciesList"
			});
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].units) {
			$scope.aTabs.push({
				sTitle: $translate.instant("app_unitsTab"),
				sState: "app.unitsList" //"#/app/unitsList"
			});
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].contractors) {
			$scope.aTabs.push({
				sTitle: $translate.instant("app_contractorsTab"),
				sState: "app.contractorsList" //"#/app/contractorsList"
			});
		}

		if (cacheProvider.oUserProfile.sCurrentRole && rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].clients) {
			$scope.aTabs.push({
				sTitle: $translate.instant("app_clientsTab"),
				sState: "app.clientsList" //"#/app/clientsList"
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

		$timeout(function() {
			if ($window.location.hash.indexOf("#/app/adminPanel") > -1 || $window.location.hash.indexOf("#/app/profileSettings") > -1) {
				$scope.selectedTabIndex = -1;
			}
			switch ($window.location.hash) {
				case "#/app/unitsList":
					$scope.selectedTabIndex = 1;
					break;
				case "#/app/contractorsList":
					$scope.selectedTabIndex = 2;
					break;
				case "#/app/clientsList":
					$scope.selectedTabIndex = 3;
					break;
			}
		}, 100);

		$scope.onTabSelect = function(oTab) {
			if ($scope.selectedTabIndex !== undefined) { //($window.location.hash !== oTab.sHash && $scope.selectedTabIndex !== undefined) {
				$state.go(oTab.sState);
			}
		};

		$scope.onAdminPanel = function() {
			$scope.selectedTabIndex = -1;
			$state.go('app.adminPanel.usersList');
		};

		$scope.onProfileSettings = function() {
			$scope.selectedTabIndex = -1;
			$state.go('app.profileSettings.profileDetails');
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
	}
]);