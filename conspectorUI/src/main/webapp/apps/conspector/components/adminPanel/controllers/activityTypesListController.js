viewControllers.controller('activityTypesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button		
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation	

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oActivityTypesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oActivityTypesListData,
			sDisplayedDataArrayName: "aDisplayedActivityTypes",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onActivityTypesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oActivityTypesListData.aData.push({
					_editMode: false, //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
					_guid: aData[i].Guid,
					_lastModifiedAt: aData[i].LastModifiedAt,
					nameEN: aData[i].NameEN,
					nameFR: aData[i].NameFR,
					sortingSequence: aData[i].GeneralAttributes.SortingSequence
				});
			}
			$scope.tableParams.reload();
		}

		apiProvider.getActivityTypes({
			bShowSpinner: true,
			onSuccess: onActivityTypesLoaded
		});

		$scope.onAddNew = function() {
			oActivityTypesListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				_counter: iNewItemsCounter
			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oActivityType) {
			oActivityType._editMode = true;
		};

		$scope.onDelete = function(oActivityType) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oActivityTypesListData.aData.length; i++) {
					if (oActivityTypesListData.aData[i]._guid === oActivityType._guid) {
						oActivityTypesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oActivityType._guid) {
				oDataForSave.Guid = oActivityType._guid;
				oDataForSave.LastModifiedAt = oActivityType._lastModifiedAt;
				apiProvider.updateActivityType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oActivityTypesListData.aData.length; i++) {
					if(oActivityTypesListData.aData[i]._counter === oActivityType._counter){
						oActivityTypesListData.aData.splice(i, 1);
						$scope.tableParams.reload();	
						break;					
					}
				}
			}
		},

		$scope.onSave = function(oActivityType) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oActivityType._guid = oData.Guid;
				oActivityType._lastModifiedAt = oData.LastModifiedAt;
				oActivityType._editMode = false;

			};
			var onSuccessUpdate = function(oData) {
				oActivityType._editMode = false;
				oActivityType._lastModifiedAt = oData.LastModifiedAt;
			};

			oDataForSave.NameEN = oActivityType.nameEN;
			oDataForSave.NameFR = oActivityType.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oActivityType.sortingSequence;
			oDataForSave.LastModifiedAt = oActivityType._lastModifiedAt;

			if (oActivityType._guid) {
				oDataForSave.Guid = oActivityType._guid;
				apiProvider.updateActivityType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createActivityType({
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