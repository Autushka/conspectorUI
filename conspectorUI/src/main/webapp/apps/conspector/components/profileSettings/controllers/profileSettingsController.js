viewControllers.controller('profileSettingsView', ['$scope', '$state', 'servicesProvider', '$cookieStore', 'cacheProvider', '$window','$mdSidenav', 'historyProvider',
	function($scope, $state, servicesProvider, $window, $cookieStore, cacheProvider, $mdSidenav, historyProvider) {
		historyProvider.removeHistory();// because current view doesn't have a back button				
		
		$scope.toggleLeftSidenav = function() {
			$mdSidenav('left').toggle();
		};

		var navigateToCustomizing = function(sStateName) {
			$mdSidenav('left').close();
			$state.go(sStateName);
		}
		
		$scope.onProfileDetails = function() {
			navigateToCustomizing("app.profileSettings.profileDetails");
		};
		$scope.onChangePassword = function() {
			navigateToCustomizing("app.profileSettings.changePassword");
		};

		var oWindow = angular.element($window);

		oWindow.bind('resize', function() {
			$mdSidenav('left').close();
		});
	}
]);