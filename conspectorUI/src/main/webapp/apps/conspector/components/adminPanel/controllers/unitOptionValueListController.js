viewControllers.controller('unitOptionValueListView', ['$scope', '$rootScope','$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'cacheProvider', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, cacheProvider, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			
		var unitOptionSetArrayWrapper = {
			aData: []
		};

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oUnitOptionValuesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oUnitOptionValuesListData,
			sDisplayedDataArrayName: "aDisplayedUnitOptionValues",
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
				oParentArrayWrapper: oUnitOptionValuesListData,
				oNewParentItemArrayWrapper: unitOptionSetArrayWrapper,
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sDependentKey: "Guid",
				sParentKey: "_unitOptionSetGuid",
				sTargetArrayNameInParent: "aUnitOptionSets"
			});
		};

		var onUnitOptionValuesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				var oUnitOptionValue = {};
				oUnitOptionValue._editMode = false; //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
				oUnitOptionValue._guid = aData[i].Guid;
				oUnitOptionValue._lastModifiedAt = aData[i].LastModifiedAt;
				oUnitOptionValue.nameEN = aData[i].NameEN;
				oUnitOptionValue.nameFR = aData[i].NameFR;
				oUnitOptionValue.sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				if (aData[i].UnitOptionSetDetails) {
					oUnitOptionValue._unitOptionSetGuid = aData[i].UnitOptionSetDetails.Guid;
				}
				oUnitOptionValuesListData.aData.push(oUnitOptionValue);
			}
			$scope.tableParams.reload();

			apiProvider.getUnitOptionSets({
				bShowSpinner: false,
				onSuccess: onUnitOptionSetsLoaded
			});
		}

		apiProvider.getUnitOptionValues({
			bShowSpinner: true,
			onSuccess: onUnitOptionValuesLoaded
		});

		$scope.onAddNew = function() {
			oUnitOptionValuesListData.aData.push({
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

		$scope.onEdit = function(oUnitOptionValue) {
			oUnitOptionValue._editMode = true;
		};

		$scope.onDelete = function(oUnitOptionValue) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oUnitOptionValuesListData.aData.length; i++) {
					if (oUnitOptionValuesListData.aData[i]._guid === oUnitOptionValue._guid) {
						oUnitOptionValuesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oUnitOptionValue._guid) {
				oDataForSave.Guid = oUnitOptionValue._guid;
				oDataForSave.LastModifiedAt = oUnitOptionValue._lastModifiedAt;
				apiProvider.updateUnitOptionValue({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oUnitOptionValuesListData.aData.length; i++) {
					if (oUnitOptionValuesListData.aData[i]._counter === oUnitOptionValue._counter) {
						oUnitOptionValuesListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		};

		$scope.onSave = function(oUnitOptionValue) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oUnitOptionValue._guid = oData.Guid;
				oUnitOptionValue._lastModifiedAt = oData.LastModifiedAt;
				oUnitOptionValue._editMode = false;


				
			};
			var onSuccessUpdate = function(oData) {
				oUnitOptionValue._editMode = false;
				oUnitOptionValue._lastModifiedAt = oData.LastModifiedAt;



			};

			oDataForSave.NameEN = oUnitOptionValue.nameEN;
			oDataForSave.NameFR = oUnitOptionValue.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oUnitOptionValue.sortingSequence;
			oDataForSave.LastModifiedAt = oUnitOptionValue._lastModifiedAt;

			for (var i = 0; i < oUnitOptionValue.aUnitOptionSets.length; i++) {
				if (oUnitOptionValue.aUnitOptionSets[i].ticked) {
					oDataForSave.UnitOptionSetGuid = oUnitOptionValue.aUnitOptionSets[i].Guid;
					break;
				}
			}

			if (oUnitOptionValue._guid) {
				oDataForSave.Guid = oUnitOptionValue._guid;
				apiProvider.updateUnitOptionValue({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createUnitOptionValue({
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