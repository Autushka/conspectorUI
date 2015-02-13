viewControllers.controller('unitsListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
    function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
        historyProvider.removeHistory(); // because current view doesn't have a back button

        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oUnit",
            sOperation: "bCreate"
        });

        $scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oUnit",
            sOperation: "bUpdate"
        });

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = {}; // for backNavigation			

        var oUnitsListData = {
            aData: []
        };

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "unitsList",
            sStateName: $rootScope.sCurrentStateName,
        });

        var oInitialSortingForUnitsList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            oInitialSortingForUnitsList = angular.copy(oTableStatusFromCache.oSorting);
        }
        var oInitialFilterForUnitsList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            oInitialFilterForUnitsList = angular.copy(oTableStatusFromCache.oFilter);
        }
        var oInitialGroupsSettingsForUnitsList = [];
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            oInitialGroupsSettingsForUnitsList = angular.copy(oTableStatusFromCache.aGroups);
        }

        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oUnitsListData,
            sDisplayedDataArrayName: "aDisplayedUnits",
            oInitialSorting: oInitialSortingForUnitsList,
            oInitialFilter: oInitialFilterForUnitsList,
            aInitialGroupsSettings: oInitialGroupsSettingsForUnitsList,
            sGroupBy: "sProjectPhase",
            sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
        });

        var onUnitsLoaded = function(aData) {

            var sProjectName = "";
            var sPhaseName = "";
            var bMatchFound = false;
            var iSortingSequence = 0;
            var sClients = "";
            var sProjectPhase = "";
            for (var i = 0; i < aData.length; i++) {
                sProjectName = "";
                sPhaseName = "";
                bMatchFound = false;
                iSortingSequence = 0;
                sClients = "";
                sProjectPhase = "";

                if (aData[i].PhaseDetails) {
                    iSortingSequence = aData[i].PhaseDetails.GeneralAttributes.SortingSequence;
                    for (var k = 0; k < cacheProvider.oUserProfile.aGloballySelectedPhasesGuids.length; k++) {
                        if (aData[i].PhaseDetails.Guid === cacheProvider.oUserProfile.aGloballySelectedPhasesGuids[k]) {
                            bMatchFound = true;
                            break;
                        }
                    }
                    if (!bMatchFound) {
                        continue;
                    }

                    sProjectName = $translate.use() === "en" ? aData[i].PhaseDetails.ProjectDetails.NameEN : aData[i].PhaseDetails.ProjectDetails.NameFR;
                    if (!sProjectName) {
                        sProjectName = aData[i].PhaseDetails.ProjectDetails.NameEN;
                    }
                    sPhaseName = $translate.use() === "en" ? aData[i].PhaseDetails.NameEN : aData[i].PhaseDetails.NameFR;
                    if (!sPhaseName) {
                        sPhaseName = aData[i].PhaseDetails.NameEN;
                    }

                    sProjectPhase = sProjectName + " - " + sPhaseName;
                } else {
                    sProjectPhase = "Not Assigned";
                }


                //




                if (aData[i].AccountDetails) {
                    for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
                        sClients = sClients + aData[i].AccountDetails.results[j].Name + "; ";
                    }
                }

                oUnitsListData.aData.push({
                    sUnitName: aData[i].Name,
                    _guid: aData[i].Guid,
                    sTags: aData[i].DescriptionTags,
                    sProjectPhase: sProjectName + " - " + sPhaseName,
                    sClients: sClients,
                    _sortingSequence: iSortingSequence
                });
            }
            $scope.tableParams.reload();
        };

        var loadUnits = function() {
            oUnitsListData.aData = [];
            var sFilterByPhases = "";
            var sFilterStart = " and (";
            var sFilterEnd = ")";
            if ($scope.globalSelectedPhases.length > 0) {
                sFilterByPhases = sFilterStart;
                for (var i = 0; i < $scope.globalSelectedPhases.length; i++) {
                    sFilterByPhases = sFilterByPhases + "PhaseGuid eq '" + $scope.globalSelectedPhases[i] + "'";
                    if (i < $scope.globalSelectedPhases.length - 1) {
                        sFilterByPhases = sFilterByPhases + " or ";
                    }             
                }
                sFilterByPhases = sFilterByPhases + sFilterEnd;
            }

            apiProvider.getUnits({
                sExpand: "PhaseDetails/ProjectDetails,UnitOptionDetails,AccountDetails",
                sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByPhases,
                bShowSpinner: true,
                onSuccess: onUnitsLoaded
            });
        };
        
        loadUnits(); //load Units

        $scope.onDisplay = function(oUnit) {
            $state.go('app.unitDetailsWrapper.unitDetails', {
                sMode: "display",
                sUnitGuid: oUnit._guid,
            });
        };

        $scope.onEdit = function(oUnit) {
            $state.go('app.unitDetailsWrapper.unitDetails', {
                sMode: "edit",
                sUnitGuid: oUnit._guid,
            });
        };

        $scope.onAddNew = function() {
            $state.go('app.unitDetailsWrapper.unitDetails', {
                sMode: "create",
                sUnitGuid: "",
            });
        };
        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            loadUnits();
        });

        $scope.$on('accountsShouldBeRefreshed', function(oParameters) {
            loadUnits();
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
                sTableName: "unitsList",
                sStateName: $rootScope.sCurrentStateName,
                aGroups: $scope.tableParams.settings().$scope.$groups,
                oFilter: $scope.tableParams.$params.filter,
                oSorting: $scope.tableParams.$params.sorting,
            });
        });
    }
]);