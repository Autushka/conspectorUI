viewControllers.controller('contractorsListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', 'utilsProvider', '$timeout',
    function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, utilsProvider, $timeout) {
        historyProvider.removeHistory(); // because current view doesn't have a back button
        cacheProvider.clearOtherViewsScrollPosition("contractorsList");
        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oContractor",
            sOperation: "bCreate"
        });

        $scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oContractor",
            sOperation: "bUpdate"
        });



        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = {}; // for backNavigation

        var oContractorsListData = {
            aData: []
        };

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "contractorsList",
            sStateName: $rootScope.sCurrentStateName
        });

        var oInitialSortingForContractorsList = {
            sContractorName: 'asc'
        };
        $scope.oListSettings = {
            bGroupListByProjectAndPhase: oTableStatusFromCache.oListSettings.bGroupListByProjectAndPhase
        };
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            oInitialSortingForContractorsList = angular.copy(oTableStatusFromCache.oSorting);
        }
        var oInitialFilterForContractorsList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            oInitialFilterForContractorsList = angular.copy(oTableStatusFromCache.oFilter);
        }
        var oInitialGroupsSettingsForContractorsList = [];
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            oInitialGroupsSettingsForContractorsList = angular.copy(oTableStatusFromCache.aGroups);
        }

        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oContractorsListData,
            sDisplayedDataArrayName: "aDisplayedContractors",
            oInitialSorting: oInitialSortingForContractorsList,
            oInitialFilter: oInitialFilterForContractorsList,
            aInitialGroupsSettings: oInitialGroupsSettingsForContractorsList,
            sGroupBy: "sProjectPhase",
            sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
        });

        var onContractorsLoaded = function(aData) {


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

                            oContractorsListData.aData.push({
                                sContractorName: aData[i].Name,
                                sCleanedContractorName: utilsProvider.replaceSpecialChars(aData[i].Name),
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
                    oContractorsListData.aData.push({
                        sContractorName: aData[i].Name,
                        sCleanedContractorName: utilsProvider.replaceSpecialChars(aData[i].Name),
                        sPhone: aData[i].MainPhone,
                        sEmail: aData[i].Email,
                        _guid: aData[i].Guid,
                        sTags: aData[i].DescriptionTags,
                        sProjectPhase: $translate.instant('contractorsList_groupAll'),
                        _sortingSequence: -1, //for default groups sorting
                    });
                }
            }
            $scope.tableParams.reload();
            $timeout(function() {
                if ($(".cnpAppView")[0]) {
                    $(".cnpAppView")[0].scrollTop = cacheProvider.getListViewScrollPosition("contractorsList");
                }
            }, 0);
        };

        var loadContractors = function() {
            oContractorsListData.aData = [];
            if ($scope.globalSelectedPhases.length > 0) {
                apiProvider.getContractors({
                    sExpand: "PhaseDetails/ProjectDetails,AccountTypeDetails",
                    bShowSpinner: true,
                    onSuccess: onContractorsLoaded,
                });
            } else {
                oContractorsListData.aData = [];
                onContractorsLoaded([]);
                return;
            }
        };

        loadContractors(); //load Contractors
        $timeout(function() {
            if ($(".cnpAppView")[0]) {
                $(".cnpAppView")[0].scrollTop = cacheProvider.getListViewScrollPosition("contractorsList");
            }
        }, 0);

        $scope.onDisplay = function(oContractor) {
            cacheProvider.putListViewScrollPosition("contractorsList", $(".cnpAppView")[0].scrollTop); //saving scroll position...            
            $state.go('app.contractorDetailsWrapper.contractorDetails', {
                sMode: "display",
                sContractorGuid: oContractor._guid,
            });
        };

        $scope.onGroupingChange = function() {
            loadContractors();
        }

        $scope.onEdit = function(oContractor) {
            cacheProvider.putListViewScrollPosition("contractorsList", $(".cnpAppView")[0].scrollTop); //saving scroll position...
            $state.go('app.contractorDetailsWrapper.contractorDetails', {
                sMode: "edit",
                sContractorGuid: oContractor._guid,
            });
        };

        $scope.onAddNew = function() {
            $state.go('app.contractorDetailsWrapper.contractorDetails', {
                sMode: "create",
                sContractorGuid: "",
            });
        };

        $scope.onClearFiltering = function() {
            $scope.tableParams.$params.filter = {};
            $scope.tableParams.reload();
        };

        $scope.onGenerateReport = function() {
            apiProvider.generateReport({});
        };

        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            loadContractors();
        });

        $scope.$on('accountsShouldBeRefreshed', function(oParameters) {
            loadContractors();
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
                sTableName: "contractorsList",
                sStateName: $rootScope.sCurrentStateName,
                aGroups: $scope.tableParams.settings().$scope.$groups,
                oFilter: $scope.tableParams.$params.filter,
                oSorting: $scope.tableParams.$params.sorting,
                oListSettings: $scope.oListSettings,
            });
        });
    }
]);