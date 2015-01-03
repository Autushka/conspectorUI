viewControllers.controller('roleSelectionView', ['$scope', '$rootScope', '$state', '$translate', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider', 'apiProvider',
	function($scope, $rootScope, $state, $translate, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider, apiProvider) {
		var aRoles = [];
		$scope.sLanguage = $translate.use();

		$rootScope.$on('languageChanged', function() {
			$scope.sLanguage = $translate.use();
		});

		for (var i = 0; i < cacheProvider.oUserProfile.aUserRoles.length; i++) {
			var oRole = {};
			oRole.RoleName = cacheProvider.oUserProfile.aUserRoles[i].RoleName;
			oRole.DescriptionEN = cacheProvider.oUserProfile.aUserRoles[i].DescriptionEN;
			oRole.DescriptionFR = cacheProvider.oUserProfile.aUserRoles[i].DescriptionFR;

			if (!oRole.DescriptionFR) {
				oRole.DescriptionFR = oRole.DescriptionEN; //default value is engilsh one (in case when translation is missing)
			}
			oRole._sortingSequence = cacheProvider.oUserProfile.aUserRoles[i].GeneralAttributes.SortingSequence;
			aRoles.push(oRole);
		}

		$scope.aUserRoles = $filter('orderBy')(aRoles, ["_sortingSequence"]);
		$scope.sSelectedRoleName = $scope.aUserRoles[0].RoleName;

		$scope.onContinue = function() {
			var sCurrentRole = $scope.sSelectedRoleName;

			if (!rolesSettings.oInitialViews[sCurrentRole]) {
				servicesProvider.onNoDefaultViewForTheRole();
				return;
			}

			cacheProvider.oUserProfile.sCurrentRole = sCurrentRole;
			$rootScope.sCurrentRole = sCurrentRole;
			apiProvider.setCurrentRole(sCurrentRole); //current role is cached here	
			servicesProvider.logSuccessLogIn(); //log login_success operation 
			window.location.href = rolesSettings.oInitialViews[sCurrentRole];
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
	}
]);