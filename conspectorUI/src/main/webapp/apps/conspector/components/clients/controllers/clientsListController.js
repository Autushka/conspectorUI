viewControllers.controller('clientsListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', 'utilsProvider',
    function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, utilsProvider) {
        historyProvider.removeHistory(); // because current view doesn't have a back button

        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oClient",
            sOperation: "bCreate"
        });

        $scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oClient",
            sOperation: "bUpdate"
        });

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = {}; // for backNavigation

        var oClientsListData = {
            aData: []
        };

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "clientsList",
            sStateName: $rootScope.sCurrentStateName,
        });
        $scope.oListSettings = {
            bGroupListByProjectAndPhase: oTableStatusFromCache.oListSettings.bGroupListByProjectAndPhase
        };

        var oInitialSortingForClientsList = {
            sClientName: 'asc'
        };
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            oInitialSortingForClientsList = angular.copy(oTableStatusFromCache.oSorting);
        }
        var oInitialFilterForClientsList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            oInitialFilterForClientsList = angular.copy(oTableStatusFromCache.oFilter);
        }
        var oInitialGroupsSettingsForClientsList = [];
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            oInitialGroupsSettingsForClientsList = angular.copy(oTableStatusFromCache.aGroups);
        }

        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oClientsListData,
            sDisplayedDataArrayName: "aDisplayedClients",
            oInitialSorting: oInitialSortingForClientsList,
            oInitialFilter: oInitialFilterForClientsList,
            aInitialGroupsSettings: oInitialGroupsSettingsForClientsList,
            sGroupBy: "sProjectPhase",
            sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
        });

        var onClientsLoaded = function(aData) {
            var sProjectName = "";
            var sPhaseName = "";
            var bMatchFound = false;
            if ($scope.oListSettings.bGroupListByProjectAndPhase) {
                for (var i = 0; i < aData.length; i++) {

                    if (aData[i].PhaseDetails.results.length) {
                        for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
                            aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
                        }
                        aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);

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

                            oClientsListData.aData.push({
                                sClientName: aData[i].Name,
                                sCleanedClientName: utilsProvider.replaceSpecialChars(aData[i].Name),
                                sPhone: aData[i].MainPhone,
                                sEmail: aData[i].Email,
                                _guid: aData[i].Guid,
                                sTags: aData[i].DescriptionTags,
                                sProjectPhase: sProjectName + " - " + sPhaseName,
                                _sortingSequence: aData[i].PhaseDetails.results[j]._sortingSequence, //for default groups sorting
                            });
                        }
                    }
                }
            } else {
                for (var i = 0; i < aData.length; i++) {
                    oClientsListData.aData.push({
                        sClientName: aData[i].Name,
                        sCleanedClientName: utilsProvider.replaceSpecialChars(aData[i].Name),
                        sPhone: aData[i].MainPhone,
                        sEmail: aData[i].Email,
                        _guid: aData[i].Guid,
                        sTags: aData[i].DescriptionTags,
                        sProjectPhase: $translate.instant('clientsList_groupAll'), // TODO should be translatable...
                        _sortingSequence: -1, //for default groups sorting
                    });
                }

            }


            $scope.tableParams.reload();
        };

        var loadClients = function() {
            oClientsListData.aData = [];
            if ($scope.globalSelectedPhases.length > 0) {
            apiProvider.getClients({
                sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
                bShowSpinner: true,
                onSuccess: onClientsLoaded
            });
            } else {
                oClientsListData.aData = [];
                onClientsLoaded([]);
                return;
            }
        };

        loadClients(); //load Clients

        $scope.onDisplay = function(oClient) {
            $state.go('app.clientDetailsWrapper.clientDetails', {
                sMode: "display",
                sClientGuid: oClient._guid,
            });
        };

        $scope.onGroupingChange = function() {
            loadClients();
        }

        $scope.onEdit = function(oClient) {
            $state.go('app.clientDetailsWrapper.clientDetails', {
                sMode: "edit",
                sClientGuid: oClient._guid,
            });
        };

        $scope.onAddNew = function() {
            $state.go('app.clientDetailsWrapper.clientDetails', {
                sMode: "create",
                sClientGuid: "",
            });
        };

        $scope.onClearFiltering = function() {
            $scope.tableParams.$params.filter = {};
            $scope.tableParams.reload();
        };

        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            loadClients();
        });

        $scope.$on('accountsShouldBeRefreshed', function(oParameters) {
            loadClients();
        });

        $scope.$on("$destroy", function() {
            if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
                return;
            }

            historyProvider.addStateToHistory({
                sStateName: $rootScope.sCurrentStateName,
                oStateParams: $rootScope.oStateParams
            });

            cacheProvider.putTableStatusToCache({
                sTableName: "clientsList",
                sStateName: $rootScope.sCurrentStateName,
                aGroups: $scope.tableParams.settings().$scope.$groups,
                oFilter: $scope.tableParams.$params.filter,
                oSorting: $scope.tableParams.$params.sorting,
                oListSettings: $scope.oListSettings,
            });
        });
    }
]);