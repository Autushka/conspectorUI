viewControllers.controller('unitsListView', ['$scope', '$rootScope', '$state', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings', '$timeout',
    function($scope, $rootScope, $state, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings, $timeout) {
        historyProvider.removeHistory(); // because current view doesn't have a back button
        cacheProvider.clearOtherViewsScrollPosition("unitsList");

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

        var oInitialSortingForUnitsList = {
            sUnitName: 'asc'
        };
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
            var iImagesNumber = 0;
            var sFileMetadataSetLastModifiedAt = "";
            var aImages = [];
            for (var i = 0; i < aData.length; i++) {
                sProjectName = "";
                sPhaseName = "";
                bMatchFound = false;
                iSortingSequence = 0;
                sClients = "";
                sProjectPhase = "";
                iImagesNumber = 0;
                aImages = [];

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

                if (aData[i].FileMetadataSetDetails) {
                    if (aData[i].FileMetadataSetDetails.AttachmentsNumber) { // to display default 0
                        iImagesNumber = aData[i].FileMetadataSetDetails.AttachmentsNumber;
                    }
                    sFileMetadataSetLastModifiedAt = aData[i].FileMetadataSetDetails.LastModifiedAt;
                    if (aData[i].FileMetadataSetDetails.FileMetadataDetails) {
                        for (var j = 0; j < aData[i].FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
                            //Things[i]
                            if (aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false) {
                                aImages.push(aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j]);
                            }
                        }
                    }
                }

                if (aData[i].AccountDetails) {
                    for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
                        sClients = sClients + aData[i].AccountDetails.results[j].Name + "; ";
                    }
                }

                oUnitsListData.aData.push({
                    sUnitName: utilsProvider.convertStringToInt(aData[i].Name),
                    sCleanedUnitName: utilsProvider.replaceSpecialChars(aData[i].Name),
                    _guid: aData[i].Guid,
                    sTags: aData[i].DescriptionTags,
                    sCleanedTags: utilsProvider.replaceSpecialChars(aData[i].DescriptionTags),
                    sProjectPhase: sProjectName + " - " + sPhaseName,
                    sClients: sClients,
                    sCleanedClients: utilsProvider.replaceSpecialChars(sClients),
                    _sortingSequence: iSortingSequence,
                    _fileMetadataSetGuid: aData[i].FileMetadataSetGuid,
                    _fileMetadataSetLastModifiedAt: sFileMetadataSetLastModifiedAt,
                    iImagesNumber: iImagesNumber,
                    _aImages: aImages,
                });
            }
            $scope.tableParams.reload();
            $timeout(function() {
                if ($(".cnpContentWrapper")[0]) {
                    $(".cnpContentWrapper")[0].scrollTop = cacheProvider.getListViewScrollPosition("unitsList");
                    cacheProvider.putListViewScrollPosition("unitsList", 0);
                }
            }, 0);
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

                apiProvider.getUnits({
                    sExpand: "PhaseDetails/ProjectDetails,UnitOptionDetails,AccountDetails,FileMetadataSetDetails/FileMetadataDetails",
                    sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByPhases,
                    bShowSpinner: true,
                    onSuccess: onUnitsLoaded
                });
            } else {
                oUnitsListData.aData = [];
                onUnitsLoaded([]);
                return;
            }
        };

        loadUnits(); //load Units

        $scope.onDisplay = function(oUnit) {
            cacheProvider.putListViewScrollPosition("unitsList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...

            $rootScope.sFileMetadataSetGuid = oUnit._fileMetadataSetGuid;
            $rootScope.sFileMetadataSetLastModifiedAt = oUnit._fileMetadataSetLastModifiedAt;
            $state.go('app.unitDetailsWrapper.unitDetails', {
                sMode: "display",
                sUnitGuid: oUnit._guid,
            });
        };

        $scope.onEdit = function(oUnit) {
            cacheProvider.putListViewScrollPosition("unitsList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...

            $rootScope.sFileMetadataSetGuid = oUnit._fileMetadataSetGuid;
            $rootScope.sFileMetadataSetLastModifiedAt = oUnit._fileMetadataSetLastModifiedAt;
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

        $scope.onClearFiltering = function() {
            $scope.tableParams.$params.filter = {};
            $scope.tableParams.reload();
        };

        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            cacheProvider.putListViewScrollPosition("unitsList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...            
            loadUnits();
        });

        $scope.$on('accountsShouldBeRefreshed', function(oParameters) {
            cacheProvider.putListViewScrollPosition("unitsList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...            
            loadUnits();
        });

        $scope.onDisplayPhotoGallery = function(oUnit, oEvent) {
            oEvent.stopPropagation();
            if (oUnit._aImages.length) {
                servicesProvider.setUpPhotoGallery(oUnit._aImages);
            }
        };

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