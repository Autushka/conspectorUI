viewControllers.controller('signInView', ['$scope', '$state', 'utilsProvider', function($scope, $state, utilsProvider) {
	$scope.viewData = {
		userName: "",
		password: ""
	};

	
	$scope.onChangeLanguage = function(){
		utilsProvider.changeLanguage();
	}

	
}]);
