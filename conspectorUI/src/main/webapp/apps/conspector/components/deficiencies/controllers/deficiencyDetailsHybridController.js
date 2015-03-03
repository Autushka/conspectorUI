viewControllers.controller('deficiencyDetailsHybridView', ['$scope', '$location', '$anchorScroll', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout',
	function($scope, $location, $anchorScroll, $rootScope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout) {
        $scope.onClose = function() {
        	$rootScope.sDeficienciesListView = "deficienciesList"; 
        } 

        $scope.onSave = function(){

        };

        $scope.onImagesAttribute = function(){

        };

        $scope.onStatusAttribute = function(){

        };		
	}
]);