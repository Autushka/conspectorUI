viewControllers.controller('unitOptionValueListView', ['$scope', '$rootScope','$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'cacheProvider', 'historyProvider',
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
		var UnitOptionValuesListData = {
			aData: []
		};
//
		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: UnitOptionValuesListData,
			sDisplayedDataArrayName: "aDisplayedUnitOptionValues",
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
		var onUnitOptionValuesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				var oUnitOptionValue = {};
				oUnitOptionValue._editMode = false; //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
				oUnitOptionValue._guid = aData[i].Guid;
				oUnitOptionValue._lastModifiedAt = aData[i].LastModifiedAt;
				oUnitOptionValue.nameEN = aData[i].NameEN;
				oUnitOptionValue.nameFR = aData[i].NameFR;
				oUnitOptionValue.sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				// if (aData[i].ProjectDetails) {
				// 	oPhase._projectGuid = aData[i].ProjectDetails.Guid;
				// 	oPhase.projectName = $translate.use() === "en" ? aData[i].ProjectDetails.NameEN : aData[i].ProjectDetails.NameFR;
				// 	if (!oPhase.projectName) {
				// 		oPhase.projectName = aData[i].ProjectDetails.NameEN;
				// 	}
				// }
				UnitOptionValuesListData.aData.push(oUnitOptionValue);
			}
			$scope.tableParams.reload();

			// apiProvider.getProjects({
			// 	bShowSpinner: false,
			// 	onSuccess: onProjectsLoaded
			// });
		}

		apiProvider.getUnitOptionValues({
			bShowSpinner: true,
			onSuccess: onUnitOptionValuesLoaded
		});
//
		$scope.onAddNew = function() {
			UnitOptionValuesListData.aData.push({
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
		$scope.onEdit = function(oUnitOptionValue) {
			oUnitOptionValue._editMode = true;
		};
//
		$scope.onDelete = function(oUnitOptionValue) {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				for (var i = 0; i < UnitOptionValuesListData.aData.length; i++) {
					if (UnitOptionValuesListData.aData[i]._guid === oUnitOptionValue._guid) {
						UnitOptionValuesListData.aData.splice(i, 1);
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
				for (var i = 0; i < UnitOptionValuesListData.aData.length; i++) {
					if (UnitOptionValuesListData.aData[i]._counter === oUnitOptionValue._counter) {
						UnitOptionValuesListData.aData.splice(i, 1);
						$scope.tableParams.reload();
						break;
					}
				}
			}
		};
//
//		var sProjectName = "";
//
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

			// for (var i = 0; i < oPhase.aProjects.length; i++) {
			// 	if (oPhase.aProjects[i].ticked) {
			// 		oDataForSave.ProjectGuid = oPhase.aProjects[i].Guid;
			// 		sProjectName = oPhase.aProjects[i].name;
			// 		break;
			// 	}
			// }

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