viewControllers.controller('forgotPasswordView', ['$scope', '$state', 'utilsProvider', 'dataProvider', 'servicesProvider',
    function($scope, $state, utilsProvider, dataProvider, servicesProvider) {
		$scope.onChangeLanguage = function() {
			servicesProvider.changeLanguage();
		};
    }
]);