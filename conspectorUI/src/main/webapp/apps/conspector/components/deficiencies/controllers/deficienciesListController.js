viewControllers.controller('deficienciesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
	function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
		historyProvider.removeHistory(); // because current view doesn't have a back button

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bCreate"
		});

		$scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bUpdate"
		});

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation			

		var oDeficienciesListData = {
			aData: []
		};

		var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
			sTableName: "deficienciesList",
			sStateName: $rootScope.sCurrentStateName,
		});

		var oInitialSortingForDeficienciesList = {};
		if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
			oInitialSortingForDeficienciesList = angular.copy(oTableStatusFromCache.oSorting);
		}
		var oInitialFilterForDeficienciesList = {};
		if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
			oInitialFilterForDeficienciesList = angular.copy(oTableStatusFromCache.oFilter);
		}
		var oInitialGroupsSettingsForDeficienciesList = [];
		if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
			oInitialGroupsSettingsForDeficienciesList = angular.copy(oTableStatusFromCache.aGroups);
		}

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oDeficienciesListData,
			sDisplayedDataArrayName: "aDisplayedDeficiencies",
			oInitialSorting: oInitialSortingForDeficienciesList,
			oInitialFilter: oInitialFilterForDeficienciesList,
			aInitialGroupsSettings: oInitialGroupsSettingsForDeficienciesList,
			sGroupBy: "sProjectPhase",
			sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
		});

		var onDeficienciesLoaded = function(aData) {
			var sProjectName = "";
			var sPhaseName = "";
			var sProjectPhase = "";
			var bMatchFound = false;
			var iSortingSequence = 0;
			var sStatuseIconUrl = "";
			var sContractors = "";
			for (var i = 0; i < aData.length; i++) {
				sProjectName = "";
				sPhaseName = "";
				sProjectPhase = "";
				iSortingSequence = 0;
				sStatuseIconUrl = "";
				sContractors = "";

				bMatchFound = false;

				if (aData[i].PhaseDetails) {
					iSortingSequence = aData[i].PhaseDetails.GeneralAttributes.SortingSequence;
					for (var k = 0; k < cacheProvider.oUserProfile.aGloballySelectedPhasesGuids.length; k++) {
						if (aData[i].PhaseDetails.Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]) {
							bMatchFound = true;
							break;
						}
					}
					if (!bMatchFound) {
						continue;
					}

					sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.ProjectDetails.NameEN : aData[i].PhaseDetails.ProjectDetails.NameFR;
					if (!sProjectName) {
						sProjectName = aData[i].PhaseDetails.ProjectDetails.NameEN;
					}
					sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.NameEN : aData[i].PhaseDetails.NameFR;
					if (!sPhaseName) {
						sPhaseName = aData[i].PhaseDetails.NameEN;
					}

					sProjectPhase = sProjectName + " - " + sPhaseName;
				} else {
					sProjectPhase = "Not Assigned";
				}

				if (aData[i].TaskStatusDetails) {
					sStatuseIconUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[i].TaskStatusDetails.AssociatedIconFileGuid;
				}

				if (aData[i].AccountDetails) {
					for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
						sContractors = sContractors + aData[i].AccountDetails.results[j].Name + "; ";
					}
				}

				//$rootScope.sLogoUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[0].guid;

				// if (!bMatchFound) {
				// 	continue;
				// }
				//aData[i].PhaseDetails._sortingSequence = 

				// sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].ProjectDetails.NameEN : aData[i].PhaseDetails.results[j].ProjectDetails.NameFR;
				// if (!sProjectName) {
				// 	sProjectName = aData[i].PhaseDetails.results[j].ProjectDetails.NameEN;
				// }
				// sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].NameEN : aData[i].PhaseDetails.results[j].NameFR;
				// if (!sPhaseName) {
				// 	sPhaseName = aData[i].PhaseDetails.results[j].NameEN;
				// }

				oDeficienciesListData.aData.push({
					// sDeficiencyName: aData[i].Name,
					// sPhone: aData[i].MainPhone,
					// sEmail: aData[i].Email,
					_guid: aData[i].Guid,
					sTags: aData[i].DescriptionTags,
					sProjectPhase: sProjectPhase,
					sContractors: sContractors,
					_sortingSequence: iSortingSequence,
					sStatuseIconUrl: sStatuseIconUrl
				});
				// }


			}
			$scope.tableParams.reload();
		};

		var loadDeficiencies = function() {
			oDeficienciesListData.aData = [];
			apiProvider.getDeficiencies({
				sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,AccountDetails",
				bShowSpinner: true,
				onSuccess: onDeficienciesLoaded
			});
		};

		loadDeficiencies(); //load Deficiencys

		$scope.onDisplay = function(oDeficiency) {
			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
				sMode: "display",
				sDeficiencyGuid: oDeficiency._guid,
			});
		};

		$scope.onEdit = function(oDeficiency) {
			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
				sMode: "edit",
				sDeficiencyGuid: oDeficiency._guid,
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
				sMode: "create",
				sDeficiencyGuid: "",
			});
		};
		$scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
			loadDeficiencies();
		});

		$scope.$on('deficienciesShouldBeRefreshed', function(oParameters) {
			loadDeficiencies();
		});

		$scope.$on("$destroy", function() {
			if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
				return;
			}

			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: $rootScope.oStateParams
			});

			cacheProvider.putTableStatusToCache({
				sTableName: "deficienciesList",
				sStateName: $rootScope.sCurrentStateName,
				aGroups: $scope.tableParams.settings().$scope.$groups,
				oFilter: $scope.tableParams.$params.filter,
				oSorting: $scope.tableParams.$params.sorting,
			});
		});
	}
]);