viewControllers.controller('contractorsListView', ['$scope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter',
	function($scope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter) {
		historyProvider.removeHistory();// because current view doesn't have a back button
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.contractorNameTE = $translate.instant('global_contractorName');
		$scope.phoneTE = $translate.instant('global_phone');
		$scope.emailTE = $translate.instant('global_email');
		$scope.tagsTE = $translate.instant('global_tags');

		$scope.sCurrentStateName = $state.current.name;	// for backNavigation	
		$scope.oStateParams = {};// for backNavigation

		var oContractorsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oContractorsListData,
			sDisplayedDataArrayName: "aDisplayedContractors",
			oInitialSorting: {
				sContractorName: 'asc'
			},
			sGroupBy: "sProjectPhase",
		});

		var onContractorsLoaded = function(aData) {
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
						if(aData[i].PhaseDetails.results[j].Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]){
							bMatchFound = true;
							break;
						}
					}
					if(!bMatchFound){
						continue;
					}

					sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].ProjectDetails.NameEN : aData[i].PhaseDetails.results[j].ProjectDetails.NameFR;
					if(!sProjectName){
						sProjectName = aData[i].PhaseDetails.results[j].ProjectDetails.NameEN;
					}
					sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].NameEN : aData[i].PhaseDetails.results[j].NameFR;
					if(!sPhaseName){
						sPhaseName = aData[i].PhaseDetails.results[j].NameEN;
					}					

					oContractorsListData.aData.push({
						sContractorName: aData[i].Name,
						sPhone: aData[i].MainPhone,
						sEmail: aData[i].Email,
						_guid: aData[i].Guid,
						sTags: aData[i].DescriptionTags,
						sProjectPhase: sProjectName + " - " + sPhaseName,
					});
				}
			}

			$scope.tableParams.reload();
		};

		var loadContractors = function(){
			oContractorsListData.aData = [];
			apiProvider.getContractorsWithPhases({
				bShowSpinner: true,
				onSuccess: onContractorsLoaded
			});
		};

		loadContractors();//load Contractors

		$scope.onDisplay = function(oContractor) {
			$state.go('app.contractorDetailsWrapper.contractorDetails', {
				sMode: "display",
				sContractorGuid: oContractor._guid,
			});
		};

		$scope.onEdit = function(oContractor) {
			$state.go('app.contractorDetailsWrapper.contractorDetails', {
				sMode: "edit",
				sContractorGuid: oContractor._guid,
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.contractorDetailsWrapper.contractorDetails', {
				sMode: "create",
				sContractorGuid: "",
			});
		};

		$scope.onGenerateReport = function() {
			apiProvider.generateReport({});
		};
		
		$scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
			loadContractors();
		});

		$scope.$on('accountsShouldBeRefreshed', function(oParameters) {
			loadContractors();
		});

		$scope.$on("$destroy", function() {
			historyProvider.addStateToHistory({
				sStateName: $scope.sCurrentStateName,
				oStateParams: $scope.oStateParams
			});
		});		
	}
]);