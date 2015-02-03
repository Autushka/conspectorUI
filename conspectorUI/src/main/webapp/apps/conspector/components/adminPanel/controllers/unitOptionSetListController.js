viewControllers.controller('unitOptionSetListView', ['$scope', '$rootScope','$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'cacheProvider', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, cacheProvider, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			
//		var oProjectArrayWrapper = {
//			aData: []
//		};
//		//$scope.aProjects = [];
//
		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering
//
		var UnitOptionSetsListData = {
			aData: []
		};
//
		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: UnitOptionSetsListData,
			sDisplayedDataArrayName: "aDisplayedUnitOptionSets",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});
//
//		var aProjectArray = [];
//
//		var onProjectsLoaded = function(aData) {
//			for (var i = 0; i < aData.length; i++) {
//				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
//			}
//			aData = $filter('orderBy')(aData, ["_sortingSequence"]);
//
//			servicesProvider.constructDependentMultiSelectArray({
//				oDependentArrayWrapper: {
//					aData: aData
//				},
//				oParentArrayWrapper: oPhasesListData,
//				oNewParentItemArrayWrapper: oProjectArrayWrapper,
//				sNameEN: "NameEN",
//				sNameFR: "NameFR",
//				sDependentKey: "Guid",
//				sParentKey: "_projectGuid",
//				sTargetArrayNameInParent: "aProjects"
//			});
//		};
//
		var onUnitOptionSetsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				var oUnitOptionSet = {};
				oUnitOptionSet._editMode = false; //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
				oUnitOptionSet._guid = aData[i].Guid;
				oUnitOptionSet._lastModifiedAt = aData[i].LastModifiedAt;
				oUnitOptionSet.nameEN = aData[i].NameEN;
				oUnitOptionSet.nameFR = aData[i].NameFR;
				oUnitOptionSet.sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				// if (aData[i].ProjectDetails) {
				// 	oPhase._projectGuid = aData[i].ProjectDetails.Guid;
				// 	oPhase.projectName = $translate.use() === "en" ? aData[i].ProjectDetails.NameEN : aData[i].ProjectDetails.NameFR;
				// 	if (!oPhase.projectName) {
				// 		oPhase.projectName = aData[i].ProjectDetails.NameEN;
				// 	}
				// }
				UnitOptionSetsListData.aData.push(oUnitOptionSet);
			}
			$scope.tableParams.reload();

			// apiProvider.getProjects({
			// 	bShowSpinner: false,
			// 	onSuccess: onProjectsLoaded
			// });
		}

		apiProvider.getUnitOptionSets({
			bShowSpinner: true,
			onSuccess: onUnitOptionSetsLoaded
		});
//
		$scope.onAddNew = function() {
			UnitOptionSetsListData.aData.push({
				_editMode: true,
				sortingSequence: 0,
				nameEN: "",
				nameFR: "",
				_counter: iNewItemsCounter,
				//aProjects: angular.copy(oProjectArrayWrapper.aData)

			});
			iNewItemsCounter++;
			$scope.tableParams.reload();
		};
//
		$scope.onEdit = function(oUnitOptionSet) {
			oUnitOptionSet._editMode = true;
		};
//
		$scope.onDelete = function(oUnitOptionSet) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < UnitOptionSetsListData.aData.length; i++) {
					if (UnitOptionSetsListData.aData[i]._guid === oUnitOptionSet._guid) {
						UnitOptionSetsListData.aData.splice(i, 1);
						break;
					}
				}
				$scope.tableParams.reload();
			}

			if (oUnitOptionSet._guid) {
				oDataForSave.Guid = oUnitOptionSet._guid;
				oDataForSave.LastModifiedAt = oPhase._lastModifiedAt;
				apiProvider.updateUnitOptionSet({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessDelete
				});
			} else {
				for (var i = 0; i < UnitOptionSetsListData.aData.length; i++) {
					if (UnitOptionSetsListData.aData[i]._counter === oUnitOptionSet._counter) {
						UnitOptionSetsListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		};
//
//		var sProjectName = "";
//
		$scope.onSave = function(oUnitOptionSet) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var onSuccessCreation = function(oData) {
				oUnitOptionSet._guid = oData.Guid;
				oUnitOptionSet._lastModifiedAt = oData.LastModifiedAt;
				oUnitOptionSet._editMode = false;


				
			};
			var onSuccessUpdate = function(oData) {
				oUnitOptionSet._editMode = false;
				oUnitOptionSet._lastModifiedAt = oData.LastModifiedAt;



			};

			oDataForSave.NameEN = oUnitOptionSet.nameEN;
			oDataForSave.NameFR = oUnitOptionSet.nameFR;
			oDataForSave.GeneralAttributes.SortingSequence = oUnitOptionSet.sortingSequence;
			oDataForSave.LastModifiedAt = oUnitOptionSet._lastModifiedAt;

			// for (var i = 0; i < oPhase.aProjects.length; i++) {
			// 	if (oPhase.aProjects[i].ticked) {
			// 		oDataForSave.ProjectGuid = oPhase.aProjects[i].Guid;
			// 		sProjectName = oPhase.aProjects[i].name;
			// 		break;
			// 	}
			// }

			if (oUnitOptionSet._guid) {
				oDataForSave.Guid = oUnitOptionSet._guid;
				apiProvider.updateUnitOptionSet({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate
				});
			} else {
				apiProvider.createUnitOptionSet({
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