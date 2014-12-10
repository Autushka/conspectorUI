viewControllers.controller('deficienciesListView', function($scope, $sce, $modal, $rootScope, $filter, $resource, $q, ngTableParams, dataSrv, globalSrv, $state, customSrv, $window, $timeout, dataProvider, cashProvider, utilsProvider) {
	$scope.accountTE = jQuery.i18n.prop('deficienciesListView.accountTE');
	$scope.actionsTE = jQuery.i18n.prop('deficienciesListView.actionsTE');
	$scope.clearSortingTE = jQuery.i18n.prop('deficienciesListView.clearSortingTE');
	$scope.countPerPageTE = jQuery.i18n.prop('deficienciesListView.countPerPageTE');
	$scope.durationTE = jQuery.i18n.prop('deficienciesListView.durationTE');
	$scope.imagesTE = jQuery.i18n.prop('deficienciesListView.imagesTE');
	$scope.locationTE = jQuery.i18n.prop('deficienciesListView.locationTE');
	$scope.newTE = jQuery.i18n.prop('deficienciesListView.newTE');
	$scope.noDataSelectedTE = jQuery.i18n.prop('deficienciesListView.noDataSelectedTE');
	$scope.pageTE = jQuery.i18n.prop('deficienciesListView.pageTE');
	$scope.phasesTE = jQuery.i18n.prop('deficienciesListView.phasesTE');
	$scope.phaseTE = jQuery.i18n.prop('deficienciesListView.phaseTE');
	$scope.printTE = jQuery.i18n.prop('deficienciesListView.printTE');
	$scope.projectsTE = jQuery.i18n.prop('deficienciesListView.projectsTE');
	$scope.projectTE = jQuery.i18n.prop('deficienciesListView.projectTE');
	$scope.searchTE = jQuery.i18n.prop('deficienciesListView.searchTE');
	$scope.statusesTE = jQuery.i18n.prop('deficienciesListView.statusesTE');
	$scope.statusTE = jQuery.i18n.prop('deficienciesListView.statusTE');
	$scope.tagsTE = jQuery.i18n.prop('deficienciesListView.tagsTE');
	$scope.totalTE = jQuery.i18n.prop('deficienciesListView.totalTE');
	$scope.unitTE = jQuery.i18n.prop('deficienciesListView.unitTE');
	$scope.viewTitleTE = jQuery.i18n.prop('deficienciesListView.viewTitleTE');


	$scope.oTableData = {};
	$scope.filter = {};
	$scope.bShowFilters = true;

	$scope.oTableDisplayParameters = {
		bShowSearchBox: true,
		bShowFilterButton: false,
		bShowClearFilterButton: true,
		bShowSaveAllButton: false,
		bShowPrintButton: true
	};

	$scope.prepareDataForTable = function(aData) {
		var aAllListItems = [];
		for (var i = 0; i < aData.length; i++) {
			var oTableItem = {};
			oTableItem._rowId = aData[i].RowId;
			//Duration
			if (aData[i].CreatedDate) {
				var sDate = aData[i].CreatedDate.substring(6, aData[i].CreatedDate.length - 2);
				var dDate = new Date(parseInt(sDate));
				var dCurrentDate = new Date();
				var timeDiff = Math.abs(dCurrentDate.getTime() - dDate.getTime());
				oTableItem._durationNumber = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
				oTableItem._duration = oTableItem._durationNumber + "d";
			}
			//Tags
			oTableItem.labels = $scope.formatTags(aData[i].Labels);
			oTableItem.trHtmlLabels = $sce.trustAsHtml($scope.formatTags(aData[i].Labels));

			//Locations
			oTableItem.environment = $scope.formatTags(aData[i].Environment);
			oTableItem.trHtmlEnvironment = $sce.trustAsHtml($scope.formatTags(aData[i].Environment));

			if (aData[i].PriorityDetails) {
				oTableItem.trHtmlPriorityName = $sce.trustAsHtml(aData[i].PriorityDetails.Name);
				oTableItem._associatedColor = aData[i].PriorityDetails.AssociatedColor;
				oTableItem._prioritySortingSequence = aData[i].PriorityDetails.SortingSequence;
			} else {
				oTableItem._associatedColor = "";
				oTableItem._prioritySortingSequence = 999;
			}
			if (aData[i].ComponentDetails) {
				oTableItem.unitName = customSrv.convertStringToInt(aData[i].ComponentDetails.Name);
				oTableItem.trHtmlUnitName = $sce.trustAsHtml(aData[i].ComponentDetails.Name);
			} else {
				oTableItem.unitName = "";
			}
			if (aData[i].StatusDetails) {
				oTableItem._associatedStatusIcon = aData[i].StatusDetails.AssociatedIcon;
				oTableItem._associatedStatusName = aData[i].StatusDetails.Name;
				oTableItem._sortingSequence = aData[i].StatusDetails.SortingSequence;
				var sImg = "";
				switch (oTableItem._associatedStatusIcon) {
					case "icon-status conforme":
						sImg = "apps/conspector/img/icon_done.png";
						break;
					case "icon-status no-conforme":
						sImg = "apps/conspector/img/icon_noconforme.png";
						break;
					case "icon-status new_status":
						sImg = "apps/conspector/img/icon_new_status.png";
						break;

					case "icon-status pending":
						sImg = "apps/conspector/img/icon_pending.png";
						break;
					case "icon-status in-progress":
						sImg = "apps/conspector/img/icon_inprogress.png";
						break;
					case "icon-status contractor-conforme":
						sImg = "apps/conspector/img/icon_done_contractor.png";
						break;
				}
				oTableItem._iconImgPath = sImg;
			} else {
				oTableItem._associatedStatusIcon = "";
				oTableItem._associatedStatusName = "";
			}

			if (aData[i].ContactDetails) {
				oTableItem.AccountFirstName = aData[i].ContactDetails.FirstName;
				oTableItem.trHtmlAccountFirstName = $sce.trustAsHtml(aData[i].ContactDetails.FirstName);
			} else {
				oTableItem.accountFirstName = "";
			}

			if (aData[i].ProjectDetails) {
				oTableItem._projectId = aData[i].ProjectDetails.RowId;
				oTableItem._projectName = aData[i].ProjectDetails.Name;
			}
			if (aData[i].VersionDetails) {
				oTableItem._versionId = aData[i].VersionDetails.RowId;
				oTableItem._versionName = aData[i].VersionDetails.Name;
				oTableItem._versionSortingSequence = aData[i].VersionDetails.SortingSequence;
			} else {
				oTableItem._versionSortingSequence = 999;
			}

			oTableItem.trHtmlNote = $sce.trustAsHtml(aData[i].Description);
			oTableItem._note = aData[i].Description;

			oTableItem._attachmentsNumber = aData[i].AttachmentsNumber;
			// oTableItem._filesGuid = aData[i].FilesGuid;
			oTableItem._createdBy = aData[i].CreatedBy;

			oTableItem._projectAndVersion = oTableItem._projectName + " " + oTableItem._versionName;

			aAllListItems.push(oTableItem);
		}
		return aAllListItems;
	};

	$scope.getDeficiencies = function() {
		var sKey = cashProvider.oUserProfile.sUserName;
		var sFilter = "";
		var sExpand = "User_PhaseDetails/PhaseDetails/TaskDetails"
		$scope.getDeficienciesRequestSettings = sKey + sFilter + sExpand;

		var getDeficienciesSvc = dataProvider.getEntity({
			sPath: "Users",
			sKey: sKey,
			sFilter: sFilter,
			sExpand: sExpand,
			bShowSpinner: true,
			oCashProvider: cashProvider,
			sCashProviderAttribute: "oDeficiencyEntity"
		});
		getDeficienciesSvc.then(function(oData) {
			alert("Yo!");
			// $scope.oTableData.aAllListItems = $scope.prepareDataForTable(aData);
			// $scope.oTableData.aAllListItems = $filter('orderBy')($scope.oTableData.aAllListItems, ["_versionSortingSequence", "ComponentName", "_prioritySortingSequence", "_rowId"]);
			// $scope.reloadDeficienciesTable();
		}, function() {});
	};

	$scope.getDeficiencies();

	$scope.onRefreshList = function() {
		cashProvider.cleanEntitiesCash("oDeficiencyEntity", $scope.getDeficienciesRequestSettings);
		$scope.getDeficiencies();
	};

	// if ($scope.globalData.userRole === "endUser") {
	// 	$scope.newTE = "Report a new Deficiency";
	// 	$scope.oTableDisplayParameters.bShowFilterButton = false;
	// 	$scope.oTableDisplayParameters.bShowClearFilterButton = false;
	// 	$scope.oTableDisplayParameters.bShowPrintButton = false;
	// 	$scope.oTableDisplayParameters.bShowSearchBox = false;
	// }

	// $scope.getStatuses = function() {
	// 	customSrv.getEntitySet({ // get Statuses
	// 		oReadServiceParameters: {
	// 			path: "Statuss",
	// 			filter: "",
	// 			expand: "",
	// 			showSpinner: false
	// 		},
	// 		oServiceProvider: customSrv,
	// 		oCashProvider: customSrv,
	// 		oCashProviderAttribute: "aStatuses",
	// 		oPendingRequestFor: {
	// 			aEntities: ["oDeficiencyEntity"]
	// 		},
	// 		fnSuccessCallBack: function(aData) {
	// 			$scope.aStatuses = $filter('orderBy')(aData, 'SortingSequence');
	// 			$scope.oSelectCriterias.aStatuses = [];
	// 			var sImg = "";

	// 			for (var i = 0; i < $scope.aStatuses.length; i++) {
	// 				switch ($scope.aStatuses[i].AssociatedIcon) {
	// 					case "icon-status conforme":
	// 						sImg = "apps/conspector/img/icon_done.png";
	// 						break;
	// 					case "icon-status no-conforme":
	// 						sImg = "apps/conspector/img/icon_noconforme.png";
	// 						break;
	// 					case "icon-status new_status":
	// 						sImg = "apps/conspector/img/icon_new_status.png";
	// 						break;

	// 					case "icon-status pending":
	// 						sImg = "apps/conspector/img/icon_pending.png";
	// 						break;
	// 					case "icon-status in-progress":
	// 						sImg = "apps/conspector/img/icon_inprogress.png";
	// 						break;
	// 					case "icon-status contractor-conforme":
	// 						sImg = "apps/conspector/img/icon_done_contractor.png";
	// 						break;
	// 				}
	// 				var bTicked = true;
	// 				if (sImg === "apps/conspector/img/icon_done.png") {
	// 					bTicked = false;
	// 				}
	// 				$scope.oSelectCriterias.aStatuses.push({
	// 					rowId: $scope.aStatuses[i].RowId,
	// 					icon: "<img src=" + sImg + ">",
	// 					name: $scope.aStatuses[i].Name,
	// 					ticked: bTicked
	// 				});
	// 			}
	// 		}
	// 	});
	// };

	// $scope.oSelectCriterias = {};
	// angular.copy(customSrv.oDeficiencyEntity.oSelectCriterias, $scope.oSelectCriterias);

	// if(angular.equals($scope.oSelectCriterias, {})){
	// 	$scope.getStatuses();
	// }

	// $scope.selectData = function() {
	// 	if($scope.oSelectCriterias.aStatuses !== undefined){
	// 		$scope.constructGetDeficienciesFilter();
	// 		$scope.refreshDeficiencies();			
	// 	}
	// };

	$scope.reloadDeficienciesTable = function() {
		var sGroupTableBy = '_projectAndVersion';
		// if ($scope.globalData.userRole === "endUser") {
		// 	sGroupTableBy = "";
		// }

		if (!$scope.oListTable) {
			$scope.oListTable = utilsProvider.createNgTableParams({
				oTableDataArrays: $scope.oTableData,
				oTableData: $scope.oTableData,
				sSourceDataArrayAttribute: "aAllListItems",
				sTargerObjectAttribute: "aDisplayedListItems",
				scope: $scope,
				groupTableBy: sGroupTableBy
			});
			//customSrv.oDeficiencyEntity.oCurrentListTable = $scope.oListTable;

		} else {
			//customSrv.oDeficiencyEntity.oCurrentListTable = $scope.oListTable;
			$scope.oListTable.reload();
		}
	};

	$scope.formatTags = function(sTags) {
		if (sTags) {
			while (sTags.indexOf('|') >= 0) {
				sTags = sTags.replace('|', '');
			}
		}
		return sTags;
	};



	$scope.constructGetDeficienciesFilter = function() {
		var sFilter = customSrv.constructFilterBasedOnGlobalSelections();

		var bIsFirstFilter = false;
		if (sFilter === "") {
			bIsFirstFilter = true;
		}

		sFilter = sFilter + customSrv.constractFilterBasedOnMultipleSelect({
			aArray: $scope.oSelectCriterias.aStatuses,
			sArrayKey: "rowId",
			sFilterKey: "StatusId",
			bIsFirstFilter: bIsFirstFilter,
			bIsString: false
		});

		sFilter = sFilter + " and IsDeleted ne true";
		if ($scope.globalData.userRole === "endUser") {
			sFilter = sFilter + " and CreatedBy eq '" + $scope.globalData.userName + "'";
		}

		$scope.oTableData.sFilter = sFilter;
	};

	$scope.refreshDeficiencies = function() {
		customSrv.getEntitySet({
			oReadServiceParameters: {
				path: "Tasks",
				filter: $scope.oTableData.sFilter,
				expand: "StatusDetails,PriorityDetails,ContactDetails,ComponentDetails,ProjectDetails,VersionDetails",
				showSpinner: true
			},
			oServiceProvider: customSrv,
			fnSuccessCallBack: function(aData) {
				$scope.aDeficiencies = aData;
				$scope.oTableData.aAllListItems = $scope.prepareDataForTable(aData);
				$scope.oTableData.aAllListItems = $filter('orderBy')($scope.oTableData.aAllListItems, ["_phaseSortingSequence", "unitName", "_prioritySortingSequence", "_rowId"]);
				$scope.reloadDeficienciesTable();
			}
		});
	};

	// if (customSrv.oDeficiencyEntity.iPendingRequestsForGetEntitySet === 0) {
	// 	$scope.selectData();
	// }

	// var offEventPendingRequestsFinishedForoDeficiencyEntity = $rootScope.$on("pendingRequestsFinishedForoDeficiencyEntity", function() {
	// 	$scope.selectData();
	// });

	// var offEventGlobalSelectionsChanged = $rootScope.$on("globalSelectionsChanged", function() {
	// 	$scope.selectData();
	// });	

	// $scope.$watch("filter.$", function() {
	// 	if ($scope.filter && $scope.oListTable) {
	// 		$scope.oListTable.parameters().filter.$ = $scope.filter.$;
	// 		$scope.reloadDeficienciesTable();
	// 	}
	// });

	$scope.onClearFiltering = function() {
		$scope.oListTable.sorting({});
		$scope.oListTable.filter({});
		$scope.filter = {};
		$scope.oTableData.aAllListItems = $filter('orderBy')($scope.oTableData.aAllListItems, ["_phaseSortingSequence", "unitName", "_prioritySortingSequence", "_rowId"]);
		$scope.reloadDeficienciesTable();
	};



	// $scope.setCurrentDeficiency = function(deficiency) {
	// 	var oDeficiency = {
	// 		obj: {}
	// 	};
	// 	customSrv.setAttributeFromArrayByKey({
	// 		aArray: $scope.aDeficiencies,
	// 		oObject: deficiency,
	// 		sArrayKey: "rowId",
	// 		sObjectKey: "_rowId",
	// 		sTargetAttribute: "obj",
	// 		oTargetObject: oDeficiency
	// 	});
	// 	customSrv.oDeficiencyEntity.oCurrentDeficiency = jQuery.extend(true, {}, oDeficiency.obj);
	// };

	// $scope.goToDisplayDetails = function(deficiency) {
	// 	customSrv.oDeficiencyEntity.bDeficiencyDisplayMode = true;
	// 	$scope.setCurrentDeficiency(deficiency);
	// 	if ($scope.globalData.userRole === "endUser") {
	// 		$state.go('^.deficiencyDetailsEndUser');
	// 	} else {
	// 		$state.go('^.deficiencyDetails');
	// 	}

	// 	if ($scope.globalData.userRole === "endUser") {
	// 		customSrv.backNavigationFromDeficiencyDetailsTo = '^.deficienciesListEndUser';
	// 	} else {
	// 		customSrv.backNavigationFromDeficiencyDetailsTo = '^.deficienciesList';
	// 	}
	// };

	// $scope.goToEditDetails = function(deficiency) {
	// 	customSrv.oDeficiencyEntity.bDeficiencyDisplayMode = false;
	// 	$scope.setCurrentDeficiency(deficiency);
	// 	if ($scope.globalData.userRole === "endUser") {
	// 		$state.go('^.deficiencyDetailsEndUser');
	// 	} else {
	// 		$state.go('^.deficiencyDetails');
	// 	}
	// 	if ($scope.globalData.userRole === "endUser") {
	// 		customSrv.backNavigationFromDeficiencyDetailsTo = '^.deficienciesListEndUser';
	// 	} else {
	// 		customSrv.backNavigationFromDeficiencyDetailsTo = '^.deficienciesList';
	// 	}
	// };

	// $scope.onAddNew = function() {
	// 	customSrv.oDeficiencyEntity.oCurrentDeficiency = {};
	// 	customSrv.oDeficiencyEntity.bDeficiencyDisplayMode = false;
	// 	customSrv.oDeficiencyEntity.bCreateNewMode = true;

	// 	if ($scope.globalData.userRole === "endUser") {
	// 		$state.go('^.deficiencyDetailsEndUser');
	// 	} else {
	// 		$state.go('^.deficiencyDetails');
	// 	}

	// 	if ($scope.globalData.userRole === "endUser") {
	// 		customSrv.backNavigationFromDeficiencyDetailsTo = '^.deficienciesListEndUser';
	// 	} else {
	// 		customSrv.backNavigationFromDeficiencyDetailsTo = '^.deficienciesList';
	// 	}
	// };

	// $scope.$on("$destroy", function() {
	// 	offEventPendingRequestsFinishedForoDeficiencyEntity();
	// 	offEventGlobalSelectionsChanged();

	// 	customSrv.oDeficiencyEntity.listSearchFilter = $scope.filter.$;

	// 	if ($scope.oListTable) {
	// 		customSrv.oDeficiencyEntity.listColumnsFilters = $scope.oListTable.parameters().filter;
	// 		customSrv.oDeficiencyEntity.listColumnsSorting = $scope.oListTable.parameters().sorting;
	// 		customSrv.oDeficiencyEntity.oSelectCriterias = jQuery.extend(true, {}, $scope.oSelectCriterias);
	// 		$scope.oListTable.settings().setGroupsInfo();
	// 		customSrv.oDeficiencyEntity.listColumnsGrouping = $scope.oListTable.settings().$scope.aGroupsInfo;
	// 	}
	// });

	// $scope.$on("ngTableAfterReloadData", function() {
	// 	if ($scope.oTableData && $scope.oTableData.aDisplayedListItems) {
	// 		$scope.tableInfoTotal = customSrv.getTableTotalInfo({
	// 			aItems: $scope.oTableData.aDisplayedListItems,
	// 			sAttribute: "_associatedStatusName"
	// 		});
	// 	}

	// 	if ($scope.oListTable && customSrv.oDeficiencyEntity.listSearchFilter !== "" && customSrv.oDeficiencyEntity.listSearchFilter !== undefined) {
	// 		$scope.filter.$ = customSrv.oDeficiencyEntity.listSearchFilter;
	// 		customSrv.oDeficiencyEntity.listSearchFilter = "";
	// 	}

	// 	delete customSrv.oDeficiencyEntity.listColumnsFilters.$;
	// 	if ($scope.oListTable && JSON.stringify(customSrv.oDeficiencyEntity.listColumnsFilters) !== JSON.stringify({})) {
	// 		$scope.oListTable.parameters().filter = customSrv.oDeficiencyEntity.listColumnsFilters;
	// 		$scope.bShowFilters = true;
	// 		customSrv.oDeficiencyEntity.listColumnsFilters = {};
	// 	}

	// 	if ($scope.oListTable && JSON.stringify(customSrv.oDeficiencyEntity.listColumnsSorting) !== JSON.stringify({})) {
	// 		$scope.oListTable.parameters().sorting = customSrv.oDeficiencyEntity.listColumnsSorting;
	// 		customSrv.oDeficiencyEntity.listColumnsSorting = {};
	// 	}

	// 	if ($scope.oListTable && customSrv.oDeficiencyEntity.listColumnsGrouping && customSrv.oDeficiencyEntity.listColumnsGrouping.length > 0) {
	// 		$scope.oListTable.settings().$scope.aGroupsInfo = customSrv.oDeficiencyEntity.listColumnsGrouping;
	// 		customSrv.oDeficiencyEntity.listColumnsGrouping = [];
	// 	}
	// });

	// $scope.onPrint = function() {
	// 	$scope.$destroy();
	// 	$state.go('deficienciesListPrintForm');
	// };

	// $scope.getDeficiencyPhotos = function(sFilesGuid) {
	// 	var sPhotosUrl = "rest/file/list/deficiency/" + sFilesGuid + "/_attachments_";

	// 	var oGetDeficienciesPhotos = dataSrv.httpRequest(sPhotosUrl, {});
	// 	oGetDeficienciesPhotos.then(function(aData) {
	// 		$scope.aPhotos = [];
	// 		for (var i = 0; i < aData.length; i++) {
	// 			if (aData[i].isDeleted !== true && (aData[i].fileExtention.toUpperCase() === ".JPG" || aData[i].fileExtention.toUpperCase() === ".JPEG" || aData[i].fileExtention.toUpperCase() === ".PNG" || aData[i].fileExtention === ".GIF" || aData[i].fileExtention === ".BMP")) {
	// 				$scope.aPhotos.push(aData[i]);
	// 			}
	// 		}
	// 		//temporary before Lin's fix
	// 		sPhotosUrl = "rest/file/list/deficiency/" + sFilesGuid + "/_photo_";
	// 		oGetDeficienciesPhotos = dataSrv.httpRequest(sPhotosUrl, {});
	// 		oGetDeficienciesPhotos.then(function(aData) {
	// 			for (var i = 0; i < aData.length; i++) {
	// 				if (aData[i].isDeleted !== true && (aData[i].fileExtention.toUpperCase() === ".JPG" || aData[i].fileExtention.toUpperCase() === ".JPEG" || aData[i].fileExtention.toUpperCase() === ".PNG" || aData[i].fileExtention === ".GIF" || aData[i].fileExtention === ".BMP")) {
	// 					$scope.aPhotos.push(aData[i]);
	// 				}
	// 			}
	// 			if ($scope.aPhotos.length) {
	// 				customSrv.setUpPhotoGallery($scope.aPhotos);
	// 			}
	// 		});
	// 	});
	// };

	// $scope.showDeficiencyPhotos = function($event, deficiency) {
	// 	$event.stopPropagation();
	// 	$scope.getDeficiencyPhotos(deficiency._filesGuid);
	// };
});