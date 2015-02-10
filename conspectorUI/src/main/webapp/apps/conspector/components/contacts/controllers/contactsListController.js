viewControllers.controller('contactsListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$filter', 'rolesSettings',
    function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $filter, rolesSettings) {
        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oContact",
            sOperation: "bCreate"
        });

        $scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oContact",
            sOperation: "bUpdate"
        });

        $scope.bDisplayAccountColumn = $state.current.name === "app.contactsList" ? true : false;

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation

        var sAccountGuid = "";

        if ($stateParams.sContractorGuid) {
            sAccountGuid = $stateParams.sContractorGuid;
        }
        if ($stateParams.sClientGuid) {
            sAccountGuid = $stateParams.sClientGuid;
        }

        var oContactsListData = {
            aData: []
        };

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "contactsList",
            sStateName: $rootScope.sCurrentStateName,
        });

        $scope.oListSettings = {
            bGroupListByProjectAndPhase: oTableStatusFromCache.oListSettings.bGroupListByProjectAndPhase
        };

        var oInitialSortingForContactList = {
            sName: 'asc'
        };
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            oInitialSortingForContactList = angular.copy(oTableStatusFromCache.oSorting);
        }
        var oInitialFilterForContactList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            oInitialFilterForContactList = angular.copy(oTableStatusFromCache.oFilter);
        }
        var oInitialGroupsSettingsForContactList = [];
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            oInitialGroupsSettingsForContactList = angular.copy(oTableStatusFromCache.aGroups);
        }

        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oContactsListData,
            sDisplayedDataArrayName: "aDisplayedContacts",
            oInitialSorting: oInitialSortingForContactList,
            oInitialFilter: oInitialFilterForContactList,
            aInitialGroupsSettings: oInitialGroupsSettingsForContactList,
            sGroupBy: "sProjectPhase",
            sGroupsSortingAttribue: "_sortingSequence", //for default groups sorting
        });

        var onContactsLoaded = function(aData) {
            var sName = "";
            var sProjectName = "";
            var sPhaseName = "";
            var bMatchFound = false;
            if ($scope.oListSettings.bGroupListByProjectAndPhase) {
            for (var i = 0; i < aData.length; i++) {
                for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
                    aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
                }
                aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);

                sName = "";
                if (aData[i].FirstName) {
                    sName = aData[i].FirstName;
                }
                if (aData[i].LastName) {
                    if (aData[i].FirstName) {
                        sName = sName + " ";
                    }
                    sName = sName + aData[i].LastName;
                }

                if (aData[i].PhaseDetails.results.length) {
                    for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
                        bMatchFound = false;
                        for (var k = 0; k < cacheProvider.oUserProfile.aGloballySelectedPhasesGuids.length; k++) {
                            if (aData[i].PhaseDetails.results[j].Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]) {
                                bMatchFound = true;
                                break;
                            }
                        }
                        if (!bMatchFound) {
                            continue;
                        }

                        sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].ProjectDetails.NameEN : aData[i].PhaseDetails.results[j].ProjectDetails.NameFR;
                        if (!sProjectName) {
                            sProjectName = aData[i].PhaseDetails.results[j].ProjectDetails.NameEN;
                        }
                        sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.results[j].NameEN : aData[i].PhaseDetails.results[j].NameFR;
                        if (!sPhaseName) {
                            sPhaseName = aData[i].PhaseDetails.results[j].NameEN;
                        }

                        oContactsListData.aData.push({
                            sName: sName,
                            sTitle: aData[i].Title,
                            sPhone: aData[i].MobilePhone,
                            sEmail: aData[i].Email,
                            _guid: aData[i].Guid,
                            sProjectPhase: sProjectName + ' - ' + sPhaseName,
                            _accountGuid: aData[i].AccountGuid,
                            _accountTypeName: aData[i].AccountDetails.AccountTypeDetails.NameEN,
                            sAccountName: aData[i].AccountDetails.Name,
                            _sortingSequence: aData[i].PhaseDetails.results[j]._sortingSequence, //for default groups sorting                       
                        });
                    }
                } 
            }
        } else {
            for (var i = 0; i < aData.length; i++) {

                sName = ""; //TO DO improve logic to get rid of duplicate logic for sName...
                if (aData[i].FirstName) {
                    sName = aData[i].FirstName;
                }
                if (aData[i].LastName) {
                    if (aData[i].FirstName) {
                        sName = sName + " ";
                    }
                    sName = sName + aData[i].LastName;
                }

                    oContactsListData.aData.push({
                        sName: sName,
                        sTitle: aData[i].Title,
                        sPhone: aData[i].MobilePhone,
                        sEmail: aData[i].Email,
                        _guid: aData[i].Guid,
                        sProjectPhase: $translate.instant('contactsList_groupAll'),// TODO should be translatable...
                        _accountGuid: aData[i].AccountGuid,
                        _accountTypeName: aData[i].AccountDetails.AccountTypeDetails.NameEN,
                        sAccountName: aData[i].AccountDetails.Name,
                        _sortingSequence: -1, //for default groups sorting                       
                    });
                }
            }

            $scope.tableParams.reload();
        };

        var loadContacts = function() {
            oContactsListData.aData = [];
            if (sAccountGuid) {
                apiProvider.getContactsForAccount({
                    bShowSpinner: true,
                    onSuccess: onContactsLoaded,
                    sAccountGuid: sAccountGuid
                });
            } else {
                apiProvider.getContacts({
                    sExpand: "UserDetails,ContactTypeDetails,AccountDetails/AccountTypeDetails,PhaseDetails/ProjectDetails",
                    bShowSpinner: true,
                    onSuccess: onContactsLoaded,
                });
            }
        };

        loadContacts();

        $scope.onDisplay = function(oContact) {
            if (!sAccountGuid) {
                sAccountGuid = oContact._accountGuid;
            }
            $state.go('app.contactDetailsWrapper.contactDetails', {
                sMode: "display",
                sAccountGuid: sAccountGuid,
                sContactGuid: oContact._guid,
            });
        };

        $scope.onGroupingChange = function() {
            loadContacts();
        }

        $scope.onEdit = function(oContact) {
            if (!sAccountGuid) {
                sAccountGuid = oContact._accountGuid;
            }
            $state.go('app.contactDetailsWrapper.contactDetails', {
                sMode: "edit",
                sAccountGuid: sAccountGuid,
                sContactGuid: oContact._guid,
            });
        };

        $scope.onAddNew = function() {
            $state.go('app.contactDetailsWrapper.contactDetails', {
                sMode: "create",
                sAccountGuid: sAccountGuid,
                sContactGuid: "",
            });
        };

        $scope.onNavigateToAccountDetails = function(oContact) {
            var sAccountGuid = oContact._accountGuid;
            var sAccountTypeName = oContact._accountTypeName;

            switch (sAccountTypeName) {
                case "Contractor":
                    $state.go('app.contractorDetailsWrapper.contractorDetails', {
                        sMode: "display",
                        sContractorGuid: sAccountGuid,
                    });
                    break;
                case "Client":
                    $state.go('app.clientDetailsWrapper.clientDetails', {
                        sMode: "display",
                        sClientGuid: sAccountGuid,
                    });
                    break;
            }
        };

        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            loadContacts();
        });

        $scope.$on('contactsShouldBeRefreshed', function(oParameters) {
            loadContacts();
        });

        $scope.$on("$destroy", function() {
            if ($rootScope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails" && $rootScope.sCurrentStateName !== "app.clientDetailsWrapper.clientDetails") { //don't save in history if contact list is weathin the contractor/client details view...  
                if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
                    return;
                }
                historyProvider.addStateToHistory({
                    sStateName: $rootScope.sCurrentStateName,
                    oStateParams: $rootScope.oStateParams
                });
            }

            cacheProvider.putTableStatusToCache({
                sTableName: "contactsList",
                sStateName: $rootScope.sCurrentStateName,
                aGroups: $scope.tableParams.settings().$scope.$groups,
                oFilter: $scope.tableParams.$params.filter,
                oSorting: $scope.tableParams.$params.sorting,
                oListSettings: $scope.oListSettings,
            });
        });
    }
]);