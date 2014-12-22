viewControllers.controller('projectsListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate) {
		$scope.actionsTE = $translate.instant('projectsList_actions'); //need TE for ngTable columns headers
		$scope.nameENTE = $translate.instant('projectsList_descriptionEN');
		$scope.nameFRTE = $translate.instant('projectsList_descriptionFR');
		$scope.sortingSequenceTE = $translate.instant('projectsList_sortingSequence');

		var oProjectsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oProjectsListData,
			sDisplayedDataArrayName: "aDisplayedProjects"
		});

		var onProjectsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				if (!aData[i].GeneralAttributes.IsDeleted) {
					oProjectsListData.aData.push({
						_editMode: false, //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
						_guid: aData[i].Guid,
						_lastModifiedAt: aData[i].LastModifiedAt,
						nameEN: aData[i].NameEN,
						nameFR: aData[i].NameFR,
						sortingSequence: aData[i].GeneralAttributes.SortingSequence
					});
				}
			}
			oProjectsListData.aData = $filter('orderBy')(oProjectsListData.aData, ["sortingSequence"]);
			$scope.tableParams.reload();
		}

		apiProvider.getProjects({
			sPath: "Projects",
			bShowSpinner: true,
			onSuccess: onProjectsLoaded
		});

		$scope.onAddNew = function() {
			oProjectsListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: ""
			});
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oProject) {
			oProject._editMode = true;
		};

		$scope.onDelete = function(oProject, iIndex) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oProjectsListData.aData.length; i++) {
					if (oProjectsListData.aData[i]._guid === oProject._guid) {
						oProjectsListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if(oProject._guid){
				oDataForSave.Guid = oProject._guid;
				oDataForSave.LastModifiedAt = oProject._lastModifiedAt;			
				apiProvider.updateProject({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});				
			}else{
				if(!oProjectsListData.aData[iIndex]._guid){
					oProjectsListData.aData.splice(iIndex, 1);
					$scope.tableParams.reload();					
				}
			}
		},

		$scope.onSave = function(oProject) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oProject._guid = oData.Guid;
				oProject._lastModifiedAt = oData.LastModifiedAt;
				oProject._editMode = false;

			};
			var onSuccessUpdate = function(oData) {
				oProject._editMode = false;
				oProject._lastModifiedAt = oData.LastModifiedAt;
			};

			oDataForSave.NameEN = oProject.nameEN;
			oDataForSave.NameFR = oProject.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oProject.sortingSequence;
			oDataForSave.LastModifiedAt = oProject._lastModifiedAt;

			if (oProject._guid) {
				oDataForSave.Guid = oProject._guid;
				apiProvider.updateProject({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createProject({
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