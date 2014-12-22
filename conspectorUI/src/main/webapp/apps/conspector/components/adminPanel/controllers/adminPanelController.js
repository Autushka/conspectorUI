viewControllers.controller('adminPanelView', ['$scope', '$state', 'servicesProvider', '$window',
	function($scope, $state, servicesProvider, $window) {
		$scope.onUserManagement = function(){
			$window.location.href = "#/app/adminPanel/usersList";
		};
		$scope.onRoles = function(){
			$window.location.href = "#/app/adminPanel/rolesList";
		};			
		$scope.onProjects = function(){
			$window.location.href = "#/app/adminPanel/projectsList";
		};	
	}
]);