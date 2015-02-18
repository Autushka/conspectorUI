viewControllers.controller('activitiesListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
    function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
        historyProvider.removeHistory(); // because current view doesn't have a back button

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
        $rootScope.oStateParams = {}; // for backNavigation

        var oActivitiesListData = {
            aData: []
        };

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "activitiesList",
            sStateName: $rootScope.sCurrentStateName,
        });

        var oInitialSortingForActivitiesList = {
            sActivityName: 'asc'
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

        var onActivitiesLoaded = function(aData) {
            var sProjectName = "";
            var sPhaseName = "";
            var sAccounts = "";
            var sContacts = "";
            var _sortingSequence = "";
            var sTypeSortingSequence = "";
            var sTypeIconUrl = "";
            var bMatchFound = false;
            for (var i = 0; i < aData.length; i++) {
                sTypeSortingSequence = "";
                sTypeIconUrl = "";

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
	                            sContacts = sContacts + aData[i].ContactDetails.results[j].FirstName + " " + aData[i].ContactDetails.results[j].LastName + ", ";
	                        }
	                    }
	                }

                    if (aData[i].ActivityTypeDetails) {
                        sTypeIconUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[i].ActivityTypeDetails.AssociatedIconFileGuid;
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
		                    sObject: aData[i].Object,
		                    sAccounts: sAccounts,
		                    sContacts: sContacts,
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
        };

        var loadActivities = function() {
            oActivitiesListData.aData = [];
            apiProvider.getActivities({
                sExpand: "AccountDetails/AccountTypeDetails, ActivityTypeDetails, ContactDetails, PhaseDetails/ProjectDetails",
                bShowSpinner: true,
                onSuccess: onActivitiesLoaded
            });
        };

        loadActivities(); //load Activities

        $scope.onDisplay = function(oActivity) {
            $state.go('app.activityDetailsWrapper.activityDetails', {
                sMode: "display",
                sActivityGuid: oActivity._guid,
            });
        };

        $scope.onEdit = function(oActivity) {
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

        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            loadActivities();
        });

        $scope.$on('activitiesShouldBeRefreshed', function(oParameters) {
            loadActivities();
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
                sTableName: "activitiesList",
                sStateName: $rootScope.sCurrentStateName,
                aGroups: $scope.tableParams.settings().$scope.$groups,
                oFilter: $scope.tableParams.$params.filter,
                oSorting: $scope.tableParams.$params.sorting,
            });
        });
    }
]);