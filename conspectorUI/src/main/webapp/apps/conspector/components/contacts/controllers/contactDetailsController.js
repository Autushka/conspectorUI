viewControllers.controller('contactDetailsView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider',
	function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider) {
		var sAccountGuid = $stateParams.sAccountGuid;
		var sContactGuid = $stateParams.sContactGuid;
		$scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;
		var bDataHasBeenModified = false;
		var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

		$scope.sMode = $stateParams.sMode;
		$scope.oContact = {};

		var oContactWrapper = {
			aData: [{}]
		};

		var aCountriesWithProvinces = [];

		$scope.aBillingCountries = [];
		$scope.aBillingProvinces = [];
		$scope.aShippingCountries = [];
		$scope.aShippingProvinces = [];

		var setDisplayedContactDetails = function(oContact) {
			$scope.oContact._guid = oContact.Guid;
			$scope.oContact._lastModifiedAt = oContact.LastModifiedAt;
			$scope.oContact.sFirstName = oContact.FirstName;
			$scope.oContact.sLastName = oContact.LastName;

			$scope.oContact.sEmail = oContact.Email;
			$scope.oContact.sHomePhone = oContact.HomePhone;
			$scope.oContact.sWorkPhone = oContact.WorkPhone;
			$scope.oContact.sMobilePhone = oContact.MobilePhone;
			$scope.oContact.sFax = oContact.Fax;
			$scope.oContact.sTitle = oContact.Title;
			$scope.oContact.aTags = utilsProvider.tagsStringToTagsArray(oContact.DescriptionTags);

			if (oContact.BillingAddress) {
				$scope.oContact.sBillingStreet = oContact.BillingAddress.BillingStreet;
				$scope.oContact.sBillingCity = oContact.BillingAddress.BillingCity;
				$scope.oContact.sBillingPostalCode = oContact.BillingAddress.BillingPostalCode;
				$scope.oContact._billingCountryCode = oContact.BillingAddress.BillingCountry;
				$scope.oContact._billingProvinceCode = oContact.BillingAddress.BillingProvince;
			}

			if (oContact.ShippingAddress) {
				$scope.oContact.sShippingStreet = oContact.ShippingAddress.ShippingStreet;
				$scope.oContact.sShippingCity = oContact.ShippingAddress.ShippingCity;
				$scope.oContact.sShippingPostalCode = oContact.ShippingAddress.ShippingPostalCode;
				$scope.oContact._shippingCountryCode = oContact.ShippingAddress.ShippingCountry;
				$scope.oContact._shippingProvinceCode = oContact.ShippingAddress.ShippingProvince;
			}

			$scope.oContact.sCreatedAt = utilsProvider.dBDateToSting(oContact.CreatedAt);
			$scope.oContact.sLastModifiedAt = utilsProvider.dBDateToSting(oContact.LastModifiedAt);

			oContactWrapper.aData[0] = angular.copy($scope.oContact);
		};

		var sRequestSettings = "GeneralAttributes/IsDeleted eq false and AccountGuid eq '" + sAccountGuid + "'";
		sRequestSettings = sRequestSettings + "UserDetails,ContactTypeDetails,AccountDetails";
		var oContact = cacheProvider.getEntityDetails({
			sCacheProviderAttribute: "oContactEntity",
			sRequestSettings: sRequestSettings, //filter + expand
			sKeyName: "Guid",
			sKeyValue: sContactGuid
		});

		var constructProvinceSelect = function(oParameters) {
			var sParentKey = oParameters.sParentKey;
			var sTargetArrayName = "";
			var sCountriesArrayName = "";

			if (oParameters.sProvincesFor === "billingAddress") {
				sTargetArrayName = "aBillingProvinces";
				sCountriesArrayName = "aBillingCountries";
			} else {
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
								oParentArrayWrapper: oContactWrapper,
								sNameEN: "Name",
								sNameFR: "Name",
								sDependentKey: "ProvinceCode",
								sParentKey: sParentKey,
								sTargetArrayNameInParent: sTargetArrayName
							});
							if (oContactWrapper.aData[0]) {
								$scope[sTargetArrayName] = angular.copy(oContactWrapper.aData[0][sTargetArrayName]);
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
				oParentArrayWrapper: oContactWrapper,
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
				oParentArrayWrapper: oContactWrapper,
				sNameEN: "Name",
				sNameFR: "Name",
				sDependentKey: "CountryCode",
				sParentKey: "_shippingCountryCode",
				sTargetArrayNameInParent: "aShippingCountries"
			});
			if (oContactWrapper.aData[0]) {
				$scope.aBillingCountries = angular.copy(oContactWrapper.aData[0].aBillingCountries);
				$scope.aShippingCountries = angular.copy(oContactWrapper.aData[0].aShippingCountries);
			}

			if ($scope.oContact._billingCountryCode) {
				constructProvinceSelect({
					sParentKey: "_billingProvinceCode",
					sProvincesFor: "billingAddress"
				});
			}
			if ($scope.oContact._shippingCountryCode) {
				constructProvinceSelect({
					sParentKey: "_shippingProvinceCode",
					sProvincesFor: "shippingAddress"
				});
			}
		};

		var onContactDetailsLoaded = function(oData) {
			setDisplayedContactDetails(oData);

			apiProvider.getCountriesWithProvinces({
				bShowSpinner: false,
				onSuccess: onCountriesLoaded
			});
		};

		var getContactDetails = function() {
			apiProvider.getContact({
				sKey: sContactGuid,
				bShowSpinner: true,
				onSuccess: onContactDetailsLoaded,
			});
		};

		if ($scope.sMode !== "create") {
			if (angular.equals(oContact, {})) { //in case of F5
				getContactDetails();
			} else { //in case when data is retrieved from the cash
				setDisplayedContactDetails(oContact);

				apiProvider.getCountriesWithProvinces({
					bShowSpinner: false,
					onSuccess: onCountriesLoaded
				});
			}
		} else {
			apiProvider.getCountriesWithProvinces({
				bShowSpinner: false,
				onSuccess: onCountriesLoaded
			});
		}

		$scope.onEdit = function() {
			$state.go('app.contactDetails', {
				sMode: "edit",
				sAccountGuid: sAccountGuid,
				sContactGuid: $scope.oContact._guid,
			});
		};


		var deleteContact = function() {
			var oDataForSave = {
				GeneralAttributes: {
					IsDeleted: true
				}
			};
			var onSuccessDelete = function() {
				if ($rootScope.sFromState) {
					$state.go($rootScope.sFromState, $rootScope.oFromStateParams);
				} else {
					$state.go("app.contactsList");
				}
			};
			oDataForSave.Guid = $scope.oContact._guid;
			oDataForSave.LastModifiedAt = $scope.oContact._lastModifiedAt;
			apiProvider.updateContact({
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
				sHeader: $translate.instant('contactDetails_deletionConfirmationHeader'),
				sContent: $translate.instant('contactDetails_deletionConfirmationContent'),
				sOk: $translate.instant('global_ok'),
				sCancel: $translate.instant('global_cancel'),
				onOk: deleteContact,
				event: $event
			});
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

			var onSuccessCreation = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
				}
				if (!bSaveAndNew) {
					$state.go('app.contactDetails', {
						sMode: "display",
						sAccountGuid: sAccountGuid,
						sContactGuid: oData.Guid
					});
					$scope.oContact._lastModifiedAt = oData.LastModifiedAt;
					$scope.oContact.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
					$scope.oContact.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
					$scope.oContact._guid = oData.Guid;
				} else {
					$scope.oContact.sFirstName = "";
					$scope.oContact.sLastName = "";

					$scope.oContact.sEmail = "";
					$scope.oContact.sHomePhone = "";
					$scope.oContact.sWorkPhone = "";
					$scope.oContact.sMobilePhone = "";
					$scope.oContact.sFax = "";
					$scope.oContact.sTitle = "";
					$scope.oContact.aTags = [];

					oDataForSave.BillingAddress = {};
					oDataForSave.ShippingAddress = {};
				}
			};
			var onSuccessUpdate = function(oData) {
				bDataHasBeenModified = false;
				if (oNavigateTo) {
					$state.go(oNavigateTo.toState, oNavigateTo.toParams);
				}

				$scope.oContact._lastModifiedAt = oData.LastModifiedAt;
				$scope.oContact.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
				$state.go('app.contactDetails', {
					sMode: "display",
					sAccountGuid: sAccountGuid,
					sContactGuid: oData.Guid
				});
			};
			oDataForSave.Guid = $scope.oContact._guid;
			oDataForSave.AccountGuid = sAccountGuid;

			oDataForSave.FirstName = $scope.oContact.sFirstName;
			oDataForSave.LastName = $scope.oContact.sLastName;
			oDataForSave.HomePhone = $scope.oContact.sHomePhone;
			oDataForSave.WorkPhone = $scope.oContact.sWorkPhone;
			oDataForSave.MobilePhone = $scope.oContact.sMobilePhone;
			oDataForSave.Email = $scope.oContact.sEmail;
			oDataForSave.Fax = $scope.oContact.sFax;
			oDataForSave.Title = $scope.oContact.sTitle;

			oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oContact.aTags);

			oDataForSave.BillingAddress = {};
			oDataForSave.BillingAddress.BillingStreet = $scope.oContact.sBillingStreet;
			oDataForSave.BillingAddress.BillingCity = $scope.oContact.sBillingCity;
			oDataForSave.BillingAddress.BillingPostalCode = $scope.oContact.sBillingPostalCode;

			oDataForSave.ShippingAddress = {};
			oDataForSave.ShippingAddress.ShippingStreet = $scope.oContact.sShippingStreet;
			oDataForSave.ShippingAddress.ShippingCity = $scope.oContact.sShippingCity;
			oDataForSave.ShippingAddress.ShippingPostalCode = $scope.oContact.sShippingPostalCode;

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

			oDataForSave.LastModifiedAt = $scope.oContact._lastModifiedAt;

			switch ($scope.sMode) {
				case "edit":
					apiProvider.updateContact({
						bShowSpinner: true,
						sKey: oDataForSave.Guid,
						oData: oDataForSave,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessUpdate
					});
					break;
				case "create":
					apiProvider.createContact({
						bShowSpinner: true,
						oData: oDataForSave,
						bShowSuccessMessage: true,
						bShowErrorMessage: true,
						onSuccess: onSuccessCreation,
					});
					break;
			}
		};

		$scope.onBack = function() {
			historyProvider.navigateBack({oState: $state});
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