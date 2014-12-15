viewControllers.controller('appView', ['$scope', '$state', 'servicesProvider', 
	function($scope, $state, servicesProvider) {
		$scope.onLogOut = function(){
			servicesProvider.logOut();
		}
	}
]);