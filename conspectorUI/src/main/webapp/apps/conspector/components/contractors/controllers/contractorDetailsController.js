viewControllers.controller('contractorDetailsView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS) {
		var sContractorGuid = $stateParams.sContractorGuid;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		$scope.sMode = $stateParams.sMode;
		$scope.oContractor = {
			_aPhases: [],
		};

		var oContractorWrapper = {
			aData: [{}]
		};

		var aCountriesWithProvinces = [];

		$scope.aBillingCountries = [];
		$scope.aBillingProvinces = [];
		$scope.aShippingCountries = [];
		$scope.aShippingProvinces = [];		

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

			if (oContractor.BillingAddress) {
				$scope.oContractor.sBillingStreet = oContractor.BillingAddress.BillingStreet;
				$scope.oContractor.sBillingCity = oContractor.BillingAddress.BillingCity;
				$scope.oContractor.sBillingPostalCode = oContractor.BillingAddress.BillingPostalCode;
				$scope.oContractor._billingCountryCode = oContractor.BillingAddress.BillingCountry;
				$scope.oContractor._billingProvinceCode = oContractor.BillingAddress.BillingProvince;
			}

			if (oContractor.ShippingAddress) {
				$scope.oContractor.sShippingStreet = oContractor.ShippingAddress.ShippingStreet;
				$scope.oContractor.sShippingCity = oContractor.ShippingAddress.ShippingCity;
				$scope.oContractor.sShippingPostalCode = oContractor.ShippingAddress.ShippingPostalCode;
				$scope.oContractor._shippingCountryCode = oContractor.ShippingAddress.ShippingCountry;
				$scope.oContractor._shippingProvinceCode = oContractor.ShippingAddress.ShippingProvince;
			}

			$scope.oContractor.sCreatedAt = utilsProvider.dBDateToSting(oContractor.CreatedAt);
			$scope.oContractor.sLastModifiedAt = utilsProvider.dBDateToSting(oContractor.LastModifiedAt);

			$scope.oContractor._aPhases = angular.copy(oContractor.PhaseDetails.results);
			for (var i = 0; i < $scope.oContractor._aPhases.length; i++) {
				aContractorPhasesGuids.push($scope.oContractor._aPhases[i].Guid);
			}
			constructPhasesMultiSelect(aContractorPhasesGuids);

			oContractorWrapper.aData[0] = angular.copy($scope.oContractor);
		};

		var oContractor = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oAccountEntity",
			sRequestSettings: "GeneralAttributes/IsDeleted eq false" + "PhaseDetails", //filter + expand
			sKeyName: "Guid",
			sKeyValue: $stateParams.sContractorGuid
		});

		var constructProvinceSelect = function(oParameters) {
			var sParentKey = oParameters.sParentKey;
			var sTargetArrayName = "";
			var sCountriesArrayName = "";

			if(oParameters.sProvincesFor === "billingAddress"){
				sTargetArrayName = "aBillingProvinces";
				sCountriesArrayName = "aBillingCountries";
			}else{
				sTargetArrayName = "aShippingProvinces";
				sCountriesArrayName = "aShippingCountries";
			}

			for (var i = 0; i < $scope[sCountriesArrayName].length; i++) {
				if ($scope[sCountriesArrayName][i].ticked) {
					for (var j = 0; j < aCountriesWithProvinces.length; j++) {
						if ($scope[sCountriesArrayName][i].CountryCode === aCountriesWithProvinces[j].CountryCode) {
							servicesProvider.constructDependentMultiSelectArray({
								oDependentArrayWrapper: {
									aData: aCountriesWithProvinces[j].ProvinceDetails.results
								},
								oParentArrayWrapper: oContractorWrapper,
								sNameEN: "Name",
								sNameFR: "Name",
								sDependentKey: "ProvinceCode",
								sParentKey: sParentKey,
								sTargetArrayNameInParent: sTargetArrayName
							});
							if (oContractorWrapper.aData[0]) {
								$scope[sTargetArrayName] = angular.copy(oContractorWrapper.aData[0][sTargetArrayName]);
							}
							break;
						}
					}
					break;
				}
			}
		};

		var onCountriesLoaded = function(aData) {
			aCountriesWithProvinces = angular.copy(aData);
			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oContractorWrapper,
				sNameEN: "Name",
				sNameFR: "Name",
				sDependentKey: "CountryCode",
				sParentKey: "_billingCountryCode",
				sTargetArrayNameInParent: "aBillingCountries"
			});

			servicesProvider.constructDependentMultiSelectArray({
				oDependentArrayWrapper: {
					aData: aData
				},
				oParentArrayWrapper: oContractorWrapper,
				sNameEN: "Name",
				sNameFR: "Name",
				sDependentKey: "CountryCode",
				sParentKey: "_shippingCountryCode",
				sTargetArrayNameInParent: "aShippingCountries"
			});
			if (oContractorWrapper.aData[0]) {
				$scope.aBillingCountries = angular.copy(oContractorWrapper.aData[0].aBillingCountries);
				$scope.aShippingCountries = angular.copy(oContractorWrapper.aData[0].aShippingCountries);
			}

			if ($scope.oContractor._billingCountryCode) {
				constructProvinceSelect({
					sParentKey: "_billingProvinceCode",
					sProvincesFor: "billingAddress"
				});
			}
			if ($scope.oContractor._shippingCountryCode) {
				constructProvinceSelect({
					sParentKey: "_shippingProvinceCode",
					sProvincesFor: "shippingAddress"
				});
			}
		};

		var onContractorDetailsLoaded = function(oData) {
			setDisplayedContractorDetails(oData);

			apiProvider.getCountriesWithProvinces({
				bShowSpinner: false,
				onSuccess: onCountriesLoaded
			});
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

				apiProvider.getCountriesWithProvinces({
					bShowSpinner: false,
					onSuccess: onCountriesLoaded
				});
			}
		} else {
			constructPhasesMultiSelect({
				aSelectedPhases: []
			});

			apiProvider.getCountriesWithProvinces({
				bShowSpinner: false,
				onSuccess: onCountriesLoaded
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
				sContent: $translate.instant('contractorDetails_deletionConfirmationContent'),
				sOk: $translate.instant('global_ok'),
				sCancel: $translate.instant('global_cancel'),
				onOk: deleteContractor,
				event: $event
			});
		};

		var prepareLinksForSave = function() { // link contractor to phases
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

		$scope.onDataModified = function() {
			bDataHasBeenModified = true;
		};

		$scope.onBillingCountryChanged = function() {
			$scope.onDataModified();
			constructProvinceSelect({
				sParentKey: "",
				sProvincesFor: "billingAddress"
			});

		};

		$scope.onShippingCountryChanged = function() {
			$scope.onDataModified();
			constructProvinceSelect({
				sParentKey: "",
				sProvincesFor: "shippingAddress"
			});

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
					$scope.oContractor._guid = oData.Guid;
				} else {
					$scope.oContractor.sName = "";
					$scope.oContractor.sPhone = "";
					$scope.oContractor.sSecondaryPhone = "";
					$scope.oContractor.sWebsite = "";
					$scope.oContractor.sEmail = "";
					$scope.oContractor.sFax = "";

					oDataForSave.BillingAddress = {};
					oDataForSave.ShippingAddress = {};
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

			oDataForSave.BillingAddress = {};
			oDataForSave.BillingAddress.BillingStreet = $scope.oContractor.sBillingStreet;
			oDataForSave.BillingAddress.BillingCity = $scope.oContractor.sBillingCity;
			oDataForSave.BillingAddress.BillingPostalCode = $scope.oContractor.sBillingPostalCode;

			oDataForSave.ShippingAddress = {};
			oDataForSave.ShippingAddress.ShippingStreet = $scope.oContractor.sShippingStreet;
			oDataForSave.ShippingAddress.ShippingCity = $scope.oContractor.sShippingCity;
			oDataForSave.ShippingAddress.ShippingPostalCode = $scope.oContractor.sShippingPostalCode;

			for (var i = 0; i < $scope.aBillingCountries.length; i++) {
				if ($scope.aBillingCountries[i].ticked) {
					oDataForSave.BillingAddress.BillingCountry = $scope.aBillingCountries[i].CountryCode;
					break;
				}
			}
			for (var i = 0; i < $scope.aBillingProvinces.length; i++) {
				if ($scope.aBillingProvinces[i].ticked) {
					oDataForSave.BillingAddress.BillingProvince = $scope.aBillingProvinces[i].ProvinceCode;
					break;
				}
			}
			for (var i = 0; i < $scope.aShippingCountries.length; i++) {
				if ($scope.aShippingCountries[i].ticked) {
					oDataForSave.ShippingAddress.ShippingCountry = $scope.aShippingCountries[i].CountryCode;
					break;
				}
			}
			for (var i = 0; i < $scope.aShippingProvinces.length; i++) {
				if ($scope.aShippingProvinces[i].ticked) {
					oDataForSave.ShippingAddress.ShippingProvince = $scope.aShippingProvinces[i].ProvinceCode;
					break;
				}
			}

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