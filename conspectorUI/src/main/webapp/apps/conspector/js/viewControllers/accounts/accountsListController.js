viewControllers.controller('accountsListView', function($scope, $rootScope, $filter, $resource, $q, ngTableParams, dataSrv, globalSrv, $state, customSrv, $window, $timeout, $sce) {

	$scope.actionTE = jQuery.i18n.prop('accountsListView.actionTE');
	$scope.addressTE = jQuery.i18n.prop('accountsListView.addressTE');
	$scope.clearSortingTE = jQuery.i18n.prop('accountsListView.clearSortingTE');
	$scope.countPerPageTE = jQuery.i18n.prop('accountsListView.countPerPageTE');
	$scope.nameTE = jQuery.i18n.prop('accountsListView.nameTE');
	$scope.newTE = jQuery.i18n.prop('accountsListView.newTE');
	$scope.noDataSelectedTE = jQuery.i18n.prop('accountsListView.noDataSelectedTE');
	$scope.pageTE = jQuery.i18n.prop('accountsListView.pageTE');
	$scope.primaryPhoneTE = jQuery.i18n.prop('accountsListView.primaryPhoneTE');
	$scope.searchTE = jQuery.i18n.prop('accountsListView.searchTE');
	$scope.tagsTE = jQuery.i18n.prop('accountsListView.tagsTE');
	$scope.totalTE = jQuery.i18n.prop('accountsListView.totalTE');
	$scope.viewTitleTE = jQuery.i18n.prop('accountsListView.viewTitleTE');


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

	$scope.reloadAccountsTable = function() {
		if (!$scope.oListTable) {
			$scope.oListTable = customSrv.createNgTableParams({
				oTableDataArrays: $scope.oTableData,
				oTableData: $scope.oTableData,
				sSourceDataArrayAttribute: "aAllListItems",
				sTargerObjectAttribute: "aDisplayedListItems",
				scope: $scope,
				groupTableBy: '_contactType'
			});
			customSrv.oAccountEntity.oCurrentListTable = $scope.oListTable;
		} else {
			customSrv.oAccountEntity.oCurrentListTable = $scope.oListTable;
			$scope.oListTable.reload();
		}
	};

	$scope.prepareDataForTable = function(aData) {
		var aAllListItems = [];
		for (var i = 0; i < aData.length; i++) {
			var oTableItem = {};
			oTableItem._rowId = aData[i].rowId;
			if(aData[i].contactType){
				oTableItem._contactType = aData[i].contactType.name;				
			}

			oTableItem.firstName = aData[i].firstName;
			oTableItem.trHtmlFirstName = $sce.trustAsHtml(aData[i].firstName);
			oTableItem.phone = aData[i].phone;
			oTableItem.trHtmlPhone = $sce.trustAsHtml(aData[i].phone);
			oTableItem.address = aData[i].address;
			oTableItem.trHtmlAddress = $sce.trustAsHtml(aData[i].addres);
			oTableItem.tags = $scope.formatTags(aData[i].title);
			oTableItem.trHtmlTags = $sce.trustAsHtml(oTableItem.tags);

			aAllListItems.push(oTableItem);
		}

		$scope.tableInfoTotal = aAllListItems.length;		
		return aAllListItems;
	};

	$scope.refreshAccounts = function() {
		customSrv.getEntitySet({
			oReadServiceParameters: {
				path: "Contact",
				filter: "rowId ge '0'",
				expand: "contactType",
				showSpinner: true
			},
			oServiceProvider: customSrv,
			oCashProvider: customSrv.oAccountEntity,
			oCashProviderAttribute: "aAccounts",
			fnSuccessCallBack: function(aData) {
				aData = $filter('orderBy')(aData, ["firstName"]);
				$scope.oTableData.aAllListItems = $scope.prepareDataForTable(aData);
				$scope.reloadAccountsTable();
			}
		});
	};

	$scope.formatTags = function(sTags) {
		if (sTags) {
			while (sTags.indexOf('|') >= 0) {
				sTags = sTags.replace('|', '');
			}
		}
		return sTags;
	};

	$scope.refreshAccounts();

	$scope.$watch("filter.$", function() {
		if ($scope.filter && $scope.oListTable) {
			$scope.oListTable.parameters().filter.$ = $scope.filter.$;
			$scope.reloadAccountsTable();
		}
	});

	$scope.onClearFiltering = function() {
		$scope.oListTable.sorting({});
		$scope.oListTable.filter({});
		$scope.filter = {};
		$scope.reloadAccountsTable();
	};

	$scope.onRefreshList = function() {
		customSrv.oAccountEntity.aAccounts = [];
		$scope.refreshAccounts();
	};

	$scope.onFilterIconClick = function() {
		$scope.bShowFilters = !$scope.bShowFilters;
	};

	$scope.setCurrentAccount = function(account) {
		var oAccount = {
			obj: {}
		};
		customSrv.setAttributeFromArrayByKey({
			aArray: customSrv.oAccountEntity.aAccounts,
			oObject: account,
			sArrayKey: "rowId",
			sObjectKey: "_rowId",
			sTargetAttribute: "obj",
			oTargetObject: oAccount
		});
		customSrv.oAccountEntity.oCurrentAccount = jQuery.extend(true, {}, oAccount.obj);
	};

	$scope.goToDisplayDetails = function(account) {
		customSrv.oAccountEntity.bAccountDisplayMode = true;
		//customSrv.oAccountEntity.oCurrentAccount = jQuery.extend(true, {}, account);
		$scope.setCurrentAccount(account);
		$state.go('^.accountDetails');
		customSrv.backNavigationFromAccountDetailsTo = '^.accountsList';
	};

	$scope.goToEditDetails = function(account) {
		customSrv.oAccountEntity.bAccountDisplayMode = false;
		$scope.setCurrentAccount(account);
		//customSrv.oAccountEntity.oCurrentAccount = jQuery.extend(true, {}, account);
		$state.go('^.accountDetails');
		customSrv.backNavigationFromAccountDetailsTo = '^.accountsList';
	};

	$scope.onAddNew = function() {
		customSrv.oAccountEntity.oCurrentAccount = {};
		customSrv.oAccountEntity.bAccountDisplayMode = false;
		$state.go('^.accountDetails');
		customSrv.backNavigationFromAccountDetailsTo = '^.accountsList';
	};

	$scope.$on("$destroy", function() {
		customSrv.oAccountEntity.listSearchFilter = $scope.filter.$;
		if ($scope.oListTable) {
			customSrv.oAccountEntity.listColumnsFilters = $scope.oListTable.parameters().filter;
			customSrv.oAccountEntity.listColumnsSorting = $scope.oListTable.parameters().sorting;
			$scope.oListTable.settings().setGroupsInfo();
			customSrv.oAccountEntity.listColumnsGrouping = $scope.oListTable.settings().$scope.aGroupsInfo;
		}
	});

	$scope.$on("ngTableAfterReloadData", function() {
		if ($scope.oListTable && customSrv.oAccountEntity.listSearchFilter !== "" && customSrv.oAccountEntity.listSearchFilter !== undefined) {
			$scope.filter.$ = customSrv.oAccountEntity.listSearchFilter;
			customSrv.oAccountEntity.listSearchFilter = "";
		}

		delete customSrv.oAccountEntity.listColumnsFilters.$;
		if ($scope.oListTable && JSON.stringify(customSrv.oAccountEntity.listColumnsFilters) !== JSON.stringify({})) {
			$scope.oListTable.parameters().filter = customSrv.oAccountEntity.listColumnsFilters;
			$scope.bShowFilters = true;
			customSrv.oAccountEntity.listColumnsFilters = {};
		}

		if ($scope.oListTable && JSON.stringify(customSrv.oAccountEntity.listColumnsSorting) !== JSON.stringify({})) {
			$scope.oListTable.parameters().sorting = customSrv.oAccountEntity.listColumnsSorting;
			customSrv.oAccountEntity.listColumnsSorting = {};
		}

		if ($scope.oListTable && customSrv.oAccountEntity.listColumnsGrouping && customSrv.oAccountEntity.listColumnsGrouping.length > 0) {
			$scope.oListTable.settings().$scope.aGroupsInfo = customSrv.oAccountEntity.listColumnsGrouping;
			customSrv.oAccountEntity.listColumnsGrouping = [];
		}
	});
});