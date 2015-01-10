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

		var constructPhasesMultiSelect = function(aSelectedPhases) {
			$scope.aUserProjectsPhasesForMultiselect = servicesProvider.constructUserProjectsPhasesForMultiSelect({
				aSelectedPhases: aSelectedPhases
			});
		};

		var setDisplayedContractorDetails = function(oContractor) {
			var aContractorPhasesGuids = [];
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
			for (var i = 0; i < $scope.oContractor._aPhases.length; i++) {
				aContractorPhasesGuids.push($scope.oContractor._aPhases[i].Guid);
			}
			constructPhasesMultiSelect(aContractorPhasesGuids);

			oContractorWrapper.aData.push($scope.oContractor);
		};

		var oContractor = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oAccountEntity",
			sRequestSettings: "GeneralAttributes/IsDeleted eq false" + "PhaseDetails", //filter + expand
			sKeyName: "Guid",
			sKeyValue: $stateParams.sContractorGuid
		});

		var onContractorDetailsLoaded = function(oData) {
			setDisplayedContractorDetails(oData);
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
			}
		} else {
			constructPhasesMultiSelect({
				aSelectedPhases: []
			});
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

		var prepareLinksForSave = function() { // link contractor to phases
			var aLinks = [{
				sRelationName: "PhaseDetails",
				bKeepCompanyDependentLinks: true,
				aUri: []
			}];
			for (var i = 0; i < $scope.aUserProjectsPhasesForMultiselect.length; i++) {
				if ($scope.aUserProjectsPhasesForMultiselect[i].ticked) {
					sUri = "Phases('" + $scope.aUserProjectsPhasesForMultiselect[i].Guid + "')";
					aLinks[0].aUri.push(sUri);
				}
			}
			return aLinks;
		};

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

			aLinks = prepareLinksForSave();
			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateAccount({
						bShowSpinner: true,
						sKey: oDataForSave.Guid,
						oData: oDataForSave,
						aLinks: aLinks,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessUpdate
					});
					break;
				case "create":
					apiProvider.createAccount({
						bShowSpinner: true,
						oData: oDataForSave,
						aLinks: aLinks,
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