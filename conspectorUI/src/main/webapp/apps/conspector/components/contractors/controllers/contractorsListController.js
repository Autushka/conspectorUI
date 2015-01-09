viewControllers.controller('contractorsListView', ['$scope', '$state', 'servicesProvider', '$translate', 'apiProvider',
	function($scope, $state, servicesProvider, $translate, apiProvider) {
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
			}
		});

		// var onCompaniesLoaded = function(aData) {
		// 	for (var i = 0; i < oUsersListData.aData.length; i++) {
		// 		oUsersListData.aData[i].sCompanies = "";
		// 		for (var j = 0; j < oUsersListData.aData[i]._companyDetails.results.length; j++) {
		// 			for (var k = 0; k < aData.length; k++) {
		// 				if (oUsersListData.aData[i]._companyDetails.results[j].CompanyName === aData[k].CompanyName) {
		// 					oUsersListData.aData[i].sCompanies = oUsersListData.aData[i].sCompanies + aData[k].CompanyName + "; ";
		// 					break;
		// 				}
		// 			}
		// 		}
		// 	}
		// };

		// var onRolesLoaded = function(aData) {
		// 	for (var i = 0; i < oUsersListData.aData.length; i++) {
		// 		oUsersListData.aData[i].sRoles = "";
		// 		for (var j = 0; j < oUsersListData.aData[i]._roleDetails.results.length; j++) {
		// 			for (var k = 0; k < aData.length; k++) {
		// 				if (oUsersListData.aData[i]._roleDetails.results[j].Guid === aData[k].Guid) {
		// 					oUsersListData.aData[i].sRoles = oUsersListData.aData[i].sRoles + aData[k].RoleName + "; ";
		// 					break;
		// 				}
		// 			}
		// 		}
		// 	}
		// };

		var onContractorsLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				oContractorsListData.aData.push({
					sContractorName: aData[i].Name,
					sPhone: aData[i].MainPhone,
					sEmail: aData[i].Email,
					_guid: aData[i].Guid
				});
			}

			$scope.tableParams.reload();

			// var bMatchFound = false;

			// for (var i = 0; i < aData.length; i++) {
			// 	if (cacheProvider.oUserProfile.sCurrentRole !== CONSTANTS.sGlobalAdministatorRole) {
			// 		bMatchFound = false;
			// 		for (var j = 0; j < aData[i].CompanyDetails.results.length; j++) {
			// 			if (aData[i].CompanyDetails.results[j].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
			// 				bMatchFound = true;
			// 				break;
			// 			}
			// 		}

			// 		if (!bMatchFound) {
			// 			continue;
			// 		} else {
			// 			bMatchFound = false;
			// 			for (var j = 0; j < aData[i].RoleDetails.results.length; j++) {
			// 				if (aData[i].RoleDetails.results[j].RoleName === CONSTANTS.sGlobalAdministatorRole && aData[i].UserName !== cacheProvider.oUserProfile.sUserName) {
			// 					bMatchFound = true;
			// 					break;
			// 				}
			// 			}

			// 			if (bMatchFound) {
			// 				continue;
			// 			}
			// 		}
			// 	}

			// 	oUsersListData.aData.push({
			// 		userName: aData[i].UserName,
			// 		email: aData[i].EMail,
			// 		_roleDetails: aData[i].RoleDetails,
			// 		_companyDetails: aData[i].CompanyDetails,
			// 		_lastModifiedAt: aData[i].LastModifiedAt,
			// 		roles: ""
			// 	});
			// }
			// $scope.tableParams.reload();

			// apiProvider.getCompanies({
			// 	bShowSpinner: false,
			// 	onSuccess: onCompaniesLoaded
			// });

			// apiProvider.getRoles({
			// 	bShowSpinner: false,
			// 	onSuccess: onRolesLoaded
			// });
		}

		apiProvider.getContractorsWithPhases({
			bShowSpinner: true,
			onSuccess: onContractorsLoaded
		});

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
	}
]);