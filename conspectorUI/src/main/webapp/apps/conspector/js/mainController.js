app.controller('mainController', ['$scope', '$rootScope', function($scope, $rootScope) {
	$rootScope.$on('LOAD', function() {
		$rootScope.showSpinner = true;
	});	
	$rootScope.$on('UNLOAD', function() {
		$rootScope.showSpinner = false;
	});		

}]);