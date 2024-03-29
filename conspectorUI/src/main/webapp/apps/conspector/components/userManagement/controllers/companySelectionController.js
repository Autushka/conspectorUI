viewControllers.controller('companySelectionView', ['$scope', '$rootScope', '$state', '$translate', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider', 'apiProvider', 'historyProvider',
	function($scope, $rootScope, $state, $translate, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider, apiProvider, historyProvider) {
		var aCompanies = [];
		$rootScope.sCurrentStateName = $state.current.name;	
		cacheProvider.clearOtherViewsScrollPosition("");
 		$rootScope.oStateParams = {};// for backNavigation			
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
			aCompanies.push(oCompany);
		}

		$scope.aUserCompanies = $filter('orderBy')(aCompanies, ["_sortingSequence"]);

		if(cacheProvider.oUserProfile.sCurrentCompany){
			for (var i = 0; i < $scope.aUserCompanies.length; i++) {
				if($scope.aUserCompanies[i].CompanyName === cacheProvider.oUserProfile.sCurrentCompany){
					$scope.sSelectedCompanyName = $scope.aUserCompanies[i].CompanyName;
					break;
				}
			}
		}else{
			$scope.sSelectedCompanyName = $scope.aUserCompanies[0].CompanyName;
		}		

		$scope.onContinue = function() {
			var sCurrentCompany = $scope.sSelectedCompanyName;;
			cacheProvider.oUserProfile.sCurrentCompany = sCurrentCompany; //current company is cached here	
			apiProvider.setCurrentCompany(sCurrentCompany);

			cacheProvider.oUserProfile.aUserRoles = angular.copy(cacheProvider.oUserProfile.aAllUserRoles);
			servicesProvider.setUserPhasesForCurrentCompany(sCurrentCompany);
			servicesProvider.setUserContactForCurrentCompany(sCurrentCompany);				
			servicesProvider.checkUserRolesAssignment(sCurrentCompany);
					
		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};

		$scope.onBack = function() {
			if(!historyProvider.aHistoryStates.length){
				$state.go('signIn');
			}
			historyProvider.navigateBack({
				oState: $state
			});
		};

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName
			});
		});		
	}
]);