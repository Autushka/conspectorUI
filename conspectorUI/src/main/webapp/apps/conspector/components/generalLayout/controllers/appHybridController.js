viewControllers.controller('appHybridView', ['$scope', '$rootScope', '$state', '$window', 'servicesProvider', '$translate', '$timeout', 'cacheProvider', 'rolesSettings', '$cookieStore', 'historyProvider',
	function($scope, $rootScope, $state, $window, servicesProvider, $translate, $timeout, cacheProvider, rolesSettings, $cookieStore, historyProvider) {
		servicesProvider.constructLogoUrl();

        $scope.onMainMenu = function(){
            $state.go("mainMenuHybrid");
        };		
	}
]);