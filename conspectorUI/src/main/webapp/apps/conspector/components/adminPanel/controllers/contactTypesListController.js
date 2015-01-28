viewControllers.controller('contactTypesListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate) {
		
		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oContactTypesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oContactTypesListData,
			sDisplayedDataArrayName: "aDisplayedContactTypes",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onContactTypesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oContactTypesListData.aData.push({
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

		apiProvider.getContactTypes({
			bShowSpinner: true,
			onSuccess: onContactTypesLoaded
		});

		$scope.onAddNew = function() {
			oContactTypesListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				_counter: iNewItemsCounter
			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oContactType) {
			oContactType._editMode = true;
		};

		$scope.onDelete = function(oContactType) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oContactTypesListData.aData.length; i++) {
					if (oContactTypesListData.aData[i]._guid === oContactType._guid) {
						oContactTypesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oContactType._guid) {
				oDataForSave.Guid = oContactType._guid;
				oDataForSave.LastModifiedAt = oContactType._lastModifiedAt;
				apiProvider.updateContactType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oContactTypesListData.aData.length; i++) {
					if(oContactTypesListData.aData[i]._counter === oContactType._counter){
						oContactTypesListData.aData.splice(i, 1);
						$scope.tableParams.reload();	
						break;					
					}
				}
			}
		},

		$scope.onSave = function(oContactType) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oContactType._guid = oData.Guid;
				oContactType._lastModifiedAt = oData.LastModifiedAt;
				oContactType._editMode = false;

			};
			var onSuccessUpdate = function(oData) {
				oContactType._editMode = false;
				oContactType._lastModifiedAt = oData.LastModifiedAt;
			};

			oDataForSave.NameEN = oContactType.nameEN;
			oDataForSave.NameFR = oContactType.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oContactType.sortingSequence;
			oDataForSave.LastModifiedAt = oContactType._lastModifiedAt;

			if (oContactType._guid) {
				oDataForSave.Guid = oContactType._guid;
				apiProvider.updateContactType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createContactType({
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