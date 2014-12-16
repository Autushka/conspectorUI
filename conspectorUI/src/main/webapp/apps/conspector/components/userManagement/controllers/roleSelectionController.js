viewControllers.controller('roleSelectionView', ['$scope', '$state', 'utilsProvider', 'dataProvider', 'cacheProvider', '$filter', 'rolesSettings',
	function($scope, $state, utilsProvider, dataProvider, cacheProvider, $filter, rolesSettings) {
		$scope.aUserRoles = $filter('orderBy')(cacheProvider.oUserProfile.aUserRoles, function(oItem) {
			return oItem.GeneralAttributes.SortingSequence;
		});

		$scope.sSelectedRoleName = $scope.aUserRoles[0].RoleName;

		$scope.onContinue = function(){
			cacheProvider.oUserProfile.sCurrentRole = $scope.sSelectedRoleName;
			window.location.href = rolesSettings.oInitialViews[cacheProvider.oUserProfile.sCurrentRole];

		}
	}
]);