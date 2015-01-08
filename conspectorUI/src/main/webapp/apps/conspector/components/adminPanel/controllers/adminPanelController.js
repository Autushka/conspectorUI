viewControllers.controller('adminPanelView', ['$scope', '$state', 'servicesProvider', '$window', 'CONSTANTS', 'cacheProvider',
	function($scope, $state, servicesProvider, $window, CONSTANTS, cacheProvider) {
		$scope.sGlobalAdministratorRole = CONSTANTS.sGlobalAdministatorRole;
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$scope.onUserManagement = function() {
			$state.go("app.adminPanel.usersList");
		};
		$scope.onRoles = function() {
			$state.go("app.adminPanel.rolesList");
		};
		$scope.onProjects = function() {
			$state.go("app.adminPanel.projectsList");
		};
		$scope.onPhases = function() {
			$state.go("app.adminPanel.phasesList");
		};
		$scope.onOperationLogs = function() {
			$state.go("app.adminPanel.operationLogsList");
		};
		$scope.onDeficiencyStatuses = function() {
			$state.go("app.adminPanel.deficiencyStatusesList");
		};
		$scope.onDeficiencyPriorities = function() {
			$state.go("app.adminPanel.deficiencyPrioritiesList");
		};
		$scope.onSystemFiles = function() {
			$state.go("app.adminPanel.systemFiles");
		};
		$scope.onAccountTypes = function() {
			$state.go("app.adminPanel.accountTypesList");			
		};
		$scope.onCompanies = function() {
			$state.go("app.adminPanel.companiesList");			
		};		
	}
]);