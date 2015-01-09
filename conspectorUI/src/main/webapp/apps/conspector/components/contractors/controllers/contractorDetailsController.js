viewControllers.controller('contractorDetailsView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS) {
		var sContractorGuid = $stateParams.sContractorGuid;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		// $scope.sGlobalAdministratorRole = CONSTANTS.sGlobalAdministatorRole;
		// $scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.sMode = $stateParams.sMode;
		$scope.oContractor = {
			_aPhases: [],
		};

		var oContractorWrapper = {
			aData: []
		};

		$scope.aPhases = [];

		var setDisplayedContractorDetails = function(oContractor) {
			$scope.oContractor._guid = oContractor.Guid;
			$scope.oContractor._lastModifiedAt = oContractor.LastModifiedAt;
			$scope.oContractor.sName = oContractor.Name;
			$scope.oContractor.sPhone = oContractor.MainPhone;
			$scope.oContractor.sSecondaryPhone = oContractor.SecondaryPhone;
			$scope.oContractor.sWebsite = oContractor.Website;
			$scope.oContractor.sEmail = oContractor.Email;
			$scope.oContractor.sFax = oContractor.Fax;

			$scope.oContractor.sCreatedAt = utilsProvider.dBDateToSting(oContractor.CreatedAt);
			$scope.oContractor.sLastModifiedAt = utilsProvider.dBDateToSting(oContractor.LastModifiedAt);

			$scope.oContractor._aPhases = angular.copy(oContractor.PhaseDetails.results);

			oContractorWrapper.aData.push($scope.oContractor);
		};

		var oContractor = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oAccountEntity",
			sRequestSettings: "GeneralAttributes/IsDeleted eq false" + "PhaseDetails", //filter + expand
			sKeyName: "Guid",
			sKeyValue: $stateParams.sContractorGuid
		});

		// var onCompaniesLoaded = function(aData) {
		// 	//Sort aData by company sorting sequence 
		// 	for (var i = 0; i < aData.length; i++) {
		// 		aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
		// 	}
		// 	aData = $filter('orderBy')(aData, ["_sortingSequence"]);

		// 	var aUserCompaniesKeys = [];

		// 	for (var i = 0; i < $scope.oUser._aCompanies.length; i++) {
		// 		aUserCompaniesKeys.push($scope.oUser._aCompanies[i].CompanyName);
		// 	}

		// 	servicesProvider.constructDependentMultiSelectArray({
		// 		oDependentArrayWrapper: {
		// 			aData: aData
		// 		},
		// 		oParentArrayWrapper: oUserWrapper,
		// 		oNewParentItemArrayWrapper: oUserWrapper,
		// 		sNameEN: "CompanyName",
		// 		sNameFR: "CompanyName",
		// 		sDependentKey: "CompanyName",
		// 		aParentKeys: aUserCompaniesKeys,
		// 		sTargetArrayNameInParent: "aCompanies"
		// 	});

		// 	if (oUserWrapper.aData[0]) {
		// 		$scope.aCompanies = angular.copy(oUserWrapper.aData[0].aCompanies);
		// 	}
		// };

		// var onRolesLoaded = function(aData) {
		// 	//Sort aData by role sorting sequence 
		// 	for (var i = 0; i < aData.length; i++) {
		// 		aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
		// 	}
		// 	aData = $filter('orderBy')(aData, ["_sortingSequence"]);

		// 	var aUserRolesKeys = [];

		// 	for (var i = 0; i < $scope.oUser._aRoles.length; i++) {
		// 		aUserRolesKeys.push($scope.oUser._aRoles[i].Guid);
		// 	}

		// 	servicesProvider.constructDependentMultiSelectArray({
		// 		oDependentArrayWrapper: {
		// 			aData: aData
		// 		},
		// 		oParentArrayWrapper: oUserWrapper,
		// 		oNewParentItemArrayWrapper: oUserWrapper,
		// 		sNameEN: "RoleName",
		// 		sNameFR: "RoleName",
		// 		sDependentKey: "Guid",
		// 		aParentKeys: aUserRolesKeys,
		// 		sTargetArrayNameInParent: "aRoles"
		// 	});

		// 	if (oUserWrapper.aData[0]) {
		// 		$scope.aRoles = angular.copy(oUserWrapper.aData[0].aRoles);
		// 	}
		// };

		// var onProjectsLoaded = function(aData) {
		// 	//Sort aData by project sorting sequence and then by phases sorting sequence...
		// 	for (var i = 0; i < aData.length; i++) {
		// 		aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
		// 		for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
		// 			if (aData[i].PhaseDetails.results[j].GeneralAttributes.IsDeleted) { // Filtering on expanded entities doesn't work right now in olingo...
		// 				aData[i].PhaseDetails.results.splice(j, 1);
		// 				break;
		// 			}
		// 			aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
		// 		}
		// 		aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);
		// 	}
		// 	aData = $filter('orderBy')(aData, ["_sortingSequence"]);

		// 	var aUserPhasesGuids = [];

		// 	for (var i = 0; i < $scope.oUser._aPhases.length; i++) {
		// 		aUserPhasesGuids.push($scope.oUser._aPhases[i].Guid);
		// 	}

		// 	servicesProvider.constructDependentMultiSelectArray({
		// 		oDependentArrayWrapper: {
		// 			aData: aData
		// 		},
		// 		sSecondLevelAttribute: "PhaseDetails",
		// 		sSecondLevelNameEN: "NameEN",
		// 		sSecondLevelNameFR: "NameFR",
		// 		oParentArrayWrapper: oUserWrapper,
		// 		oNewParentItemArrayWrapper: oUserWrapper,
		// 		sNameEN: "NameEN",
		// 		sNameFR: "NameFR",
		// 		sDependentKey: "Guid",
		// 		aParentKeys: aUserPhasesGuids,
		// 		sTargetArrayNameInParent: "aPhases"
		// 	});

		// 	if (oUserWrapper.aData[0]) {
		// 		$scope.aPhases = angular.copy(oUserWrapper.aData[0].aPhases);
		// 	}
		// };

		var onContractorDetailsLoaded = function(oData) {
			setDisplayedContractorDetails(oData);

			// apiProvider.getCompanies({
			// 	bShowSpinner: false,
			// 	onSuccess: onCompaniesLoaded
			// });

			// apiProvider.getProjectsWithPhases({
			// 	bShowSpinner: false,
			// 	onSuccess: onProjectsLoaded
			// });

			// apiProvider.getRoles({
			// 	bShowSpinner: false,
			// 	onSuccess: onRolesLoaded
			// });
		};

		var getContractorDetails = function() {
			apiProvider.getContractorWithPhases({
				sKey: sContractorGuid,
				bShowSpinner: true,
				onSuccess: onContractorDetailsLoaded,
			});
		};

		if ($scope.sMode !== "create") {
			if (angular.equals(oContractor, {})) { //in case of F5
				getContractorDetails();
			} else { //in case when data is retrieved from the cash
				setDisplayedContractorDetails(oContractor);
				// apiProvider.getCompanies({
				// 	bShowSpinner: false,
				// 	onSuccess: onCompaniesLoaded
				// });
				// apiProvider.getProjectsWithPhases({
				// 	bShowSpinner: false,
				// 	onSuccess: onProjectsLoaded
				// });
				// apiProvider.getRoles({
				// 	bShowSpinner: false,
				// 	onSuccess: onRolesLoaded
				// });
			}
		} else {
			// $scope.oUser.sAvatarUrl = $window.location.origin + $window.location.pathname + "img/noAvatar.jpg";
			// apiProvider.getCompanies({
			// 	bShowSpinner: false,
			// 	onSuccess: onCompaniesLoaded
			// });
			// apiProvider.getProjectsWithPhases({
			// 	bShowSpinner: false,
			// 	onSuccess: onProjectsLoaded
			// });
			// apiProvider.getRoles({
			// 	bShowSpinner: false,
			// 	onSuccess: onRolesLoaded
			// });
		}

		$scope.onBack = function() {
			if (!$rootScope.sFromState) {
				$state.go('app.contractorsList');
				return;
			}
			$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
		};

		$scope.onEdit = function() {
			$scope.sMode = "edit";
		};


		var deleteContractor = function() {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				//cacheProvider.cleanEntitiesCache("oAccountEntity");
				$state.go('app.contractorsList');
			}
			oDataForSave.Guid = $scope.oContractor._guid;
			oDataForSave.LastModifiedAt = $scope.oContractor._lastModifiedAt;
			apiProvider.updateAccount({
				bShowSpinner: true,
				sKey: oDataForSave.Guid,
				oData: oDataForSave,
				bShowSuccessMessage: true,
				bShowErrorMessage: true,
				onSuccess: onSuccessDelete
			});
		};

		$scope.onDelete = function($event) {
			servicesProvider.showConfirmationPopup({
				sHeader: $translate.instant('contractorDetails_deletionConfirmationHeader'),
				sContent: $translate.instant('ontractorDetails_deletionConfirmationContent'),
				sOk: $translate.instant('global_ok'),
				sCancel: $translate.instant('global_cancel'),
				onOk: deleteContractor,
				event: $event
			});
		};

		// var prepareLinksForSave = function() { // link user to roles and phases
		// 	var aLinks = [{
		// 		sRelationName: "CompanyDetails",
		// 		aUri: []
		// 	}, {
		// 		sRelationName: "RoleDetails",
		// 		bKeepCompanyDependentLinks: true,
		// 		aUri: []
		// 	}, {
		// 		sRelationName: "PhaseDetails",
		// 		bKeepCompanyDependentLinks: true,
		// 		aUri: []
		// 	}];
		// 	var sUri = "";
		// 	for (var i = 0; i < $scope.aCompanies.length; i++) {
		// 		if ($scope.aCompanies[i].ticked) {
		// 			sUri = "Companys('" + $scope.aCompanies[i].CompanyName + "')";
		// 			aLinks[0].aUri.push(sUri);
		// 		}
		// 	}

		// 	for (var i = 0; i < $scope.aRoles.length; i++) {
		// 		if ($scope.aRoles[i].ticked) {
		// 			sUri = "Roles('" + $scope.aRoles[i].Guid + "')";
		// 			aLinks[1].aUri.push(sUri);
		// 		}
		// 	}

		// 	for (var i = 0; i < $scope.aPhases.length; i++) {
		// 		if ($scope.aPhases[i].ticked) {
		// 			sUri = "Phases('" + $scope.aPhases[i].Guid + "')";
		// 			aLinks[2].aUri.push(sUri);
		// 		}
		// 	}

		// 	return aLinks;
		// };

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		$scope.onSave = function(bSaveAndNew, oNavigateTo) {
			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];

			var onSuccessCreation = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
				}
				if (!bSaveAndNew) {
					$scope.sMode = "display";
					$scope.oContractor._lastModifiedAt = oData.LastModifiedAt;
					$scope.oContractor.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
					$scope.oContractor.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
				} else {
					$scope.oContractor.sName = "";
					$scope.oContractor.sPhone = "";
					$scope.oContractor.sSecondaryPhone = "";
					$scope.oContractor.sWebsite = "";
					$scope.oContractor.sEmail = "";
					$scope.oContractor.sFax = "";
					$scope.oContractor._aPhases = [];
				}
			};
			var onSuccessUpdate = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
				}

				$scope.oContractor._lastModifiedAt = oData.LastModifiedAt;
				$scope.oContractor.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				$scope.sMode = "display";
			};
			oDataForSave.Guid = $scope.oContractor._guid;
			oDataForSave.Name = $scope.oContractor.sName;
			oDataForSave.MainPhone = $scope.oContractor.sPhone;
			oDataForSave.SecondaryPhone = $scope.oContractor.sSecondaryPhone;
			oDataForSave.Website = $scope.oContractor.sWebsite;
			oDataForSave.Email = $scope.oContractor.sEmail;
			oDataForSave.Fax = $scope.oContractor.sFax;
			oDataForSave.LastModifiedAt = $scope.oContractor._lastModifiedAt;

			//aLinks = prepareLinksForSave();
			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateAccount({
						bShowSpinner: true,
						sKey: oDataForSave.Guid,
						oData: oDataForSave,
					//	aLinks: aLinks,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessUpdate
					});
					break;
				case "create":
					apiProvider.createAccount({
						bShowSpinner: true,
						oData: oDataForSave,
						//aLinks: aLinks,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessCreation,
					});
					break;
			}
		};

		$scope.onSaveAndNew = function() {
			$scope.onSave(true);
		};

		var saveAndLeaveView = function() {
			$scope.onSave(false, oNavigateToInfo);
		};

		var leaveView = function() {
			bDataHasBeenModified = false;
			$state.go(oNavigateToInfo.toState, oNavigateToInfo.toParams);
		};

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if (bDataHasBeenModified) {
				event.preventDefault();

				oNavigateToInfo = {
					toState: toState,
					toParams: toParams
				};
				servicesProvider.showConfirmationPopup({
					sHeader: $translate.instant('global_changesSaveConfirmationHeader'), //"Do you want to save changes before leaving the view?", //$translate.instant('userDetails_deletionConfirmationHeader'),
					sContent: $translate.instant('global_changesSaveConfirmationContent'), //"Not saved changes will be lost...", //$translate.instant('userDetails_deletionConfirmationContent'),
					sOk: $translate.instant('global_yes'),
					sCancel: $translate.instant('global_no'),
					onOk: saveAndLeaveView,
					onCancel: leaveView,
					event: event
				});
			}
		});
	}
]);