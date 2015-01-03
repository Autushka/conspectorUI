viewControllers.controller('phasesListView', ['$scope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'cacheProvider',
	function($scope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, cacheProvider) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.projectTE = $translate.instant('global_project');
		$scope.nameENTE = $translate.instant('global_descriptionEN');
		$scope.nameFRTE = $translate.instant('global_descriptionFR');
		$scope.sortingSequenceTE = $translate.instant('global_sortingSequence');

		var oProjectArrayWrapper = {
			aData: []
		};
		//$scope.aProjects = [];

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var oPhasesListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oPhasesListData,
			sDisplayedDataArrayName: "aDisplayedPhases",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var aProjectArray = [];

		var onProjectsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oPhasesListData,
				oNewParentItemArrayWrapper: oProjectArrayWrapper,
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sDependentKey: "Guid",
				sParentKey: "_projectGuid",
				sTargetArrayNameInParent: "aProjects"
			});
		};

		var onPhasesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				var oPhase = {};
				oPhase._editMode = false; //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
				oPhase._guid = aData[i].Guid;
				oPhase._lastModifiedAt = aData[i].LastModifiedAt;
				oPhase.nameEN = aData[i].NameEN;
				oPhase.nameFR = aData[i].NameFR;
				oPhase.sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				if (aData[i].ProjectDetails) {
					oPhase._projectGuid = aData[i].ProjectDetails.Guid;
					oPhase.projectName = $translate.use() === "en" ? aData[i].ProjectDetails.NameEN : aData[i].ProjectDetails.NameFR;
					if (!oPhase.projectName) {
						oPhase.projectName = aData[i].ProjectDetails.NameEN;
					}
				}
				oPhasesListData.aData.push(oPhase);
			}
			$scope.tableParams.reload();

			apiProvider.getProjects({
				bShowSpinner: false,
				onSuccess: onProjectsLoaded
			});
		}

		apiProvider.getPhases({
			bShowSpinner: true,
			onSuccess: onPhasesLoaded
		});

		$scope.onAddNew = function() {
			oPhasesListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				_counter: iNewItemsCounter,
				aProjects: angular.copy(oProjectArrayWrapper.aData)

			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};

		$scope.onEdit = function(oPhase) {
			oPhase._editMode = true;
		};

		$scope.onDelete = function(oPhase) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < oPhasesListData.aData.length; i++) {
					if (oPhasesListData.aData[i]._guid === oPhase._guid) {
						oPhasesListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oPhase._guid) {
				oDataForSave.Guid = oPhase._guid;
				oDataForSave.LastModifiedAt = oPhase._lastModifiedAt;
				apiProvider.updatePhase({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < oPhasesListData.aData.length; i++) {
					if (oPhasesListData.aData[i]._counter === oPhase._counter) {
						oPhasesListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		};

		var sProjectName = "";

		$scope.onSave = function(oPhase) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oPhase._guid = oData.Guid;
				oPhase._lastModifiedAt = oData.LastModifiedAt;
				oPhase._editMode = false;
				oPhase.projectName = sProjectName;
				sProjectName = "";

				cacheProvider.cleanEntitiesCache("oProjectEntity");
			};
			var onSuccessUpdate = function(oData) {
				oPhase._editMode = false;
				oPhase._lastModifiedAt = oData.LastModifiedAt;
				oPhase.projectName = sProjectName;
				sProjectName = "";

				cacheProvider.cleanEntitiesCache("oProjectEntity");
			};

			oDataForSave.NameEN = oPhase.nameEN;
			oDataForSave.NameFR = oPhase.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oPhase.sortingSequence;
			oDataForSave.LastModifiedAt = oPhase._lastModifiedAt;

			for (var i = 0; i < oPhase.aProjects.length; i++) {
				if (oPhase.aProjects[i].ticked) {
					oDataForSave.ProjectGuid = oPhase.aProjects[i].Guid;
					sProjectName = oPhase.aProjects[i].name;
					break;
				}
			}

			if (oPhase._guid) {
				oDataForSave.Guid = oPhase._guid;
				apiProvider.updatePhase({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createPhase({
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