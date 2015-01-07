viewControllers.controller('appView', ['$scope', '$rootScope', '$state', '$window', 'servicesProvider', '$translate', '$timeout', 'cacheProvider', 'rolesSettings', '$cookieStore',
	function($scope, $rootScope, $state, $window, servicesProvider, $translate, $timeout, cacheProvider, rolesSettings, $cookieStore) {
		var sCurrentUser = cacheProvider.oUserProfile.sUserName;
		var sCompany = cacheProvider.oUserProfile.sCurrentCompany;

		if ($cookieStore.get("userPhases" + sCurrentUser + sCompany) && $cookieStore.get("userPhases" + sCurrentUser + sCompany).aPhases){
			$scope.globalProjectsWithPhases = angular.copy($cookieStore.get("userPhases" + sCurrentUser + sCompany).aPhases);
		}else{
			$scope.globalProjectsWithPhases = servicesProvider.constructGlobalProjectPhaseData();
		}

		$scope.onGlobalUserPhasesChanged = function() {
			$cookieStore.put("userPhases" + sCurrentUser + sCompany, {
				aPhases: $scope.globalProjectsWithPhases,
			});
		};

		servicesProvider.constructLogoUrl(); //"http://localhost:8080/conspector/img/logo_conspector.png";//servicesProvider.constructLogoUrl();

		if (rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].adminPanel) {
			$scope.bDisplayAdminPanel = true;
		}

		if (rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].profileSettings) {
			$scope.bDisplayProfileSettings = true;
		}

		if (cacheProvider.oUserProfile.aUserCompanies.length > 1) {
			$scope.bDisplaySwitchCompanies = true;
		}

		if (cacheProvider.oUserProfile.aUserRoles.length > 1) {
			$scope.bDisplaySwitchRoles = true;
		}

		$scope.aTabs = [];

		if (rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].deficiencies) {
			$scope.aTabs.push({
				sTitle: $translate.instant("app_deficienciesTab"),
				sState: "app.deficienciesList"//"#/app/deficienciesList"
			});
		}

		if (rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].units) {
			$scope.aTabs.push({
				sTitle: $translate.instant("app_unitsTab"),
				sState: "app.unitsList"//"#/app/unitsList"
			});
		}

		if (rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].contractors) {
			$scope.aTabs.push({
				sTitle: $translate.instant("app_contractorsTab"),
				sState: "app.constractorsList"//"#/app/contractorsList"
			});
		}

		if (rolesSettings.oDisplayedSections[cacheProvider.oUserProfile.sCurrentRole].clients) {
			$scope.aTabs.push({
				sTitle: $translate.instant("app_clientsTab"),
				sState: "app.clientsList"//"#/app/clientsList"
			});
		}

		$scope.onSwitchCompanies = function() {
			//$window.location.href = "#/companySelection";
			$state.go('companySelection');
		};

		$scope.onSwitchRoles = function() {
			//$window.location.href = "#/roleSelection";
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
			if ($window.location.hash !== oTab.sHash && $scope.selectedTabIndex !== undefined) {
				//$window.location.href = oTab.sHash;
				$state.go(oTab.sState);
			}
		};

		$scope.onAdminPanel = function() {
			$scope.selectedTabIndex = -1;
			//$window.location.href = "#/app/adminPanel/usersList";
			$state.go('app.adminPanel.usersList');
		};

		$scope.onProfileSettings = function() {
			$scope.selectedTabIndex = -1;
			//$window.location.href = "#/app/profileSettings";
			$state.go('app.profileSettings.profileDetails');
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
	}
]);