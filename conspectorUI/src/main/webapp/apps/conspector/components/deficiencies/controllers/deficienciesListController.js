viewControllers.controller('deficienciesListView', ['$scope', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout', 'CONSTANTS',
    function($scope, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout, CONSTANTS) {
        if ($rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails" && $rootScope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails") {
            historyProvider.removeHistory(); // because current view doesn't have a back button
            $rootScope.oStateParams = {}; // for backNavigation	
            cacheProvider.clearOtherViewsScrollPosition("deficienciesList");
        }

        $scope.toggleAdminPanelRightSideNav = function() {
            $timeout($mdSidenav('adminPanelRightSideNav').toggle, 200);
            // $mdSidenav('adminPanelRightSideNav').toggle();
        };

        var sCurrentUser = cacheProvider.oUserProfile.sUserName;
        var sCompany = cacheProvider.oUserProfile.sCurrentCompany;
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

        var sUnitGuid = "";
        if ($stateParams.sUnitGuid) {
            sUnitGuid = $stateParams.sUnitGuid;
        }

        var sContractorGuid = "";
        if ($stateParams.sContractorGuid) {
            sContractorGuid = $stateParams.sContractorGuid;
        }

        if ($cookieStore.get("selectedDeficiencyStatuses" + sCurrentUser + sCompany) && $cookieStore.get("selectedDeficiencyStatuses" + sCurrentUser + sCompany).aSelectedStatuses) {
            $scope.aSelectedStatuses = angular.copy($cookieStore.get("selectedDeficiencyStatuses" + sCurrentUser + sCompany).aSelectedStatuses);
        }

        $scope.aDataForMassChanges = [];

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
        var aTaskStatuses = [];

        var oTableStatusFromCache = cacheProvider.getTableStatusFromCache({
            sTableName: "deficienciesList",
            sStateName: $rootScope.sCurrentStateName,
        });

        var oInitialSortingForDeficienciesList = {
            sUnit: 'asc',
            sStatusSortingSequence: 'asc',
            _createdAt: 'desc',

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

            aTaskStatuses = [];

            for (var i = 0; i < aData.length; i++) {
                if (aData[i].NameEN != "Done by Contractor" && aData[i].NameEN != "In Progress" && aData[i].NameEN != "Non Conform" && cacheProvider.oUserProfile.sCurrentRole === "contractor") {
                    continue;
                }
                aTaskStatuses.push(aData[i]);
            }

            //aTaskStatuses = angular.copy(aData);
            oStatuses._statusesGuids = [];
            if ($scope.aSelectedStatuses) {
                for (var i = 0; i < $scope.aSelectedStatuses.length; i++) {
                    oStatuses._statusesGuids.push($scope.aSelectedStatuses[i].Guid);
                }
            } else {
                // for (var i = 0; i < aData.length; i++) {
                //     oStatuses._statusesGuids.push(aData[i].Guid);
                // }
                // $cookieStore.put("selectedDeficiencyStatuses" + sCurrentUser + sCompany, {
                //     aSelectedStatuses: oStatuses._statusesGuids,
                // });
            }
            oDeficiencyStatusesWrapper.aData[0] = angular.copy(oStatuses);

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
            var sStatuseIconGuid = "";
            var sStatusDescription = "";
            var sStatusDescriptionEN = "";
            var sContractors = "";
            var iImagesNumber = 0;
            var sFileMetadataSetLastModifiedAt = "";
            var aImages = [];
            var sDescription = "";
            var sContractorsGuids = "";

            oDeficienciesListData.aData = [];

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
                sStatusIconGuid = "";
                sStatusDescription = "";
                sStatusDescriptionEN = "";
                sPriorityDescriptionEN = "";
                sContractors = "";
                iImagesNumber = 0;
                aImages = [];
                sDescription = "";
                sContractorsGuids = "";

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
                    sStatusSortingSequence = aData[i].TaskStatusDetails.GeneralAttributes.SortingSequence;
                    sStatuseIconUrl = $window.location.origin + $window.location.pathname + "rest/file/v2/get/" + aData[i].TaskStatusDetails.AssociatedIconFileGuid;
                    sStatusDescriptionEN = aData[i].TaskStatusDetails.NameEN;
                    sStatusDescription = $translate.use() === "en" ? aData[i].TaskStatusDetails.NameEN : aData[i].TaskStatusDetails.NameFR;
                    if (!sStatusDescription) {
                        sStatusDescription = aData[i].TaskStatusDetails.NameEN;
                    }
                    sStatusIconGuid = aData[i].TaskStatusDetails.AssociatedIconFileGuid;
                }
                if (aData[i].TaskPriorityDetails) {
                    sPriorityDescriptionEN = aData[i].TaskPriorityDetails.NameEN;
                }

                if (aData[i].AccountDetails) {
                    for (var j = 0; j < aData[i].AccountDetails.results.length; j++) {
                        sContractors = sContractors + aData[i].AccountDetails.results[j].Name + "; ";
                        sContractorsGuids = sContractorsGuids + aData[i].AccountDetails.results[j].Guid + "; ";
                    }
                }

                if (aData[i].UnitDetails) {
                    aData[i].sUnitName = aData[i].UnitDetails.Name;
                }

                if (aData[i].FileMetadataSetDetails) {
                    sFileMetadataSetLastModifiedAt = aData[i].FileMetadataSetDetails.LastModifiedAt;
                    if (aData[i].FileMetadataSetDetails.FileMetadataDetails) {
                        for (var j = 0; j < aData[i].FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
                            if (aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType) {
                                if (aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false) {
                                    aImages.push(aData[i].FileMetadataSetDetails.FileMetadataDetails.results[j]);
                                }
                            }
                        }
                    }
                    iImagesNumber = aImages.length;
                }

                var iCommentsNumber = 0;
                if (aData[i].CommentSetDetails) {
                    if (aData[i].CommentSetDetails.CommentDetails) {
                        for (var j = 0; j < aData[i].CommentSetDetails.CommentDetails.results.length; j++) {
                            if (!aData[i].CommentSetDetails.CommentDetails.results[j].GeneralAttributes.IsDeleted) {
                                iCommentsNumber++;
                            }
                        }
                    }
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

                if (aData[i].Description) {
                    sDescription = utilsProvider.removeTagsFromString(aData[i].Description);
                }
                

                oDeficienciesListData.aData.push({
                    _guid: aData[i].Guid,
                    _phaseGuid: aData[i].PhaseGuid,
                    sUnit: utilsProvider.convertStringToInt(aData[i].sUnitName),
                    sCleanedUnit: utilsProvider.replaceSpecialChars(aData[i].sUnitName),
                    sTags: aData[i].DescriptionTags !== null && aData[i].DescriptionTags !== undefined ? aData[i].DescriptionTags : "",
                    sCleanedTags: utilsProvider.replaceSpecialChars(aData[i].DescriptionTags),
                    sLocationTags: aData[i].LocationTags !== null && aData[i].LocationTags !== undefined ? aData[i].LocationTags : "",
                    sDueIn: utilsProvider.convertStringToInt(durationNumber),
                    sDueInLetter: sDueInLetter,
                    sProjectPhase: sProjectPhase,
                    sContractors: sContractors,
                    sContractorsGuids: sContractorsGuids,
                    sCleanedContractors: utilsProvider.replaceSpecialChars(sContractors),
                    sStatusSortingSequence: sStatusSortingSequence,
                    sStatuseIconUrl: sStatuseIconUrl,
                    sStatusIconGuid: sStatusIconGuid,
                    sStatusDescription: sStatusDescription,
                    sStatusDescriptionEN: sStatusDescriptionEN,
                    sPriorityDescriptionEN: sPriorityDescriptionEN,
                    sDescription: sDescription,
                    _unitGuid: aData[i].UnitGuid,
                    _sortingSequence: iSortingSequence,
                    _fileMetadataSetGuid: aData[i].FileMetadataSetGuid,
                    _fileMetadataSetLastModifiedAt: sFileMetadataSetLastModifiedAt,
                    iImagesNumber: iImagesNumber,
                    iCommentsNumber: iCommentsNumber,
                    _createdAt: aData[i].CreatedAt,
                    _aImages: aImages,
                });
            }

            $scope.tableParams.reload();
            if ($rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails" && $rootScope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails") {
                $timeout(function() {
                    if ($(".cnpContentWrapper")[0]) {
                        $(".cnpContentWrapper")[0].scrollTop = cacheProvider.getListViewScrollPosition("deficienciesList");
                        cacheProvider.putListViewScrollPosition("deficienciesList", 0);
                    }
                }, 0);
            }
        };

        var loadDeficiencies = function() {
            oDeficienciesListData.aData = [];
            var sFilter = "";
            var sFilterStart = " and (";
            var sFilterEnd = ")";
            var sFilterByCompanyGuid = "";

            if (cacheProvider.oUserProfile.sCurrentRole === "contractor") {
                sFilterByCompanyGuid = " and substringof('" + cacheProvider.oUserProfile.oUserContact.AccountDetails.Guid + "', AccountGuids) eq true";
            }

            if ($scope.globalSelectedPhases.length > 0) {
                sFilter = sFilterStart;
                for (var i = 0; i < $scope.globalSelectedPhases.length; i++) {
                    sFilter = sFilter + "PhaseGuid eq '" + $scope.globalSelectedPhases[i] + "'";
                    if (i < $scope.globalSelectedPhases.length - 1) {
                        sFilter = sFilter + " or ";
                    }
                }
                sFilter = sFilter + sFilterEnd;
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

                        if (sUnitGuid) {
                            sFilter = sFilter + sFilterStart;
                            sFilter = sFilter + "UnitGuid eq '" + sUnitGuid + "'";
                            sFilter = sFilter + sFilterEnd;
                        }

                        if (sContractorGuid) {
                            sFilter = sFilter + sFilterStart;
                            sFilter = sFilter + "substringof('" + sContractorGuid + "', AccountGuids) eq true";
                            sFilter = sFilter + sFilterEnd;
                        }

                        apiProvider.getDeficiencies({
                            sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails, TaskPriorityDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails,CommentSetDetails/CommentDetails",
                            sFilter: "CompanyName eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByCompanyGuid + sFilter,
                            bShowSpinner: true,
                            onSuccess: onDeficienciesLoaded
                        });
                    }
                }
            } else {
                oDeficienciesListData.aData = [];
                onDeficienciesLoaded([]);
                return;
            }
        };

        var loadDeficiencyStatuses = function() {
            apiProvider.getDeficiencyStatuses({
                bShowSpinner: false,
                onSuccess: onDeficiencyStatusesLoaded
            });
        };
        loadDeficiencyStatuses();
        loadDeficiencies();

        $scope.onDisplay = function(oDeficiency, oEvent) {
            cacheProvider.putListViewScrollPosition("deficienciesList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...

            $rootScope.sFileMetadataSetGuid = oDeficiency._fileMetadataSetGuid;
            $rootScope.sFileMetadataSetLastModifiedAt = oDeficiency._fileMetadataSetLastModifiedAt;
            $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                sMode: "display",
                sDeficiencyGuid: oDeficiency._guid,
            });
        };

        $scope.onEdit = function(oDeficiency) {
            cacheProvider.putListViewScrollPosition("deficienciesList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...
            
            $rootScope.sFileMetadataSetGuid = oDeficiency._fileMetadataSetGuid;
            $rootScope.sFileMetadataSetLastModifiedAt = oDeficiency._fileMetadataSetLastModifiedAt;

            if (sCurrentRole === 'contractor' && oDeficiency.sStatusDescriptionEN != "Done by Contractor" && oDeficiency.sStatusDescriptionEN != "In Progress" && oDeficiency.sStatusDescriptionEN != "Non Conform") {
                $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                    sMode: "display",
                    sDeficiencyGuid: oDeficiency._guid,
                });
            } else {
                $state.go('app.deficiencyDetailsWrapper.deficiencyDetails', {
                    sMode: "edit",
                    sDeficiencyGuid: oDeficiency._guid,
                });
            }
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
            $cookieStore.put("selectedDeficiencyStatuses" + sCurrentUser + sCompany, {
                aSelectedStatuses: $scope.aSelectedStatuses,
            });

            loadDeficiencies();
        };

        $scope.onSelectedStatusesModified = function() {
            $scope.onCloseCheckSelectedStatusesLength();
        };

        $scope.onNavigateToUnitDetails = function(oDeficiency) {
            var sUnitGuid = oDeficiency._unitGuid;
            $state.go('app.unitDetailsWrapper.unitDetails', {
                sMode: "display",
                sUnitGuid: sUnitGuid,
            });
        };
        $scope.$on('globalUserPhasesHaveBeenChanged', function(oParameters) {
            cacheProvider.putListViewScrollPosition("deficienciesList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...
            loadDeficiencies();
        });

        $scope.$on('deficienciesShouldBeRefreshed', function(oParameters) {
            cacheProvider.putListViewScrollPosition("deficienciesList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...
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
                var oTasks = {
                    tasks: [],
                };
                var aImagesGuids = [];

                for (var i = 0; i < $scope.tableParams.data.length; i++) {
                    for (var j = 0; j < $scope.tableParams.data[i].data.length; j++) {
                        aImagesGuids = [];
                        for (var k = 0; k < $scope.tableParams.data[i].data[j]._aImages.length; k++) {
                            aImagesGuids.push({
                                guid: $scope.tableParams.data[i].data[j]._aImages[k].Guid
                            });
                        }
                        oTasks.tasks.push({
                            unit: $scope.tableParams.data[i].data[j].sUnit != null && $scope.tableParams.data[i].data[j].sUnit != undefined ? $scope.tableParams.data[i].data[j].sUnit : "",
                            status: $scope.tableParams.data[i].data[j].sStatusDescription != null && $scope.tableParams.data[i].data[j].sStatusDescription != undefined ? $scope.tableParams.data[i].data[j].sStatusDescription : "",
                            statusIconGuid: $scope.tableParams.data[i].data[j].sStatusIconGuid,
                            contractors: $scope.tableParams.data[i].data[j].sContractors != null && $scope.tableParams.data[i].data[j].sContractors != undefined ? $scope.tableParams.data[i].data[j].sContractors : "",
                            descriptionTags: $scope.tableParams.data[i].data[j].sTags,
                            locationTags: $scope.tableParams.data[i].data[j].sLocationTags,
                            dueIn: $scope.tableParams.data[i].data[j].sDueIn + $scope.tableParams.data[i].data[j].sDueInLetter,
                            description: $scope.tableParams.data[i].data[j].sDescription,
                            fls: aImagesGuids
                        });
                    }
                }

                var sTasks = JSON.stringify(oTasks);

                apiProvider.generateReport({
                    oReportParameters: {
                        reportId: sCompany + "-" + $scope.sReportName + "-" + Math.round(1000000 * Math.random()),
                        fileGuid: aData[0].Guid,
                        converter: "",
                        processState: "generated",
                        dispatch: "download",
                        entryName: "",
                        data: sTasks
                    }
                });
            }
        };

        $scope.onReports = function() {
            $scope.sReportName = $translate.use() === "en" ? "DeficienciesList" : "ListeDeDeficiences";
            apiProvider.getFileMetadatas({
                sFilter: "CatalogId eq '" + cacheProvider.oUserProfile.sCurrentCompany + "' and DescriptionEN eq '" + $scope.sReportName + "'",
                onSuccess: onReportTemplateLoaded
            });
        };

        $scope.onStatusChange = function(oDeficiency) {
            if (!$scope.bDisplayEditButtons) {
                return;
            }

            if (oDeficiency.sStatusDescriptionEN != "Done by Contractor" && oDeficiency.sStatusDescriptionEN != "Non Conform" && oDeficiency.sStatusDescriptionEN != "In Progress" && cacheProvider.oUserProfile.sCurrentRole === "contractor") {
                return;
            }

            oDeficiency.sStatuseIconUrl = $window.location.origin + $window.location.pathname + "rest/file/v2/get/" + aTaskStatuses[(oDeficiency.sStatusSortingSequence) % aTaskStatuses.length].AssociatedIconFileGuid;

            $scope.sAccountValues = "";
            $scope.sAccountGuids = "";
            $scope.sAccountValues = oDeficiency.sContractors;
            $scope.sAccountGuids = oDeficiency.sContractorsGuids;


            for (var i = $scope.aDataForMassChanges.length - 1; i >= 0; i--) {
                if ($scope.aDataForMassChanges[i].Guid === oDeficiency._guid) {
                    $scope.aDataForMassChanges.splice(i, 1);
                    break;
                }
            }


            $scope.aDataForMassChanges.push({
                Guid: oDeficiency._guid,
                //to put back...
                TaskStatusGuid: aTaskStatuses[(oDeficiency.sStatusSortingSequence) % aTaskStatuses.length].Guid, //aTaskStatuses[oDeficiency.sStatusSortingSequence - 1].Guid
                PhaseGuid: oDeficiency._phaseGuid,
                //AccountValues:  $scope.sAccountValues,
                //AccountGuids: $scope.sAccountGuids,
            });

            oDeficiency.sStatusSortingSequence = (oDeficiency.sStatusSortingSequence + 1) % aTaskStatuses.length;
        };

        $scope.onMassSave = function() {
            cacheProvider.putListViewScrollPosition("deficienciesList", $(".cnpContentWrapper")[0].scrollTop); //saving scroll position...
            var onSuccess = function() {
                $scope.aDataForMassChanges = [];
                loadDeficiencies();
            };

            apiProvider.updateDeficiencies({
                aData: $scope.aDataForMassChanges,
                bShowSpinner: true,
                bShowSuccessMessage: true,
                bShowErrorMessage: true,
                onSuccess: onSuccess
            });
        };

        $scope.$on("$destroy", function() {
            if ($rootScope.sCurrentStateName !== "app.unitDetailsWrapper.unitDetails" && $rootScope.sCurrentStateName !== "app.contractorDetailsWrapper.contractorDetails") { //don't save in history if contact list is weathin the contractor/client details view...  
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