viewControllers.controller('activityDetailsView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings) {

		$scope.oForms = {};

		var sActivityGuid = $stateParams.sActivityGuid;
		$scope.sMode = $stateParams.sMode;

		$rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
		$rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

		var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
		$scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oActivity",
			sOperation: "bUpdate"
		});

		$scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
			sRole: sCurrentRole,
			sEntityName: "oActivity",
			sOperation: "bDelete"
		});	

//to delete
		// $scope.sActivityType = "";
		// $scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;
		// if ($rootScope.sCurrentStateName === "app.activityDetailsWrapper.activityDetails") { 
		// 	if($scope.sMode === "display" || $scope.sMode === "edit"){
		// 		$scope.$parent.bDisplayContactsList = true;
		// 	}
		// 	$scope.sActivityType = "Activity";
		// }

		// $scope.sActivityTypeGuid = ""; 
		//for new activity creation flow

		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		$scope.oActivity = {
			_aPhases: [],
		};

		var oActivityWrapper = {
			aData: [{}]
		};

		var constructPhasesMultiSelect = function(aSelectedPhases) {
			$scope.aUserProjectsPhasesForMultiselect = servicesProvider.constructUserProjectsPhasesForMultiSelect({
				aSelectedPhases: aSelectedPhases
			});
		};

		var setDisplayedActivityDetails = function(oActivity) {
			var aActivityPhasesGuids = [];
			$scope.oActivity._guid = oActivity.Guid;
			$scope.oActivity.sObject =  oActivity.Object;
			// $scope.oActivity._lastModifiedAt = oActivity.LastModifiedAt;
			// $scope.oActivity.sCreatedAt = utilsProvider.dBDateToSting(oActivity.CreatedAt);
			// $scope.oActivity.sLastModifiedAt = utilsProvider.dBDateToSting(oActivity.LastModifiedAt);

			$scope.oActivity._aPhases = angular.copy(oActivity.PhaseDetails.results);
			for (var i = 0; i < $scope.oActivity._aPhases.length; i++) {
				aActivityPhasesGuids.push($scope.oActivity._aPhases[i].Guid);
			}
			constructPhasesMultiSelect(aActivityPhasesGuids);

			oActivityWrapper.aData[0] = angular.copy($scope.oActivity);
		};

		var oActivity = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oActivityEntity",
			sRequestSettings: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + "PhaseDetails/ProjectDetails,ActivityTypeDetails", //filter + expand
			sKeyName: "Guid",
			sKeyValue: $stateParams.sActivityGuid
		});

		var onActivityDetailsLoaded = function(oData) {
			setDisplayedActivityDetails(oData);
		};

	

		var onActivityTypesLoaded = function(aData) {
			for (var i = 0; i < aData.length; i++) {
				aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
			}
			aData = $filter('orderBy')(aData, ["_sortingSequence"]);

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oActivityWrapper,
				sNameEN: "NameEN",
				sNameFR: "NameFR",
				sDependentKey: "Guid",
				sParentKey: "_activityTypeGuid",
				sTargetArrayNameInParent: "aActivityTypes"
			});
			if (oActivityWrapper.aData[0]) {
				$scope.aActivityTypes = angular.copy(oActivityWrapper.aData[0].aActivityTypes);
			}
		};

		var getActivity = function() {
			apiProvider.getActivityWithPhases({
				sKey: sActivityGuid,
				sExpand: "AccountDetails/AccountTypeDetails, ActivityTypeDetails, ContactDetails, PhaseDetails/ProjectDetails, UnitDetails/PhaseDetails, UserDetails",
				bShowSpinner: true,
				onSuccess: onActivityDetailsLoaded,
			});
		};

		if ($scope.sMode !== "create") {
			if (angular.equals(oActivity, {})) { //in case of F5
				getActivityDetails();
			} else { //in case when data is retrieved from the cash
				setDisplayedActivityDetails(oActivity);

				apiProvider.getActivityTypes({
					bShowSpinner: false,
					onSuccess: onActivityTypesLoaded
				});
				// apiProvider.getAccountTypesWithAccounts({
				// 	bShowSpinner: false,
				// 	onSuccess: onAccountTypesWithAccountsLoaded
				// });
			}
		} else {
			var aSelectedPhases = [];
			// if (historyProvider.getPreviousStateName() === "app.contractorDetailsWrapper.contractorDetails" || historyProvider.getPreviousStateName() === "app.clientDetailsWrapper.clientDetails") {
			// 	aSelectedPhases = angular.copy($rootScope.aAccountPhasesGuids);
			// }
			constructPhasesMultiSelect(aSelectedPhases);

			apiProvider.getActivityTypes({
					bShowSpinner: false,
					onSuccess: onActivityTypesLoaded
				});


			// apiProvider.getAccountTypesWithAccounts({
			// 	bShowSpinner: false,
			// 	onSuccess: onAccountTypesWithAccountsLoaded
			// });
		}

		$scope.onEdit = function() {
			$state.go('app.activityDetailsWrapper.activityDetails', {
				sMode: "edit",
				sActivityGuid: $scope.oActivity._guid,
			});
		};


		var deleteActivity = function() {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				historyProvider.navigateBack({
					oState: $state
				});
			}
			oDataForSave.Guid = $scope.oActivity._guid;
			oDataForSave.LastModifiedAt = $scope.oActivity._lastModifiedAt;
			apiProvider.updateActivity({
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
				sHeader: $translate.instant('activityDetails_deletionConfirmationHeader'),
				sContent: $translate.instant('activityDetails_deletionConfirmationContent'),
				sOk: $translate.instant('global_ok'),
				sCancel: $translate.instant('global_cancel'),
				onOk: deleteActivity,
				event: $event
			});
		};

		var prepareLinksForSave = function() { // link activity to phases
			var aLinks = [];
			var aUri = [];
			var sUri = "";
			for (var i = 0; i < $scope.aUserProjectsPhasesForMultiselect.length; i++) {
				if ($scope.aUserProjectsPhasesForMultiselect[i].ticked) {
					sUri = "Phases('" + $scope.aUserProjectsPhasesForMultiselect[i].Guid + "')";
					aUri.push(sUri);
				}
			}
			if (aUri.length) {
				aLinks.push({
					sRelationName: "PhaseDetails",
					bKeepCompanyDependentLinks: true,
					aUri: aUri
				});
			}
			return aLinks;
		};

		$scope.onCloseCheckSelectedPhasesLength = function(){
			if ($scope.aSelectedPhases.length == 0)
			$scope.onSelectedPhasesModified();
		};

		$scope.onSelectedPhasesModified = function() {
			$scope.onDataModified();
			$scope.oForms.activityDetailsForm.selectedPhases.$setDirty();
		};

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		$scope.onBack = function() {
			historyProvider.navigateBack({
				oState: $state
			});
		};

		$scope.onSave = function(bSaveAndNew, oNavigateTo) {
			if($scope.oForms.activityDetailsForm.selectedPhases){
				$scope.oForms.activityDetailsForm.selectedPhases.$setDirty();//to display validation messages on submit press
			}
			if($scope.oForms.activityDetailsForm.activityObject){
				$scope.oForms.activityDetailsForm.selectedActivityType.$setDirty();//to display validation messages on submit press
			}
			if($scope.oForms.activityDetailsForm.activityObject){
				$scope.oForms.activityDetailsForm.activityObject.$setDirty();//to display validation messages on submit press
			}			

			if(!$scope.oForms.activityDetailsForm.$valid){
				return;
			}	

			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];

			var onSuccessCreation = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return; // to prevent switch to displaly mode otherwise navigation will be to display state and not away...
				}
				// if (!bSaveAndNew) {
				// 	$scope.oActivity._lastModifiedAt = oData.LastModifiedAt;
				// 	$scope.oActivity.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				// 	$scope.oActivity.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
				// 	$scope.oActivity._guid = oData.Guid;
				// 	$state.go('app.activityDetailsWrapper.activityDetails', {
				// 		sMode: "display",
				// 		sActivityGuid: oData.Guid,
				// 	});
				// } else {
				// 	$scope.oActivity.sName = "";
				// 	$scope.oActivity.sPhone = "";
				// 	$scope.oActivity.sPhoneExtension = "";
				// 	$scope.oActivity.sSecondaryPhone = "";
				// 	$scope.oActivity.sSecondaryPhoneExtension = "";
				// 	$scope.oActivity.sWebsite = "";
				// 	$scope.oActivity.sEmail = "";
				// 	$scope.oActivity.sFax = "";
				// 	$scope.oActivity.aTags = [];

				// 	$scope.oActivity.sBillingStreet = "";
				// 	$scope.oActivity.sBillingCity = "";
				// 	$scope.oActivity.sBillingPostalCode = "";
				// 	$scope.oActivity.sShippingStreet = "";
				// 	$scope.oActivity.sShippingCity = "";
				// 	$scope.oActivity.sShippingPostalCode = "";					

				// 	$scope.oForms.activityDetailsForm.activityName.$setPristine();
				// 	oDataForSave.BillingAddress = {};
				// 	oDataForSave.ShippingAddress = {};
				// 	$scope.oActivity._aPhases = [];
				// }
			};
			var onSuccessUpdate = function(oData) {
				bDataHasBeenModified = false;
				$scope.oActivity._lastModifiedAt = oData.LastModifiedAt;
				$scope.oActivity.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
					return; // to prevent switch to displaly mode otherwise navigation will be to display state and not away...
				}
				$state.go('app.activityDetailsWrapper.activityDetails', {
					sMode: "display",
					sActivityGuid: oData.Guid,
				});
			};

			oDataForSave.Guid = $scope.oActivity._guid;
			// oDataForSave.Name = $scope.oActivity.sName;

			// if ($scope.oActivity.sPhone) {
			// 	oDataForSave.MainPhone = $scope.oActivity.sPhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.MainPhone = "";
			// }
			// if ($scope.oActivity.sSecondaryPhone) {
			// 	oDataForSave.SecondaryPhone = $scope.oActivity.sSecondaryPhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.SecondaryPhone = "";
			// }
			// if ($scope.oActivity.sFax) {
			// 	oDataForSave.Fax = $scope.oActivity.sFax.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.Fax = "";
			// }	

			oDataForSave.Object = $scope.oActivity.sObject;
			// oDataForSave.Email = $scope.oActivity.sEmail;
			// oDataForSave.MainPhoneExtension = $scope.oActivity.sPhoneExtension;
			// oDataForSave.SecondaryPhoneExtension = $scope.oActivity.sSecondaryPhoneExtension;
			
			// oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oActivity.aTags);

			// oDataForSave.BillingAddress = {};
			// oDataForSave.BillingAddress.BillingStreet = $scope.oActivity.sBillingStreet;
			// oDataForSave.BillingAddress.BillingCity = $scope.oActivity.sBillingCity;
			// oDataForSave.BillingAddress.BillingPostalCode = $scope.oActivity.sBillingPostalCode;

			// oDataForSave.ShippingAddress = {};
			// oDataForSave.ShippingAddress.ShippingStreet = $scope.oActivity.sShippingStreet;
			// oDataForSave.ShippingAddress.ShippingCity = $scope.oActivity.sShippingCity;
			// oDataForSave.ShippingAddress.ShippingPostalCode = $scope.oActivity.sShippingPostalCode;

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

			oDataForSave.LastModifiedAt = $scope.oActivity._lastModifiedAt;

			aLinks = prepareLinksForSave();
			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateActivity({
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
					oDataForSave.ActivityTypeGuid = $scope.sActivityTypeGuid;
					apiProvider.createActivity({
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

		// $scope.$on("$destroy", function() {
		// 	$rootScope.aActivityPhasesGuids = [];
		// 	for (var i = 0; i < $scope.aSelectedPhases.length; i++) {
		// 		$rootScope.aActivityPhasesGuids.push($scope.aSelectedPhases[i].Guid);
		// 	}			
		// });			
	}
]);