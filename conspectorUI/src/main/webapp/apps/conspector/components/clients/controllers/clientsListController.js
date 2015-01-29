viewControllers.controller('clientsListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
	function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
		historyProvider.removeHistory(); // because current view doesn't have a back button
		
		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oClient",
			sOperation: "bCreate"
		});

		$scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oClient",
			sOperation: "bUpdate"
		});

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = {}; // for backNavigation

		var oClientsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oClientsListData,
			sDisplayedDataArrayName: "aDisplayedClients",
			oInitialSorting: {
				sClientName: 'asc'
			},
			sGroupBy: "sProjectPhase",
			sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
		});

		var onClientsLoaded = function(aData) {
			var sProjectName = "";
			var sPhaseName = "";
			var bMatchFound = false;
			for (var i = 0; i < aData.length; i++) {
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

					oClientsListData.aData.push({
						sClientName: aData[i].Name,
						sPhone: aData[i].MainPhone,
						sEmail: aData[i].Email,
						_guid: aData[i].Guid,
						sTags: aData[i].DescriptionTags,
						sProjectPhase: sProjectName + " - " + sPhaseName,
						_sortingSequence: aData[i].PhaseDetails.results[j]._sortingSequence, //for default groups sorting
					});
				}
			}

			$scope.tableParams.reload();
		};

		var loadClients = function() {
			oClientsListData.aData = [];
			apiProvider.getClientsWithPhases({
				bShowSpinner: true,
				onSuccess: onClientsLoaded
			});
		};

		loadClients(); //load Clients

		$scope.onDisplay = function(oClient) {
			$state.go('app.clientDetailsWrapper.clientDetails', {
				sMode: "display",
				sClientGuid: oClient._guid,
			});
		};

		$scope.onEdit = function(oClient) {
			$state.go('app.clientDetailsWrapper.clientDetails', {
				sMode: "edit",
				sClientGuid: oClient._guid,
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.clientDetailsWrapper.clientDetails', {
				sMode: "create",
				sClientGuid: "",
			});
		};
		$scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
			loadClients();
		});

		$scope.$on('accountsShouldBeRefreshed', function(oParameters) {
			loadClients();
		});

		$scope.$on("$destroy", function() {
			if(historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName){ //current state was already put to the history in the parent views
				return;
			}
						
			historyProvider.addStateToHistory({
				sStateName: $rootScope.sCurrentStateName,
				oStateParams: $rootScope.oStateParams
			});
		});
	}
]);