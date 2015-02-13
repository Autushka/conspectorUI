viewControllers.controller('unitDetailsView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings',
	function($scope, $rootScope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings) {
		var sUnitGuid = $stateParams.sUnitGuid;

		$scope.oForms = {};

		$scope.bShowClients = true;

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oUnit",
			sOperation: "bUpdate"
		});

		$scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oUnit",
			sOperation: "bDelete"
		});


		$scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		$scope.sMode = $stateParams.sMode;

		if ($scope.sMode === "display" || $scope.sMode === "edit") {
			$scope.$parent.bDisplayAttachmentsList = true;
		}

		$scope.oUnit = {
			aDescriptionTags: [],
		};

		var oUnitWrapper = {
			aData: [{
				_clientsGuids: []
			}]
		};

		$scope.aUnitOptionsArrays = [];

		var onUnitOptionSetsLoaded = function(oData) {
			//var bMatchFound = false;
			//aData = $filter('orderBy')(aData, ["Name"]);
			for (var i = 0; i < oData.UnitOptionSetDetails.results.length; i++) {
				oData.UnitOptionSetDetails.results[i]._sortingSequence = oData.UnitOptionSetDetails.results[i].GeneralAttributes.SortingSequence;
				for (var j = 0; j < oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results.length; j++) {
					oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results[j]._sortingSequence = oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results[j].GeneralAttributes.SortingSequence;
				}
				oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results = $filter('orderBy')(oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results, ["_sortingSequence"]);
			}

			oData.UnitOptionSetDetails.results = $filter('orderBy')(oData.UnitOptionSetDetails.results, ["_sortingSequence"]);

			for (var i = 0; i < oData.UnitOptionSetDetails.results.length; i++) {
				//bMatchFound = false;
				$scope.oUnit._unitOptionGuid = "";
				for (var j = 0; j < oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results.length; j++) {
					for (var k = 0; k < $scope.oUnit._unitOptions.length; k++) {
						if (oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results[j].Guid === $scope.oUnit._unitOptions[k].Guid) {
							//bMatchFound = true;
							$scope.oUnit._unitOptionGuid = $scope.oUnit._unitOptions[k].Guid;
							break;
						}
					}
				}

				oUnitWrapper.aData[0] = angular.copy($scope.oUnit);
				
				servicesProvider.constructDependentMultiSelectArray({
					oDependentArrayWrapper: {
						aData: oData.UnitOptionSetDetails.results[i].UnitOptionDetails.results
					},
					oParentArrayWrapper: oUnitWrapper,
					sNameEN: "NameEN",
					sNameFR: "NameFR",
					sDependentKey: "Guid",
					sParentKey: "_unitOptionGuid",
					sTargetArrayNameInParent: "aUnitOptions"
				});
				if (oUnitWrapper.aData[0]) {
					$scope.aUnitOptionsArrays.push({
						sOptionSetName: $translate.use() === "en" ? oData.UnitOptionSetDetails.results[i].NameEN : oData.UnitOptionSetDetails.results[i].NameFR,
						aOptions: oUnitWrapper.aData[0].aUnitOptions
					});
				}
			}
		};

		var getUnitOptionSets = function(sPhaseGuid) {
			apiProvider.getPhase({
				sExpand: "UnitOptionSetDetails/UnitOptionDetails",
				sKey: sPhaseGuid,
				bShowSpinner: false,
				onSuccess: onUnitOptionSetsLoaded
			});
		};

		var constructPhasesMultiSelect = function(aSelectedPhases) {
			$scope.aUserProjectsPhasesForMultiselect = servicesProvider.constructUserProjectsPhasesForMultiSelect({
				aSelectedPhases: aSelectedPhases
			});

			if (aSelectedPhases.length && aSelectedPhases[0]) {
				getUnitOptionSets(aSelectedPhases[0]);
			}
		};

		var setDisplayedUnitDetails = function(oUnit) {
			$scope.oUnit._guid = oUnit.Guid;
			var sProject = "";
			var sPhase = "";

			$rootScope.sFileMetadataSetGuid = oUnit.FileMetadataSetGuid;
			if(oUnit.FileMetadataSetDetails){
				$rootScope.sFileMetadataSetLastModifiedAt = oUnit.FileMetadataSetDetails.LastModifiedAt;
			}			
			$rootScope.$broadcast("FileAttachemntsCanBeLoaded");

			$scope.oUnit._lastModifiedAt = oUnit.LastModifiedAt;

			$scope.oUnit.sName = oUnit.Name;

			if (oUnit.PhaseDetails && oUnit.PhaseDetails.ProjectDetails){
				if(oUnit.PhaseDetails.NameFR && $translate.use() === "fr"){
					sPhase = oUnit.PhaseDetails.NameFR;
				}else{
					sPhase = oUnit.PhaseDetails.NameEN;
				}
				if(oUnit.PhaseDetails.ProjectDetails.NameFR && $translate.use() === "fr"){
					sProject = oUnit.PhaseDetails.ProjectDetails.NameFR;
				}else{
					sProject = oUnit.PhaseDetails.ProjectDetails.NameEN;
				}
			}	
			$scope.oUnit._ProjectAndPhaseName = sProject + " - " + sPhase;

			$scope.oUnit._clientsGuids = [];
			if (oUnit.AccountDetails) {
				
				for (var i = 0; i < oUnit.AccountDetails.results.length; i++) {
					$scope.oUnit._clientsGuids.push(oUnit.AccountDetails.results[i].Guid);
				}
			}

			$scope.oUnit.aDescriptionTags = utilsProvider.tagsStringToTagsArray(oUnit.DescriptionTags);

			$scope.oUnit._unitOptions = angular.copy(oUnit.UnitOptionDetails.results);

			oUnitWrapper.aData[0] = angular.copy($scope.oUnit);
			constructPhasesMultiSelect([oUnit.PhaseGuid]);
		};

		var sRequestSettings = "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + "PhaseDetails/ProjectDetails,UnitOptionDetails";

		sRequestSettings = sRequestSettings + "FileMetadataSetDetails/FileMetadataDetails";
		var oUnit = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oUnitEntity",
			sRequestSettings: sRequestSettings, //filter + expand
			sKeyName: "Guid",
			sKeyValue: sUnitGuid
		});

		var onUnitDetailsLoaded = function(oData) {
			setDisplayedUnitDetails(oData);

			apiProvider.getClients({
				sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
				bShowSpinner: false,
				onSuccess: onClientsLoaded
			});

		};

		var getUnitDetails = function() {
			apiProvider.getUnit({
				sKey: sUnitGuid,
				sExpand: "PhaseDetails/ProjectDetails,UnitOptionDetails,AccountDetails,FileMetadataSetDetails",
				bShowSpinner: true,
				onSuccess: onUnitDetailsLoaded,
			});
		};

		var onClientsLoaded = function(aData) {
			//Sort aData by accountType sorting sequence and then by AccountName
			aData = $filter('orderBy')(aData, ["Name"]);
			
			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oUnitWrapper,
				sNameEN: "Name",
				sNameFR: "Name",
				sDependentKey: "Guid",
				sParentKeys: "_clientsGuids",
				sTargetArrayNameInParent: "aClients"
			});

			if (oUnitWrapper.aData[0]) {
				$scope.aClients = angular.copy(oUnitWrapper.aData[0].aClients);
			}
		};

		if ($scope.sMode !== "create") {
			if (angular.equals(oUnit, {})) { //in case of F5
				getUnitDetails();
			} else { //in case when data is retrieved from the cash
				setDisplayedUnitDetails(oUnit);
				
				apiProvider.getClients({
					sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
					bShowSpinner: false,
					onSuccess: onClientsLoaded
				});
			}
		} else {
			constructPhasesMultiSelect({
				aSelectedPhases: []
			});

			apiProvider.getClients({
				sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
				bShowSpinner: false,
				onSuccess: onClientsLoaded
			});
		}

		$scope.onEdit = function() {
			$state.go('app.unitDetailsWrapper.unitDetails', {
				sMode: "edit",
				sUnitGuid: $scope.oUnit._guid,
			});
		};

		var deleteUnit = function() {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				historyProvider.navigateBack({
					oState: $state
				});
			};
			oDataForSave.Guid = $scope.oUnit._guid;
			oDataForSave.LastModifiedAt = $scope.oUnit._lastModifiedAt;
			apiProvider.updateUnit({
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
				sHeader: $translate.instant('unitDetails_deletionConfirmationHeader'),
				sContent: $translate.instant('unitDetails_deletionConfirmationContent'),
				sOk: $translate.instant('global_ok'),
				sCancel: $translate.instant('global_cancel'),
				onOk: deleteUnit,
				event: $event
			});
		};

		var prepareLinksForSave = function() { // link unit to phases
			var aLinks = [];
			var aUri = [];
			var sUri = "";
			for (var i = 0; i < $scope.aUnitOptionsArrays.length; i++) {
				if ($scope.aUnitOptionsArrays[i].aSelectedOption.length) {
					sUri = "UnitOptions('" + $scope.aUnitOptionsArrays[i].aSelectedOption[0].Guid + "')";
					aUri.push(sUri);
				}
			}
			if (aUri.length) {
				aLinks.push({
					sRelationName: "UnitOptionDetails",
					bKeepCompanyDependentLinks: true,
					aUri: aUri
				});
			}

			var aUri = [];
			if ($scope.aSelectedClients && $scope.aSelectedClients.length) {
				for (var i = 0; i < $scope.aSelectedClients.length; i++) {
					sUri = "Accounts('" + $scope.aSelectedClients[i].Guid + "')";
					aUri.push(sUri);
				}
			}

			aLinks.push({
				sRelationName: "AccountDetails",
				bKeepCompanyDependentLinks: true,
				aUri: aUri
			});
			
			return aLinks;
		};

		$scope.onCloseCheckSelectedPhasesLength = function() {
			if ($scope.aSelectedPhases.length == 0)
				$scope.onSelectedPhasesModified();
		};

		$scope.onSelectedPhasesModified = function() {
			$scope.onDataModified();
			$scope.oForms.unitDetailsForm.selectedPhases.$setDirty();
		};

		// $scope.onCloseCheckSelectedClientsLength = function() {
		// 	if ($scope.aSelectedClients.length == 0)
		// 		$scope.onSelectedClientsModified();
		// };

		$scope.onSelectedClientsModified = function() {
			$scope.onDataModified();
			// $scope.oForms.unitDetailsForm.selectedClients.$setDirty();

			if ($scope.aSelectedPhases[0]) {
				getUnitOptionSets($scope.aSelectedPhases[0].Guid);
			}
		};

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		$scope.onSave = function(bSaveAndNew, oNavigateTo) {
			if ($scope.oForms.unitDetailsForm.selectedPhases) {
				$scope.oForms.unitDetailsForm.selectedPhases.$setDirty(); //to display validation messages on submit press
			}

			if ($scope.oForms.unitDetailsForm.unitName) {
				$scope.oForms.unitDetailsForm.unitName.$setDirty(); //to display validation messages on submit press
			}
			if (!$scope.oForms.unitDetailsForm.$valid) {
				return;
			}

			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];

			oDataForSave.Guid = $scope.oUnit._guid;
			var onSuccessCreation = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return;
				}
				if (!bSaveAndNew) {
					$state.go('app.unitDetailsWrapper.unitDetails', {
						sMode: "display",
						sUnitGuid: oData.Guid
					});

					$scope.oUnit._lastModifiedAt = oData.LastModifiedAt;
					$scope.oUnit.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
					$scope.oUnit.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
					$scope.oUnit._guid = oData.Guid;
				} else {
					$scope.oUnit.aDescriptionTags = [];
				}
			};
			var onSuccessUpdate = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return;
				}

				$scope.oUnit._lastModifiedAt = oData.LastModifiedAt;
				$scope.oUnit.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);

				$state.go('app.unitDetailsWrapper.unitDetails', {
					sMode: "display",
					sUnitGuid: oData.Guid
				});
			};

			oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oUnit.aDescriptionTags);

			if ($scope.aSelectedPhases.length) {
				oDataForSave.PhaseGuid = $scope.aSelectedPhases[0].Guid;
			}

			oDataForSave.Name = $scope.oUnit.sName;

			aLinks = prepareLinksForSave();
			oDataForSave.LastModifiedAt = $scope.oUnit._lastModifiedAt;

			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateUnit({
						bShowSpinner: true,
						sKey: oDataForSave.Guid,
						aLinks: aLinks,
						oData: oDataForSave,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessUpdate
					});
					break;
				case "create":
					apiProvider.createUnit({
						bShowSpinner: true,
						aLinks: aLinks,
						oData: oDataForSave,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessCreation,
					});
					break;
			}
		};

		$scope.onBack = function() {
			historyProvider.navigateBack({
				oState: $state
			});
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