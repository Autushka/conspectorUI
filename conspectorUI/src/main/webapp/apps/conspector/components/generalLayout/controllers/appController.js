viewControllers.controller('appView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$window', '$translate', '$timeout',
	function($scope, $rootScope, $state, servicesProvider, $window, $translate, $timeout) {
		servicesProvider.constructLogoUrl(); //"http://localhost:8080/conspector/img/logo_conspector.png";//servicesProvider.constructLogoUrl();

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

		$timeout(function(){
			if($window.location.hash.indexOf("#/app/adminPanel") > -1 || $window.location.hash.indexOf("#/app/profileSettings") > -1){
				$scope.selectedTabIndex = -1;
			}
			switch($window.location.hash){
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
				$window.location.href = oTab.sHash;
			}
		};

		$scope.onAdminPanel = function() {
			$scope.selectedTabIndex = -1;
			$window.location.href = "#/app/adminPanel/usersList";
		};

		$scope.onProfileSettings = function() {
			$scope.selectedTabIndex = -1;
			$window.location.href = "#/app/profileSettings";
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
	}
]);