viewControllers.controller('usersListView', ['$scope', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$window', 'cacheProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$filter',
    function($scope, $rootScope, $state, servicesProvider, apiProvider, $translate, $window, cacheProvider, CONSTANTS, historyProvider, rolesSettings, $filter) {
        historyProvider.removeHistory(); // because current view doesn't have a back button		

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = {}; // for backNavigation	

        $scope.sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;

        $scope.bIsGlobalUserAdministrator = rolesSettings[$scope.sCurrentRole].bIsGlobalUserAdministrator;
        $scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: $scope.sCurrentRole,
            sEntityName: "oUser",
            sOperation: "bCreate"
        });

        $scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: $scope.sCurrentRole,
            sEntityName: "oUser",
            sOperation: "bUpdate"
        });

        var oUsersListData = {
            aData: []
        };

        var oInitialFilterForUsersList = {};

        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oUsersListData,
            sDisplayedDataArrayName: "aDisplayedUsers",
            sGroupBy: "sCompany",
            sGroupsSortingAttribue: "_sortingSequence", //for default groups sorting
            oInitialFilter: oInitialFilterForUsersList,
            oInitialSorting: {
                userName: 'asc'
            }
        });

        var onRolesLoaded = function(aData) {
            for (var i = 0; i < oUsersListData.aData.length; i++) {
                oUsersListData.aData[i].sRoles = "";
                for (var j = 0; j < oUsersListData.aData[i]._roleDetails.results.length; j++) {
                    for (var k = 0; k < aData.length; k++) {
                        if (oUsersListData.aData[i]._roleDetails.results[j].Guid === aData[k].Guid) {
                            oUsersListData.aData[i].sRoles = oUsersListData.aData[i].sRoles + aData[k].RoleName + "; ";
                            break;
                        }
                    }
                }
            }
        };

        var onUsersLoaded = function(aData) {
            var aUsersForDisplay = [];
            var aUserForDisplay = [];
            var aUserForDisplayCurrentCompany = [];
            var bIsUserGlobalAdmin = false;
            //var bIsUserAssignedToCurrentCompany = false;
            for (var i = 0; i < aData.length; i++) {
                bIsUserGlobalAdmin = false;
                bIsUserAssignedToCurrentCompany = false;
                aUserForDisplay = [];
                aUserForDisplayCurrentCompany = [];
                for (var j = 0; j < aData[i].RoleDetails.results.length; j++) {
                    if (rolesSettings[aData[i].RoleDetails.results[j].RoleName] && rolesSettings[aData[i].RoleDetails.results[j].RoleName].bIsGlobalUserAdministrator && aData[i].UserName !== cacheProvider.oUserProfile.sUserName) {
                        bIsUserGlobalAdmin = true;
                        break;
                    }
                }

                for (var j = 0; j < aData[i].CompanyDetails.results.length; j++) {
                    aData[i]._sortingSequence = aData[i].CompanyDetails.results[j].GeneralAttributes.SortingSequence;

                    aData[i].sCompany = $translate.use() === "en" ? aData[i].CompanyDetails.results[j].DescriptionEN : aData[i].CompanyDetails.results[j].DescriptionFR;
                    if (!aData[i].sCompany) {
                        aData[i].sCompany = aData[i].CompanyDetails.results[j].DescriptionEN
                    }

                    if (aData[i].CompanyDetails.results[j].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
                        //bIsUserAssignedToCurrentCompany = true;
                        aUserForDisplayCurrentCompany.push(angular.copy(aData[i]));

                    }
                    if (aData[i].ContactDetails.results) {
                        aData[i].sAssociatedContact = "";
                        for (var k = 0; k < aData[i].ContactDetails.results.length; k++) {
                            if (cacheProvider.oUserProfile.sCurrentCompany === "Conspector") {
                            	
                                if (aData[i].ContactDetails.results[k].FirstName && aData[i].ContactDetails.results[k].LastName) {
                                    aData[i].sAssociatedContact = aData[i].sAssociatedContact + aData[i].ContactDetails.results[k].FirstName + " " + aData[i].ContactDetails.results[k].LastName + " ";
                                } else {
                                    aData[i].sAssociatedContact = aData[i].sAssociatedContact + aData[i].ContactDetails.results[k].FirstName  + " ";
                                }
                            } else {
                            	if (aData[i].ContactDetails.results[k].FirstName && aData[i].ContactDetails.results[k].LastName && aData[i].ContactDetails.results[k].CompanyName === cacheProvider.oUserProfile.sCurrentCompany) {
                                    aData[i].sAssociatedContact = aData[i].sAssociatedContact + aData[i].ContactDetails.results[k].FirstName + " " + aData[i].ContactDetails.results[k].LastName + " ";
                                } else if (aData[i].ContactDetails.results[k].FirstName && aData[i].ContactDetails.results[k].CompanyName === cacheProvider.oUserProfile.sCurrentCompany){
                                    aData[i].sAssociatedContact = aData[i].sAssociatedContact + aData[i].ContactDetails.results[k].FirstName + " ";
                                }
                            }
                        }
                    }
                    aUserForDisplay.push(angular.copy(aData[i]));
                }

                if (!rolesSettings[cacheProvider.oUserProfile.sCurrentRole].bIsGlobalUserAdministrator && !bIsUserGlobalAdmin) {
                    for (var j = 0; j < aUserForDisplayCurrentCompany.length; j++) {
                        aUsersForDisplay.push(angular.copy(aUserForDisplayCurrentCompany[j]));
                    }
                }

                if (rolesSettings[cacheProvider.oUserProfile.sCurrentRole].bIsGlobalUserAdministrator) {
                    for (var j = 0; j < aUserForDisplay.length; j++) {
                        aUsersForDisplay.push(angular.copy(aUserForDisplay[j]));
                    }
                }
            }

            aUsersForDisplay = $filter('orderBy')(aUsersForDisplay, ["_sortingSequence"]);

            for (var i = 0; i < aUsersForDisplay.length; i++) {
                oUsersListData.aData.push({
                    userName: aUsersForDisplay[i].UserName,
                    email: aUsersForDisplay[i].EMail,
                    _roleDetails: aUsersForDisplay[i].RoleDetails,
                    _companyDetails: aUsersForDisplay[i].CompanyDetails,
                    _lastModifiedAt: aUsersForDisplay[i].LastModifiedAt,
                    roles: "",
                    sAssociatedContact: aUsersForDisplay[i].sAssociatedContact,
                    sCompany: aUsersForDisplay[i].sCompany,
                    _sortingSequence: aUsersForDisplay[i]._sortingSequence,
                });
            }
            $scope.tableParams.reload();
            apiProvider.getRoles({
                bShowSpinner: false,
                onSuccess: onRolesLoaded
            });
        };

        apiProvider.getUsers({
            sExpand: "CompanyDetails,PhaseDetails,RoleDetails,ContactDetails",
            bShowSpinner: true,
            onSuccess: onUsersLoaded
        });

        $scope.onDisplay = function(oUser) {
            $state.go('app.adminPanel.userDetails', {
                sMode: "display",
                sUserName: oUser.userName,
            });
        };

        $scope.onEdit = function(oUser) {
            $state.go('app.adminPanel.userDetails', {
                sMode: "edit",
                sUserName: oUser.userName,
            });
        };

        $scope.onAddNew = function() {
            $state.go('app.adminPanel.userDetails', {
                sMode: "create",
                sUserName: "",
            });
        };

        $scope.$on("$destroy", function() {
            if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
                return;
            }

            historyProvider.addStateToHistory({
                sStateName: $rootScope.sCurrentStateName,
                oStateParams: $rootScope.oStateParams
            });
        });
    }
]);