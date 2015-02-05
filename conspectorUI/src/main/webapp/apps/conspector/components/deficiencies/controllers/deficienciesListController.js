viewControllers.controller('deficienciesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
	function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
		historyProvider.removeHistory();// because current view doesn't have a back button

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
			var bMatchFound = false;
			for (var i = 0; i < aData.length; i++) {

				if (aData[i].PhaseDetails.results.length) {
					for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
						aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
					}
					aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);

					for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
						bMatchFound = false;
						for (var k = 0; k < cacheProvider.oUserProfile.aGloballySelectedPhasesGuids.length; k++) {
							if (aData[i].PhaseDetails.results[j].Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]) {
								bMatchFound = true;
								break;
							}
						}
						if (!bMatchFound) {
							continue;
						}

						sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].ProjectDetails.NameEN : aData[i].PhaseDetails.results[j].ProjectDetails.NameFR;
						if (!sProjectName) {
							sProjectName = aData[i].PhaseDetails.results[j].ProjectDetails.NameEN;
						}
						sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].NameEN : aData[i].PhaseDetails.results[j].NameFR;
						if (!sPhaseName) {
							sPhaseName = aData[i].PhaseDetails.results[j].NameEN;
						}

						oDeficiencysListData.aData.push({
							// sDeficiencyName: aData[i].Name,
							// sPhone: aData[i].MainPhone,
							// sEmail: aData[i].Email,
							_guid: aData[i].Guid,
							sTags: aData[i].DescriptionTags,
							sProjectPhase: sProjectName + " - " + sPhaseName,
							_sortingSequence: aData[i].PhaseDetails.results[j]._sortingSequence, //for default groups sorting
						});
					}
				} else {
					oDeficiencysListData.aData.push({
						// sDeficiencyName: aData[i].Name,
						// sPhone: aData[i].MainPhone,
						// sEmail: aData[i].Email,
						_guid: aData[i].Guid,
						sTags: aData[i].DescriptionTags,
						sProjectPhase: "Not Assigned", // TODO should be translatable...
						_sortingSequence: -1, //for default groups sorting
					});
				}

			}
			$scope.tableParams.reload();
		};

		var loadDeficiencies = function() {
			oDeficienciesListData.aData = [];
			apiProvider.getDeficiencies({
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
			loadDeficiencys();
		});

		$scope.$on('accountsShouldBeRefreshed', function(oParameters) {
			loadDeficiencys();
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