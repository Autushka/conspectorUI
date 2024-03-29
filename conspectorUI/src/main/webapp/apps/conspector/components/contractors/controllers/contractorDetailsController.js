viewControllers.controller('contractorDetailsView', ['$rootScope', '$scope', '$location', '$anchorScroll', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings',
    function($rootScope, $scope, $location, $anchorScroll, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings) {

        // the element you wish to scroll to.
        $location.hash('top');
        // call $anchorScroll()
        $anchorScroll();

        $scope.oForms = {};

        var sContractorGuid = $stateParams.sContractorGuid;
        $scope.sAccountType = "";
        $scope.sMode = $stateParams.sMode;

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oContractor",
            sOperation: "bUpdate"
        });

        $scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oContractor",
            sOperation: "bDelete"
        });

        $scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;
        if ($rootScope.sCurrentStateName === "app.contractorDetailsWrapper.contractorDetails") {
            // if ($scope.sMode === "display" || $scope.sMode === "edit") {
            //     $scope.$parent.bDisplayContactsList = true;
            //     $scope.$parent.bDisplayDeficienciesList = true;
            //     $scope.$parent.bDisplayActivitiesList = true;
            // }
            $scope.sAccountType = "Contractor";
        }

        $scope.sAccountTypeGuid = ""; //for new contractor creation flow

        var bDataHasBeenModified = false;
        var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

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
            $scope.oContractor.sPhoneExtension = oContractor.MainPhoneExtension;
            $scope.oContractor.sSecondaryPhone = oContractor.SecondaryPhone;
            $scope.oContractor.sSecondaryPhoneExtension = oContractor.SecondaryPhoneExtension;
            $scope.oContractor.sWebsite = oContractor.Website;
            $scope.oContractor.sEmail = oContractor.Email;
            $scope.oContractor.sFax = oContractor.Fax;

            $scope.oContractor.aTags = utilsProvider.tagsStringToTagsArray(oContractor.DescriptionTags);

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
            if (oContractor.PhaseDetails) {
                $scope.oContractor._aPhases = angular.copy(oContractor.PhaseDetails.results);
            }
            for (var i = 0; i < $scope.oContractor._aPhases.length; i++) {
                aContractorPhasesGuids.push($scope.oContractor._aPhases[i].Guid);
            }
            constructPhasesMultiSelect(aContractorPhasesGuids);

            oContractorWrapper.aData[0] = angular.copy($scope.oContractor);
        };

        var oContractor = cacheProvider.getEntityDetails({
            sCacheProviderAttribute: "oAccountEntity",
            sRequestSettings: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + "PhaseDetails/ProjectDetails,AccountTypeDetails", //filter + expand
            sKeyName: "Guid",
            sKeyValue: $stateParams.sContractorGuid
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
            apiProvider.getAccount({
                sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
                sKey: sContractorGuid,
                bShowSpinner: true,
                onSuccess: onContractorDetailsLoaded,
            });
        };

        var onAccountTypeLoaded = function(oData) {
            $scope.sAccountTypeGuid = oData[0].Guid;
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

            if ($scope.sAccountType === "Contractor") {
                apiProvider.getContractorAccountType({
                    bShowSpinner: false,
                    onSuccess: onAccountTypeLoaded
                });
            }
            if ($scope.sAccountType === "Client") {
                apiProvider.getClientAccountType({
                    bShowSpinner: false,
                    onSuccess: onAccountTypeLoaded
                });
            }
        }

        $scope.onEdit = function() {
            $state.go('app.contractorDetailsWrapper.contractorDetails', {
                sMode: "edit",
                sContractorGuid: $scope.oContractor._guid,
            });
        };


        var deleteContractor = function() {
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

            if ($scope.aSelectedPhases && $scope.aSelectedPhases.length) {
                for (var i = 0; i < $scope.aSelectedPhases.length; i++) {
                    sUri = "Phases('" + $scope.aSelectedPhases[i].Guid + "')";
                    aUri.push(sUri);
                }
            }

            aLinks.push({
                sRelationName: "PhaseDetails",
                bKeepCompanyDependentLinks: true,
                aUri: aUri
            });

            return aLinks;
        };

        // $scope.onCloseCheckSelectedPhasesLength = function(){
        // 	if ($scope.aSelectedPhases.length == 0)
        // 	$scope.onSelectedPhasesModified();
        // };

        // $scope.onSelectedPhasesModified = function() {
        // 	$scope.onDataModified();
        // 	$scope.oForms.contractorDetailsForm.selectedPhases.$setDirty();
        // };

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

        $scope.onBack = function() {
            historyProvider.navigateBack({
                oState: $state
            });
        };

        $scope.onSave = function(bSaveAndNew, oNavigateTo) {
            // if ($scope.oForms.contractorDetailsForm.selectedPhases) {
            //     $scope.oForms.contractorDetailsForm.selectedPhases.$setDirty(); //to display validation messages on submit press
            // }
            if ($scope.oForms.contractorDetailsForm.contractorName) {
                $scope.oForms.contractorDetailsForm.contractorName.$setDirty(); //to display validation messages on submit press
            }

            if (!$scope.oForms.contractorDetailsForm.$valid) {
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
                if (!bSaveAndNew) {
                    $scope.oContractor._lastModifiedAt = oData.LastModifiedAt;
                    $scope.oContractor.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
                    $scope.oContractor.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
                    $scope.oContractor._guid = oData.Guid;
                    // if ($scope.$parent && $scope.$parent.sViewName === "contractorDetailsWrapperView") { // to pass current mode to the wrapper (info needed to show/hide subviews based on the current mode)
                    // 	//$scope.$parent.oStateParams.sMode = "display";
                    // }
                    $state.go('app.contractorDetailsWrapper.contractorDetails', {
                        sMode: "display",
                        sContractorGuid: oData.Guid,
                    });
                } else {
                    $scope.oContractor.sName = "";
                    $scope.oContractor.sPhone = "";
                    $scope.oContractor.sPhoneExtension = "";
                    $scope.oContractor.sSecondaryPhone = "";
                    $scope.oContractor.sSecondaryPhoneExtension = "";
                    $scope.oContractor.sWebsite = "";
                    $scope.oContractor.sEmail = "";
                    $scope.oContractor.sFax = "";
                    $scope.oContractor.aTags = [];

                    $scope.oContractor.sBillingStreet = "";
                    $scope.oContractor.sBillingCity = "";
                    $scope.oContractor.sBillingPostalCode = "";
                    $scope.oContractor.sShippingStreet = "";
                    $scope.oContractor.sShippingCity = "";
                    $scope.oContractor.sShippingPostalCode = "";

                    $scope.oForms.contractorDetailsForm.contractorName.$setPristine();
                    oDataForSave.BillingAddress = {};
                    oDataForSave.ShippingAddress = {};
                    $scope.oContractor._aPhases = [];
                }
            };
            var onSuccessUpdate = function(oData) {
                bDataHasBeenModified = false;
                $scope.oContractor._lastModifiedAt = oData.LastModifiedAt;
                $scope.oContractor.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
                if (oNavigateTo) {
                    $state.go(oNavigateTo.toState, oNavigateTo.toParams);
                    return; // to prevent switch to displaly mode otherwise navigation will be to display state and not away...
                }
                // if ($scope.$parent && $scope.$parent.sViewName === "contractorDetailsWrapperView") { // to pass current mode to the wrapper (info needed to show/hide subviews based on the current mode)
                // 	//$scope.$parent.oStateParams.sMode = "display";

                // }
                $state.go('app.contractorDetailsWrapper.contractorDetails', {
                    sMode: "display",
                    sContractorGuid: oData.Guid,
                });
            };
            oDataForSave.Guid = $scope.oContractor._guid;
            oDataForSave.Name = $scope.oContractor.sName;

            if ($scope.oContractor.sPhone) {
                oDataForSave.MainPhone = $scope.oContractor.sPhone.replace(/\D/g, '');
            } else {
                oDataForSave.MainPhone = "";
            }

            if ($scope.oContractor.sSecondaryPhone) {
                oDataForSave.SecondaryPhone = $scope.oContractor.sSecondaryPhone.replace(/\D/g, '');
            } else {
                oDataForSave.SecondaryPhone = "";
            }

            if ($scope.oContractor.sFax) {
                oDataForSave.Fax = $scope.oContractor.sFax.replace(/\D/g, '');
            } else {
                oDataForSave.Fax = "";
            }

            oDataForSave.Website = $scope.oContractor.sWebsite;
            oDataForSave.Email = $scope.oContractor.sEmail;
            oDataForSave.MainPhoneExtension = $scope.oContractor.sPhoneExtension;
            oDataForSave.SecondaryPhoneExtension = $scope.oContractor.sSecondaryPhoneExtension;

            oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oContractor.aTags);

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
                    oDataForSave.AccountTypeGuid = $scope.sAccountTypeGuid;
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

        $scope.$on("$destroy", function() {
            $rootScope.aAccountPhasesGuids = [];
            for (var i = 0; i < $scope.aSelectedPhases.length; i++) {
                $rootScope.aAccountPhasesGuids.push($scope.aSelectedPhases[i].Guid);
            }
        });
    }
]);