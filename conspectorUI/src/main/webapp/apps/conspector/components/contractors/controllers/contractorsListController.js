viewControllers.controller('contractorsListView', ['$scope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider',
	function($scope, $state, servicesProvider, $translate, apiProvider, cacheProvider) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.contractorNameTE = $translate.instant('global_contractorName');
		$scope.phoneTE = $translate.instant('global_phone');
		$scope.emailTE = $translate.instant('global_email');
		$scope.tagsTE = $translate.instant('global_tags');

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
					bMatchFound = false;
					for (var k = 0; k < cacheProvider.oUserProfile.aGlobalSelectedPhasesGuids.length; k++) {
						if(aData[i].PhaseDetails.results[j].Guid === cacheProvider.oUserProfile.aGlobalSelectedPhasesGuids[k]){
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
						sProjectPhase: sProjectName + " - " + sPhaseName
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
			$state.go('app.contractorDetails', {
				sMode: "display",
				sContractorGuid: oContractor._guid,
				sFromState: "app.contractorsList"
			});
		};

		$scope.onEdit = function(oContractor) {
			$state.go('app.contractorDetails', {
				sMode: "edit",
				sContractorGuid: oContractor._guid,
				sFromState: "app.contractorsList"
			});
		};

		$scope.onAddNew = function() {
			$state.go('app.contractorDetails', {
				sMode: "create",
				sContractorGuid: "",
				sFromState: "app.contractorsList"
			});
		};

		$scope.$on('dataShouldBeRefreshed', function(oParameters) {
			loadContractors();
		});		
	}
]);