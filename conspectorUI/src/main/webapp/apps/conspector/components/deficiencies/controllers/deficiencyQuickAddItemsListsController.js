viewControllers.controller('deficiencyQuickAddItemsListsView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout', '$mdSidenav', '$window', '$cordovaCamera',
    function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout, $mdSidenav, $window, $cordovaCamera) {

        switch ($rootScope.sSideNavHeader) {
                // case $rootScope.oDeficiencyAttributes.oUnit.sDescription:
                //     if (!$rootScope.aUnits.length) {
                //         apiProvider.getPhase({
                //             sExpand: "UnitDetails",
                //             sKey: $rootScope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid,
                //             onSuccess: onUnitsLoaded
                //         });

                //     }  
                //     break;
                // case $rootScope.oDeficiencyAttributes.oContractors.sDescription:
                //     if (!$rootScope.aContractors.length) {
                //         apiProvider.getPhase({
                //             sKey: $scope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid,
                //             sExpand: "AccountDetails/AccountTypeDetails",
                //             onSuccess: onContractorsLoaded,
                //         });  
                //     }                  
                //     break;
        }

        $scope.onClose = function() {
            switch ($rootScope.sSideNavHeader) {
                case $rootScope.oDeficiencyAttributes.oPhase.sDescription:
                    if ($rootScope.bPhaseWasSelected) {
                        $rootScope.oDeficiencyAttributes["oUnit"].bIsSelectionUnabled = true;
                        $rootScope.oDeficiencyAttributes["oContractors"].bIsSelectionUnabled = true;
                        $rootScope.oDeficiencyAttributes["oPhase"].sValue = "";
                        for (var i = 0; i < $rootScope.aProjectsWithPhases.length; i++) {
                            for (var j = 0; j < $rootScope.aProjectsWithPhases[i].aPhases.length; j++) {
                                if ($rootScope.aProjectsWithPhases[i].aPhases[j].bTicked) {
                                    $rootScope.oDeficiencyAttributes["oPhase"].sValue = $rootScope.oDeficiencyAttributes["oPhase"].sValue + $rootScope.aProjectsWithPhases[i].sProjectName + " - " + $rootScope.aProjectsWithPhases[i].aPhases[j].sPhaseName;
                                    $rootScope.oDeficiencyAttributes["oPhase"].sSelectedItemGuid = $rootScope.aProjectsWithPhases[i].aPhases[j].Guid;
                                    break;
                                }
                            }
                        }
                    }
                    break;
                case $rootScope.oDeficiencyAttributes.oUnit.sDescription:
                    if ($rootScope.bUnitWasSelected) {
                        $rootScope.oDeficiencyAttributes["oUnit"].sValue = "";
                        for (var i = 0; i < $rootScope.aUnits.length; i++) {
                            if ($rootScope.aUnits[i].bTicked) {
                                $rootScope.oDeficiencyAttributes["oUnit"].sValue = $rootScope.aUnits[i].sName;
                                $rootScope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid = $rootScope.aUnits[i].sGuid;
                                break;
                            }
                        }
                    }
                    break;
                case $rootScope.oDeficiencyAttributes.oStatus.sDescription:
                    if ($rootScope.bStatusWasSelected) {
                        $rootScope.oDeficiencyAttributes["oStatus"].sValue = "";
                        for (var i = 0; i < $rootScope.aStatuses.length; i++) {
                            if ($rootScope.aStatuses[i].bTicked) {
                                $rootScope.oDeficiencyAttributes["oStatus"].sValue = $rootScope.aStatuses[i].sName;
                                $rootScope.oDeficiencyAttributes["oStatus"].sSelectedItemGuid = $rootScope.aStatuses[i].sGuid;
                                $rootScope.oDeficiencyAttributes["oStatus"].sIconUrl = $rootScope.aStatuses[i].sIconUrl;
                                break;
                            }
                        }
                    }
                    break;
                case $rootScope.oDeficiencyAttributes.oPriority.sDescription:
                    if ($rootScope.bPriorityWasSelected) {
                        $rootScope.oDeficiencyAttributes["oPriority"].sValue = "";
                        for (var i = 0; i < $rootScope.aPriorities.length; i++) {
                            if ($rootScope.aPriorities[i].bTicked) {
                                $rootScope.oDeficiencyAttributes["oPriority"].sValue = $rootScope.aPriorities[i].sName;
                                $rootScope.oDeficiencyAttributes["oPriority"].sSelectedItemGuid = $rootScope.aPriorities[i].sGuid;
                                break;
                            }
                        }
                    }
                    break;
                case $rootScope.oDeficiencyAttributes.oUser.sDescription:
                    if ($rootScope.bUserWasSelected) {
                        $rootScope.oDeficiencyAttributes["oUser"].sValue = "";
                        for (var i = 0; i < $rootScope.aUsers.length; i++) {
                            if ($rootScope.aUsers[i].bTicked) {
                                $rootScope.oDeficiencyAttributes["oUser"].sValue = $rootScope.aUsers[i].sName;
                                $rootScope.oDeficiencyAttributes["oUser"].sSelectedItemGuid = $rootScope.aUsers[i].sGuid;
                                break;
                            }
                        }
                    }
                    break;
                case $rootScope.oDeficiencyAttributes.oDescriptionTags.sDescription:
                    if ($rootScope.aDescriptionTags.length) {
                        $rootScope.oDeficiencyAttributes["oDescriptionTags"].sValue = utilsProvider.tagsArrayToTagsString($rootScope.aDescriptionTags);
                    } else {
                        $rootScope.oDeficiencyAttributes["oDescriptionTags"].sValue = "...";
                    }
                    break;
                case $rootScope.oDeficiencyAttributes.oLocationTags.sDescription:
                    if ($rootScope.aLocationTags.length) {
                        $rootScope.oDeficiencyAttributes["oLocationTags"].sValue = utilsProvider.tagsArrayToTagsString($rootScope.aLocationTags);
                    } else {
                        $rootScope.oDeficiencyAttributes["oLocationTags"].sValue = "...";
                    }
                    break;
                case $rootScope.oDeficiencyAttributes.oContractors.sDescription:
                    if ($rootScope.bContractorWasSelected) {
                        $rootScope.oDeficiencyAttributes["oContractors"].sValue = "";
                        $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
                        for (var i = 0; i < $rootScope.aContractors.length; i++) {
                            if ($rootScope.aContractors[i].bTicked) {
                                $rootScope.oDeficiencyAttributes["oContractors"].sValue = $rootScope.oDeficiencyAttributes["oContractors"].sValue + $rootScope.aContractors[i].sName + "; ";
                                $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids.push($rootScope.aContractors[i].sGuid);
                            }
                        }
                    } else {
                        $rootScope.oDeficiencyAttributes["oContractors"].sValue = "...";
                        $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
                    }
                    break;
            }
            //$state.go("deficiencyQuickAdd");
            $rootScope.bIsItemsListsOpen = false;
        };

        $scope.onSelectPhase = function(oPhase) {
            $rootScope.bPhaseWasSelected = true;

            if (!oPhase.bTicked) {
                for (var i = 0; i < $rootScope.aProjectsWithPhases.length; i++) {
                    for (var j = 0; j < $rootScope.aProjectsWithPhases[i].aPhases.length; j++) {
                        $rootScope.aProjectsWithPhases[i].aPhases[j].bTicked = false;
                    }
                }
                oPhase.bTicked = true;
                $rootScope.aUnits = [];
                $rootScope.aFilteredUnits = [];
                $rootScope.sUnitFilter = "";
                $rootScope.aContractors = [];
                $rootScope.aFilteredContractors = [];
                $rootScope.sContractorsFilter = "";
                $rootScope.oDeficiencyAttributes["oUnit"].sValue = "...";
                $rootScope.oDeficiencyAttributes["oUnit"].sSelectedItemGuid = "";
                $rootScope.bUnitWasSelected = false;
                $rootScope.oDeficiencyAttributes["oContractors"].sValue = "...";
                $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
                $rootScope.bContractorWasSelected = false;
            }

            $timeout($scope.onClose, 300);
        };

        $scope.onSelectUnit = function(oUnit) {
            $rootScope.bUnitWasSelected = true;
            if (!oUnit.bTicked) {
                for (var i = 0; i < $rootScope.aUnits.length; i++) {
                    $rootScope.aUnits[i].bTicked = false;
                }
                oUnit.bTicked = true;
            }

            $timeout($scope.onClose, 300);
        }; 

        $scope.onSelectStatus = function(oStatus) {
            $rootScope.bStatusWasSelected = true;
            if (!oStatus.bTicked) {
                for (var i = 0; i < $rootScope.aStatuses.length; i++) {
                    $rootScope.aStatuses[i].bTicked = false;
                }
                oStatus.bTicked = true;
            }

            $timeout($scope.onClose, 300);
        };

        $scope.onSelectPriority = function(oPriority) {
            $rootScope.bPriorityWasSelected = true;
            if (!oPriority.bTicked) {
                for (var i = 0; i < $rootScope.aPriorities.length; i++) {
                    $rootScope.aPriorities[i].bTicked = false;
                }
                oPriority.bTicked = true;
            }

            $timeout($scope.onClose, 300);
        };

        $scope.onSelectUser = function(oUser) {
            $rootScope.bUserWasSelected = true;
            if (!oUser.bTicked) {
                for (var i = 0; i < $rootScope.aUsers.length; i++) {
                    $rootScope.aUsers[i].bTicked = false;
                }
                oUser.bTicked = true;
            }

            $timeout($scope.onClose, 300);
        };

        $scope.onSelectContractor = function(oContractor) {
            $rootScope.bContractorWasSelected = false;
            oContractor.bTicked = !oContractor.bTicked;

            if (!oContractor.bTicked) {
                for (var i = 0; i < $rootScope.aContractors.length; i++) {
                    if ($rootScope.aContractors[i].bTicked) {
                        $rootScope.bContractorWasSelected = true;
                        break;
                    }
                }
            } else {
                $rootScope.bContractorWasSelected = true;
            }

            //$timeout($scope.onClose, 300);
        };        

        $scope.onChangeUnitFilter = function(sFilter) {
            $rootScope.sUnitFilter = sFilter;
            $rootScope.aFilteredUnits = $filter('filter')($rootScope.aUnits, {
                sName: sFilter
            });
        };

        $scope.onChangeContractorsFilter = function(sFilter) {
            $rootScope.sContractorsFilter = sFilter;
            $rootScope.aFilteredContractors = $filter('filter')($rootScope.aContractors, {
                sName: sFilter
            });
        };   

        // $scope.onBack = function() {
        //     $state.go("deficiencyQuickAdd");
        // };
    }
]);