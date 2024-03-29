viewControllers.controller('clientDetailsView', ['$rootScope', '$scope', '$location', '$anchorScroll', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings',
    function($rootScope, $scope, $location, $anchorScroll, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings) {

        // the element you wish to scroll to.
        $location.hash('top');
        // call $anchorScroll()
        $anchorScroll();
        
        $scope.oForms = {};

        var sClientGuid = $stateParams.sClientGuid;
        $scope.sMode = $stateParams.sMode;

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayEditButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oClient",
            sOperation: "bUpdate"
        });

        $scope.bDisplayDeleteButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oClient",
            sOperation: "bDelete"
        });

        $scope.sAccountType = "";
        $scope.bShowBackButton = historyProvider.aHistoryStates.length > 0 ? true : false;
        if ($rootScope.sCurrentStateName === "app.clientDetailsWrapper.clientDetails") {
            // if ($scope.sMode === "display" || $scope.sMode === "edit") {
            //     $scope.$parent.bDisplayContactsList = true;
            //     $scope.$parent.bDisplayActivitiesList = true;
            // }
            $scope.sAccountType = "Client";
        }

        $scope.sAccountTypeGuid = ""; //for new client creation flow

        var bDataHasBeenModified = false;
        var oNavigateToInfo = {}; //needed to keen in scope info about state change parameters (for save and leave scenario)

        $scope.oClient = {
            _aPhases: [],
            bIsProspect: true,
        };

        var oClientWrapper = {
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

        var setDisplayedClientDetails = function(oClient) {
            var aClientPhasesGuids = [];
            $scope.oClient._guid = oClient.Guid;
            $scope.oClient._lastModifiedAt = oClient.LastModifiedAt;

            $scope.oClient.sName = oClient.Name;
            $scope.oClient.sPhone = oClient.MainPhone;
            $scope.oClient.sPhoneExtension = oClient.MainPhoneExtension;
            $scope.oClient.sSecondaryPhone = oClient.SecondaryPhone;
            $scope.oClient.sSecondaryPhoneExtension = oClient.SecondaryPhoneExtension;
            $scope.oClient.sWebsite = oClient.Website;
            $scope.oClient.sEmail = oClient.Email;
            $scope.oClient.sFax = oClient.Fax;
            $scope.oClient.bIsProspect = oClient.IsProspect;

            $scope.oClient.aTags = utilsProvider.tagsStringToTagsArray(oClient.DescriptionTags);

            if (oClient.BillingAddress) {
                $scope.oClient.sBillingStreet = oClient.BillingAddress.BillingStreet;
                $scope.oClient.sBillingCity = oClient.BillingAddress.BillingCity;
                $scope.oClient.sBillingPostalCode = oClient.BillingAddress.BillingPostalCode;
                $scope.oClient._billingCountryCode = oClient.BillingAddress.BillingCountry;
                $scope.oClient._billingProvinceCode = oClient.BillingAddress.BillingProvince;
            }

            if (oClient.ShippingAddress) {
                $scope.oClient.sShippingStreet = oClient.ShippingAddress.ShippingStreet;
                $scope.oClient.sShippingCity = oClient.ShippingAddress.ShippingCity;
                $scope.oClient.sShippingPostalCode = oClient.ShippingAddress.ShippingPostalCode;
                $scope.oClient._shippingCountryCode = oClient.ShippingAddress.ShippingCountry;
                $scope.oClient._shippingProvinceCode = oClient.ShippingAddress.ShippingProvince;
            }

            $scope.oClient.sCreatedAt = utilsProvider.dBDateToSting(oClient.CreatedAt);
            $scope.oClient.sLastModifiedAt = utilsProvider.dBDateToSting(oClient.LastModifiedAt);

            if (oClient.PhaseDetails) {
                $scope.oClient._aPhases = angular.copy(oClient.PhaseDetails.results);
            }
            for (var i = 0; i < $scope.oClient._aPhases.length; i++) {
                aClientPhasesGuids.push($scope.oClient._aPhases[i].Guid);
            }
            constructPhasesMultiSelect(aClientPhasesGuids);

            oClientWrapper.aData[0] = angular.copy($scope.oClient);
        };

        var oClient = cacheProvider.getEntityDetails({
            sCacheProviderAttribute: "oAccountEntity",
            sRequestSettings: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + "PhaseDetails/ProjectDetails,AccountTypeDetails", //filter + expand
            sKeyName: "Guid",
            sKeyValue: $stateParams.sClientGuid
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
                                oParentArrayWrapper: oClientWrapper,
                                sNameEN: "Name",
                                sNameFR: "Name",
                                sDependentKey: "ProvinceCode",
                                sParentKey: sParentKey,
                                sTargetArrayNameInParent: sTargetArrayName
                            });
                            if (oClientWrapper.aData[0]) {
                                $scope[sTargetArrayName] = angular.copy(oClientWrapper.aData[0][sTargetArrayName]);
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
                oParentArrayWrapper: oClientWrapper,
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
                oParentArrayWrapper: oClientWrapper,
                sNameEN: "Name",
                sNameFR: "Name",
                sDependentKey: "CountryCode",
                sParentKey: "_shippingCountryCode",
                sTargetArrayNameInParent: "aShippingCountries"
            });
            if (oClientWrapper.aData[0]) {
                $scope.aBillingCountries = angular.copy(oClientWrapper.aData[0].aBillingCountries);
                $scope.aShippingCountries = angular.copy(oClientWrapper.aData[0].aShippingCountries);
            }

            if ($scope.oClient._billingCountryCode) {
                constructProvinceSelect({
                    sParentKey: "_billingProvinceCode",
                    sProvincesFor: "billingAddress"
                });
            }
            if ($scope.oClient._shippingCountryCode) {
                constructProvinceSelect({
                    sParentKey: "_shippingProvinceCode",
                    sProvincesFor: "shippingAddress"
                });
            }
        };

        var onClientDetailsLoaded = function(oData) {
            setDisplayedClientDetails(oData);

            apiProvider.getCountriesWithProvinces({
                bShowSpinner: false,
                onSuccess: onCountriesLoaded
            });
        };

        var getClientDetails = function() {
            apiProvider.getAccount({
                sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
                sKey: sClientGuid,
                bShowSpinner: true,
                onSuccess: onClientDetailsLoaded,
            });
        };

        var onAccountTypeLoaded = function(oData) {
            $scope.sAccountTypeGuid = oData[0].Guid;
        };

        if ($scope.sMode !== "create") {
            if (angular.equals(oClient, {})) { //in case of F5
                getClientDetails();
            } else { //in case when data is retrieved from the cash
                setDisplayedClientDetails(oClient);

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

            if ($scope.sAccountType === "Client") {
                apiProvider.getClientAccountType({
                    bShowSpinner: false,
                    onSuccess: onAccountTypeLoaded
                });
            }
        };

        $scope.onEdit = function() {
            $state.go('app.clientDetailsWrapper.clientDetails', {
                sMode: "edit",
                sClientGuid: $scope.oClient._guid,
            });
        };


        var deleteClient = function() {
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
            oDataForSave.Guid = $scope.oClient._guid;
            oDataForSave.LastModifiedAt = $scope.oClient._lastModifiedAt;
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
                sHeader: $translate.instant('clientDetails_deletionConfirmationHeader'),
                sContent: $translate.instant('clientDetails_deletionConfirmationContent'),
                sOk: $translate.instant('global_ok'),
                sCancel: $translate.instant('global_cancel'),
                onOk: deleteClient,
                event: $event
            });
        };

        var prepareLinksForSave = function() { // link client to phases
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
            if ($scope.oForms.clientDetailsForm.clientName) {
                $scope.oForms.clientDetailsForm.clientName.$setDirty(); //to display validation messages on submit press
            }

            if (!$scope.oForms.clientDetailsForm.$valid) {
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
                    $scope.oClient._lastModifiedAt = oData.LastModifiedAt;
                    $scope.oClient.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
                    $scope.oClient.sCreatedAt = utilsProvider.dBDateToSting(oData.CreatedAt);
                    $scope.oClient._guid = oData.Guid;
                    $state.go('app.clientDetailsWrapper.clientDetails', {
                        sMode: "display",
                        sClientGuid: oData.Guid,
                    });
                } else {
                    $scope.oClient.sName = "";
                    $scope.oClient.sPhone = "";
                    $scope.oClient.sPhoneExtension = "";
                    $scope.oClient.sSecondaryPhone = "";
                    $scope.oClient.sSecondaryPhoneExtension = "";
                    $scope.oClient.sWebsite = "";
                    $scope.oClient.sEmail = "";
                    $scope.oClient.sFax = "";
                    $scope.oClient.aTags = [];

                    $scope.oClient.sBillingStreet = "";
                    $scope.oClient.sBillingCity = "";
                    $scope.oClient.sBillingPostalCode = "";
                    $scope.oClient.sShippingStreet = "";
                    $scope.oClient.sShippingCity = "";
                    $scope.oClient.sShippingPostalCode = "";

                    $scope.oForms.clientDetailsForm.clientName.$setPristine();
                    oDataForSave.BillingAddress = {};
                    oDataForSave.ShippingAddress = {};
                    $scope.oClient._aPhases = [];
                }
            };
            var onSuccessUpdate = function(oData) {
                bDataHasBeenModified = false;
                $scope.oClient._lastModifiedAt = oData.LastModifiedAt;
                $scope.oClient.sLastModifiedAt = utilsProvider.dBDateToSting(oData.LastModifiedAt);
                if (oNavigateTo) {
                    $state.go(oNavigateTo.toState, oNavigateTo.toParams);
                    return; // to prevent switch to displaly mode otherwise navigation will be to display state and not away...
                }
                $state.go('app.clientDetailsWrapper.clientDetails', {
                    sMode: "display",
                    sClientGuid: oData.Guid,
                });
            };
            oDataForSave.Guid = $scope.oClient._guid;
            oDataForSave.Name = $scope.oClient.sName;

            if ($scope.oClient.sPhone) {
                oDataForSave.MainPhone = $scope.oClient.sPhone.replace(/\D/g, '');
            } else {
                oDataForSave.MainPhone = "";
            }
            if ($scope.oClient.sSecondaryPhone) {
                oDataForSave.SecondaryPhone = $scope.oClient.sSecondaryPhone.replace(/\D/g, '');
            } else {
                oDataForSave.SecondaryPhone = "";
            }
            if ($scope.oClient.sFax) {
                oDataForSave.Fax = $scope.oClient.sFax.replace(/\D/g, '');
            } else {
                oDataForSave.Fax = "";
            }

            oDataForSave.IsProspect = $scope.oClient.bIsProspect;

            oDataForSave.Website = $scope.oClient.sWebsite;
            oDataForSave.Email = $scope.oClient.sEmail;
            oDataForSave.MainPhoneExtension = $scope.oClient.sPhoneExtension;
            oDataForSave.SecondaryPhoneExtension = $scope.oClient.sSecondaryPhoneExtension;

            oDataForSave.DescriptionTags = utilsProvider.tagsArrayToTagsString($scope.oClient.aTags);

            oDataForSave.BillingAddress = {};
            oDataForSave.BillingAddress.BillingStreet = $scope.oClient.sBillingStreet;
            oDataForSave.BillingAddress.BillingCity = $scope.oClient.sBillingCity;
            oDataForSave.BillingAddress.BillingPostalCode = $scope.oClient.sBillingPostalCode;

            oDataForSave.ShippingAddress = {};
            oDataForSave.ShippingAddress.ShippingStreet = $scope.oClient.sShippingStreet;
            oDataForSave.ShippingAddress.ShippingCity = $scope.oClient.sShippingCity;
            oDataForSave.ShippingAddress.ShippingPostalCode = $scope.oClient.sShippingPostalCode;

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

            oDataForSave.LastModifiedAt = $scope.oClient._lastModifiedAt;

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