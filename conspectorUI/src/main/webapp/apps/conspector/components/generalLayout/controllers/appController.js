viewControllers.controller('appView', ['$scope', '$rootScope', '$state', '$mdSidenav', '$window', 'servicesProvider', 'notificationsProvider', '$translate', 'cacheProvider', 'rolesSettings', '$cookieStore', 'historyProvider', 'apiProvider', 'utilsProvider', '$filter', '$timeout', 'CONSTANTS',
        function($scope, $rootScope, $state, $mdSidenav, $window, servicesProvider, notificationsProvider, $translate, cacheProvider, rolesSettings, $cookieStore, historyProvider, apiProvider, utilsProvider, $filter, $timeout, CONSTANTS) {

            $scope.bMobileMode = bMobileMode;
            var sCurrentUser = cacheProvider.oUserProfile.sUserName;
            var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
            var aSelectedPhases = [];
            var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
            var iPageNumber = 1;
            $scope.iDisplayedNotificationsNumber = 0

            $scope.sCurrentUser = sCurrentUser;
            $scope.oUserProfile = cacheProvider.oUserProfile;
            $scope.sCurrentLanguage = $translate.use();
            $rootScope.sCurrentStateName = $state.current.name; // for backNavigation (i.e. switch role/company views)	
            $rootScope.oStateParams = {}; // for backNavigation

            if (!sCurrentUser) {
                servicesProvider.logOut();
            }

            $scope.aDataForMassChanges = [];

            servicesProvider.constructLogoUrl();

            if ($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany) && $cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids) {
                aSelectedPhases = angular.copy($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids);

            } else {
                // aSelectedPhases = servicesProvider.getUserPhasesGuids();
                aSelectedPhases = [];
            }
            //Notifications
            var oNotificationsListData = {
                aData: []
            };
            var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
                sTableName: "notificationsList",
                sStateName: $rootScope.sCurrentStateName,
            });
            var oInitialSortingForNotificationsList = {
                _createdAt: 'desc'
            };
            //

            $scope.onGlobalUserPhasesChanged = function() {
                var aSelectedPhases = [];
                aSelectedPhases = servicesProvider.getSeletedItemsKeysInMultiSelect({
                    sKey: "Guid",
                    aData: $scope.globalProjectsWithPhases
                });

                $cookieStore.put("globallySelectedPhasesGuids" + sCurrentUser + sCompany, {
                    aPhasesGuids: aSelectedPhases,
                });
                cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aSelectedPhases;
                $scope.globalSelectedPhases = aSelectedPhases;
                $scope.$broadcast('globalUserPhasesHaveBeenChanged');
            };

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowAdminPanel"
            })) {
                $scope.bDisplayAdminPanel = true;
            }

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowProfileSettings"
            })) {
                $scope.bDisplayProfileSettings = true;
            }

            if (cacheProvider.oUserProfile.aUserCompanies && cacheProvider.oUserProfile.aUserCompanies.length > 1) {
                $scope.bDisplaySwitchCompanies = true;
            }

            if (cacheProvider.oUserProfile.aUserRoles && cacheProvider.oUserProfile.aUserRoles.length > 1) {
                $scope.bDisplaySwitchRoles = true;
            }

            $scope.selectedTabIndex;
            $scope.aSideMenuItems = [];
            $scope.aTabs = [];

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowDeficiencies"
            })) {
                $scope.aTabs.push({
                    sTitle: "app_deficienciesTab",
                    sState: "app.deficienciesList"
                });
                $scope.aSideMenuItems.push({
                    sTitle: "app_deficienciesTab",
                    sState: "app.deficienciesList"
                });
            }

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowUnits"
            })) {
                $scope.aTabs.push({
                    sTitle: "app_unitsTab",
                    sState: "app.unitsList"
                });
                $scope.aSideMenuItems.push({
                    sTitle: "app_unitsTab",
                    sState: "app.unitsList"
                });
            }

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowContractors"
            })) {
                $scope.aTabs.push({
                    sTitle: "app_contractorsTab",
                    sState: "app.contractorsList"
                });
                $scope.aSideMenuItems.push({
                    sTitle: "app_contractorsTab",
                    sState: "app.contractorsList"
                });

            }

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowClients"
            })) {
                $scope.aTabs.push({
                    sTitle: "app_clientsTab",
                    sState: "app.clientsList"
                });
                $scope.aSideMenuItems.push({
                    sTitle: "app_clientsTab",
                    sState: "app.clientsList"
                });
            }

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowContacts"
            })) {
                $scope.aTabs.push({
                    sTitle: "app_contactsTab",
                    sState: "app.contactsList"
                });
                $scope.aSideMenuItems.push({
                    sTitle: "app_contactsTab",
                    sState: "app.contactsList"
                });
            }

            if (cacheProvider.oUserProfile.oCurrentRoleSettings && rolesSettings.getRolesMainMenuItemSettings({
                sRole: sCurrentRole,
                sMenuItem: "bShowActivities"
            })) {
                $scope.aTabs.push({
                    sTitle: "app_activitiesTab",
                    sState: "app.activitiesList"
                });
            }

            if (!bMobileMode) {

                cacheProvider.oUserProfile.aGloballySelectedPhasesGuids = aSelectedPhases;
                $scope.globalSelectedPhases = aSelectedPhases;

                $scope.globalProjectsWithPhases = servicesProvider.constructUserProjectsPhasesForMultiSelect({
                    aSelectedPhases: aSelectedPhases

                });

                var getITabIndexForCurrentState = function(sState) {
                    for (var i = 0; i < $scope.aTabs.length; i++) { // can't use static numbering due to hidden tabs scenario (for some user roles)
                        if ($scope.aTabs[i].sState === sState) {
                            return i;
                        }
                    };
                }

                var tabSelectionBasedOnHash = function() {
                    if ($window.location.hash.indexOf("#/app/adminPanel") > -1 ||
                        $window.location.hash.indexOf("#/app/profileSettings") > -1 ||
                        $window.location.hash.indexOf("#/app/clientDetails") > -1 ||
                        $window.location.hash.indexOf("#/app/contractorDetails") > -1 ||
                        $window.location.hash.indexOf("#/app/contactDetails") > -1 ||
                        $window.location.hash.indexOf("#/app/deficiencyDetails") > -1 ||
                        $window.location.hash.indexOf("#/app/activityDetails") > -1 ||
                        $window.location.hash.indexOf("#/app/unitDetails") > -1 ||
                        $window.location.hash.indexOf("#/app/notificationsList") > -1) {
                        $scope.selectedTabIndex = -1;
                        $scope.$broadcast("$mdTabsPaginationChanged");
                        return;
                    }

                    if ($window.location.hash.indexOf("deficienc") > -1) {
                        $scope.selectedTabIndex = getITabIndexForCurrentState("app.deficienciesList");
                        return;
                    }

                    if ($window.location.hash.indexOf("unit") > -1) {
                        $scope.selectedTabIndex = getITabIndexForCurrentState("app.unitsList");
                        return;
                    }
                    if ($window.location.hash.indexOf("contractor") > -1) {
                        $scope.selectedTabIndex = getITabIndexForCurrentState("app.contractorsList");
                        return;
                    }
                    if ($window.location.hash.indexOf("client") > -1) {
                        $scope.selectedTabIndex = getITabIndexForCurrentState("app.clientsList");
                        return;
                    }
                    if ($window.location.hash.indexOf("contact") > -1) {
                        $scope.selectedTabIndex = getITabIndexForCurrentState("app.contactsList");
                        return;
                    }
                    if ($window.location.hash.indexOf("activit") > -1) {
                        $scope.selectedTabIndex = getITabIndexForCurrentState("app.activitiesList");
                        return;
                    }
                };

                $timeout(tabSelectionBasedOnHash, 100);

                $scope.onTabSelect = function(oTab) {
                    var sCurrentSelectedTab = "";
                    if ($window.location.hash.indexOf("deficienc") > -1) {
                        sCurrentSelectedTab = "Deficiencies";
                    }
                    if ($window.location.hash.indexOf("unit") > -1) {
                        sCurrentSelectedTab = "Units";
                    }
                    if ($window.location.hash.indexOf("contractor") > -1) {
                        sCurrentSelectedTab = "Contractors";
                    }
                    if ($window.location.hash.indexOf("client") > -1) {
                        sCurrentSelectedTab = "Clients";
                    }
                    if ($window.location.hash.indexOf("contact") > -1) {
                        sCurrentSelectedTab = "Contacts";
                    }
                    if ($window.location.hash.indexOf("activit") > -1) {
                        sCurrentSelectedTab = "Activities";
                    }

                    if ($scope.selectedTabIndex !== undefined) { //($window.location.hash !== oTab.sHash && $scope.selectedTabIndex !== undefined) {
                        $state.go(oTab.sState);
                    }
                };

                $scope.$on('$stateChangeSuccess', function(ev, to, toParams, from, fromParams) {
                    $timeout(tabSelectionBasedOnHash, 100);
                });

            }

            //Notifications logic
            // if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            //     oInitialSortingForNotificationsList = angular.copy(oTableStatusFromCache.oSorting);
            // }
            // var oInitialFilterForNotificationsList = {};
            // if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            //     oInitialFilterForNotificationsList = angular.copy(oTableStatusFromCache.oFilter);
            // }
            // var oInitialGroupsSettingsForNotificationsList = [];
            // if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            //     oInitialGroupsSettingsForNotificationsList = angular.copy(oTableStatusFromCache.aGroups);
            // }
            // $scope.tableParams = servicesProvider.createNgTable({
            //     oInitialDataArrayWrapper: oNotificationsListData,
            //     sDisplayedDataArrayName: "aDisplayedNotification",
            //     oInitialSorting: oInitialSortingForNotificationsList,
            //     oInitialFilter: oInitialFilterForNotificationsList,
            //     aInitialGroupsSettings: oInitialGroupsSettingsForNotificationsList,
            //     sGroupBy: "sProjectPhase",
            //     sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
            // });

            $scope.aNotifications = [];

            // $scope.$watch($scope.aNotifications.length, function() {

            // }, true);

            var onNotificationsLoaded = function(oData) {

                if (oData.results.length > 0) {
                    $scope.aNotifications = $scope.aNotifications.concat(oData.results);
                }

                $scope.iTotalNotificationsNumber = oData.__count;
                $scope.iDisplayedNotificationsNumber = $scope.aNotifications.length;
            };

            var loadNotifications = function(iPageNumber) {
                //oNotificationsListData.aData = [];
                var sOtherUrlParams = "$top=5&$orderby=CreatedAt desc&$inlinecount=allpages";
                if (iPageNumber > 1) {
                    sOtherUrlParams = sOtherUrlParams + "&$skip=" + 5 * (iPageNumber - 1);
                }

                apiProvider.getOperationLogs({
                    sExpand: "PhaseDetails/ProjectDetails,ContactDetails/UserDetails",
                    sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and UserName eq '" + cacheProvider.oUserProfile.sUserName + "' and GeneralAttributes/IsDeleted eq false",
                    sOtherUrlParams: sOtherUrlParams,
                    // bShowSpinner: true,
                    onSuccess: onNotificationsLoaded
                });
            };


            $scope.onDisplay = function(oNotification, oEvent) {
                cacheProvider.putListViewScrollPosition("deficienciesList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...
                switch (oNotification.EntityName) {
                    case "deficiency":
                        $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                            sMode: "display",
                            sDeficiencyGuid: oNotification.EntityGuid,
                        });
                        $timeout($scope.onCloseNotificationsMenu, 200);
                        break;
                }

                apiProvider.updateOperationLog({
                    sKey: oNotification.Guid,
                    oData: {
                        Status: 'read'
                    },
                })
            };

            $scope.onClearFiltering = function() {
                $scope.tableParams.$params.filter = {};
                $scope.tableParams.reload();
            };

            $scope.$on('notificationsShouldBeRefreshed', function(oParameters) {
                cacheProvider.putListViewScrollPosition("deficienciesList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...            
                $scope.aNotifications = [];
                iPageNumber = 1;
                loadNotifications(iPageNumber);
            });

            // $scope.onStatusChange = function(oNotification) {
            //     if (!$scope.bDisplayEditButtons) {
            //         return;
            //     }
            //     oNotification.sStatuseIconUrl = $window.location.origin + $window.location.pathname + "rest/file/v2/get/" + aTaskStatuses[(oNotification.sStatusSortingSequence + 1) % aTaskStatuses.length].AssociatedIconFileGuid;

            //     $scope.aDataForMassChanges.push({
            //         Guid: oNotification._guid,
            //         TaskStatusGuid: aTaskStatuses[(oNotification.sStatusSortingSequence + 1) % aTaskStatuses.length].Guid,
            //     });
            //     oNotification.sStatusSortingSequence = (oNotification.sStatusSortingSequence + 1) % aTaskStatuses.length;
            //     alert(oNotification._guid);
            //     oNotification._guid = "!!!";
            // };

            $scope.onMarkAllAsRead = function() {
                var aData = [];
                var onSuccess = function() {
                    // $scope.aNotifications = [];
                    iPageNumber = 1;
                    loadNotifications(iPageNumber);
                };
                for (var i = 0; i < $scope.aNotifications.length; i++) {
                    if ($scope.aNotifications[i].Status === "not read") {
                        aData.push({
                            Guid: $scope.aNotifications[i].Guid,
                            Status: "read",
                        });
                        $scope.aNotifications[i].Status = "read";
                    }
                }
                    if (!aData.length) {
                        return;
                    }
                    apiProvider.updateOperationLogs({
                        aData: aData,
                        onSuccess: onSuccess,
                        //bShowSuccessMessage: true,
                        //bShowErrorMessage: true,
                    });
                };

                $scope.onDismissAll = function() {
                    var onSuccess = function() {
                        $scope.aNotifications = [];
                        iPageNumber = 1;
                        loadNotifications(iPageNumber);
                    };
                    // var aData = [];
                    // for (var i = 0; i < $scope.tableParams.data.length; i++) {
                    //     for (var j = 0; j < $scope.tableParams.data[i].data.length; j++) {
                    //         aData.push({
                    //             Guid: $scope.tableParams.data[i].data[j]._guid,
                    //         });
                    //     }
                    // }

                    if (!$scope.aNotifications.length) {
                        return;
                    }
                    apiProvider.deleteOperationLogs({
                        aData: $scope.aNotifications,
                        onSuccess: onSuccess,
                        //bShowSuccessMessage: true,
                        //bShowErrorMessage: true,
                    });

                };

                //

                $scope.onSideMenuItemClicked = function(aSideMenuItem) {
                    $state.go(aSideMenuItem.sState);
                    $timeout($scope.onCloseMenu, 200);
                }

                $scope.onAdminPanel = function() {
                    $scope.selectedTabIndex = -1;
                    $scope.$broadcast("$mdTabsPaginationChanged");
                    $state.go('app.adminPanel.usersList');
                    $scope.onCloseMenu();
                };

                $scope.onProfileSettings = function() {
                    $scope.selectedTabIndex = -1;
                    $scope.$broadcast("$mdTabsPaginationChanged");
                    $state.go('app.profileSettings.profileDetails');
                    $scope.onCloseMenu();
                };

                $scope.toggleRightSidenav = function() {
                    $scope.aNotifications = [];
                    iPageNumber = 1;
                    loadNotifications(iPageNumber);
                    $timeout($mdSidenav('globalRight').toggle, 200);
                    // $mdSidenav('globalRight').toggle();
                };

                $scope.onOpenNotificationsMenu = function() {
                    $timeout($mdSidenav('globalRight').open, 200);
                };

                $scope.onCloseNotificationsMenu = function() {
                    $timeout($mdSidenav('globalRight').close, 200);
                };

                $scope.onShowMore = function() {
                    iPageNumber++;
                    loadNotifications(iPageNumber);
                };

                $scope.onOpenMenu = function() {
                    $timeout($mdSidenav('leftMenu').open, 200);
                };

                $scope.onCloseMenu = function() {
                    $timeout($mdSidenav('leftMenu').close, 200);
                };

                // $scope.hoverIn = function() {
                //     $scope.bDisplayUserDropdownMenu = true;
                // };

                // $scope.hoverOut = function() {
                //     $scope.bDisplayUserDropdownMenu = false;
                // };

                $scope.onChangeLanguage = function() {
                    servicesProvider.changeLanguage();

                    //need to tell user to refresh the page
                    $scope.onCloseMenu();
                };

                $scope.onSwitchCompanies = function() {
                    $state.go('companySelection');
                    $scope.onCloseMenu();
                };

                $scope.onSwitchRoles = function() {
                    $state.go('roleSelection');
                    $scope.onCloseMenu();
                };

                $scope.onLogOut = function() {
                    $scope.onCloseMenu();
                    servicesProvider.logOut();
                };

                $scope.$on("$destroy", function() {
                    historyProvider.addStateToHistory({
                        sStateName: $rootScope.sCurrentStateName,
                        oStateParams: $rootScope.oStateParams
                    });
                });
            }
        ]);