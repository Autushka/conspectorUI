viewControllers.controller('deficiencyStatusesListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', '$window', 'cacheProvider',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, $window, cacheProvider) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.iconTE = $translate.instant('global_icon');
		$scope.nameENTE = $translate.instant('global_descriptionEN');
		$scope.nameFRTE = $translate.instant('global_descriptionFR');
		$scope.sortingSequenceTE = $translate.instant('global_sortingSequence');

		var oStatusIconArrayWrapper = {
			aData: []
		};

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oDeficiencyStatusesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oDeficiencyStatusesListData,
			sDisplayedDataArrayName: "aDisplayedDeficiencyStatuses",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onIconsLoaded = function(aData) {
			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oDeficiencyStatusesListData,
				oNewParentItemArrayWrapper: oStatusIconArrayWrapper,
				sDependentKey: "guid",
				sParentKey: "_associatedIconFileGuid",
				sDependentIconKey: "guid",
				sTargetArrayNameInParent: "aStatusIcons"
			});
		};

		var onDeficiencyStatusesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oDeficiencyStatusesListData.aData.push({
					_editMode: false, //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
					_guid: aData[i].Guid,
					_lastModifiedAt: aData[i].LastModifiedAt,
					_associatedIconFileGuid: aData[i].AssociatedIconFileGuid,
					sUrl: $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[i].AssociatedIconFileGuid,
					nameEN: aData[i].NameEN,
					nameFR: aData[i].NameFR,
					sortingSequence: aData[i].GeneralAttributes.SortingSequence
				});
			}
			$scope.tableParams.reload();

			apiProvider.getAttachments({
				sPath: "rest/file/list/companyDependentSettings/" + cacheProvider.oUserProfile.sCurrentCompany + "/_deficiencyStatuses_",
				onSuccess: onIconsLoaded
			});
		}

		apiProvider.getDeficiencyStatuses({
			bShowSpinner: true,
			onSuccess: onDeficiencyStatusesLoaded
		});

		$scope.onAddNew = function() {
			oDeficiencyStatusesListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				_counter: iNewItemsCounter,
				aStatusIcons: angular.copy(oStatusIconArrayWrapper.aData)
			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oDeficiencyStatus) {
			oDeficiencyStatus._editMode = true;
		};

		$scope.onDelete = function(oDeficiencyStatus) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oDeficiencyStatusesListData.aData.length; i++) {
					if (oDeficiencyStatusesListData.aData[i]._guid === oDeficiencyStatus._guid) {
						oDeficiencyStatusesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oDeficiencyStatus._guid) {
				oDataForSave.Guid = oDeficiencyStatus._guid;
				oDataForSave.LastModifiedAt = oDeficiencyStatus._lastModifiedAt;
				apiProvider.updateDeficiencyStatus({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oDeficiencyStatusesListData.aData.length; i++) {
					if (oDeficiencyStatusesListData.aData[i]._counter === oDeficiencyStatus._counter) {
						oDeficiencyStatusesListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		},

		$scope.onSave = function(oDeficiencyStatus) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oDeficiencyStatus._guid = oData.Guid;
				oDeficiencyStatus._lastModifiedAt = oData.LastModifiedAt;
				oDeficiencyStatus._editMode = false;
				oDeficiencyStatus._associatedIconFileGuid = oData.AssociatedIconFileGuid;
				oDeficiencyStatus.sUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + oData.AssociatedIconFileGuid;
			};
			var onSuccessUpdate = function(oData) {
				oDeficiencyStatus._editMode = false;
				oDeficiencyStatus._lastModifiedAt = oData.LastModifiedAt;
				oDeficiencyStatus._associatedIconFileGuid = oData.AssociatedIconFileGuid;
				oDeficiencyStatus.sUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + oData.AssociatedIconFileGuid;				
			};

			oDataForSave.NameEN = oDeficiencyStatus.nameEN;
			oDataForSave.NameFR = oDeficiencyStatus.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oDeficiencyStatus.sortingSequence;
			oDataForSave.LastModifiedAt = oDeficiencyStatus._lastModifiedAt;

			for (var i = 0; i < oDeficiencyStatus.aStatusIcons.length; i++) {
				if (oDeficiencyStatus.aStatusIcons[i].ticked) {
					oDataForSave.AssociatedIconFileGuid = oDeficiencyStatus.aStatusIcons[i].guid;
					break;
				}
			}			

			if (oDeficiencyStatus._guid) {
				oDataForSave.Guid = oDeficiencyStatus._guid;
				apiProvider.updateDeficiencyStatus({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createDeficiencyStatus({
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