viewControllers.controller('taskTypeListView', ['$scope', '$rootScope','$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'cacheProvider', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, cacheProvider, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			
		var unitOptionSetArrayWrapper = {
			aData: []
		};

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oTaskTypesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oTaskTypesListData,
			sDisplayedDataArrayName: "aDisplayedTaskTypes",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onUnitOptionSetsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oTaskTypesListData,
				oNewParentItemArrayWrapper: unitOptionSetArrayWrapper,
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sDependentKey: "Guid",
				sParentKey: "_unitOptionSetGuid",
				sTargetArrayNameInParent: "aUnitOptionSets"
			});
		};

		var onTaskTypesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				var oTaskType = {};
				oTaskType._editMode = false; //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
				oTaskType._guid = aData[i].Guid;
				oTaskType._lastModifiedAt = aData[i].LastModifiedAt;
				oTaskType.nameEN = aData[i].NameEN;
				oTaskType.nameFR = aData[i].NameFR;
				oTaskType.sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				if (aData[i].UnitOptionSetDetails) {
					oTaskType._unitOptionSetGuid = aData[i].UnitOptionSetDetails.Guid;
				}
				oTaskTypesListData.aData.push(oTaskType);
			}
			$scope.tableParams.reload();

			apiProvider.getUnitOptionSets({
				bShowSpinner: false,
				onSuccess: onUnitOptionSetsLoaded
			});
		}

		apiProvider.getTaskTypes({
			bShowSpinner: true,
			onSuccess: onTaskTypesLoaded
		});

		$scope.onAddNew = function() {
			oTaskTypesListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				_counter: iNewItemsCounter,
				aUnitOptionSets: angular.copy(unitOptionSetArrayWrapper.aData)

			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oTaskType) {
			oTaskType._editMode = true;
		};

		$scope.onDelete = function(oTaskType) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oTaskTypesListData.aData.length; i++) {
					if (oTaskTypesListData.aData[i]._guid === oTaskType._guid) {
						oTaskTypesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oTaskType._guid) {
				oDataForSave.Guid = oTaskType._guid;
				oDataForSave.LastModifiedAt = oTaskType._lastModifiedAt;
				apiProvider.updateTaskType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oTaskTypesListData.aData.length; i++) {
					if (oTaskTypesListData.aData[i]._counter === oTaskType._counter) {
						oTaskTypesListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		};

		$scope.onSave = function(oTaskType) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oTaskType._guid = oData.Guid;
				oTaskType._lastModifiedAt = oData.LastModifiedAt;
				oTaskType._editMode = false;


				
			};
			var onSuccessUpdate = function(oData) {
				oTaskType._editMode = false;
				oTaskType._lastModifiedAt = oData.LastModifiedAt;



			};

			oDataForSave.NameEN = oTaskType.nameEN;
			oDataForSave.NameFR = oTaskType.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oTaskType.sortingSequence;
			oDataForSave.LastModifiedAt = oTaskType._lastModifiedAt;

			for (var i = 0; i < oTaskType.aUnitOptionSets.length; i++) {
				if (oTaskType.aUnitOptionSets[i].ticked) {
					oDataForSave.UnitOptionSetGuid = oTaskType.aUnitOptionSets[i].Guid;
					break;
				}
			}

			if (oTaskType._guid) {
				oDataForSave.Guid = oTaskType._guid;
				apiProvider.updateTaskType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createTaskType({
					bShowSpinner: true,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessCreation
				});
			}
		};
	}
]);