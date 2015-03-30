viewControllers.controller('deficiencyDetailsView', ['$scope', '$location', '$anchorScroll', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout',
	function($scope, $location, $anchorScroll, $rootScope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout) {
		// the element you wish to scroll to.
		$location.hash('top');
		// call $anchorScroll()
		$anchorScroll();

		var sDeficiencyGuid = $stateParams.sDeficiencyGuid;

		$scope.oForms = {};
		$scope.sTaskTypeGuid = "";
		$scope.sTaskType = "";
		$scope.sTaskPriority = "";
		$scope.sTaskPriorityGuid = "";
		$scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

		$scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: $scope.sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bUpdate"
		});

		$scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: $scope.sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bDelete"
		});

		$scope.aUnits = [];

		$scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;

		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		if ($rootScope.sCurrentStateName === "app.deficiencyDetailsWrapper.deficiencyDetails") {
			$scope.sTaskType = "Deficiency";
			//$scope.sTaskPriority = "Normal";
		}

		$rootScope.sMode = $stateParams.sMode;

		if ($rootScope.sMode === "create") {
			$rootScope.sFileMetadataSetGuid = "";
			$rootScope.sFileMetadataSetLastModifiedAt = "";
			$rootScope.sCommentSetGuid = "";
			$rootScope.sCommentSetLastModifiedAt = "";
		}

		$scope.oDeficiency = {};


		$scope.oContractors = {};
		$scope.oContractors.aContractors = [];
		$scope.oContractors.aSelectedContractors = [];

		var oDeficiencyWrapper = {
			aData: [{
				_contractorsGuids: []
			}]
		};

		var onUnitsLoaded = function(aData) {

			for (var i = 0; i < aData.length; i++) {
				aData[i].Name = utilsProvider.convertStringToInt(aData[i].Name);
			}

			aData = $filter('orderBy')(aData, ["Name"]);

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oDeficiencyWrapper,
				sNameEN: "Name",
				sNameFR: "Name",
				sDependentKey: "Guid",
				sParentKey: "_unitGuid",
				sTargetArrayNameInParent: "aUnits"
			});
			if (oDeficiencyWrapper.aData[0]) {
				$scope.aUnits = angular.copy(oDeficiencyWrapper.aData[0].aUnits);
			}
		};

		var getUnits = function(sPhaseGuid) {
			apiProvider.getUnits({
				sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false and PhaseGuid eq '" + sPhaseGuid + "'",
				bShowSpinner: false,
				onSuccess: onUnitsLoaded
			});
		};

		var constructPhasesMultiSelect = function(aSelectedPhases) {
			$scope.aUserProjectsPhasesForMultiselect = servicesProvider.constructUserProjectsPhasesForMultiSelect({
				aSelectedPhases: aSelectedPhases
			});

			if ($scope.oDeficiency._phaseGuid) {
				getUnits($scope.oDeficiency._phaseGuid);
			}
		};

		var setDisplayedDeficiencyDetails = function(oDeficiency) {
			$rootScope.sCurrentEntityPhaseGuid = oDeficiency.PhaseGuid; //needed for notifications...
			$scope.oDeficiency._guid = oDeficiency.Guid;
			$scope.oDeficiency._lastModifiedAt = oDeficiency.LastModifiedAt;
			var sProject = "";
			var sPhase = "";


			$rootScope.sFileMetadataSetGuid = oDeficiency.FileMetadataSetGuid;
			if (oDeficiency.FileMetadataSetDetails) {
				$rootScope.sFileMetadataSetLastModifiedAt = oDeficiency.FileMetadataSetDetails.LastModifiedAt;
			}
			$rootScope.$broadcast("FileAttachemntsCanBeLoaded");

			$rootScope.sCommentSetGuid = oDeficiency.CommentSetGuid;
			if (oDeficiency.CommentSetDetails) {
				$rootScope.sCommentSetLastModifiedAt = oDeficiency.CommentSetDetails.LastModifiedAt;
			}
			$rootScope.$broadcast("CommentsCanBeLoaded");

			if (oDeficiency.UnitDetails && oDeficiency.UnitDetails.Name) {
				$scope.oDeficiency._unitName = oDeficiency.UnitDetails.Name;
			}

			if (oDeficiency.PhaseDetails && oDeficiency.PhaseDetails.ProjectDetails) {
				if (oDeficiency.PhaseDetails.NameFR && $translate.use() === "fr") {
					sPhase = oDeficiency.PhaseDetails.NameFR;
				} else {
					sPhase = oDeficiency.PhaseDetails.NameEN;
				}
				if (oDeficiency.PhaseDetails.ProjectDetails.NameFR && $translate.use() === "fr") {
					sProject = oDeficiency.PhaseDetails.ProjectDetails.NameFR;
				} else {
					sProject = oDeficiency.PhaseDetails.ProjectDetails.NameEN;
				}
			}
			$scope.oDeficiency._ProjectAndPhaseName = sProject + " - " + sPhase;

			if (oDeficiency.TaskPriorityDetails) {
				if (oDeficiency.TaskPriorityDetails.NameFR && $translate.use() === "fr") {
					$scope.oDeficiency._deficiencyPriority = oDeficiency.TaskPriorityDetails.NameFR;
				} else {
					$scope.oDeficiency._deficiencyPriority = oDeficiency.TaskPriorityDetails.NameEN;
				}
			}

			if (oDeficiency.DueDate && oDeficiency.DueDate != "/Date(0)/") {
				$scope.oDeficiency.sDueDate = utilsProvider.dBDateToSting(oDeficiency.DueDate);
				$scope.oDeficiency.dDueDate = new Date(parseInt(oDeficiency.DueDate.substring(6, oDeficiency.DueDate.length - 2)));
			}

			$scope.oDeficiency.sCreatedAt = utilsProvider.dBDateToSting(oDeficiency.CreatedAt);
			$scope.oDeficiency.sLastModifiedAt = utilsProvider.dBDateToSting(oDeficiency.LastModifiedAt);

			$scope.oDeficiency.aDescriptionTags = utilsProvider.tagsStringToTagsArray(oDeficiency.DescriptionTags);
			$scope.oDeficiency.aLocationTags = utilsProvider.tagsStringToTagsArray(oDeficiency.LocationTags);

			$scope.oDeficiency.sDescription = oDeficiency.Description;

			$scope.oDeficiency._phaseGuid = oDeficiency.PhaseGuid;

			$scope.oDeficiency._deficiencyStatusGuid = oDeficiency.TaskStatusGuid;
			$scope.oDeficiency._taskTypeGuid = oDeficiency.TaskTypeGuid;
			$scope.oDeficiency._taskPriorityGuid = oDeficiency.TaskPriorityGuid;
			$scope.oDeficiency._assignedUserName = oDeficiency.UserName;
			$scope.oDeficiency._unitGuid = oDeficiency.UnitGuid;
			var aImages = [];
			var iImagesNumber = 0;
			if (oDeficiency.FileMetadataSetDetails) {
				if (oDeficiency.FileMetadataSetDetails.FileMetadataDetails) {
					for (var j = 0; j < oDeficiency.FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
						if (oDeficiency.FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType) {
							if (oDeficiency.FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && oDeficiency.FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false) {
								aImages.push(oDeficiency.FileMetadataSetDetails.FileMetadataDetails.results[j]);
							}
						}
					}
				}
				iImagesNumber = aImages.length;
			}
			var iCommentsNumber = 0;
			if (oDeficiency.CommentSetDetails) {
				if (oDeficiency.CommentSetDetails.CommentDetails) {
					for (var j = 0; j < oDeficiency.CommentSetDetails.CommentDetails.results.length; j++) {
						if (!oDeficiency.CommentSetDetails.CommentDetails.results[j].GeneralAttributes.IsDeleted) {
							iCommentsNumber++;
						}
					}
				}
			}

			$rootScope._aImages = angular.copy(aImages);
			$rootScope.iImagesNumber = iImagesNumber;
			$rootScope.iCommentsNumber = iCommentsNumber;

			//$scope.oDeficiency._contractorsGuids = [];
			$scope.oContractors.aSelectedContractors = [];
			if (oDeficiency.AccountDetails) {
				for (var i = 0; i < oDeficiency.AccountDetails.results.length; i++) {
					$scope.oContractors.aSelectedContractors.push({
						sName: oDeficiency.AccountDetails.results[i].Name,
						sCleanedName: utilsProvider.replaceSpecialChars(oDeficiency.AccountDetails.results[i].Name),
						sGuid: oDeficiency.AccountDetails.results[i].Guid
					});
					//$scope.oDeficiency._contractorsGuids.push(oDeficiency.AccountDetails.results[i].Guid);
				}
			}

			oDeficiencyWrapper.aData[0] = angular.copy($scope.oDeficiency);
			constructPhasesMultiSelect([$scope.oDeficiency._phaseGuid]);
		};

		var sRequestSettings = "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false";

		sRequestSettings = sRequestSettings + "PhaseDetails/ProjectDetails,TaskStatusDetails,TaskPriorityDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails,CommentSetDetails/CommentDetails";
		var oDeficiency = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oDeficiencyEntity",
			sRequestSettings: sRequestSettings, //filter + expand
			sKeyName: "Guid",
			sKeyValue: sDeficiencyGuid
		});

		var onTaskTypesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				if (aData[i].NameEN === $scope.sTaskType) {
					$scope.sTaskTypeGuid = aData[i].Guid;
					break;
				}
			}
		};

		var onTaskPrioritiesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			if ($rootScope.sMode === 'create' && aData.length) {
				oDeficiencyWrapper.aData[0]._taskPriorityGuid = aData[0].Guid;
			}

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oDeficiencyWrapper,
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sSelected: "selected",
				sDependentKey: "Guid",
				sParentKey: "_taskPriorityGuid",
				sTargetArrayNameInParent: "aTaskPriorities"
			});

			if (oDeficiencyWrapper.aData[0]) {
				$scope.aTaskPriorities = angular.copy(oDeficiencyWrapper.aData[0].aTaskPriorities);
			}
		};

		var onDeficiencyStatusesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);
			var aTaskStatuses = [];
			for (var i = 0; i < aData.length; i++) {
				if (aData[i].NameEN != "Done by Contractor" && aData[i].NameEN != "In Progress" && aData[i].NameEN != "Non Conform" && cacheProvider.oUserProfile.sCurrentRole === "contractor") {
					continue;
				}
				aTaskStatuses.push(aData[i]);
			}

			if ($rootScope.sMode === 'create' && aTaskStatuses.length) {
				oDeficiencyWrapper.aData[0]._deficiencyStatusGuid = aTaskStatuses[0].Guid;
			}

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aTaskStatuses
				},
				oParentArrayWrapper: oDeficiencyWrapper,
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sDependentKey: "Guid",
				sParentKey: "_deficiencyStatusGuid",
				sDependentIconKey: "AssociatedIconFileGuid",
				sTargetArrayNameInParent: "aDeficiencyStatuses"
			});
			if (oDeficiencyWrapper.aData[0]) {
				$scope.aDeficiencyStatuses = angular.copy(oDeficiencyWrapper.aData[0].aDeficiencyStatuses);
			}
		};

		var onDeficiencyDetailsLoaded = function(oData) {
			setDisplayedDeficiencyDetails(oData);

			apiProvider.getDeficiencyStatuses({
				bShowSpinner: false,
				onSuccess: onDeficiencyStatusesLoaded
			});
			apiProvider.getContractors({
				sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
				bShowSpinner: false,
				onSuccess: onContractorsLoaded
			});
			apiProvider.getTaskTypes({
				bShowSpinner: false,
				onSuccess: onTaskTypesLoaded
			});

			apiProvider.getDeficiencyPriorities({
				bShowSpinner: false,
				onSuccess: onTaskPrioritiesLoaded
			});

			apiProvider.getUsers({
				sExpand: "CompanyDetails",
				bShowSpinner: false,
				onSuccess: onUsersWithCompaniesLoaded
			});

		};

		var getDeficiencyDetails = function() {
			apiProvider.getDeficiency({
				sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,TaskPriorityDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails,CommentSetDetails/CommentDetails",
				sKey: sDeficiencyGuid,
				bShowSpinner: true,
				onSuccess: onDeficiencyDetailsLoaded,
			});
		};

		var onContractorsLoaded = function(aData) {
			aData = $filter('orderBy')(aData, ["Name"]);

			$scope.oContractors.aContractors = [];
			for (var i = 0; i < aData.length; i++) {
				$scope.oContractors.aContractors.push({
					sName: aData[i].Name,
					sCleanedName: utilsProvider.replaceSpecialChars(aData[i].Name),
					sGuid: aData[i].Guid					
				});
			}
		};

		var onUsersWithCompaniesLoaded = function(aData) {
			var aFilteredUser = [];
			//var iFilteredUserIndex = 0;
			var bMatchFound = false;
			for (var i = 0; i < aData.length; i++) {
				for (var j = 0; j < aData[i].CompanyDetails.results.length; j++) {
					if (aData[i].CompanyDetails.results[j].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
						bMatchFound = true;
						if (bMatchFound) {
							aFilteredUser.push(aData[i]);
						}
						break;
					}
				}
				if (!bMatchFound) {
					continue;
				}
			}

			aData = [{}];
			aData = aFilteredUser;

			aData = $filter('orderBy')(aData, ["UserName"]);

			if ($rootScope.sMode === 'create') {
				oDeficiencyWrapper.aData[0]._assignedUserName = cacheProvider.oUserProfile.sUserName;
			}
			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oDeficiencyWrapper,
				sNameEN: "UserName",
				sNameFR: "UserName",
				sDependentKey: "UserName",
				sParentKey: "_assignedUserName",
				sTargetArrayNameInParent: "aUsers"
			});
			if (oDeficiencyWrapper.aData[0]) {
				$scope.aUsers = angular.copy(oDeficiencyWrapper.aData[0].aUsers);
			}
		};

		if ($rootScope.sMode !== "create") {
			if (angular.equals(oDeficiency, {})) { //in case of F5
				getDeficiencyDetails();
			} else { //in case when data is retrieved from the cash
				setDisplayedDeficiencyDetails(oDeficiency);

				apiProvider.getDeficiencyStatuses({
					bShowSpinner: false,
					onSuccess: onDeficiencyStatusesLoaded
				});
				apiProvider.getContractors({
					sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
					bShowSpinner: false,
					onSuccess: onContractorsLoaded
				});

				if ($scope.sTaskType === "Deficiency") {
					apiProvider.getDeficiencyTaskType({
						bShowSpinner: false,
						onSuccess: onTaskTypesLoaded
					});
				}
				if ($scope.sTaskType === "Health and Safety") {
					apiProvider.getHealthAndSafetyTaskType({
						bShowSpinner: false,
						onSuccess: onTaskTypesLoaded
					});
				}

				apiProvider.getDeficiencyPriorities({
					bShowSpinner: false,
					onSuccess: onTaskPrioritiesLoaded
				});

				apiProvider.getUsers({
					sExpand: "CompanyDetails",
					bShowSpinner: false,
					onSuccess: onUsersWithCompaniesLoaded
				});
			}
		} else {
			$rootScope._aImages = [];
			$rootScope.iImagesNumber = 0;
			$rootScope.iCommentsNumber = 0;
			constructPhasesMultiSelect({
				aSelectedPhases: []
			});

			apiProvider.getDeficiencyStatuses({
				bShowSpinner: false,
				onSuccess: onDeficiencyStatusesLoaded
			});

			apiProvider.getContractors({
				sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
				bShowSpinner: false,
				onSuccess: onContractorsLoaded
			});

			apiProvider.getDeficiencyPriorities({
				bShowSpinner: false,
				onSuccess: onTaskPrioritiesLoaded
			});

			apiProvider.getUsers({
				sExpand: "CompanyDetails",
				bShowSpinner: false,
				onSuccess: onUsersWithCompaniesLoaded
			});

			if ($scope.sTaskType === "Deficiency") {
				apiProvider.getDeficiencyTaskType({
					bShowSpinner: false,
					onSuccess: onTaskTypesLoaded
				});
			}
			if ($scope.sTaskType === "Health and Safety") {
				apiProvider.getHealthAndSafetyTaskType({
					bShowSpinner: false,
					onSuccess: onTaskTypesLoaded
				});
			}
		}

		$scope.onEdit = function() {
			$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
				sMode: "edit",
				sDeficiencyGuid: $scope.oDeficiency._guid,
			});
		};

		$scope.onNavigateToUnitDetails = function() {
			if ($scope.sCurrentRole != 'contractor') {
				$state.go('app.unitDetailsWrapper.unitDetails', {
					sMode: "display",
					sUnitGuid: $scope.oDeficiency._unitGuid,
				});
			}
		};

		var deleteDeficiency = function() {
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
			oDataForSave.Guid = $scope.oDeficiency._guid;
			oDataForSave.LastModifiedAt = $scope.oDeficiency._lastModifiedAt;
			apiProvider.updateDeficiency({
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
				sHeader: $translate.instant('deficiencyDetails_deletionConfirmationHeader'),
				sContent: $translate.instant('deficiencyDetails_deletionConfirmationContent'),
				sOk: $translate.instant('global_ok'),
				sCancel: $translate.instant('global_cancel'),
				onOk: deleteDeficiency,
				event: $event
			});
		};

		var prepareLinksForSave = function() { // link contact to phases
			var aLinks = [];
			var aUri = [];
			var sUri = "";

			if ($scope.oContractors.aSelectedContractors && $scope.oContractors.aSelectedContractors.length) {
				for (var i = 0; i < $scope.oContractors.aSelectedContractors.length; i++) {
					sUri = "Accounts('" + $scope.oContractors.aSelectedContractors[i].sGuid + "')";
					aUri.push(sUri);
					$scope.sAccountValues = $scope.sAccountValues + $scope.oContractors.aSelectedContractors[i].sName + "; ";
					$scope.sAccountGuids = $scope.sAccountGuids + $scope.oContractors.aSelectedContractors[i].sGuid + "; ";
				}
			}

			aLinks.push({
				sRelationName: "AccountDetails",
				bKeepCompanyDependentLinks: true,
				aUri: aUri
			});

			return aLinks;
		};

		$scope.onCloseCheckSelectedTaskPrioritiesLength = function() {
			if ($scope.aSelectedTaskPriorities.length == 0)
				$scope.onSelectedTaskPrioritiesModified();
		};

		$scope.onSelectedContractorsModified = function() {
			$scope.onDataModified();
		};

		$scope.onDescriptionChanged = function() {
			$scope.onDataModified();
		};

		$scope.onDueDateChanged = function() {
			$scope.onDataModified();
		};

		$scope.onSelectedTaskPrioritiesModified = function() {
			$scope.onDataModified();
			$scope.oForms.deficiencyDetailsForm.selectedTaskPriorities.$setDirty();
		};

		$scope.onCloseCheckSelectedPhasesLength = function() {
			if ($scope.aSelectedPhases.length == 0)
				$scope.onSelectedPhasesModified();
		};

		$scope.onSelectedPhasesModified = function() {
			$scope.onDataModified();
			$scope.oForms.deficiencyDetailsForm.selectedPhases.$setDirty();

			if ($scope.aSelectedPhases[0]) {
				getUnits($scope.aSelectedPhases[0].Guid);
			}
		};

		$scope.onCloseCheckSelectedStatusesLength = function() {
			if ($scope.aSelectedStatuses.length == 0)
				$scope.onSelectedStatusesModified();
		};

		$scope.onSelectedStatusesModified = function() {
			$scope.onDataModified();
			$scope.oForms.deficiencyDetailsForm.selectedStatuses.$setDirty();
		};

		$scope.onDataModified = function() {
			$rootScope.bDataHasBeenModified = true;
		};

		$scope.onSave = function(bSaveAndNew, oNavigateTo) {
			// if(!$rootScope.bDataHasBeenModified){
			// 	return;
			// }


			if ($scope.oForms.deficiencyDetailsForm.selectedTaskTypes) {
				$scope.oForms.deficiencyDetailsForm.selectedTaskTypes.$setDirty(); //to display validation messages on submit press
			}
			if ($scope.oForms.deficiencyDetailsForm.selectedTaskPriorities) {
				$scope.oForms.deficiencyDetailsForm.selectedTaskPriorities.$setDirty(); //to display validation messages on submit press
			}
			if ($scope.oForms.deficiencyDetailsForm.selectedPhases) {
				$scope.oForms.deficiencyDetailsForm.selectedPhases.$setDirty(); //to display validation messages on submit press
			}
			if ($scope.oForms.deficiencyDetailsForm.selectedStatuses) {
				$scope.oForms.deficiencyDetailsForm.selectedStatuses.$setDirty(); //to display validation messages on submit press
			}
			if ($scope.oForms.deficiencyDetailsForm.selectedUser) {
				$scope.oForms.deficiencyDetailsForm.selectedUser.$setDirty(); //to display validation messages on submit press
			}
			if ($scope.oForms.deficiencyDetailsForm.selectedUnits) {
				$scope.oForms.deficiencyDetailsForm.selectedUnits.$setDirty(); //to display validation messages on submit press
			}
			if (!$scope.oForms.deficiencyDetailsForm.$valid) {
				return;
			}

			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];
			// var aInterestedUsers = [];

			oDataForSave.Guid = $scope.oDeficiency._guid;
			var onSuccessCreation = function(oData) {
				$rootScope.bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return;
				}
				if (!bSaveAndNew) {
					$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
						sMode: "display",
						sDeficiencyGuid: oData.Guid
					});

					$scope.oDeficiency._lastModifiedAt = oData.LastModifiedAt;
					$scope.oDeficiency.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
					$scope.oDeficiency.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
					if (oData.DueDate) {
						$scope.oDeficiency.sDueDate = utilsProvider.dBDateToSting(oData.DueDate);
					}
					$scope.oDeficiency._guid = oData.Guid;
				} else {
					$scope.oDeficiency.aDescriptionTags = [];
					$scope.oDeficiency.aLocationTags = [];
					$scope.oDeficiency.sDescription = "";
					$scope.oDeficiency.dDueDate = "/Date(0)/";
				}

				var onInterestedUsersLoaded = function(aData) {
					apiProvider.logEvents({
						aData: aData,
					});
				};
				apiProvider.getInterestedUsers({
					sEntityName: "deficiency",
					sOperationNameEN: CONSTANTS.newDeficiencyEN,
					sOperationNameFR: CONSTANTS.newDeficiencyFR,
					//sEntityGuid: oData.Guid,
					aData: [{
						Guid: oData.Guid
					}],
					onSuccess: onInterestedUsersLoaded
				});
			};
			var onSuccessUpdate = function(oData) {
				$rootScope.bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return;
				}

				$scope.oDeficiency._lastModifiedAt = oData.LastModifiedAt;
				$scope.oDeficiency.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);

				$state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
					sMode: "display",
					sDeficiencyGuid: oData.Guid
				});

				var onInterestedUsersLoaded = function(aData) {
					apiProvider.logEvents({
						aData: aData,
					});
				};
				apiProvider.getInterestedUsers({
					sEntityName: "deficiency",
					sOperationNameEN: CONSTANTS.updatedDeficiencyEN,
					sOperationNameFR: CONSTANTS.updatedDeficiencyFR,
					//sEntityGuid: oData.Guid,
					aData: [{
						Guid: oData.Guid
					}],
					onSuccess: onInterestedUsersLoaded
				});
			};

			oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oDeficiency.aDescriptionTags);
			oDataForSave.LocationTags = utilsProvider.tagsArrayToTagsString($scope.oDeficiency.aLocationTags);
			oDataForSave.Description = $scope.oDeficiency.sDescription;



			if ($scope.oDeficiency.dDueDate && $scope.oDeficiency.dDueDate != "/Date(0)/") {
				oDataForSave.DueDate = "/Date(" + $scope.oDeficiency.dDueDate.getTime() + ")/";
			} else {
				oDataForSave.DueDate = "/Date(0)/";
			}

			oDataForSave.TaskTypeGuid = $scope.sTaskTypeGuid;

			if ($scope.aSelectedTaskPriorities.length) {
				oDataForSave.TaskPriorityGuid = $scope.aSelectedTaskPriorities[0].Guid;
			}
			if ($scope.aSelectedPhases.length) {
				oDataForSave.PhaseGuid = $scope.aSelectedPhases[0].Guid;
			}
			if ($scope.aSelectedStatuses.length) {
				oDataForSave.TaskStatusGuid = $scope.aSelectedStatuses[0].Guid;
			}
			if ($scope.aSelectedUser.length) {
				oDataForSave.UserName = $scope.aSelectedUser[0].UserName;
			}
			if ($scope.aSelectedUnits.length) {
				oDataForSave.UnitGuid = $scope.aSelectedUnits[0].Guid;
			}

			$scope.sAccountValues = "";
			$scope.sAccountGuids = "";
			aLinks = prepareLinksForSave();
			// aInterestedUsers = prepareInterestedUsersForSave();
			oDataForSave.AccountValues = $scope.sAccountValues;
			oDataForSave.AccountGuids = $scope.sAccountGuids;
			oDataForSave.LastModifiedAt = $scope.oDeficiency._lastModifiedAt;

			switch ($rootScope.sMode) {
				case "edit":
					apiProvider.updateDeficiency({
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
					if ($rootScope.sFileMetadataSetGuid) {
						oDataForSave.FileMetadataSetGuid = $rootScope.sFileMetadataSetGuid;
					}
					if ($rootScope.sCommentSetGuid) {
						oDataForSave.CommentSetGuid = $rootScope.sCommentSetGuid;
					}
					apiProvider.createDeficiency({
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

		$scope.onDisplayPhotoGallery = function(oEvent) {
			oEvent.stopPropagation();
			if ($rootScope._aImages.length) {
				servicesProvider.setUpPhotoGallery($rootScope._aImages);
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
			$rootScope.bDataHasBeenModified = false;
			$state.go(oNavigateToInfo.toState, oNavigateToInfo.toParams);
		};

		$scope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams) {
			if ($rootScope.bDataHasBeenModified) {
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

//$scope.people = [];

		// $scope.people = [
		//    { name: 'Adam',      email: 'adam@email.com',      age: 12, country: 'United States' },
		//    { name: 'Amalie',    email: 'amalie@email.com',    age: 12, country: 'Argentina' },
		//    { name: 'Estefanía', email: 'estefania@email.com', age: 21, country: 'Argentina' },
		//    { name: 'Adrian',    email: 'adrian@email.com',    age: 21, country: 'Ecuador' },
		//    { name: 'Wladimir',  email: 'wladimir@email.com',  age: 30, country: 'Ecuador' },
		//    { name: 'Samantha',  email: 'samantha@email.com',  age: 30, country: 'United States' },
		//    { name: 'Nicole',    email: 'nicole@email.com',    age: 43, country: 'Colombia' },
		//    { name: 'Natasha',   email: 'natasha@email.com',   age: 54, country: 'Ecuador' },
		//    { name: 'Michael',   email: 'michael@email.com',   age: 15, country: 'Colombia' },
		//    { name: 'Nicolás',   email: 'nicolas@email.com',    age: 43, country: 'Colombia' }
		//  ];

		// $scope.availableColors = ['Red','Green','Blue','Yellow','Magenta','Maroon','Umbra','Turquoise'];

		// $scope.multipleDemo = {};
		 //$scope.multipleDemo.colors = ['Blue','Red'];
		// $scope.multipleDemo.selectedPeople = [];//[$scope.people[5], $scope.people[4]];
		// $scope.multipleDemo.selectedPeopleWithGroupBy = [$scope.people[8], $scope.people[6]];
		// $scope.multipleDemo.selectedPeopleSimple = ['samantha@email.com','wladimir@email.com'];



	}
]);