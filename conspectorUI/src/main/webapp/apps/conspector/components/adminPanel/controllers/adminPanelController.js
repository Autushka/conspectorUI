viewControllers.controller('adminPanelView', ['$scope', '$state', 'servicesProvider', '$window',
	function($scope, $state, servicesProvider, $window) {
		$scope.onUserManagement = function() {
			$window.location.href = "#/app/adminPanel/usersList";
		};
		$scope.onRoles = function() {
			$window.location.href = "#/app/adminPanel/rolesList";
		};
		$scope.onProjects = function() {
			$window.location.href = "#/app/adminPanel/projectsList";
		};
		$scope.onPhases = function() {
			$window.location.href = "#/app/adminPanel/phasesList";
		};
		$scope.onOperationLogs = function() {
			$window.location.href = "#/app/adminPanel/operationLogsList";
		};
		$scope.onDeficiencyStatuses = function() {
			$window.location.href = "#/app/adminPanel/deficiencyStatusesList";
		};
		$scope.onSystemFiles = function() {
			$window.location.href = "#/app/adminPanel/systemFiles";
		};
		$scope.onAccountTypes = function() {
			$window.location.href = "#/app/adminPanel/accountTypesList";
		};
	}
]);