viewControllers.controller('appView', ['$scope', '$state', 'servicesProvider', '$window', '$translate',
	function($scope, $state, servicesProvider, $window, $translate) {
		$scope.aTabs = [];

		$scope.aTabs.push({
			sTitle: $translate.instant("app_deficienciesTab"),
			sHash: "#/app/deficienciesList"
		});
		$scope.aTabs.push({
			sTitle: $translate.instant("app_unitsTab"),
			sHash: "#/app/unitsList"
		});
		$scope.aTabs.push({
			sTitle: $translate.instant("app_contractorsTab"),
			sHash: "#/app/contractorsList"
		});
		$scope.aTabs.push({
			sTitle: $translate.instant("app_clientsTab"),
			sHash: "#/app/clientsList"
		});

		$scope.onLogOut = function() {
			servicesProvider.logOut();
		};

		$scope.onTabSelect = function(oTab) {
			if ($window.location.hash !== oTab.sHash) {
				//alert(oTab.sTitle);
				$window.location.href = oTab.sHash;
			}
		};

		$scope.onAdminPanel = function() {

			$window.location.href = "#/app/adminPanel";
		};

		$scope.onProfileSettings = function() {
			$scope.selectedTabIndex = -1;
			$window.location.href = "#/app/profileSettings";

		};

		$scope.onChangeLanguage = function() {
			$scope.selectedTabIndex = -1;			
			servicesProvider.changeLanguage();
		};		
	}
]);