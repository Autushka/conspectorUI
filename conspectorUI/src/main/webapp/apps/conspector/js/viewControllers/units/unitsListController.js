viewControllers.controller('unitsListView', function($scope, $rootScope, $filter, $resource, $q, ngTableParams, dataSrv, globalSrv, $state, customSrv, $window, $timeout, $sce) {
	
	$scope.actionTE = jQuery.i18n.prop('unitsListView.actionTE');
	$scope.clearSortingTE = jQuery.i18n.prop('unitsListView.clearSortingTE');
	$scope.clearSortingTE = jQuery.i18n.prop('unitsListView.clearSortingTE');
	$scope.countPerPageTE = jQuery.i18n.prop('unitsListView.countPerPageTE');
	$scope.newTE = jQuery.i18n.prop('unitsListView.newTE');
	$scope.noDataSelectedTE = jQuery.i18n.prop('unitsListView.noDataSelectedTE');
	$scope.pageTE = jQuery.i18n.prop('unitsListView.pageTE');
	$scope.searchTE = jQuery.i18n.prop('unitsListView.searchTE');
	$scope.totalTE = jQuery.i18n.prop('unitsListView.totalTE');
	$scope.unitTE = jQuery.i18n.prop('unitsListView.unitTE');
	$scope.viewTitleTE = jQuery.i18n.prop('unitsListView.viewTitleTE');

	
	$scope.oTableData = {};
	$scope.filter = {};
	$scope.bShowFilters = true;

	$scope.oTableDisplayParameters = {
		bShowSearchBox: true,
		bShowFilterButton: false,
		bShowClearFilterButton: true,
		bShowSaveAllButton: false,
		bShowPrintButton: false
	};

	$scope.reloadUnitsTable = function() {
		if (!$scope.oListTable) {
			$scope.oListTable = customSrv.createNgTableParams({
				oTableDataArrays: $scope.oTableData,
				oTableData: $scope.oTableData,
				sSourceDataArrayAttribute: "aAllListItems",
				sTargerObjectAttribute: "aDisplayedListItems",
				scope: $scope,
				groupTableBy: '_projectAndPhase'
			});
			customSrv.oUnitEntity.oCurrentListTable = $scope.oListTable;
		} else {
			customSrv.oUnitEntity.oCurrentListTable = $scope.oListTable;
			$scope.oListTable.reload();
		}
	};

	$scope.prepareDataForTable = function(aData) {
		var aAllListItems = [];
		for (var i = 0; i < aData.length; i++) {
			var oTableItem = {};
			oTableItem._rowId = aData[i].rowId;
			if (aData[i].project && aData[i].version) {
				oTableItem._projectAndPhase = aData[i].project.name + " " + aData[i].version.name;
			}

			oTableItem.name = customSrv.convertStringToInt(aData[i].name);
			oTableItem.trHtmlName = $sce.trustAsHtml(aData[i].name.toString());

			aAllListItems.push(oTableItem);
		}

		$scope.tableInfoTotal = aAllListItems.length;
		return aAllListItems;
	};

	$scope.refreshUnits = function() {
		customSrv.getEntitySet({
			oReadServiceParameters: {
				path: "Component",
				filter: $scope.oTableData.sFilter,
				expand: "project,version",
				showSpinner: true
			},
			oServiceProvider: customSrv,
			oCashProvider: customSrv.oUnitEntity,
			oCashProviderAttribute: "aUnits",
			fnSuccessCallBack: function(aData) {
				for (var i = 0; i < aData.length; i++) {
					aData[i].name = customSrv.convertStringToInt(aData[i].name);
				}
				aData = $filter('orderBy')(aData, ["version.sortingSequence", "name"]);
				$scope.aUnits = aData;
				$scope.oTableData.aAllListItems = $scope.prepareDataForTable(aData);
				$scope.reloadUnitsTable();
			}
		});
	};

	$scope.constructGetUnitsFilter = function(){
		var sFilter = customSrv.constructFilterBasedOnGlobalSelections();
		$scope.oTableData.sFilter = sFilter;		
	};

	$scope.selectData = function(){
		$scope.constructGetUnitsFilter();
		$scope.refreshUnits();
	};

	if (customSrv.oUnitEntity.iPendingRequestsForGetEntitySet === 0) {
		$scope.selectData();
	}

	var offEventPendingRequestsFinishedForoUnitEntity = $rootScope.$on("pendingRequestsFinishedForoUnitEntity", function() {
		$scope.selectData();
	});

	var offEventGlobalSelectionsChanged = $rootScope.$on("globalSelectionsChanged", function() {
		$scope.selectData();
	});		

	$scope.$watch("filter.$", function() {
		if ($scope.filter && $scope.oListTable) {
			$scope.oListTable.parameters().filter.$ = $scope.filter.$;
			$scope.reloadUnitsTable();
		}
	});

	$scope.onClearFiltering = function() {
		$scope.oListTable.sorting({});
		$scope.oListTable.filter({});
		$scope.filter = {};
		$scope.reloadUnitsTable();
	};

	$scope.onRefreshList = function() {
		customSrv.oUnitEntity.aUnits = [];
		$scope.refreshUnits();
	};

	$scope.onFilterIconClick = function() {
		$scope.bShowFilters = !$scope.bShowFilters;
	};

	$scope.setCurrentUnit = function(unit) {
		var oUnit = {
			obj: {}
		};
		customSrv.setAttributeFromArrayByKey({
			aArray: customSrv.oUnitEntity.aUnits,
			oObject: unit,
			sArrayKey: "rowId",
			sObjectKey: "_rowId",
			sTargetAttribute: "obj",
			oTargetObject: oUnit
		});
		customSrv.oUnitEntity.oCurrentUnit = jQuery.extend(true, {}, oUnit.obj);
	};

	$scope.goToDisplayDetails = function(unit) {
		customSrv.oUnitEntity.bUnitDisplayMode = true;
		$scope.setCurrentUnit(unit);
		$state.go('^.unitDetails');
		customSrv.backNavigationFromUnitDetailsTo = '^.unitsList';
	};

	$scope.goToEditDetails = function(unit) {
		customSrv.oUnitEntity.bUnitDisplayMode = false;
		$scope.setCurrentUnit(unit);
		$state.go('^.unitDetails');
		customSrv.backNavigationFromUnitDetailsTo = '^.unitsList';
	};

	$scope.onAddNew = function() {
		customSrv.oUnitEntity.oCurrentUnit = {};
		customSrv.oUnitEntity.bUnitDisplayMode = false;
		$state.go('^.unitDetails');
		customSrv.backNavigationFromUnitDetailsTo = '^.unitsList';
	};

	$scope.$on("$destroy", function() {
		offEventPendingRequestsFinishedForoUnitEntity();
		offEventGlobalSelectionsChanged();

		customSrv.oUnitEntity.listSearchFilter = $scope.filter.$;
		if ($scope.oListTable) {
			customSrv.oUnitEntity.listColumnsFilters = $scope.oListTable.parameters().filter;
			customSrv.oUnitEntity.listColumnsSorting = $scope.oListTable.parameters().sorting;
			$scope.oListTable.settings().setGroupsInfo();
			customSrv.oUnitEntity.listColumnsGrouping = $scope.oListTable.settings().$scope.aGroupsInfo;
		}
	});

	$scope.$on("ngTableAfterReloadData", function() {
		if ($scope.oListTable && customSrv.oUnitEntity.listSearchFilter !== "" && customSrv.oUnitEntity.listSearchFilter !== undefined) {
			$scope.filter.$ = customSrv.oUnitEntity.listSearchFilter;
			customSrv.oUnitEntity.listSearchFilter = "";
		}

		delete customSrv.oUnitEntity.listColumnsFilters.$;
		if ($scope.oListTable && JSON.stringify(customSrv.oUnitEntity.listColumnsFilters) !== JSON.stringify({})) {
			$scope.oListTable.parameters().filter = customSrv.oUnitEntity.listColumnsFilters;
			$scope.bShowFilters = true;
			customSrv.oUnitEntity.listColumnsFilters = {};
		}

		if ($scope.oListTable && JSON.stringify(customSrv.oUnitEntity.listColumnsSorting) !== JSON.stringify({})) {
			$scope.oListTable.parameters().sorting = customSrv.oUnitEntity.listColumnsSorting;
			customSrv.oUnitEntity.listColumnsSorting = {};
		}

		if ($scope.oListTable && customSrv.oUnitEntity.listColumnsGrouping && customSrv.oUnitEntity.listColumnsGrouping.length > 0) {
			$scope.oListTable.settings().$scope.aGroupsInfo = customSrv.oUnitEntity.listColumnsGrouping;
			customSrv.oUnitEntity.listColumnsGrouping = [];
		}
	});
});