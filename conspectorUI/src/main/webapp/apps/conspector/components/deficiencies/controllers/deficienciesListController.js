viewControllers.controller('deficienciesListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', 'rolesSettings',
    function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, rolesSettings) {
        if ($rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails") {
            historyProvider.removeHistory(); // because current view doesn't have a back button
        }

        var sCurrentRole = cacheProvider.oUserProfile.sCurrentRole;
        $scope.bDisplayAddButton = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oDeficiency",
            sOperation: "bCreate"
        });

        $scope.bDisplayEditButtons = rolesSettings.getRolesSettingsForEntityAndOperation({
            sRole: sCurrentRole,
            sEntityName: "oDeficiency",
            sOperation: "bUpdate"
        });

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation	
        $rootScope.oStateParams = {}; // for backNavigation	

        var sUnitGuid = "";

        if ($stateParams.sUnitGuid) {
            sUnitGuid = $stateParams.sUnitGuid;
        }

        var oDeficienciesListData = {
            aData: []
        };

        var oDeficiencyStatusesWrapper = {
            aData: [{
                _statusesGuids: []
            }]
        };

        var oStatuses = {
            _statusesGuids: []
        };

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "deficienciesList",
            sStateName: $rootScope.sCurrentStateName,
        });

        var oInitialSortingForDeficienciesList = {
            sUnit: 'asc'
        };
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oSorting, {})) {
            oInitialSortingForDeficienciesList = angular.copy(oTableStatusFromCache.oSorting);
        }
        var oInitialFilterForDeficienciesList = {};
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.oFilter, {})) {
            oInitialFilterForDeficienciesList = angular.copy(oTableStatusFromCache.oFilter);
        }
        var oInitialGroupsSettingsForDeficienciesList = [];
        if (oTableStatusFromCache && !angular.equals(oTableStatusFromCache.aGroups, [])) {
            oInitialGroupsSettingsForDeficienciesList = angular.copy(oTableStatusFromCache.aGroups);
        }

        $scope.tableParams = servicesProvider.createNgTable({
            oInitialDataArrayWrapper: oDeficienciesListData,
            sDisplayedDataArrayName: "aDisplayedDeficiencies",
            oInitialSorting: oInitialSortingForDeficienciesList,
            oInitialFilter: oInitialFilterForDeficienciesList,
            aInitialGroupsSettings: oInitialGroupsSettingsForDeficienciesList,
            sGroupBy: "sProjectPhase",
            sGroupsSortingAttribue: "_sortingSequence" //for default groups sorting
        });

        var onDeficiencyStatusesLoaded = function(aData) {
            for (var i = 0; i < aData.length; i++) {
                aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
            }
            aData = $filter('orderBy')(aData, ["_sortingSequence"]);
            // if ($scope.sMode === 'create') {
            //     oDeficiencyWrapper.aData[0]._deficiencyStatusGuid = aData[0].Guid;
            // }

            if (oStatuses._statusesGuids.length) {

            } else {
                oStatuses._statusesGuids = [];
                for (var i = 0; i < aData.length; i++) {
                    oStatuses._statusesGuids.push(aData[i].Guid);
                }
                oDeficiencyStatusesWrapper.aData[0] = angular.copy(oStatuses);
            }
            // oStatuses._statusesGuids.push(aData[0].Guid);
            // oDeficiencyStatusesWrapper.aData[0] = angular.copy(oStatuses);

            servicesProvider.constructDependentMultiSelectArray({
                oDependentArrayWrapper: {
                    aData: aData
                },
                oParentArrayWrapper: oDeficiencyStatusesWrapper,
                sNameEN: "NameEN",
                sNameFR: "NameFR",
                sDependentKey: "Guid",
                sParentKeys: "_statusesGuids",
                sDependentIconKey: "AssociatedIconFileGuid",
                sTargetArrayNameInParent: "aDeficiencyStatuses"
            });
            if (oDeficiencyStatusesWrapper.aData[0]) {
                $scope.aDeficiencyStatuses = angular.copy(oDeficiencyStatusesWrapper.aData[0].aDeficiencyStatuses);
            }


        };

        var onDeficienciesLoaded = function(aData) {
            var sProjectName = "";
            var sPhaseName = "";
            var sUnitName = "";
            var sDueIn = "";
            var sDueDate = "";
            var dCurrentDate = new Date();
            var sProjectPhase = "";
            var bMatchFound = false;
            var iSortingSequence = 0;
            var sStatusSortingSequence = "";
            var sStatuseIconUrl = "";
            var sContractors = "";
            var iImagesNumber = 0;
            var sFileMetadataSetLastModifiedAt = "";
            var aImages = [];

            for (var i = 0; i < aData.length; i++) {
                sProjectName = "";
                sPhaseName = "";
                sProjectPhase = "";
                sUnitName = "";
                sDueIn = "";
                sDueDate = "";
                sStatusSortingSequence = "";
                iSortingSequence = 0;
                sStatuseIconUrl = "";
                sContractors = "";
                iImagesNumber = 0;
                aImages = [];

                bMatchFound = false;

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

                if (aData[i].TaskStatusDetails) {
                    sStatuseIconUrl = $window.location.origin + $window.location.pathname + "rest/file/get/" + aData[i].TaskStatusDetails.AssociatedIconFileGuid;
                    sStatusSortingSequence = aData[i].TaskStatusDetails.GeneralAttributes.SortingSequence;
                }

                if (aData[i].AccountDetails) {
                    for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
                        sContractors = sContractors + aData[i].AccountDetails.results[j].Name + "; ";
                    }
                }

                if (aData[i].UnitDetails) {
                    aData[i].sUnitName = aData[i].UnitDetails.Name;
                }

                if (aData[i].FileMetadataSetDetails) {
                    sFileMetadataSetLastModifiedAt = aData[i].FileMetadataSetDetails.LastModifiedAt;
                    if (aData[i].FileMetadataSetDetails.FileMetadataDetails) {
                        for (var j = 0; j < aData[i].FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
                            if (aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false) {
                                aImages.push(aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j]);
                            }
                        }
                    }
                    iImagesNumber = aImages.length;
                }

                var durationNumber = "";
                var sDueInLetter = "";

                if (aData[i].DueDate && aData[i].DueDate != "/Date(0)/") {
                    sDueDate = utilsProvider.dBDateToSting(aData[i].DueDate);
                    dDueDate = new Date(parseInt(aData[i].DueDate.substring(6, aData[i].DueDate.length - 2)));
                    var timeDiff = Math.abs(dCurrentDate.getTime() - dDueDate.getTime());
                    durationNumber = Math.ceil(timeDiff / (1000 * 3600 * 24)) - 1;
                    sDueInLetter = $translate.use() === "en" ? "d" : "j";
                    // sDueIn = durationNumber + " d";					
                }

                oDeficienciesListData.aData.push({
                    _guid: aData[i].Guid,
                    sUnit: utilsProvider.convertStringToInt(aData[i].sUnitName),
                    sTags: aData[i].DescriptionTags,
                    sLocationTags: aData[i].LocationTags,
                    sDueIn: utilsProvider.convertStringToInt(durationNumber),
                    sDueInLetter: sDueInLetter,
                    sProjectPhase: sProjectPhase,
                    sContractors: sContractors,
                    sStatusSortingSequence: sStatusSortingSequence,
                    _unitGuid: aData[i].UnitGuid,
                    _sortingSequence: iSortingSequence,
                    sStatuseIconUrl: sStatuseIconUrl,
                    _fileMetadataSetGuid: aData[i].FileMetadataSetGuid,
                    _fileMetadataSetLastModifiedAt: sFileMetadataSetLastModifiedAt,
                    iImagesNumber: iImagesNumber,
                    _aImages: aImages,
                });
            }
            $scope.tableParams.reload();
        };

        var loadDeficiencies = function() {
            oDeficienciesListData.aData = [];

            var sFilter = "";
            var sFilterStart = " and (";
            var sFilterEnd = ")";
            if ($scope.globalSelectedPhases.length > 0) {
                sFilter = sFilterStart;
                for (var i = 0; i < $scope.globalSelectedPhases.length; i++) {
                    sFilter = sFilter + "PhaseGuid eq '" + $scope.globalSelectedPhases[i] + "'";
                    if (i < $scope.globalSelectedPhases.length - 1) {
                        sFilter = sFilter + " or ";
                    }
                }
                sFilter = sFilter + sFilterEnd;
            }

            //need to remove this if
            if ($scope.aSelectedStatuses) {
                if ($scope.aSelectedStatuses.length > 0) {
                    sFilter = sFilter + sFilterStart;
                    for (var i = 0; i < $scope.aSelectedStatuses.length; i++) {
                        sFilter = sFilter + "TaskStatusGuid eq '" + $scope.aSelectedStatuses[i].Guid + "'";
                        if (i < $scope.aSelectedStatuses.length - 1) {
                            sFilter = sFilter + " or ";
                        }
                    }
                    sFilter = sFilter + sFilterEnd;


                }
            }

            if (sUnitGuid) {
                sFilter = sFilter + sFilterStart;
                sFilter = sFilter + "UnitGuid eq '" + sUnitGuid + "'";
                sFilter = sFilter + sFilterEnd;
            }

            apiProvider.getDeficiencies({
                sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails",
                sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilter,
                bShowSpinner: true,
                onSuccess: onDeficienciesLoaded
            });

        };

        var loadDeficiencyStatuses = function() {
            apiProvider.getDeficiencyStatuses({
                bShowSpinner: false,
                onSuccess: onDeficiencyStatusesLoaded
            });
        };
        loadDeficiencyStatuses();
        loadDeficiencies();

        $scope.onDisplay = function(oDeficiency) {
            // if(!sUnitGuid) {
            //     sUnitGuid = oDeficiency._unitGuid;
            // }
            $rootScope.sFileMetadataSetGuid = oDeficiency._fileMetadataSetGuid;
            $rootScope.sFileMetadataSetLastModifiedAt = oDeficiency._fileMetadataSetLastModifiedAt;
            $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                sMode: "display",
                sDeficiencyGuid: oDeficiency._guid,
            });
        };

        $scope.onEdit = function(oDeficiency) {
            // if(!sUnitGuid) {
            //     sUnitGuid = oDeficiency._unitGuid;
            // }
            $rootScope.sFileMetadataSetGuid = oDeficiency._fileMetadataSetGuid;
            $rootScope.sFileMetadataSetLastModifiedAt = oDeficiency._fileMetadataSetLastModifiedAt;
            $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                sMode: "edit",
                sDeficiencyGuid: oDeficiency._guid,
            });
        };

        $scope.onAddNew = function() {
            $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                sMode: "create",
                sDeficiencyGuid: "",
            });
        };

        $scope.onClearFiltering = function() {
            $scope.tableParams.$params.filter = {};
            $scope.tableParams.reload();
        };

        $scope.onCloseCheckSelectedStatusesLength = function() {
            loadDeficiencies();
        };

        $scope.onSelectedStatusesModified = function() {
            $scope.onCloseCheckSelectedStatusesLength();
        };

        $scope.onNavigateToUnitDetails = function(oDeficiency) {
            // if(!sUnitGuid) {
            //     sUnitGuid = oDeficiency._unitGuid;
            // }
            var sUnitGuid = oDeficiency._unitGuid;
            $state.go('app.unitDetailsWrapper.unitDetails', {
                sMode: "display",
                sUnitGuid: sUnitGuid,
            });
        };
        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            loadDeficiencies();
        });

        $scope.$on('deficienciesShouldBeRefreshed', function(oParameters) {
            loadDeficiencies();
        });

        $scope.onDisplayPhotoGallery = function(oDeficiency, oEvent) {
            oEvent.stopPropagation();
            if (oDeficiency._aImages.length) {
                servicesProvider.setUpPhotoGallery(oDeficiency._aImages);
            }
        };

        var onReportTemplateLoaded = function(aData) {
            if (aData.length === 1) {
                //alert(aData[0].Guid);
                alert(aData[0].Guid);
                apiProvider.generateReport({
                    oReportParameters: {
                        reportId: "deficienciesList",
                        fileGuid: aData[0].Guid,
                        converter: "",
                        processState: "generated",
                        dispatch: "download",
                        entryName: ""
                    }
                });
            }
        };

        $scope.onReports = function() {
            apiProvider.getFileMetadatas({
                sFilter: "CatalogId eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and DescriptionEN eq 'deficienciesList'",
                onSuccess: onReportTemplateLoaded
            });
        };

        $scope.$on("$destroy", function() {
            if ($rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails") { //don't save in history if contact list is weathin the contractor/client details view...  
                if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
                    return;
                }
                historyProvider.addStateToHistory({
                    sStateName: $rootScope.sCurrentStateName,
                    oStateParams: $rootScope.oStateParams
                });
            }
            cacheProvider.putTableStatusToCache({
                sTableName: "deficienciesList",
                sStateName: $rootScope.sCurrentStateName,
                aGroups: $scope.tableParams.settings().$scope.$groups,
                oFilter: $scope.tableParams.$params.filter,
                oSorting: $scope.tableParams.$params.sorting,
            });
        });
    }
]);