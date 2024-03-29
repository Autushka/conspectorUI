viewControllers.controller('deficiencyQuickAddView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout', '$mdSidenav', '$window', '$cordovaCamera',
    function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout, $mdSidenav, $window, $cordovaCamera) {
        historyProvider.removeHistory();

        servicesProvider.constructLogoUrl();
        servicesProvider.constructMenuIconUrl();

        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        var bCanContinue = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oDeficiency",
            sOperation: "bCreate"
        });

        if (!bCanContinue) {
            servicesProvider.logOut(); //cancel login in case of 0 roles assigned to the user
            utilsProvider.displayMessage({
                sText: $translate.instant('global_noRightToCreateDeficiencies'),
                sType: "error"
            });
        }

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation        


        $scope.onMainMenu = function() {
            $state.go("mainMenuHybrid");
        };

        if (!$rootScope.aUnits) {
            $rootScope.aUnits = [];
        }
        if (!$rootScope.sUnitFilter) {
            $rootScope.sUnitFilter = "";
        }
        if (!$rootScope.aFilteredUnits) {
            $rootScope.aFilteredUnits = [];
        }
        if (!$rootScope.bUnitWasSelected) {
            $rootScope.bUnitWasSelected = false;
        }
        if (!$rootScope.aDescriptionTags) {
            $rootScope.aDescriptionTags = [];
        }
        if (!$rootScope.aLocationTags) {
            $rootScope.aLocationTags = [];
        }
        if (!$rootScope.aContractors) {
            $rootScope.aContractors = [];
        }
        if (!$rootScope.sContractorsFilter) {
            $rootScope.sContractorsFilter = "";
        }
        if (!$rootScope.aFilteredContractors) {
            $rootScope.aFilteredContractors = [];
        }
        if (!$rootScope.bContractorWasSelected) {
            $rootScope.bContractorWasSelected = false;
        }

        if (!$rootScope.oDeficiencyAttributes) {
            $rootScope.oDeficiencyAttributes = {
                oPhase: {
                    sDescription: $translate.instant('deficiencyDetails_associatedProjectsAndPhases'), //"Project - Phase",
                    sValue: "...",
                    bIsSelectionUnabled: true,
                },
                oUnit: {
                    sDescription: $translate.instant('deficiencyDetails_unit'), //"Unit",
                    sValue: "...",
                    bIsSelectionUnabled: false,
                },
                oStatus: {
                    sDescription: $translate.instant('deficiencyDetails_status'), //"Status",
                    sValue: "...",
                    sIconUrl: "",
                    bIsSelectionUnabled: true,
                },
                oPriority: {
                    sDescription: $translate.instant('deficiencyDetails_deficiencyPriority'), //"Priority",
                    sValue: "...",
                    bIsSelectionUnabled: true,
                },
                oUser: {
                    sDescription: $translate.instant('deficiencyDetails_assignedUser'), //"User",
                    sValue: "...",
                    bIsSelectionUnabled: true,
                },
                oDescriptionTags: {
                    sDescription: $translate.instant('deficiencyDetails_descriptionTags'), //"Description Tags",
                    sValue: "...",
                    bIsSelectionUnabled: true,
                },
                oLocationTags: {
                    sDescription: $translate.instant('deficiencyDetails_locationTags'), //"Location Tags",
                    sValue: "...",
                    bIsSelectionUnabled: true,
                },
                oContractors: {
                    sDescription: $translate.instant('deficiencyDetails_contractors'), //"Contractors",
                    sValue: "...",
                    bIsSelectionUnabled: false,
                },
                oImages: {
                    sDescription: $translate.instant('global_imagesMobile'), //"Photos",
                    iValue: 0,
                    bIsSelectionUnabled: true,
                },
            };
        }

        var onTaskTypesLoaded = function(aData) {
            for (var i = 0; i < aData.length; i++) {
                if (aData[i].NameEN === 'Deficiency') {
                    $rootScope.sTaskTypeGuid = aData[i].Guid;
                    break;
                }
            }
        };

        if (!$rootScope.sTaskTypeGuid) {
            apiProvider.getTaskTypes({
                bShowSpinner: false,
                onSuccess: onTaskTypesLoaded
            });
        }

        if (!$rootScope.aProjectsWithPhases) {
            $rootScope.aProjectsWithPhases = [];
            $rootScope.bPhaseWasSelected = false;
            var aPhases = [];
            if (!$rootScope.aProjectsWithPhases.length) {

                var aProjectsWithPhases = servicesProvider.constructUserProjectsPhases();
                for (var i = 0; i < aProjectsWithPhases.length; i++) {
                    var aPhases = [];
                    if (aProjectsWithPhases[i].NameFR && $translate.use() === "fr") {
                        aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameFR;
                    } else {
                        aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameEN;
                    }
                    for (var j = 0; j < aProjectsWithPhases[i].PhaseDetails.results.length; j++) {
                        if (aProjectsWithPhases[i].PhaseDetails.results[j].NameFR && $translate.use() === "fr") {
                            aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameFR;
                        } else {
                            aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameEN;
                        }

                        aPhases.push({
                            sPhaseName: aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
                            Guid: aProjectsWithPhases[i].PhaseDetails.results[j].Guid,
                            bTicked: false,
                        });
                    }
                    $rootScope.aProjectsWithPhases.push({
                        sProjectName: aProjectsWithPhases[i].sDescription,
                        aPhases: aPhases
                    });
                }
            }
        }

        var onUnitsLoaded = function(oData) {
            oData.UnitDetails.results = $filter('filter')(oData.UnitDetails.results, function(oItem, iIndex) {
                return !oItem.GeneralAttributes.IsDeleted
            });

            for (var i = 0; i < oData.UnitDetails.results.length; i++) {
                $rootScope.aUnits.push({
                    sGuid: oData.UnitDetails.results[i].Guid,
                    sName: utilsProvider.convertStringToInt(oData.UnitDetails.results[i].Name),
                    sCleanedName: utilsProvider.replaceSpecialChars(utilsProvider.convertStringToInt(oData.UnitDetails.results[i].Name)),
                    bTicked: false
                })
            }
            $rootScope.aUnits = $filter('orderBy')($rootScope.aUnits, ["sName"]);
            $rootScope.aFilteredUnits = $filter('filter')($rootScope.aUnits, {
                sName: $rootScope.sUnitFilter
            });
        };

        var onContractorsLoaded = function(oData) {
            oData.AccountDetails.results = $filter('filter')(oData.AccountDetails.results, function(oItem, iIndex) {
                return !oItem.GeneralAttributes.IsDeleted && oItem.AccountTypeDetails.NameEN === "Contractor";
            });
            oData.AccountDetails.results = $filter('orderBy')(oData.AccountDetails.results, ["Name"]);
            for (var i = 0; i < oData.AccountDetails.results.length; i++) {
                $rootScope.aContractors.push({
                    sGuid: oData.AccountDetails.results[i].Guid,
                    sName: oData.AccountDetails.results[i].Name,
                    sCleanedName: utilsProvider.replaceSpecialChars(oData.AccountDetails.results[i].Name),
                    bTicked: false,
                })
            }

            $rootScope.aFilteredContractors = $filter('filter')($rootScope.aContractors, {
                sName: $rootScope.sContractorsFilter
            });
        };

        var onStatusesLoaded = function(aData) {
            var sDescription = "";
            for (var i = 0; i < aData.length; i++) {
                aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
            }

            aData = $filter('orderBy')(aData, ["_sortingSequence"]);
            for (var i = 0; i < aData.length; i++) {
                sDescription = "";

                if (aData[i].NameFR && $translate.use() === "fr") {
                    sDescription = aData[i].NameFR;
                } else {
                    sDescription = aData[i].NameEN;
                }

                $scope.aStatuses.push({
                    sGuid: aData[i].Guid,
                    sName: sDescription,
                    bTicked: false,
                    sIconUrl: CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + aData[i].AssociatedIconFileGuid,
                })
            }
            //initial value
            $rootScope.aStatuses[0].bTicked = true;
            $rootScope.oDeficiencyAttributes["oStatus"].sValue = $rootScope.aStatuses[0].sName;
            $rootScope.oDeficiencyAttributes["oStatus"].sSelectedItemGuid = $rootScope.aStatuses[0].sGuid;
            $rootScope.oDeficiencyAttributes["oStatus"].sIconUrl = $rootScope.aStatuses[0].sIconUrl;

            $rootScope.bStatusWasSelected = true;
        };

        if (!$rootScope.aStatuses) {
            $rootScope.aStatuses = [];
            $rootScope.bStatusWasSelected = false;
            apiProvider.getDeficiencyStatuses({
                onSuccess: onStatusesLoaded
            });
        }

        var onPrioritiesLoaded = function(aData) {
            var sDescription = "";
            for (var i = 0; i < aData.length; i++) {
                aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
            }

            aData = $filter('orderBy')(aData, ["_sortingSequence"]);
            for (var i = 0; i < aData.length; i++) {
                sDescription = "";

                if (aData[i].NameFR && $translate.use() === "fr") {
                    sDescription = aData[i].NameFR;
                } else {
                    sDescription = aData[i].NameEN;
                }

                $rootScope.aPriorities.push({
                    sGuid: aData[i].Guid,
                    sName: sDescription,
                    bTicked: false,
                });
            }

            $rootScope.aPriorities[0].bTicked = true;
            $rootScope.oDeficiencyAttributes["oPriority"].sValue = $rootScope.aPriorities[0].sName;
            $rootScope.oDeficiencyAttributes["oPriority"].sSelectedItemGuid = $rootScope.aPriorities[0].sGuid;
            $rootScope.bPriorityWasSelected = true;
        };

        if (!$rootScope.aPriorities) {
            $rootScope.aPriorities = [];
            $rootScope.bPriorityWasSelected = false;
            apiProvider.getDeficiencyPriorities({
                onSuccess: onPrioritiesLoaded
            });
        }

        var onUsersLoaded = function(aData) {
            var bIsTicked = false;
            aData = $filter('filter')(aData, function(oItem, iIndex) {
                var bMatchFound = false;
                for (var i = 0; i < oItem.CompanyDetails.results.length; i++) {
                    if (oItem.CompanyDetails.results[i].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
                        bMatchFound = true;
                        break;
                    }
                }
                return bMatchFound;
            });

            aData = $filter('orderBy')(aData, ["UserName"]);
            for (var i = 0; i < aData.length; i++) {
                bIsTicked = false;
                if (aData[i].UserName === cacheProvider.oUserProfile.sUserName) {
                    bIsTicked = true;
                    $rootScope.oDeficiencyAttributes["oUser"].sValue = aData[i].UserName;
                    $rootScope.oDeficiencyAttributes["oUser"].sSelectedItemGuid = aData[i].UserName;
                    $rootScope.bUserWasSelected = true;
                }

                $rootScope.aUsers.push({
                    sGuid: aData[i].UserName,
                    sName: aData[i].UserName,
                    bTicked: bIsTicked,
                });
            }
            $rootScope.bUserWasSelected = true;
        };

        if (!$rootScope.aUsers) {
            $rootScope.aUsers = [];
            $rootScope.bUserWasSelected = false;
            apiProvider.getUsers({
                sExpand: "CompanyDetails",
                onSuccess: onUsersLoaded
            });
        }

        $scope.onPhaseAttribute = function() {
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oPhase.sDescription;

            $rootScope.bIsItemsListsOpen = true;
            //$state.go("deficiencyQuickAddItemsLists");
        };

        $scope.onUnitAttribute = function() {
            if (!$rootScope.oDeficiencyAttributes.oUnit.bIsSelectionUnabled) {
                return;
            }

            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oUnit.sDescription;
            if (!$rootScope.aUnits.length) {
                apiProvider.getPhase({
                    sExpand: "UnitDetails",
                    sKey: $rootScope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid,
                    onSuccess: onUnitsLoaded
                });

            }

            $rootScope.bIsItemsListsOpen = true;
        };

        $scope.onStatusAttribute = function() {
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oStatus.sDescription;
            $rootScope.bIsItemsListsOpen = true;
        };

        $scope.onPriorityAttribute = function() {
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oPriority.sDescription;
            $rootScope.bIsItemsListsOpen = true;
        };

        $scope.onUserAttribute = function() {
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oUser.sDescription;
            $rootScope.bIsItemsListsOpen = true;
        };

        $scope.onDescriptionTagsAttribute = function() {
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oDescriptionTags.sDescription;
            $rootScope.bIsItemsListsOpen = true;
        };

        $scope.onLocationTagsAttribute = function() {
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oLocationTags.sDescription;
            $rootScope.bIsItemsListsOpen = true;
        };

        $scope.onContractorsAttribute = function() {
            if (!$rootScope.oDeficiencyAttributes.oContractors.bIsSelectionUnabled) {
                return;
            }
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oContractors.sDescription;
            if (!$rootScope.aContractors.length) {
                apiProvider.getPhase({
                    sKey: $scope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid,
                    sExpand: "AccountDetails/AccountTypeDetails",
                    onSuccess: onContractorsLoaded,
                });
            }

            $rootScope.bIsItemsListsOpen = true;
        };

        $scope.onImagesAttribute = function() {
           // onAddImage();
            $rootScope.sSideNavHeader = $rootScope.oDeficiencyAttributes.oImages.sDescription;

            $rootScope.bIsItemsListsOpen = true;
        };

        var prepareLinksForSave = function() { // link contact to phases
            var aLinks = [];
            var aUri = [];
            var sUri = "";

            if ($rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids && $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids.length) {
                $scope.sAccountValues = $rootScope.oDeficiencyAttributes["oContractors"].sValue;
                for (var i = 0; i < $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids.length; i++) {
                    sUri = "Accounts('" + $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids[i] + "')";
                    aUri.push(sUri);

                    $scope.sAccountGuids = $scope.sAccountGuids + $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids[i] + "; ";
                }
            }

            aLinks.push({
                sRelationName: "AccountDetails",
                bKeepCompanyDependentLinks: true,
                aUri: aUri
            });

            return aLinks;
        };

        $scope.onSave = function() {
            var onSuccessCreation = function(oData) {
                $rootScope.sFileMetadataSetGuid = "";

                $rootScope.oDeficiencyAttributes.oDescriptionTags.sValue = "...";
                $rootScope.aDescriptionTags = [];

                $rootScope.oDeficiencyAttributes.oLocationTags.sValue = "...";
                $rootScope.aLocationTags = [];

                $rootScope.oDeficiencyAttributes.oContractors.sValue = "...";
                $rootScope.aContractors = [];
                $rootScope.oDeficiencyAttributes.oImages.iValue = 0;

                $rootScope.sContractorsFilter = "";

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
                    aData: [{Guid: oData.Guid}],
                    onSuccess: onInterestedUsersLoaded
                });
            };

            var oDataForSave = {};

            var bIsDataValid = true;
            if ($rootScope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid) {
                oDataForSave.PhaseGuid = $rootScope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid;
            } else {
                bIsDataValid = false;
            }
            if ($rootScope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid) {
                oDataForSave.UnitGuid = $rootScope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid;
            } else {
                bIsDataValid = false;
            }
            if (!bIsDataValid) {
                utilsProvider.displayMessage({
                    sText: $translate.instant("global_projectAndUnitMandatory"),
                    sType: 'error'
                });
                return;
            }

            if ($rootScope.sTaskTypeGuid) {
                oDataForSave.TaskTypeGuid = $rootScope.sTaskTypeGuid;
            }
            if ($rootScope.oDeficiencyAttributes["oStatus"].sSelectedItemGuid) {
                oDataForSave.TaskStatusGuid = $rootScope.oDeficiencyAttributes["oStatus"].sSelectedItemGuid;
            }
            if ($rootScope.oDeficiencyAttributes["oPriority"].sSelectedItemGuid) {
                oDataForSave.TaskPriorityGuid = $rootScope.oDeficiencyAttributes["oPriority"].sSelectedItemGuid;
            }
            if ($rootScope.oDeficiencyAttributes["oUser"].sSelectedItemGuid) {
                oDataForSave.UserName = $rootScope.oDeficiencyAttributes["oUser"].sSelectedItemGuid;
            }
            if ($rootScope.oDeficiencyAttributes["oDescriptionTags"].sValue !== "...") {
                oDataForSave.DescriptionTags = $rootScope.oDeficiencyAttributes["oDescriptionTags"].sValue;
            }
            if ($rootScope.oDeficiencyAttributes["oLocationTags"].sValue !== "...") {
                oDataForSave.LocationTags = $rootScope.oDeficiencyAttributes["oLocationTags"].sValue;
            }

            oDataForSave.FileMetadataSetGuid = $rootScope.sFileMetadataSetGuid;

            $scope.sAccountValues = "";
            $scope.sAccountGuids = "";

            var aLinks = prepareLinksForSave();

            oDataForSave.AccountValues = $scope.sAccountValues;
            oDataForSave.AccountGuids = $scope.sAccountGuids;

            apiProvider.createDeficiency({
                bShowSpinner: true,
                aLinks: aLinks,
                oData: oDataForSave,
                bShowSuccessMessage: true,
                bShowErrorMessage: true,
                onSuccess: onSuccessCreation,
            });
        };
    }
]);