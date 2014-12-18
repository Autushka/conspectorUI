viewControllers.controller('roleSelectionView', ['$scope', '$state', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings', 'servicesProvider',
	function($scope, $state, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings, servicesProvider) {
		$scope.aUserRoles = $filter('orderBy')(cacheProvider.oUserProfile.aUserRoles, function(oItem) {
			return oItem.GeneralAttributes.SortingSequence;
		});

		$scope.sSelectedRoleName = $scope.aUserRoles[0].RoleName;

		$scope.onContinue = function(){
			cacheProvider.oUserProfile.sCurrentRole = $scope.sSelectedRoleName;
			servicesProvider.logSuccessLogIn();//log login_success operation 
			window.location.href = rolesSettings.oInitialViews[cacheProvider.oUserProfile.sCurrentRole];

		};

		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
	}
]);