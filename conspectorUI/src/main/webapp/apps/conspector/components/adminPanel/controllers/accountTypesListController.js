viewControllers.controller('accountTypesListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.nameENTE = $translate.instant('global_descriptionEN');
		$scope.nameFRTE = $translate.instant('global_descriptionFR');
		$scope.sortingSequenceTE = $translate.instant('global_sortingSequence');
		//TO DO: add associated icon
		//$scope.associatedIconFileGuidTE = $translate.instant('global_associatedIconFileGuid');

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oAccountTypesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oAccountTypesListData,
			sDisplayedDataArrayName: "aDisplayedAccountTypes",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onAccountTypesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oAccountTypesListData.aData.push({
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

		apiProvider.getAccountTypes({
			bShowSpinner: true,
			onSuccess: onAccountTypesLoaded
		});

		$scope.onAddNew = function() {
			oAccountTypesListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				_counter: iNewItemsCounter
			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oAccountType) {
			oAccountType._editMode = true;
		};

		$scope.onDelete = function(oAccountType) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oAccountTypesListData.aData.length; i++) {
					if (oAccountTypesListData.aData[i]._guid === oAccountType._guid) {
						oAccountTypesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oAccountType._guid) {
				oDataForSave.Guid = oAccountType._guid;
				oDataForSave.LastModifiedAt = oAccountType._lastModifiedAt;
				apiProvider.updateAccountType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oAccountTypesListData.aData.length; i++) {
					if(oAccountTypesListData.aData[i]._counter === oAccountType._counter){
						oAccountTypesListData.aData.splice(i, 1);
						$scope.tableParams.reload();	
						break;					
					}
				}
			}
		},

		$scope.onSave = function(oAccountType) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oAccountType._guid = oData.Guid;
				oAccountType._lastModifiedAt = oData.LastModifiedAt;
				oAccountType._editMode = false;

			};
			var onSuccessUpdate = function(oData) {
				oAccountType._editMode = false;
				oAccountType._lastModifiedAt = oData.LastModifiedAt;
			};

			oDataForSave.NameEN = oAccountType.nameEN;
			oDataForSave.NameFR = oAccountType.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oAccountType.sortingSequence;
			oDataForSave.LastModifiedAt = oAccountType._lastModifiedAt;

			if (oAccountType._guid) {
				oDataForSave.Guid = oAccountType._guid;
				apiProvider.updateAccountType({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createAccountType({
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