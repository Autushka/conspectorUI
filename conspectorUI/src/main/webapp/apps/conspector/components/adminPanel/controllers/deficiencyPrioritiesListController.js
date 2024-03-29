viewControllers.controller('deficiencyPrioritiesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', '$window', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, $window, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button			
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			
		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oDeficiencyPrioritiesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oDeficiencyPrioritiesListData,
			sDisplayedDataArrayName: "aDisplayedDeficiencyPriorities",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onDeficiencyPrioritiesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oDeficiencyPrioritiesListData.aData.push({
					_editMode: false, //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
					_guid: aData[i].Guid,
					_lastModifiedAt: aData[i].LastModifiedAt,
					nameEN: aData[i].NameEN,
					nameFR: aData[i].NameFR,
					associatedColor: aData[i].AssociatedColor,
					sortingSequence: aData[i].GeneralAttributes.SortingSequence
				});
			}
			$scope.tableParams.reload();

		}

		apiProvider.getDeficiencyPriorities({
			bShowSpinner: true,
			onSuccess: onDeficiencyPrioritiesLoaded
		});

		$scope.onAddNew = function() {
			oDeficiencyPrioritiesListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				associatedColor: "",
				_counter: iNewItemsCounter,
			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oDeficiencyPriority) {
			oDeficiencyPriority._editMode = true;
		};

		$scope.onDelete = function(oDeficiencyPriority) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oDeficiencyPrioritiesListData.aData.length; i++) {
					if (oDeficiencyPrioritiesListData.aData[i]._guid === oDeficiencyPriority._guid) {
						oDeficiencyPrioritiesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oDeficiencyPriority._guid) {
				oDataForSave.Guid = oDeficiencyPriority._guid;
				oDataForSave.LastModifiedAt = oDeficiencyPriority._lastModifiedAt;
				apiProvider.updateDeficiencyPriority({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oDeficiencyPrioritiesListData.aData.length; i++) {
					if (oDeficiencyPrioritiesListData.aData[i]._counter === oDeficiencyPriority._counter) {
						oDeficiencyPrioritiesListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		},

		$scope.onSave = function(oDeficiencyPriority) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oDeficiencyPriority._guid = oData.Guid;
				oDeficiencyPriority._lastModifiedAt = oData.LastModifiedAt;
				oDeficiencyPriority._editMode = false;
			};
			var onSuccessUpdate = function(oData) {
				oDeficiencyPriority._editMode = false;
				oDeficiencyPriority._lastModifiedAt = oData.LastModifiedAt;
			};

			oDataForSave.NameEN = oDeficiencyPriority.nameEN;
			oDataForSave.NameFR = oDeficiencyPriority.nameFR;
			oDataForSave.AssociatedColor = oDeficiencyPriority.associatedColor;
			oDataForSave.GeneralAttributes.SortingSequence = oDeficiencyPriority.sortingSequence;
			oDataForSave.LastModifiedAt = oDeficiencyPriority._lastModifiedAt;

			if (oDeficiencyPriority._guid) {
				oDataForSave.Guid = oDeficiencyPriority._guid;
				apiProvider.updateDeficiencyPriority({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createDeficiencyPriority({
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