viewControllers.controller('companySelectionView', ['$scope', '$rootScope', '$state', '$translate', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider', 'apiProvider',
	function($scope, $rootScope, $state, $translate, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider, apiProvider) {
		var aCompanies = [];
		$scope.sLanguage = $translate.use();

		$rootScope.$on('languageChanged', function() {
			$scope.sLanguage = $translate.use();
		});

		for (var i = 0; i < cacheProvider.oUserProfile.aUserCompanies.length; i++) {
			var oCompany = {};
			oCompany.CompanyName = cacheProvider.oUserProfile.aUserCompanies[i].CompanyName;
			oCompany.DescriptionEN = cacheProvider.oUserProfile.aUserCompanies[i].DescriptionEN;
			oCompany.DescriptionFR = cacheProvider.oUserProfile.aUserCompanies[i].DescriptionFR;

			if (!oCompany.DescriptionFR) {
				oCompany.DescriptionFR = oCompany.DescriptionEN; //default value is engilsh one (in case when translation is missing)
			}
			oCompany._sortingSequence = cacheProvider.oUserProfile.aUserCompanies[i].GeneralAttributes.SortingSequence;
			if (oCompany.CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
				aCompanies.push(oCompany);
			}
		}

		$scope.aUserCompanies = $filter('orderBy')(aCompanies, ["_sortingSequence"]);
		$scope.sSelectedCompanyName = $scope.aUserCompanies[0].CompanyName;

		$scope.onContinue = function() {
			var sCurrentCompany = $scope.sSelectedCompanyName;;
			cacheProvider.oUserProfile.sCurrentCompany = sCurrentCompany; //current company is cached here	
			apiProvider.setCurrentCompany(sCurrentCompany);

			cacheProvider.oUserProfile.aUserRoles = angular.copy(cacheProvider.oUserProfile.aAllUserRoles);
			servicesProvider.checkUserRolesAssignment(sCurrentCompany);
			servicesProvider.setUserPhasesForCurrentCompany(sCurrentCompany);
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};

		$scope.onBack = function() {
			$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
		};
	}
]);