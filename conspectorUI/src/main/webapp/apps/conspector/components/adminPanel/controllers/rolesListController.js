viewControllers.controller('rolesListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.roleNameTE = $translate.instant('rolesList_roleName');
		$scope.descriptionENTE = $translate.instant('global_descriptionEN');
		$scope.descriptionFRTE = $translate.instant('global_descriptionFR');
		$scope.sortingSequenceTE = $translate.instant('global_sortingSequence');

		var oRolesListData = {
			aData: []
		};

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oRolesListData,
			sDisplayedDataArrayName: "aDisplayedRoles",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onRolesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oRolesListData.aData.push({
					_editMode: false, //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
					_roleName: aData[i].RoleName,
					_lastModifiedAt: aData[i].LastModifiedAt,
					roleName: aData[i].RoleName,
					descriptionEN: aData[i].DescriptionEN,
					descriptionFR: aData[i].DescriptionFR,
					sortingSequence: aData[i].GeneralAttributes.SortingSequence,
				});
			}
			$scope.tableParams.reload();
		}

		apiProvider.getRoles({
			bShowSpinner: true,
			onSuccess: onRolesLoaded
		});

		$scope.onAddNew = function() {
			oRolesListData.aData.push({
				_createMode: true,
				_editMode: true,
				sortingSequence: 0,
				descriptionEN: "",
				descriptionFR: "",
				_counter: iNewItemsCounter

			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oRole) {
			oRole._editMode = true;
		};

		$scope.onDelete = function(oRole, iIndex) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oRolesListData.aData.length; i++) {
					if (oRolesListData.aData[i]._roleName === oRole._roleName) {
						oRolesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oRole._roleName) {
				oDataForSave.RoleName = oRole._roleName;
				oDataForSave.LastModifiedAt = oRole._lastModifiedAt;
				apiProvider.updateRole({
					bShowSpinner: true,
					sKey: oDataForSave.RoleName,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oRolesListData.aData.length; i++) {
					if(oRolesListData.aData[i]._counter === oRole._counter){
						oRolesListData.aData.splice(i, 1);
						$scope.tableParams.reload();	
						break;					
					}
				}
			}
		},

		$scope.onSave = function(oRole) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oRole._roleName = oData.RoleName;
				oRole._lastModifiedAt = oData.LastModifiedAt;
				oRole._editMode = false;
				oRole._createMode = false;
			};
			var onSuccessUpdate = function(oData) {
				oRole._editMode = false;
				oRole._lastModifiedAt = oData.LastModifiedAt;
			};

			oDataForSave.DescriptionEN = oRole.descriptionEN;
			oDataForSave.DescriptionFR = oRole.descriptionFR;
			oDataForSave.GeneralAttributes.SortingSequence = oRole.sortingSequence;
			oDataForSave.LastModifiedAt = oRole._lastModifiedAt;

			if (oRole._roleName) {
				oDataForSave.RoleName = oRole._roleName;
				apiProvider.updateRole({
					bShowSpinner: true,
					sKey: oDataForSave.RoleName,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				oDataForSave.RoleName = oRole.roleName;
				apiProvider.createRole({
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