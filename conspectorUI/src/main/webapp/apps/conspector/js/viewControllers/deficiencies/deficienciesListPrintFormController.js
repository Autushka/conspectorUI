viewControllers.controller('deficienciesListPrintFormView', function($scope, $sce, $rootScope, $filter, $resource, $q, ngTableParams, dataSrv, globalSrv, $state, customSrv, $window, $timeout) {

	$scope.unitTE = jQuery.i18n.prop('deficienciesListPrintFormView.unitTE');
	$scope.tagsTE = jQuery.i18n.prop('deficienciesListPrintFormView.tagsTE');
	$scope.durationTE = jQuery.i18n.prop('deficienciesListPrintFormView.durationTE');
	$scope.accountTE = jQuery.i18n.prop('deficienciesListPrintFormView.accountTE');
	$scope.statusTE = jQuery.i18n.prop('deficienciesListPrintFormView.statusTE');
	$scope.locationTE = jQuery.i18n.prop('deficienciesListPrintFormView.locationTE');
    $scope.noteTE = jQuery.i18n.prop('deficienciesListPrintFormView.noteTE');
   	$scope.imagesTE = jQuery.i18n.prop('deficienciesListPrintFormView.imagesTE');
   	$scope.poweredByConspectorTE = jQuery.i18n.prop('deficienciesListPrintFormView.poweredByConspectorTE');

	$scope.bShowNoDataMessage = true;
	$scope.oListTable = customSrv.oDeficiencyEntity.oCurrentListTable;

	if($scope.oListTable && $scope.oListTable.data && $scope.oListTable.data[0] && $scope.oListTable.data[0].data){
		if($scope.oListTable.data[0].data.length > 0){
			$scope.bShowNoDataMessage = false;
		}
	}
	
	$timeout(function(){$window.print();}, 1000);

	$scope.$on("ngTableAfterReloadData", function() {
		if ($scope.oListTable && customSrv.oDeficiencyEntity.listColumnsGrouping && customSrv.oDeficiencyEntity.listColumnsGrouping.length > 0) {
			$scope.oListTable.settings().$scope.aGroupsInfo = customSrv.oDeficiencyEntity.listColumnsGrouping;
			//customSrv.oDeficiencyEntity.listColumnsGrouping = [];
		}
	});

	$scope.constructLogoUrl = function() {
		var sUrl = "rest/file/list/settings/settings/_logo_";
		var oGetLogoUrl = dataSrv.httpRequest(sUrl, {});
		oGetLogoUrl.then(function(aData) {
			$scope.sLogoUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[0].rowId;
		});
	};

	$scope.constructLogoUrl();		
	

});