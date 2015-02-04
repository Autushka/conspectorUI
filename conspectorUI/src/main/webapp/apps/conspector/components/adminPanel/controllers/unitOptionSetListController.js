viewControllers.controller('unitOptionSetListView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'ngTableParams', '$filter', 'apiProvider', '$translate', 'cacheProvider', 'historyProvider',
	function($scope, $rootScope, $state, servicesProvider, ngTableParams, $filter, apiProvider, $translate, cacheProvider, historyProvider) {
		historyProvider.removeHistory(); // because current view doesn't have a back button				
		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			
		var oPhasesArrayWrapper = {
			aData: []
		};

		var iNewItemsCounter = 0; //used to identify list item for new item deletion after sorting/filtering

		var UnitOptionSetsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: UnitOptionSetsListData,
			sDisplayedDataArrayName: "aDisplayedUnitOptionSets",
			oInitialSorting: {
				sortingSequence: 'asc'
			}
		});

		var onProjectsLoaded = function(aData) {
			//Sort aData by project sorting sequence and then by phases sorting sequence...
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
					if (aData[i].PhaseDetails.results[j].GeneralAttributes.IsDeleted) { // Filtering on expanded entities doesn't work right now in olingo...
						aData[i].PhaseDetails.results.splice(j, 1);
						break;
					}
					aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
				}
				aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: UnitOptionSetsListData,
				oNewParentItemArrayWrapper: oPhasesArrayWrapper,
				sSecondLevelAttribute: "PhaseDetails",
				sSecondLevelNameEN: "NameEN",
				sSecondLevelNameFR: "NameFR",
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sDependentKey: "Guid",
				sParentKeys: "_unitOptionSetGuids",
				sTargetArrayNameInParent: "aPhases"
			});
		};

		var onUnitOptionSetsLoaded = function(aData) {
			var sProjectName = "";
			var sPhaseName = "";
			var sProjectPhase = "";			
			for (var i = 0; i < aData.length; i++) {
				var oUnitOptionSet = {};
				oUnitOptionSet._editMode = false; //symbol _ here meens that this attribute is not displayed in the table and is used for the logic only
				oUnitOptionSet._guid = aData[i].Guid;
				oUnitOptionSet._lastModifiedAt = aData[i].LastModifiedAt;
				oUnitOptionSet.nameEN = aData[i].NameEN;
				oUnitOptionSet.nameFR = aData[i].NameFR;
				oUnitOptionSet.sortingSequence = aData[i].GeneralAttributes.SortingSequence;

				oUnitOptionSet._unitOptionSetGuids = [];
				if (aData[i].PhaseDetails && aData[i].PhaseDetails.results) {
					for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
						oUnitOptionSet._unitOptionSetGuids.push(aData[i].PhaseDetails.results[j].Guid);
					}
				}

				UnitOptionSetsListData.aData.push(oUnitOptionSet);
			}
			$scope.tableParams.reload();

			apiProvider.getProjectsWithPhases({
				bShowSpinner: false,
				onSuccess: onProjectsLoaded
			});

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
				aPhases: angular.copy(oPhasesArrayWrapper.aData)

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
				oDataForSave.LastModifiedAt = oUnitOptionSet._lastModifiedAt;
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

		var prepareLinksForSave = function(oUnitOptionSet) { // link unitOptenSet to phases
			var aLinks = [];
			var aUri = [];
			var sUri = "";

			for (var i = 0; i < oUnitOptionSet.aPhases.length; i++) {
				if (oUnitOptionSet.aPhases[i].ticked) {
					sUri = "Phases('" + oUnitOptionSet.aPhases[i].Guid + "')";
					aUri.push(sUri);
				}
			}

			if (aUri.length) {
				aLinks.push({
					sRelationName: "PhaseDetails",
					aUri: aUri
				});
			}
			return aLinks;
		};

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

			var aLinks = prepareLinksForSave(oUnitOptionSet);
			if (oUnitOptionSet._guid) {
				oDataForSave.Guid = oUnitOptionSet._guid;
				apiProvider.updateUnitOptionSet({
					bShowSpinner: true,
					sKey: oDataForSave.Guid,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessUpdate,
					aLinks: aLinks
				});
			} else {
				apiProvider.createUnitOptionSet({
					bShowSpinner: true,
					oData: oDataForSave,
					bShowSuccessMessage: true,
					bShowErrorMessage: true,
					onSuccess: onSuccessCreation,
					aLinks: aLinks
				});
			}
		};
	}
]);