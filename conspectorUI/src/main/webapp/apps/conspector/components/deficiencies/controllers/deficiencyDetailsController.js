viewControllers.controller('deficiencyDetailsView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout',
	function($scope, $rootScope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout) {
		var sDeficiencyGuid = $stateParams.sDeficiencyGuid;

		$scope.oForms = {};
		$scope.sTaskTypeGuid = "";
		$scope.sTaskType = "";
		$scope.sTaskPriority = "";
		$scope.sTaskPriorityGuid = "";

		// 	$scope.bShowParentAccountAndContactType = true;
		// 	$scope.bIsChangePhasesAssignmentAllowed = true;

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bUpdate"
		});

		$scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oDeficiency",
			sOperation: "bDelete"
		});

		$scope.aUnits = [];

		$scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		if ($rootScope.sCurrentStateName === "app.deficiencyDetailsWrapper.deficiencyDetails") { 
			// if($scope.sMode === "display" || $scope.sMode === "edit"){
			// 	$scope.$parent.bDisplayContactsList = true;
			// }
			$scope.sTaskType = "Deficiency";
			$scope.sTaskPriority = "Normal";
		}



		$scope.sMode = $stateParams.sMode;
		$scope.oDeficiency = {
			//aDescriptionTags: [],
			//_aPhases: [],
		};

		var oDeficiencyWrapper = {
			aData: [{
				_contractorsGuids: []
			}]
		};

		var onUnitsLoaded = function(aData) {
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
			// var oContactPhasesGuids = [];
			
			$scope.oDeficiency._guid = oDeficiency.Guid;
			// $scope.oContact._accountGuid = oContact.AccountGuid;

			$scope.oDeficiency._lastModifiedAt = oDeficiency.LastModifiedAt;
			// $scope.oContact.sFirstName = oContact.FirstName;
			// $scope.oContact.sLastName = oContact.LastName;

			// $scope.oContact.sEmail = oContact.Email;
			// $scope.oContact.sHomePhone = oContact.HomePhone;
			// $scope.oContact.sHomePhoneExtension = oContact.HomePhoneExtension;
			// $scope.oContact.sWorkPhone = oContact.WorkPhone;
			// $scope.oContact.sWorkPhoneExtension = oContact.WorkPhoneExtension;
			// $scope.oContact.sMobilePhone = oContact.MobilePhone;
			// $scope.oContact.sFax = oContact.Fax;
			// $scope.oContact.sTitle = oContact.Title;
			
			if (oDeficiency.UnitDetails.Name){
				$scope.oDeficiency._unitName = oDeficiency.UnitDetails.Name;
			}

			if (oDeficiency.PhaseDetails && oDeficiency.PhaseDetails.NameEN && oDeficiency.PhaseDetails.ProjectDetails.NameEN && $translate.use() === "en"){
				$scope.oDeficiency._ProjectAndPhaseName = oDeficiency.PhaseDetails.ProjectDetails.NameEN + " - " + oDeficiency.PhaseDetails.NameEN;
			}

			if (oDeficiency.PhaseDetails && oDeficiency.PhaseDetails.NameFR && oDeficiency.PhaseDetails.ProjectDetails.NameFR && $translate.use() === "fr"){
				$scope.oDeficiency._ProjectAndPhaseName = oDeficiency.PhaseDetails.ProjectDetails.NameFR + " - " + oDeficiency.PhaseDetails.NameFR;
			}else{
				$scope.oDeficiency._ProjectAndPhaseName = oDeficiency.PhaseDetails.ProjectDetails.NameEN + " - " + oDeficiency.PhaseDetails.NameEN;
			}

			//

			if (oDeficiency.TaskPriorityDetails && oDeficiency.TaskPriorityDetails.NameEN && oDeficiency.TaskPriorityDetails.NameEN && $translate.use() === "en"){
				$scope.oDeficiency._deficiencyPriority = oDeficiency.TaskPriorityDetails.NameEN;
			}

			if (oDeficiency.TaskPriorityDetails && oDeficiency.TaskPriorityDetails.NameFR && oDeficiency.TaskPriorityDetails.NameFR && $translate.use() === "fr"){
				$scope.oDeficiency._deficiencyPriority = oDeficiency.TaskPriorityDetails.NameFR;
			}else{
				$scope.oDeficiency._deficiencyPriority = oDeficiency.TaskPriorityDetails.NameEN;
			}

			//

			if (oDeficiency.DueDate && oDeficiency.DueDate != "/Date(0)/") {
				$scope.oDeficiency.sDueDate = utilsProvider.dBDateToSting(oDeficiency.DueDate);
				$scope.oDeficiency.dDueDate = new Date(parseInt(oDeficiency.DueDate.substring(6, oDeficiency.DueDate.length - 2)));
			}

			$scope.oDeficiency.sCreatedAt = utilsProvider.dBDateToSting(oDeficiency.CreatedAt);
			$scope.oDeficiency.sLastModifiedAt = utilsProvider.dBDateToSting(oDeficiency.LastModifiedAt);

			$scope.oDeficiency.aDescriptionTags = utilsProvider.tagsStringToTagsArray(oDeficiency.DescriptionTags);
			$scope.oDeficiency.aLocationTags = utilsProvider.tagsStringToTagsArray(oDeficiency.LocationTags);

			//if (oDeficiency.PhaseDetails) {
			$scope.oDeficiency._phaseGuid = oDeficiency.PhaseGuid;

			//} 

			$scope.oDeficiency._deficiencyStatusGuid = oDeficiency.TaskStatusGuid;
			$scope.oDeficiency._taskTypeGuid = oDeficiency.TaskTypeGuid;
			$scope.oDeficiency._taskPriorityGuid = oDeficiency.TaskPriorityGuid;
			$scope.oDeficiency._assignedUserName = oDeficiency.UserName;
			$scope.oDeficiency._unitGuid = oDeficiency.UnitGuid;

			$scope.oDeficiency._contractorsGuids = [];
			if (oDeficiency.AccountDetails) {
				for (var i = 0; i < oDeficiency.AccountDetails.results.length; i++) {
					$scope.oDeficiency._contractorsGuids.push(oDeficiency.AccountDetails.results[i].Guid);
				}
			}

			$scope.oDeficiency.sDescription = oDeficiency.Description;

			oDeficiencyWrapper.aData[0] = angular.copy($scope.oDeficiency);
			constructPhasesMultiSelect([$scope.oDeficiency._phaseGuid]);
		};

		var sRequestSettings = "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false";

		sRequestSettings = sRequestSettings + "PhaseDetails/ProjectDetails,TaskStatusDetails,TaskPriorityDetails,AccountDetails, UnitDetails";
		var oDeficiency = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oDeficiencyEntity",
			sRequestSettings: sRequestSettings, //filter + expand
			sKeyName: "Guid",
			sKeyValue: sDeficiencyGuid
		});

		var onTaskTypesLoaded = function(aData) {
			// for (var i = 0; i < aData.length; i++) {
			// 	aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			// }
			// aData = $filter('orderBy')(aData, ["_sortingSequence"]);


			// servicesProvider.constructDependentMultiSelectArray({
			// 	oDependentArrayWrapper: {
			// 		aData: aData
			// 	},
			// 	oParentArrayWrapper: oDeficiencyWrapper,
			// 	sNameEN: "NameEN",
			// 	sNameFR: "NameFR",
			// 	sDependentKey: "Guid",
			// 	sParentKey: "_taskTypeGuid",
			// 	sTargetArrayNameInParent: "aTaskTypes"
			// });
			// if (oDeficiencyWrapper.aData[0]) {
			// 	$scope.aTaskTypes = angular.copy(oDeficiencyWrapper.aData[0].aTaskTypes);
			// }
			
			$scope.sTaskTypeGuid = aData[0].Guid;
		};

		var onTaskPrioritiesLoaded = function(aData) {

			for (var i = 0; i < aData.length; i++) {
				aData[i].selected = false;
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
				if(aData[i].NameEN === $scope.sTaskPriority ){
					aData[i].selected = true;
				}
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			

			//loop to tick element
			//how to pass selected into method ?
			// 

			
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

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
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
				sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails, TaskPriorityDetails, AccountDetails, UnitDetails",
				sKey: sDeficiencyGuid,
				bShowSpinner: true,
				onSuccess: onDeficiencyDetailsLoaded,
			});
		};

		var onContractorsLoaded = function(aData) {
			//Sort aData by accountType sorting sequence and then by AccountName
			aData = $filter('orderBy')(aData, ["Name"]);

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oDeficiencyWrapper,
				sNameEN: "Name",
				sNameFR: "Name",
				sDependentKey: "Guid",
				sParentKeys: "_contractorsGuids",
				sTargetArrayNameInParent: "aContractors"
			});

			if (oDeficiencyWrapper.aData[0]) {
				$scope.aContractors = angular.copy(oDeficiencyWrapper.aData[0].aContractors);
			}
		};

		var onUsersWithCompaniesLoaded = function(aData) {
			var aFilteredUser = [{}];

			for (var i = 0; i < aData.length; i++) {
				for (var j = 0; j < aData[i].CompanyDetails.results.length; j++) {
					if (aData[i].CompanyDetails.results[j].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
						bMatchFound = true;
						aFilteredUser[i] = aData[i];
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

		if ($scope.sMode !== "create") {
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

				if($scope.sTaskType === "Deficiency"){
					apiProvider.getDeficiencyTaskType({
						bShowSpinner: false,
						onSuccess: onTaskTypesLoaded
					});		
				}
				if($scope.sTaskType === "Health and Safety"){
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

			if($scope.sTaskType === "Deficiency"){
				apiProvider.getDeficiencyTaskType({
					bShowSpinner: false,
					onSuccess: onTaskTypesLoaded
				});		
			}
			if($scope.sTaskType === "Health and Safety"){
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
			
				for (var i = 0; i < $scope.aSelectedContractors.length; i++) {
					sUri = "Accounts('" + $scope.aSelectedContractors[i].Guid + "')";
					aUri.push(sUri);
				}
			
			if (aUri.length) {
				aLinks.push({
					sRelationName: "AccountDetails",
					bKeepCompanyDependentLinks: true,
					aUri: aUri
				});
			}
			return aLinks;
		};

		// $scope.onCloseCheckSelectedTaskTypesLength = function() {
		// 	if ($scope.aSelectedTaskTypes.length == 0)
		// 		$scope.onSelectedTaskTypesModified();
		// };

		// $scope.onSelectedTaskTypesModified = function() {
		// 	$scope.onDataModified();
		// 	$scope.oForms.deficiencyDetailsForm.selectedTaskTypes.$setDirty();
		// };

		$scope.onCloseCheckSelectedTaskPrioritiesLength = function() {
			if ($scope.aSelectedTaskPriorities.length == 0)
				$scope.onSelectedTaskPrioritiesModified();
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

		// $scope.onCloseCheckSelectedContractorsLength = function() {
		// 	if ($scope.aSelectedContractors.length == 0)
		// 		$scope.onSelectedContractorsModified();
		// };

		// $scope.onSelectedContractorsModified = function() {
		// 	$scope.onDataModified();
		// 	$scope.oForms.deficiencyDetailsForm.selectedContractors.$setDirty();
		// };

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		// 	$scope.onBillingCountryChanged = function() {
		// 		$scope.onDataModified();
		// 		constructProvinceSelect({
		// 			sParentKey: "",
		// 			sProvincesFor: "billingAddress"
		// 		});

		// 	};

		// 	$scope.onShippingCountryChanged = function() {
		// 		$scope.onDataModified();
		// 		constructProvinceSelect({
		// 			sParentKey: "",
		// 			sProvincesFor: "shippingAddress"
		// 		});

		// 	};

		$scope.onSave = function(bSaveAndNew, oNavigateTo) {
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
			// if ($scope.oForms.deficiencyDetailsForm.selectedContractors) {
			// 	$scope.oForms.deficiencyDetailsForm.selectedContractors.$setDirty(); //to display validation messages on submit press
			// }
			if ($scope.oForms.deficiencyDetailsForm.selectedUser) {
				$scope.oForms.deficiencyDetailsForm.selectedUser.$setDirty(); //to display validation messages on submit press
			}
			if ($scope.oForms.deficiencyDetailsForm.selectedUnits) {
				$scope.oForms.deficiencyDetailsForm.selectedUnits.$setDirty(); //to display validation messages on submit press
			}
			// if ($scope.oForms.contactDetailsForm.lastName) {
			// 	$scope.oForms.contactDetailsForm.lastName.$setDirty(); //to display validation messages on submit press
			// }

			if (!$scope.oForms.deficiencyDetailsForm.$valid) {
				return;
			}

			// aLinks = prepareLinksForSave();

			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];

			oDataForSave.Guid = $scope.oDeficiency._guid;
			// for (var i = 0; i < $scope.aAccounts.length; i++) {
			// 	if ($scope.aAccounts[i].ticked && $scope.aAccounts[i].multiSelectGroup === undefined) {
			// 		oDataForSave.AccountGuid = $scope.aAccounts[i].Guid;
			// 		break;
			// 	}
			// }



			var onSuccessCreation = function(oData) {
				bDataHasBeenModified = false;
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
					$scope.oDeficiency._guid = oData.Guid;
				} else {
					// $scope.oContact.sFirstName = "";
					// $scope.oContact.sLastName = "";

					// $scope.oContact.sEmail = "";
					// $scope.oContact.sHomePhone = "";
					// $scope.oContact.sHomePhoneExtension = "";
					// $scope.oContact.sWorkPhone = "";
					// $scope.oContact.sWorkPhoneExtension = "";
					// $scope.oContact.sMobilePhone = "";
					// $scope.oContact.sFax = "";
					// $scope.oContact.sTitle = "";
					$scope.oDeficiency.aDescriptionTags = [];
					$scope.oDeficiency.aLocationTags = [];

					// $scope.oContact.sBillingStreet = "";
					// $scope.oContact.sBillingCity = "";
					// $scope.oContact.sBillingPostalCode = "";
					// $scope.oContact.sShippingStreet = "";
					// $scope.oContact.sShippingCity = "";
					// $scope.oContact.sShippingPostalCode = "";

					// $scope.oForms.contactDetailsForm.lastName.$setPristine();
					// $scope.oForms.contactDetailsForm.firstName.$setPristine();
					// oDataForSave.BillingAddress = {};
					// oDataForSave.ShippingAddress = {};
				}
			};
			var onSuccessUpdate = function(oData) {
				bDataHasBeenModified = false;
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
			};


			// for (var i = 0; i < $scope.aContactTypes.length; i++) {
			// 	if ($scope.aContactTypes[i].ticked) {
			// 		oDataForSave.ContactTypeGuid = $scope.aContactTypes[i].Guid;
			// 		break;
			// 	}
			// }

			// oDataForSave.FirstName = $scope.oContact.sFirstName;
			// oDataForSave.LastName = $scope.oContact.sLastName;

			// if ($scope.oContact.sHomePhone) {
			// 	oDataForSave.HomePhone = $scope.oContact.sHomePhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.HomePhone = "";
			// }
			// if ($scope.oContact.sWorkPhone) {
			// 	oDataForSave.WorkPhone = $scope.oContact.sWorkPhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.WorkPhone = "";
			// }
			// if ($scope.oContact.sMobilePhone) {
			// 	oDataForSave.MobilePhone = $scope.oContact.sMobilePhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.MobilePhone = "";
			// }

			// oDataForSave.Email = $scope.oContact.sEmail;
			// oDataForSave.Fax = $scope.oContact.sFax;
			// oDataForSave.Title = $scope.oContact.sTitle;
			// oDataForSave.HomePhoneExtension = $scope.oContact.sHomePhoneExtension;
			// oDataForSave.WorkPhoneExtension = $scope.oContact.sWorkPhoneExtension;


			oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oDeficiency.aDescriptionTags);
			oDataForSave.LocationTags = utilsProvider.tagsArrayToTagsString($scope.oDeficiency.aLocationTags);
			oDataForSave.Description = $scope.oDeficiency.sDescription;


			if ($scope.oDeficiency.dDueDate) {
				oDataForSave.DueDate = "/Date(" + $scope.oDeficiency.dDueDate.getTime() + ")/";
			} else {
				oDataForSave.DueDate = "/Date(0)/";
			}
			// oDataForSave.BillingAddress = {};
			// oDataForSave.BillingAddress.BillingStreet = $scope.oContact.sBillingStreet;
			// oDataForSave.BillingAddress.BillingCity = $scope.oContact.sBillingCity;
			// oDataForSave.BillingAddress.BillingPostalCode = $scope.oContact.sBillingPostalCode;

			// oDataForSave.ShippingAddress = {};
			// oDataForSave.ShippingAddress.ShippingStreet = $scope.oContact.sShippingStreet;
			// oDataForSave.ShippingAddress.ShippingCity = $scope.oContact.sShippingCity;
			// oDataForSave.ShippingAddress.ShippingPostalCode = $scope.oContact.sShippingPostalCode;

			// for (var i = 0; i < $scope.aBillingCountries.length; i++) {
			// 	if ($scope.aBillingCountries[i].ticked) {
			// 		oDataForSave.BillingAddress.BillingCountry = $scope.aBillingCountries[i].CountryCode;
			// 		break;
			// 	}
			// }
			// for (var i = 0; i < $scope.aBillingProvinces.length; i++) {
			// 	if ($scope.aBillingProvinces[i].ticked) {
			// 		oDataForSave.BillingAddress.BillingProvince = $scope.aBillingProvinces[i].ProvinceCode;
			// 		break;
			// 	}
			// }
			// for (var i = 0; i < $scope.aShippingCountries.length; i++) {
			// 	if ($scope.aShippingCountries[i].ticked) {
			// 		oDataForSave.ShippingAddress.ShippingCountry = $scope.aShippingCountries[i].CountryCode;
			// 		break;
			// 	}
			// }
			// for (var i = 0; i < $scope.aShippingProvinces.length; i++) {
			// 	if ($scope.aShippingProvinces[i].ticked) {
			// 		oDataForSave.ShippingAddress.ShippingProvince = $scope.aShippingProvinces[i].ProvinceCode;
			// 		break;
			// 	}
			// }

			// if ($scope.aSelectedTaskTypes.length) {
			// 	oDataForSave.TaskTypeGuid = $scope.aSelectedTaskTypes[0].Guid;
			// }
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

			aLinks = prepareLinksForSave();
			oDataForSave.LastModifiedAt = $scope.oDeficiency._lastModifiedAt;

			switch ($scope.sMode) {
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