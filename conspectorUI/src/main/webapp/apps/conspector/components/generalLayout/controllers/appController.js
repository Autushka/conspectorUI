viewControllers.controller('appView', ['$scope', '$rootScope', '$state', '$mdSidenav', '$window', 'servicesProvider', 'notificationsProvider', '$translate', 'cacheProvider', 'rolesSettings', '$cookieStore', 'historyProvider', 'apiProvider', 'utilsProvider', '$filter', '$timeout', 'CONSTANTS',
    function($scope, $rootScope, $state, $mdSidenav, $window, servicesProvider, notificationsProvider, $translate, cacheProvider, rolesSettings, $cookieStore, historyProvider, apiProvider, utilsProvider, $filter, $timeout, CONSTANTS) {

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation (i.e. switch role/company views)  
        $rootScope.oStateParams = {}; // for backNavigation
        $scope.bMobileMode = bMobileMode; //used to skip logic not needed for mobile app
        $scope.oUserProfile = cacheProvider.oUserProfile;
        $scope.sCurrentLanguage = $translate.use();
        $scope.iDisplayedNotificationsNumber = 0;

        var sCurrentUser = $scope.oUserProfile.sUserName;
        var sCompany = $scope.oUserProfile.sCurrentCompany;
        var sCurrentRole = $scope.oUserProfile.sCurrentRole;
        var aSelectedPhases = [];
        var iPageNumber = 1;

        if (!sCurrentUser) {
            servicesProvider.logOut();
        }

        servicesProvider.constructLogoUrl();

        if (!bMobileMode) {

            if ($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany) && $cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids) {
                aSelectedPhases = angular.copy($cookieStore.get("globallySelectedPhasesGuids" + sCurrentUser + sCompany).aPhasesGuids);

            } else {

                aSelectedPhases = [];
            }

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
        }

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
                }
            };

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

        //need to move those guys to notification provider
        $scope.aNotifications = [];

        var onNotificationsLoaded = function(oData) {

            if (oData.results.length > 0) {
                // $scope.$apply(function() {
                //     $scope.aNotifications = $scope.aNotifications.concat(oData.results);
                //     $scope.iTotalNotificationsNumber = oData.__count;
                //     $scope.iDisplayedNotificationsNumber = $scope.aNotifications.length;
                // });

                $scope.$evalAsync(function() {
                    $scope.aNotifications = $scope.aNotifications.concat(oData.results);
                    $scope.iTotalNotificationsNumber = oData.__count;
                    $scope.iDisplayedNotificationsNumber = $scope.aNotifications.length;
                });
                // $scope.aNotifications = $scope.aNotifications.concat(oData.results);
            }

        };

        var loadNotifications = function(iPageNumber) {

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
                    $scope.onCloseNotificationsMenu();
                    break;
            }

            apiProvider.updateOperationLog({
                sKey: oNotification.Guid,
                oData: {
                    Status: 'read'
                },
            });
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

        $scope.onMarkAllAsRead = function() {
            var aData = [];
            var onSuccess = function() {
                // $scope.aNotifications = [];
                iPageNumber = 1;
                // loadNotifications(iPageNumber);
                onNotificationsLoaded();
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

        $scope.onSideMenuItemClicked = function(aSideMenuItem) {
            $scope.selectedTabIndex = -1;
            $scope.$broadcast("$mdTabsPaginationChanged");
            $state.go(aSideMenuItem.sState);
            $scope.onCloseMenu();
        };

        $scope.onAdminPanel = function() {
            $scope.selectedTabIndex = -1;
            $scope.$broadcast("$mdTabsPaginationChanged");
            $state.go('app.adminPanel.usersList');
            // $scope.onCloseMenu();
        };

        $scope.onProfileSettings = function() {
            $scope.selectedTabIndex = -1;
            $scope.$broadcast("$mdTabsPaginationChanged");
            $state.go('app.profileSettings.profileDetails');
            // $scope.onCloseMenu();
        };

        $scope.onOpenNotificationsMenu = function() {
            $scope.aNotifications = [];
            iPageNumber = 1;
            loadNotifications(iPageNumber);
            $timeout($mdSidenav('globalRight').open, 300);
        };

        $scope.onCloseNotificationsMenu = function() {
            $timeout($mdSidenav('globalRight').close, 300);
        };

        $scope.onShowMore = function() {
            iPageNumber++;
            loadNotifications(iPageNumber);
        };

        $scope.onOpenMenu = function() {
            $timeout($mdSidenav('leftMenu').open, 300);
        };

        $scope.onCloseMenu = function() {
            $timeout($mdSidenav('leftMenu').close, 300);
        };

        $scope.hoverIn = function() {
            $scope.bDisplayUserDropdownMenu = true;
        }; 

        $scope.hoverOut = function() {
            $scope.bDisplayUserDropdownMenu = false;
        };

        $scope.onChangeLanguage = function() {
            servicesProvider.changeLanguage();

            //need to tell user to refresh the page
            // $scope.onCloseMenu();
        };

        $scope.onSwitchCompanies = function() {
            $state.go('companySelection');
            // $scope.onCloseMenu();
        };

        $scope.onSwitchRoles = function() {
            $state.go('roleSelection');
            // $scope.onCloseMenu();
        };

        $scope.onLogOut = function() {
            // $scope.onCloseMenu();
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