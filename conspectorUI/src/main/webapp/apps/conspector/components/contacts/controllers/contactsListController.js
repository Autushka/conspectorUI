viewControllers.controller('contactsListView', ['$scope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider',
	function($scope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider) {
		$scope.actionsTE = $translate.instant('global_actions'); //need TE for ngTable columns headers
		$scope.nameTE = $translate.instant('global_name');
		$scope.titleTE = $translate.instant('global_title');		
		$scope.phoneTE = $translate.instant('global_phone');
		$scope.emailTE = $translate.instant('global_email');

		var oContactsListData = {
			aData: []
		};

		$scope.tableParams = servicesProvider.createNgTable({
			oInitialDataArrayWrapper: oContactsListData,
			sDisplayedDataArrayName: "aDisplayedContacts",
			oInitialSorting: {
				sContactName: 'asc'
			}
		});

		//alert($stateParams.sContractorGuid);

		var onContactsLoaded = function(aData) {
			// var sProjectName = "";
			// var sPhaseName = "";
			// var bMatchFound = false;
			// for (var i = 0; i < aData.length; i++) {
			// 	for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
			// 		bMatchFound = false;
			// 		for (var k = 0; k < cacheProvider.oUserProfile.aGloballySelectedPhasesGuids.length; k++) {
			// 			if(aData[i].PhaseDetails.results[j].Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]){
			// 				bMatchFound = true;
			// 				break;
			// 			}
			// 		}
			// 		if(!bMatchFound){
			// 			continue;
			// 		}

			// 		sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].ProjectDetails.NameEN : aData[i].PhaseDetails.results[j].ProjectDetails.NameFR;
			// 		if(!sProjectName){
			// 			sProjectName = aData[i].PhaseDetails.results[j].ProjectDetails.NameEN;
			// 		}
			// 		sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].NameEN : aData[i].PhaseDetails.results[j].NameFR;
			// 		if(!sPhaseName){
			// 			sPhaseName = aData[i].PhaseDetails.results[j].NameEN;
			// 		}					

			// 		oContactsListData.aData.push({
			// 			sContractorName: aData[i].Name,
			// 			sPhone: aData[i].MainPhone,
			// 			sEmail: aData[i].Email,
			// 			_guid: aData[i].Guid,
			// 			sProjectPhase: sProjectName + " - " + sPhaseName
			// 		});
			// 	}
			// }

			$scope.tableParams.reload();
		};

		var loadContacts = function(){
			oContactsListData.aData = [];
			apiProvider.getAccountContacts({
				bShowSpinner: true,
				onSuccess: onContactsLoaded
			});
		};

		//loadContacts();//load Contacts

		$scope.onDisplay = function(oContractor) {
			// $state.go('app.contractorDetails', {
			// 	sMode: "display",
			// 	sContractorGuid: oContractor._guid,
			// 	sFromState: "app.contractorsList"
			// });
		};

		$scope.onEdit = function(oContractor) {
			// $state.go('app.contractorDetails', {
			// 	sMode: "edit",
			// 	sContractorGuid: oContractor._guid,
			// 	sFromState: "app.contractorsList"
			// });
		};

		$scope.onAddNew = function() {
			// $state.go('app.contractorDetails', {
			// 	sMode: "create",
			// 	sContractorGuid: "",
			// 	sFromState: "app.contractorsList"
			// });
		};
		// $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
		// 	loadContacts();
		// });

		// $scope.$on('accountsShouldBeRefreshed', function(oParameters) {
		// 	loadContacts();
		// });
	}
]);