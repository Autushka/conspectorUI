viewControllers.controller('adminPanelView', ['$scope', '$state', 'servicesProvider', '$window', 'CONSTANTS', 'cacheProvider', '$mdSidenav', '$window', 'historyProvider',
	function($scope, $state, servicesProvider, $window, CONSTANTS, cacheProvider, $mdSidenav, $window, historyProvider) {
		historyProvider.removeHistory();// because current view doesn't have a back button		
		$scope.sGlobalAdministratorRole = CONSTANTS.sGlobalAdministatorRole;
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$scope.toggleLeftSidenav = function() {
			$mdSidenav('left').toggle();
		};

		var navigateToCustomizing = function(sStateName) {
			$mdSidenav('left').close();
			$state.go(sStateName);
		}

		$scope.onUserManagement = function() {
			navigateToCustomizing("app.adminPanel.usersList");
		};
		$scope.onRoles = function() {
			navigateToCustomizing("app.adminPanel.rolesList");
		};
		$scope.onProjects = function() {
			navigateToCustomizing("app.adminPanel.projectsList");
		};
		$scope.onPhases = function() {
			navigateToCustomizing("app.adminPanel.phasesList");
		};
		$scope.onOperationLogs = function() {
			navigateToCustomizing("app.adminPanel.operationLogsList");
		};
		$scope.onDeficiencyStatuses = function() {
			navigateToCustomizing("app.adminPanel.deficiencyStatusesList");
		};
		$scope.onDeficiencyPriorities = function() {
			navigateToCustomizing("app.adminPanel.deficiencyPrioritiesList");
		};
		$scope.onSystemFiles = function() {
			navigateToCustomizing("app.adminPanel.systemFiles");
		};
		$scope.onAccountTypes = function() {
			navigateToCustomizing("app.adminPanel.accountTypesList");
		};
		$scope.onCompanies = function() {
			navigateToCustomizing("app.adminPanel.companiesList");
		};

		var oWindow = angular.element($window);

		oWindow.bind('resize', function() {
			$mdSidenav('left').close();
		});
	}
]);