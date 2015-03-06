viewControllers.controller('roleSelectionView', ['$scope', '$rootScope', '$state', '$translate', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider', 'apiProvider', 'historyProvider',
	function($scope, $rootScope, $state, $translate, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider, apiProvider, historyProvider) {
		var aRoles = [];
        cacheProvider.clearOtherViewsScrollPosition("");		
		$rootScope.sCurrentStateName = $state.current.name;	
 		$rootScope.oStateParams = {};// for backNavigation			
		$scope.sLanguage = $translate.use();

		$rootScope.$on('languageChanged', function() {
			$scope.sLanguage = $translate.use();
		});

		for (var i = 0; i < cacheProvider.oUserProfile.aUserRoles.length; i++) {
			var oRole = {};
			oRole.RoleName = cacheProvider.oUserProfile.aUserRoles[i].RoleName;
			oRole.DescriptionEN = cacheProvider.oUserProfile.aUserRoles[i].DescriptionEN;
			oRole.DescriptionFR = cacheProvider.oUserProfile.aUserRoles[i].DescriptionFR;
			oRole.CompanyName = cacheProvider.oUserProfile.aUserRoles[i].CompanyName;

			if (!oRole.DescriptionFR) {
				oRole.DescriptionFR = oRole.DescriptionEN; //default value is engilsh one (in case when translation is missing)
			}
			oRole._sortingSequence = cacheProvider.oUserProfile.aUserRoles[i].GeneralAttributes.SortingSequence;

			if(oRole.CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
				aRoles.push(oRole);
			}
		}

		$scope.aUserRoles = $filter('orderBy')(aRoles, ["_sortingSequence"]);

		if(cacheProvider.oUserProfile.sCurrentRole){
			var bMatchFound = false;
			for (var i = 0; i < $scope.aUserRoles.length; i++) {
				if($scope.aUserRoles[i].RoleName === cacheProvider.oUserProfile.sCurrentRole){
					$scope.sSelectedRoleName = $scope.aUserRoles[i].RoleName;
					bMatchFound = true;
					break;
				}
			}
			if(!bMatchFound){
				$scope.sSelectedRoleName = $scope.aUserRoles[0].RoleName;
			}

		}else{
			$scope.sSelectedRoleName = $scope.aUserRoles[0].RoleName;
		}	

		$scope.onContinue = function() {
			var sCurrentRole = $scope.sSelectedRoleName;
			var bCanContinue = false;

			bCanContinue = rolesSettings.setCurrentRole(sCurrentRole);
			if(!bCanContinue){
				servicesProvider.logOut();
				return;
			}

			servicesProvider.logSuccessLogIn(); //log login_success operation 
			servicesProvider.initializePubNub();
			$state.go(rolesSettings.getRolesInitialState(sCurrentRole));
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