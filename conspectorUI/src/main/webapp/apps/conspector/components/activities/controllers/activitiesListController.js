viewControllers.controller('activitiesListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', 'utilsProvider', '$timeout',
    function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, utilsProvider, $timeout) {
        if ($rootScope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails" && $rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails" && $rootScope.sCurrentStateName !== "app.contactDetailsWrapper.contactDetails" && $rootScope.sCurrentStateName !== "app.clientDetailsWrapper.clientDetails") {
            historyProvider.removeHistory(); // because current view doesn't have a back button
            $rootScope.oStateParams = {}; // for backNavigation 
            cacheProvider.clearOtherViewsScrollPosition("activitiesList");
        }

        var sCurrentUser = cacheProvider.oUserProfile.sUserName;
        var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oActivity",
            sOperation: "bCreate"
        });

        $scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oActivity",
            sOperation: "bUpdate"
        });

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	

        var sUnitGuid = "";
        if ($stateParams.sUnitGuid) {
            sUnitGuid = $stateParams.sUnitGuid;
        }

        var sContractorGuid = "";
        if ($stateParams.sContractorGuid) {
            sContractorGuid = $stateParams.sContractorGuid;
        }

        var sClientGuid = "";
        if ($stateParams.sClientGuid) {
            sClientGuid = $stateParams.sClientGuid;
        }

        var sContactGuid = "";
        if ($stateParams.sContactGuid) {
            sContactGuid = $stateParams.sContactGuid;
        }


        if ($cookieStore.get("selectedActivityTypes" + sCurrentUser + sCompany) && $cookieStore.get("selectedActivityTypes" + sCurrentUser + sCompany).aSelectedActivityType) {
            $scope.aSelectedActivityType = angular.copy($cookieStore.get("selectedActivityTypes" + sCurrentUser + sCompany).aSelectedActivityType);
        }

        var oActivitiesListData = {
            aData: []
        };

        var oActivityTypesWrapper = {
            aData: [{
                _typesGuids: []
            }]
        };

        var oTypes = {
            _typesGuids: []
        };

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "activitiesList",
            sStateName: $rootScope.sCurrentStateName,
        });

        var oInitialSortingForActivitiesList = {
            sDbCreatedAt: 'dsc'
        };
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            oInitialSortingForActivitiesList = angular.copy(oTableStatusFromCache.oSorting);
        }
        var oInitialFilterForActivitiesList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            oInitialFilterForActivitiesList = angular.copy(oTableStatusFromCache.oFilter);
        }
        var oInitialGroupsSettingsForActivitiesList = [];
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            oInitialGroupsSettingsForActivitiesList = angular.copy(oTableStatusFromCache.aGroups);
        }

        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oActivitiesListData,
            sDisplayedDataArrayName: "aDisplayedActivities",
            oInitialSorting: oInitialSortingForActivitiesList,
            oInitialFilter: oInitialFilterForActivitiesList,
            aInitialGroupsSettings: oInitialGroupsSettingsForActivitiesList,
            sGroupBy: "sProjectPhase",
            sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
        });

        var onActivityTypesLoaded = function(aData) {
            for (var i = 0; i < aData.length; i++) {
                aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
            }
            aData = $filter('orderBy')(aData, ["_sortingSequence"]);
            // if ($scope.sMode === 'create') {
            //     oActivityWrapper.aData[0]._activityTypeGuid = aData[0].Guid;
            // }
            oTypes._typesGuids = [];
            if ($scope.aSelectedActivityType) {
                for (var i = 0; i < $scope.aSelectedActivityType.length; i++) {
                    oTypes._typesGuids.push($scope.aSelectedActivityType[i].Guid);
                }
            } else {
                // for (var i = 0; i < aData.length; i++) {
                //     oTypes._typesGuids.push(aData[i].Guid);
                // }
                // $cookieStore.put("selectedActivityTypes" + sCurrentUser + sCompany, {
                //     aSelectedActivityType: oTypes._typesGuids,
                // });
            }
            oActivityTypesWrapper.aData[0] = angular.copy(oTypes);
            // oTypes._typesGuids.push(aData[0].Guid);
            // oActivityTypesWrapper.aData[0] = angular.copy(oTypes);



            servicesProvider.constructDependentMultiSelectArray({
                oDependentArrayWrapper: {
                    aData: aData
                },
                oParentArrayWrapper: oActivityTypesWrapper,
                sNameEN: "NameEN",
                sNameFR: "NameFR",
                sDependentKey: "Guid",
                sParentKeys: "_typesGuids",
                sDependentIconKey: "AssociatedIconFileGuid",
                sTargetArrayNameInParent: "aActivityTypes"
            });
            if (oActivityTypesWrapper.aData[0]) {
                $scope.aActivityTypes = angular.copy(oActivityTypesWrapper.aData[0].aActivityTypes);
            }


        };

        var onActivitiesLoaded = function(aData) {
            var sProjectName = "";
            var sPhaseName = "";
            var sAccounts = "";
            var sContacts = "";
            var _sortingSequence = "";
            var sTypeSortingSequence = "";
            var sTypeIconUrl = "";
            var sCreatedAt = "";
            var sDbCreatedAt = "";
            var sLastModifiedAt = "";
            var sLastModifiedAt = "";
            var bMatchFound = false;
            for (var i = 0; i < aData.length; i++) {
                sCreatedAt = "";
                sLastModifiedAt = "";
                sTypeSortingSequence = "";
                sTypeIconUrl = "";

                sDbCreatedAt = aData[i].CreatedAt;
                sCreatedAt = utilsProvider.dBDateToSting(aData[i].CreatedAt);
                sDbModifiedAt = aData[i].LastModifiedAt;
                sLastModifiedAt = utilsProvider.dBDateToSting(aData[i].LastModifiedAt);

                sActivityType = $translate.use() === "en" ? aData[i].ActivityTypeDetails.NameEN : aData[i].ActivityTypeDetails.NameFR;

                if (aData[i].PhaseDetails.results.length) {
                    sAccounts = "";
                    sContacts = "";
                    for (var j = 0; j < aData[i].PhaseDetails.results.length; j++) {
                        aData[i].PhaseDetails.results[j]._sortingSequence = aData[i].PhaseDetails.results[j].GeneralAttributes.SortingSequence;
                    }
                    aData[i].PhaseDetails.results = $filter('orderBy')(aData[i].PhaseDetails.results, ["_sortingSequence"]);

                    if (aData[i].AccountDetails.results.length == 0) {

                    } else {
                        for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {

                            if (!aData[i].AccountDetails.results[j].GeneralAttributes.IsDeleted) {
                                // _aAccounts.push(oData.AccountDetails.results[i]);
                                sAccounts = sAccounts + aData[i].AccountDetails.results[j].Name + ", ";
                            }
                        }
                    }

                    if (aData[i].ContactDetails.results.length == 0) {

                    } else {
                        for (var j = 0; j < aData[i].ContactDetails.results.length; j++) {

                            if (!aData[i].ContactDetails.results[j].GeneralAttributes.IsDeleted) {
                                // _aContacts.push(oData.ContactDetails.results[i]);
                                if (aData[i].ContactDetails.results[j].LastName) {
                                    sContacts = sContacts + aData[i].ContactDetails.results[j].FirstName + " " + aData[i].ContactDetails.results[j].LastName + ", ";
                                } else {
                                    sContacts = sContacts + aData[i].ContactDetails.results[j].FirstName + ", ";
                                }

                            }
                        }
                    }

                    if (aData[i].ActivityTypeDetails) {
                        sTypeIconUrl = $window.location.origin + $window.location.pathname + "rest/file/V2/get/" + aData[i].ActivityTypeDetails.AssociatedIconFileGuid;
                        sTypeSortingSequence = aData[i].ActivityTypeDetails.GeneralAttributes.SortingSequence;
                    }

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

                        oActivitiesListData.aData.push({
                            sActivityType: sActivityType,
                            sCleanedActivityType: utilsProvider.replaceSpecialChars(sActivityType),
                            sObject: aData[i].Object,
                            sCleanedObject: utilsProvider.replaceSpecialChars(aData[i].Object),
                            sAccounts: sAccounts,
                            sCleanedAccounts: utilsProvider.replaceSpecialChars(sAccounts),
                            sContacts: sContacts,
                            sCleanedContacts: utilsProvider.replaceSpecialChars(sContacts),
                            sDbCreatedAt: sDbCreatedAt,
                            sCreatedAt: sCreatedAt,
                            sDbModifiedAt: sDbModifiedAt,
                            sLastModifiedAt: sLastModifiedAt,
                            _guid: aData[i].Guid,
                            sProjectPhase: sProjectName + " - " + sPhaseName,
                            _sortingSequence: aData[i].PhaseDetails.results[j]._sortingSequence,
                            sTypeSortingSequence: sTypeSortingSequence,
                            sTypeIconUrl: sTypeIconUrl,
                        });
                    }
                }
            }
            $scope.tableParams.reload();
            if($rootScope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails" && $rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails" && $rootScope.sCurrentStateName !== "app.contactDetailsWrapper.contactDetails" && $rootScope.sCurrentStateName !== "app.clientDetailsWrapper.clientDetails"){
            $timeout(function() {
                if ($(".cnpAppView")[0]) {
                    $(".cnpAppView")[0].scrollTop = cacheProvider.getListViewScrollPosition("activitiesList");
                    cacheProvider.putListViewScrollPosition("activitiesList", 0); 
                }
            }, 0);}
        };

        var loadActivities = function() {
            oActivitiesListData.aData = [];

            var sFilter = "";
            var sFilterStart = " and (";
            var sFilterEnd = ")";

            //need to remove this if
            if ($scope.globalSelectedPhases.length > 0) {
                if ($scope.aSelectedActivityType) {
                    if ($scope.aSelectedActivityType.length > 0) {
                        sFilter = sFilter + sFilterStart;
                        for (var i = 0; i < $scope.aSelectedActivityType.length; i++) {
                            sFilter = sFilter + "ActivityTypeGuid eq '" + $scope.aSelectedActivityType[i].Guid + "'";
                            if (i < $scope.aSelectedActivityType.length - 1) {
                                sFilter = sFilter + " or ";
                            }
                        }
                        sFilter = sFilter + sFilterEnd;

                        if (sUnitGuid) {
                            sFilter = sFilter + sFilterStart;
                            sFilter = sFilter + "substringof('" + sUnitGuid + "', UnitGuids) eq true";
                            sFilter = sFilter + sFilterEnd;
                        }

                        if (sContractorGuid) {
                            sFilter = sFilter + sFilterStart;
                            sFilter = sFilter + "substringof('" + sContractorGuid + "', AccountGuids) eq true";
                            sFilter = sFilter + sFilterEnd;
                        }

                        if (sClientGuid) {
                            sFilter = sFilter + sFilterStart;
                            sFilter = sFilter + "substringof('" + sClientGuid + "', AccountGuids) eq true";
                            sFilter = sFilter + sFilterEnd;
                        }

                        if (sContactGuid) {
                            sFilter = sFilter + sFilterStart;
                            sFilter = sFilter + "substringof('" + sContactGuid + "', ContactGuids) eq true";
                            sFilter = sFilter + sFilterEnd;
                        }


                        apiProvider.getActivities({
                            sExpand: "AccountDetails/AccountTypeDetails, ActivityTypeDetails, ContactDetails, PhaseDetails/ProjectDetails",
                            sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilter,
                            bShowSpinner: true,
                            onSuccess: onActivitiesLoaded
                        });
                    }
                }
            } else {
                oActivitiesListData.aData = [];
                onActivitiesLoaded([]);
                return;
            }
        };

        var loadActivityTypes = function() {
            apiProvider.getActivityTypes({
                bShowSpinner: false,
                onSuccess: onActivityTypesLoaded
            });
        };
        loadActivityTypes();
        loadActivities(); //load Activities

        $scope.onDisplay = function(oActivity) {
            cacheProvider.putListViewScrollPosition("activitiesList", $(".cnpAppView")[0].scrollTop); //saving scroll position...             
            $state.go('app.activityDetailsWrapper.activityDetails', {
                sMode: "display",
                sActivityGuid: oActivity._guid,
            });
        };

        $scope.onEdit = function(oActivity) {
            cacheProvider.putListViewScrollPosition("activitiesList", $(".cnpAppView")[0].scrollTop); //saving scroll position...              
            $state.go('app.activityDetailsWrapper.activityDetails', {
                sMode: "edit",
                sActivityGuid: oActivity._guid,
            });
        };

        $scope.onAddNew = function() {
            $state.go('app.activityDetailsWrapper.activityDetails', {
                sMode: "create",
                sActivityGuid: "",
            });
        };

        $scope.onClearFiltering = function() {
            $scope.tableParams.$params.filter = {};
            $scope.tableParams.reload();
        };

        $scope.onCloseCheckSelectedTypesLength = function() {
            $cookieStore.put("selectedActivityTypes" + sCurrentUser + sCompany, {
                aSelectedActivityType: $scope.aSelectedActivityType,
            });

            if ($scope.aSelectedActivityType && $scope.aSelectedActivityType.length === 0) {
                // cacheProvider.cleanEntitiesCache("oActivityEntity");
                // cacheProvider.cleanEntitiesCache("oTaskStatusEntity");
            }

            loadActivities();
        };

        $scope.onSelectedTypesModified = function() {
            $scope.onCloseCheckSelectedTypesLength();
        };

        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            cacheProvider.putListViewScrollPosition("activitiesList", $(".cnpAppView")[0].scrollTop); //saving scroll position...
            loadActivities();
        });

        $scope.$on('activitiesShouldBeRefreshed', function(oParameters) {
            cacheProvider.putListViewScrollPosition("activitiesList", $(".cnpAppView")[0].scrollTop); //saving scroll position...            
            loadActivities();
        });

        $scope.$on("$destroy", function() {
            if ($rootScope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails" && $rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails" && $rootScope.sCurrentStateName !== "app.contactDetailsWrapper.contactDetails" && $rootScope.sCurrentStateName !== "app.clientDetailsWrapper.clientDetails") { //don't save in history if contact list is weathin the contractor/client details view...  
                if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
                    return;
                }
                historyProvider.addStateToHistory({
                    sStateName: $rootScope.sCurrentStateName,
                    oStateParams: $rootScope.oStateParams
                });
            }

            cacheProvider.putTableStatusToCache({
                sTableName: "activitiesList",
                sStateName: $rootScope.sCurrentStateName,
                aGroups: $scope.tableParams.settings().$scope.$groups,
                oFilter: $scope.tableParams.$params.filter,
                oSorting: $scope.tableParams.$params.sorting,
            });
        });
    }
]);