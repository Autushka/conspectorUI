viewControllers.controller('unitDetailsView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings',
	function($scope, $rootScope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings) {
		var sUnitGuid = $stateParams.sUnitGuid;

		$scope.oForms = {};

		// 	$scope.bShowParentAccountAndUnitType = true;
		// 	$scope.bIsChangePhasesAssignmentAllowed = true;

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
		$scope.oUnit = {
			aDescriptionTags: [],
			//_aPhases: [],
		};

		var oUnitWrapper = {
			aData: [{
				_clientsGuids: []
			}]
		};

		// 	var oUnitWrapper = {
		// 		aData: [{
		// 			_accountGuid: sAccountGuid
		// 		}] //initial accountGuid needed here for new contract creation scenario
		// 	};

		// 	$scope.aUnitTypes = [];
		// 	var aCountriesWithProvinces = [];

		// 	$scope.aBillingCountries = [];
		// 	$scope.aBillingProvinces = [];
		// 	$scope.aShippingCountries = [];
		// 	$scope.aShippingProvinces = [];

		var constructPhasesMultiSelect = function(aSelectedPhases) {
			$scope.aUserProjectsPhasesForMultiselect = servicesProvider.constructUserProjectsPhasesForMultiSelect({
				aSelectedPhases: aSelectedPhases
			});
		};

		var setDisplayedUnitDetails = function(oUnit) {
			// var oContactPhasesGuids = [];
			$scope.oUnit._guid = oUnit.Guid;
			// $scope.oContact._accountGuid = oContact.AccountGuid;

			$scope.oUnit._lastModifiedAt = oUnit.LastModifiedAt;
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
			$scope.oUnit.aDescriptionTags = utilsProvider.tagsStringToTagsArray(oUnit.DescriptionTags);
			$scope.oUnit.sName = oUnit.Name;
			//if (oUnit.PhaseDetails) {
			constructPhasesMultiSelect([oUnit.PhaseGuid]);
			//} 

			// $scope.oUnit._unitStatusGuid = oUnit.TaskStatusGuid;
			// $scope.oUnit._taskTypeGuid = oUnit.TaskTypeGuid;

			// $scope.oUnit._unitsGuids = [];
			// if (oUnit.AccountDetails) {
			// 	for (var i = 0; i < oUnit.AccountDetails.results.length; i++) {
			// 		$scope.oUnit._unitsGuids.push(oUnit.AccountDetails.results[i].Guid);
			// 	}
			// }

			// $scope.oContact._contactTypeGuid = oContact.ContactTypeGuid;

			// if (oContact.BillingAddress) {
			// 	$scope.oContact.sBillingStreet = oContact.BillingAddress.BillingStreet;
			// 	$scope.oContact.sBillingCity = oContact.BillingAddress.BillingCity;
			// 	$scope.oContact.sBillingPostalCode = oContact.BillingAddress.BillingPostalCode;
			// 	$scope.oContact._billingCountryCode = oContact.BillingAddress.BillingCountry;
			// 	$scope.oContact._billingProvinceCode = oContact.BillingAddress.BillingProvince;
			// }

			// if (oContact.ShippingAddress) {
			// 	$scope.oContact.sShippingStreet = oContact.ShippingAddress.ShippingStreet;
			// 	$scope.oContact.sShippingCity = oContact.ShippingAddress.ShippingCity;
			// 	$scope.oContact.sShippingPostalCode = oContact.ShippingAddress.ShippingPostalCode;
			// 	$scope.oContact._shippingCountryCode = oContact.ShippingAddress.ShippingCountry;
			// 	$scope.oContact._shippingProvinceCode = oContact.ShippingAddress.ShippingProvince;
			// }

			// if (oContact.AccountDetails) {
			// 	$scope.oContact._sAccountName = oContact.AccountDetails.Name;
			// }

			// if (oContact.ContactTypeDetails) {
			// 	$scope.oContact._sContactType = $translate.use() === "en" ? oContact.ContactTypeDetails.NameEN : oContact.ContactTypeDetails.NameFR;
			// 	if (!$scope.oContact._sContactType) {
			// 		$scope.oContact._sContactType = oContact.ContactTypeDetails.NameEN
			// 	}
			// }

			// $scope.oContact.sCreatedAt = utilsProvider.dBDateToSting(oContact.CreatedAt);
			// $scope.oContact.sLastModifiedAt = utilsProvider.dBDateToSting(oContact.LastModifiedAt);

			// $scope.oContact._aPhases = angular.copy(oContact.PhaseDetails.results);
			// for (var i = 0; i < $scope.oContact._aPhases.length; i++) {
			// 	oContactPhasesGuids.push($scope.oContact._aPhases[i].Guid);
			// }


			oUnitWrapper.aData[0] = angular.copy($scope.oUnit);
		};

		var sRequestSettings = "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false";

		sRequestSettings = sRequestSettings + "";
		var oUnit = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oUnitEntity",
			sRequestSettings: sRequestSettings, //filter + expand
			sKeyName: "Guid",
			sKeyValue: sUnitGuid
		});

		// 	var constructProvinceSelect = function(oParameters) {
		// 		var sParentKey = oParameters.sParentKey;
		// 		var sTargetArrayName = "";
		// 		var sCountriesArrayName = "";

		// 		if (oParameters.sProvincesFor === "billingAddress") {
		// 			sTargetArrayName = "aBillingProvinces";
		// 			sCountriesArrayName = "aBillingCountries";
		// 		} else {
		// 			sTargetArrayName = "aShippingProvinces";
		// 			sCountriesArrayName = "aShippingCountries";
		// 		}

		// 		for (var i = 0; i < $scope[sCountriesArrayName].length; i++) {
		// 			if ($scope[sCountriesArrayName][i].ticked) {
		// 				for (var j = 0; j < aCountriesWithProvinces.length; j++) {
		// 					if ($scope[sCountriesArrayName][i].CountryCode === aCountriesWithProvinces[j].CountryCode) {
		// 						servicesProvider.constructDependentMultiSelectArray({
		// 							oDependentArrayWrapper: {
		// 								aData: aCountriesWithProvinces[j].ProvinceDetails.results
		// 							},
		// 							oParentArrayWrapper: oUnitWrapper,
		// 							sNameEN: "Name",
		// 							sNameFR: "Name",
		// 							sDependentKey: "ProvinceCode",
		// 							sParentKey: sParentKey,
		// 							sTargetArrayNameInParent: sTargetArrayName
		// 						});
		// 						if (oUnitWrapper.aData[0]) {
		// 							$scope[sTargetArrayName] = angular.copy(oUnitWrapper.aData[0][sTargetArrayName]);
		// 						}
		// 						break;
		// 					}
		// 				}
		// 				break;
		// 			}
		// 		}
		// 	};

		// 	var onCountriesLoaded = function(aData) {
		// 		aCountriesWithProvinces = angular.copy(aData);
		// 		servicesProvider.constructDependentMultiSelectArray({
		// 			oDependentArrayWrapper: {
		// 				aData: aData
		// 			},
		// 			oParentArrayWrapper: oUnitWrapper,
		// 			sNameEN: "Name",
		// 			sNameFR: "Name",
		// 			sDependentKey: "CountryCode",
		// 			sParentKey: "_billingCountryCode",
		// 			sTargetArrayNameInParent: "aBillingCountries"
		// 		});

		// 		servicesProvider.constructDependentMultiSelectArray({
		// 			oDependentArrayWrapper: {
		// 				aData: aData
		// 			},
		// 			oParentArrayWrapper: oUnitWrapper,
		// 			sNameEN: "Name",
		// 			sNameFR: "Name",
		// 			sDependentKey: "CountryCode",
		// 			sParentKey: "_shippingCountryCode",
		// 			sTargetArrayNameInParent: "aShippingCountries"
		// 		});
		// 		if (oUnitWrapper.aData[0]) {
		// 			$scope.aBillingCountries = angular.copy(oUnitWrapper.aData[0].aBillingCountries);
		// 			$scope.aShippingCountries = angular.copy(oUnitWrapper.aData[0].aShippingCountries);
		// 		}

		// 		if ($scope.oUnit._billingCountryCode) {
		// 			constructProvinceSelect({
		// 				sParentKey: "_billingProvinceCode",
		// 				sProvincesFor: "billingAddress"
		// 			});
		// 		}
		// 		if ($scope.oUnit._shippingCountryCode) {
		// 			constructProvinceSelect({
		// 				sParentKey: "_shippingProvinceCode",
		// 				sProvincesFor: "shippingAddress"
		// 			});
		// 		}
		// 	};

		// 	var onUnitTypesLoaded = function(aData) {
		// 		for (var i = 0; i < aData.length; i++) {
		// 			aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
		// 		}
		// 		aData = $filter('orderBy')(aData, ["_sortingSequence"]);

		// 		servicesProvider.constructDependentMultiSelectArray({
		// 			oDependentArrayWrapper: {
		// 				aData: aData
		// 			},
		// 			oParentArrayWrapper: oUnitWrapper,
		// 			sNameEN: "NameEN",
		// 			sNameFR: "NameFR",
		// 			sDependentKey: "Guid",
		// 			sParentKey: "_unitTypeGuid",
		// 			sTargetArrayNameInParent: "aUnitTypes"
		// 		});
		// 		if (oUnitWrapper.aData[0]) {
		// 			$scope.aUnitTypes = angular.copy(oUnitWrapper.aData[0].aUnitTypes);
		// 		}
		// 	};

		var onUnitDetailsLoaded = function(oData) {
			setDisplayedUnitDetails(oData);

			// apiProvider.getCountriesWithProvinces({
			// 	bShowSpinner: false,
			// 	onSuccess: onCountriesLoaded
			// });

			// apiProvider.getUnitTypes({
			// 	bShowSpinner: false,
			// 	onSuccess: onUnitTypesLoaded
			// });

			// apiProvider.getAccountTypesWithAccounts({
			// 	bShowSpinner: false,
			// 	onSuccess: onAccountTypesWithAccountsLoaded
			// });
		};

		var getUnitDetails = function() {
			apiProvider.getUnit({
				sKey: sUnitGuid,
				bShowSpinner: true,
				onSuccess: onUnitDetailsLoaded,
			});
		};

		// 	var onAccountTypesWithAccountsLoaded = function(aData) {
		// 		//Sort aData by accountType sorting sequence and then by AccountName
		// 		for (var i = 0; i < aData.length; i++) {
		// 			aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
		// 			aData[i].AccountDetails.results = $filter('orderBy')(aData[i].AccountDetails.results, ["Name"]);
		// 		}
		// 		aData = $filter('orderBy')(aData, ["_sortingSequence"]);

		// 		servicesProvider.constructDependentMultiSelectArray({
		// 			oDependentArrayWrapper: {
		// 				aData: aData
		// 			},
		// 			sSecondLevelAttribute: "AccountDetails",
		// 			sSecondLevelNameEN: "Name",
		// 			sSecondLevelNameFR: "Name",
		// 			oParentArrayWrapper: oUnitWrapper,
		// 			sNameEN: "NameEN",
		// 			sNameFR: "NameFR",
		// 			sDependentKey: "Guid",
		// 			sParentKey: "_accountGuid",
		// 			sTargetArrayNameInParent: "aAccounts"
		// 		});

		// 		if (oUnitWrapper.aData[0]) {
		// 			$scope.aAccounts = angular.copy(oUnitWrapper.aData[0].aAccounts);
		// 		}
		// 	};

		if ($scope.sMode !== "create") {
			if (angular.equals(oUnit, {})) { //in case of F5
				getUnitDetails();
			} else { //in case when data is retrieved from the cash
				setDisplayedUnitDetails(oUnit);

				// apiProvider.getCountriesWithProvinces({
				// 	bShowSpinner: false,
				// 	onSuccess: onCountriesLoaded
				// });
				// apiProvider.getUnitTypes({
				// 	bShowSpinner: false,
				// 	onSuccess: onUnitTypesLoaded
				// });
				// apiProvider.getAccountTypesWithAccounts({
				// 	bShowSpinner: false,
				// 	onSuccess: onAccountTypesWithAccountsLoaded
				// });
			}
		} else {
			constructPhasesMultiSelect({
				aSelectedPhases: []
			});

			// var aSelectedPhases = [];
			// if (historyProvider.getPreviousStateName() === "app.unitDetailsWrapper.unitDetails" || historyProvider.getPreviousStateName() === "app.clientDetailsWrapper.clientDetails") {
			// 	aSelectedPhases = angular.copy($rootScope.aAccountPhasesGuids);
			// }
			// constructPhasesMultiSelect(aSelectedPhases);

			// apiProvider.getCountriesWithProvinces({
			// 	bShowSpinner: false,
			// 	onSuccess: onCountriesLoaded
			// });

			// apiProvider.getUnitTypes({
			// 	bShowSpinner: false,
			// 	onSuccess: onUnitTypesLoaded
			// });


			// apiProvider.getAccountTypesWithAccounts({
			// 	bShowSpinner: false,
			// 	onSuccess: onAccountTypesWithAccountsLoaded
			// });
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

		// 	$scope.onParentAccountModified = function() {
		// 		$scope.onDataModified();
		// 		$scope.oForms.unitDetailsForm.selectedParentAccount.$setDirty();
		// 	};

		$scope.onCloseCheckSelectedPhasesLength = function() {
			if ($scope.aSelectedPhases.length == 0)
				$scope.onSelectedPhasesModified();
		};

		$scope.onSelectedPhasesModified = function() {
			$scope.onDataModified();
			$scope.oForms.unitDetailsForm.selectedPhases.$setDirty();
		};

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
			if ($scope.oForms.unitDetailsForm.selectedPhases) {
				$scope.oForms.unitDetailsForm.selectedPhases.$setDirty(); //to display validation messages on submit press
			}
			// if ($scope.oForms.unitDetailsForm.selectedPhases) {
			// 	$scope.oForms.unitDetailsForm.selectedPhases.$setDirty(); //to display validation messages on submit press
			// }
			// if ($scope.oForms.unitDetailsForm.selectedPhases) {
			// 	$scope.oForms.unitDetailsForm.selectedPhases.$setDirty(); //to display validation messages on submit press
			// }

			if (!$scope.oForms.unitDetailsForm.$valid) {
				return;
			}

			// aLinks = prepareLinksForSave();

			var oDataForSave = {
				GeneralAttributes: {}
			};
			var aLinks = [];

			oDataForSave.Guid = $scope.oUnit._guid;
			// for (var i = 0; i < $scope.aAccounts.length; i++) {
			// 	if ($scope.aAccounts[i].ticked && $scope.aAccounts[i].multiSelectGroup === undefined) {
			// 		oDataForSave.AccountGuid = $scope.aAccounts[i].Guid;
			// 		break;
			// 	}
			// }

			// if (!$scope.oForms.unitDetailsForm.$valid) {
			// 	return;
			// }

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
					// $scope.oUnit.sFirstName = "";
					// $scope.oUnit.sLastName = "";

					// $scope.oUnit.sEmail = "";
					// $scope.oUnit.sHomePhone = "";
					// $scope.oUnit.sHomePhoneExtension = "";
					// $scope.oUnit.sWorkPhone = "";
					// $scope.oUnit.sWorkPhoneExtension = "";
					// $scope.oUnit.sMobilePhone = "";
					// $scope.oUnit.sFax = "";
					// $scope.oUnit.sTitle = "";
					$scope.oUnit.aDescriptionTags = [];
					$scope.oUnit.aClientTags = [];

					// $scope.oUnit.sBillingStreet = "";
					// $scope.oUnit.sBillingCity = "";
					// $scope.oUnit.sBillingPostalCode = "";
					// $scope.oUnit.sShippingStreet = "";
					// $scope.oUnit.sShippingCity = "";
					// $scope.oUnit.sShippingPostalCode = "";

					// $scope.oForms.unitDetailsForm.lastName.$setPristine();
					// $scope.oForms.unitDetailsForm.firstName.$setPristine();
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

				$scope.oUnit._lastModifiedAt = oData.LastModifiedAt;
				$scope.oUnit.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);

				$state.go('app.unitDetailsWrapper.unitDetails', {
					sMode: "display",
					sUnitGuid: oData.Guid
				});
			};


			// for (var i = 0; i < $scope.aUnitTypes.length; i++) {
			// 	if ($scope.aUnitTypes[i].ticked) {
			// 		oDataForSave.UnitTypeGuid = $scope.aUnitTypes[i].Guid;
			// 		break;
			// 	}
			// }

			// oDataForSave.FirstName = $scope.oUnit.sFirstName;
			// oDataForSave.LastName = $scope.oUnit.sLastName;

			// if ($scope.oUnit.sHomePhone) {
			// 	oDataForSave.HomePhone = $scope.oUnit.sHomePhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.HomePhone = "";
			// }
			// if ($scope.oUnit.sWorkPhone) {
			// 	oDataForSave.WorkPhone = $scope.oUnit.sWorkPhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.WorkPhone = "";
			// }
			// if ($scope.oUnit.sMobilePhone) {
			// 	oDataForSave.MobilePhone = $scope.oUnit.sMobilePhone.replace(/\D/g, '');
			// } else {
			// 	oDataForSave.MobilePhone = "";
			// }

			// oDataForSave.Email = $scope.oUnit.sEmail;
			// oDataForSave.Fax = $scope.oUnit.sFax;
			// oDataForSave.Title = $scope.oUnit.sTitle;
			// oDataForSave.HomePhoneExtension = $scope.oUnit.sHomePhoneExtension;
			// oDataForSave.WorkPhoneExtension = $scope.oUnit.sWorkPhoneExtension;

			oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oUnit.aDescriptionTags);
			oDataForSave.Name = $scope.oUnit.sName;
			if ($scope.aSelectedPhases.length) {
				oDataForSave.PhaseGuid = $scope.aSelectedPhases[0].Guid;
			}

			// oDataForSave.BillingAddress = {};
			// oDataForSave.BillingAddress.BillingStreet = $scope.oUnit.sBillingStreet;
			// oDataForSave.BillingAddress.BillingCity = $scope.oUnit.sBillingCity;
			// oDataForSave.BillingAddress.BillingPostalCode = $scope.oUnit.sBillingPostalCode;

			// oDataForSave.ShippingAddress = {};
			// oDataForSave.ShippingAddress.ShippingStreet = $scope.oUnit.sShippingStreet;
			// oDataForSave.ShippingAddress.ShippingCity = $scope.oUnit.sShippingCity;
			// oDataForSave.ShippingAddress.ShippingPostalCode = $scope.oUnit.sShippingPostalCode;

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

			oDataForSave.LastModifiedAt = $scope.oUnit._lastModifiedAt;

			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateUnit({
						bShowSpinner: true,
						sKey: oDataForSave.Guid,
						//aLinks: aLinks,
						oData: oDataForSave,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessUpdate
					});
					break;
				case "create":
					apiProvider.createUnit({
						bShowSpinner: true,
						//aLinks: aLinks,
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