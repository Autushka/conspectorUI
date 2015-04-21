viewControllers.controller('deficienciesListMobileView', ['$scope', '$location', '$q', 'CONSTANTS', '$anchorScroll', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout',
    function($scope, $location, $q, CONSTANTS, $anchorScroll, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout) {
        historyProvider.removeHistory();


        $scope.sDisplayedView = "list";
        $scope.sDisplayMode = "display";

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation  
        $scope.bShowContractorInList = true;

        if ($scope.oUserProfile.sCurrentRole === "contractor") {
            $scope.bShowContractorInList = false;
        }
        var iPageNumberDeficiencies = 1;

        $scope.aDeficiencies = [];
        $scope.aPhases = [];
        $scope.aStatuses = [];
        var oPhaseForSearch = {};

        $scope.oContractors = {};
        $scope.oContractors.aContractors = [];
        $scope.oContractors.aSelectedContractors = [];
        $scope.oUnits = {};
        $scope.oUnits.aUnits = [];
        $scope.oUnits.aSelectedUnits = [];
        // $scope.sUnits = $filter('translate')('global_allUnits');
        // $scope.sStatuses = $filter('translate')('global_allStatuses');
        // $scope.sContractors = $filter('translate')('global_allContractors');

        $scope.onSelectPhaseSearchCriteria = function() {

            var defer = $q.defer();

            $scope.aPhases = [];

            defer.promise
                .then(function() {

                    var aPhases = [];
                    var aProjectsWithPhases = servicesProvider.constructUserProjectsPhases();

                    for (var i = 0; i < aProjectsWithPhases.length; i++) {
                        aPhases = [];
                        if (aProjectsWithPhases[i].NameFR && $translate.use() === "fr") {
                            aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameFR;
                        } else {
                            aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameEN;
                        }
                        for (var j = 0; j < aProjectsWithPhases[i].PhaseDetails.results.length; j++) {
                            if (aProjectsWithPhases[i].PhaseDetails.results[j].NameFR && $translate.use() === "fr") {
                                aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameFR;
                            } else {
                                aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameEN;
                            }
                            $scope.aPhases.push({
                                sProjectAndPhaseName: aProjectsWithPhases[i].sDescription + " - " + aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
                                sPhaseName: aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
                                Guid: aProjectsWithPhases[i].PhaseDetails.results[j].Guid,
                                bTicked: false,
                            });
                        }
                    }
                    return;
                });

            defer.resolve();

            // $scope.aPhases = [];
            // $scope.bPhasesButtonDisabled = true;
            // $scope.onOpenPhasesSidenav();

            // return $timeout(function() {

            //     var aPhases = [];

            //     var aProjectsWithPhases = servicesProvider.constructUserProjectsPhases();
            //     for (var i = 0; i < aProjectsWithPhases.length; i++) {
            //         var aPhases = [];
            //         if (aProjectsWithPhases[i].NameFR && $translate.use() === "fr") {
            //             aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameFR;
            //         } else {
            //             aProjectsWithPhases[i].sDescription = aProjectsWithPhases[i].NameEN;
            //         }
            //         for (var j = 0; j < aProjectsWithPhases[i].PhaseDetails.results.length; j++) {
            //             if (aProjectsWithPhases[i].PhaseDetails.results[j].NameFR && $translate.use() === "fr") {
            //                 aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameFR;
            //             } else {
            //                 aProjectsWithPhases[i].PhaseDetails.results[j].sDescription = aProjectsWithPhases[i].PhaseDetails.results[j].NameEN;
            //             }

            //             $scope.aPhases.push({
            //                 sProjectAndPhaseName: aProjectsWithPhases[i].sDescription + " - " + aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
            //                 sPhaseName: aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
            //                 Guid: aProjectsWithPhases[i].PhaseDetails.results[j].Guid,
            //                 bTicked: false,
            //             });
            //         }
            //     }

            // }, 650);


        };



        $scope.onSelectSearchCriteriaPhase = function(oPhase) {

            oPhaseForSearch = oPhase;

            $scope.oContractors = {};
            $scope.oContractors.aContractors = [];
            $scope.oContractors.aSelectedContractors = [];

            $scope.oUnits = {};
            $scope.oUnits.aUnits = [];
            $scope.oUnits.aSelectedUnits = [];

            loadContractorsAndUnits();
            // }
        };

        var onDeficienciesLoaded = function(aData) {

            var aImages = [];
            for (var i = 0; i < aData.results.length; i++) {
                aData.results[i].iImagesNumber = 0;
                aData.results[i].iCommentsNumber = 0;
                aData.results[i].bFadeImagesIcon = true;
                aData.results[i].bFadeCommentsIcon = true;
                if (aData.results[i].FileMetadataSetDetails) {
                    // sFileMetadataSetLastModifiedAt = aData[i].FileMetadataSetDetails.LastModifiedAt;
                    if (aData.results[i].FileMetadataSetDetails.FileMetadataDetails) {
                        for (var j = 0; j < aData.results[i].FileMetadataSetDetails.FileMetadataDetails.results.length; j++) {
                            if (aData.results[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType) {
                                if (aData.results[i].FileMetadataSetDetails.FileMetadataDetails.results[j].MediaType.indexOf("image") > -1 && aData.results[i].FileMetadataSetDetails.FileMetadataDetails.results[j].GeneralAttributes.IsDeleted === false) {
                                    aImages.push(aData.results[i].FileMetadataSetDetails.FileMetadataDetails.results[j]);
                                }
                            }
                        }
                    }
                    if (aImages.length) {
                        aData.results[i].iImagesNumber = aImages.length;
                        aData.results[i].aImages = aImages;
                        aData.results[i].bFadeImagesIcon = false;
                    }

                }
                if (aData.results[i].CommentSetDetails) {
                    aData.results[i].iCommentsNumber = aData.results[i].CommentSetDetails.CommentDetails.results.length;
                    aData.results[i].bFadeCommentsIcon = false;
                }
                
                aData.results[i].sIconUrl = CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + aData.results[i].TaskStatusDetails.AssociatedIconFileGuid;
                aData.results[i].aDescriptionTags = utilsProvider.tagsStringToTagsArrayForUiSelect(aData.results[i].DescriptionTags);
                aData.results[i].aLocationTags = utilsProvider.tagsStringToTagsArrayForUiSelect(aData.results[i].LocationTags);
                aData.results[i].aContractorsTags = utilsProvider.tagsStringToTagsArrayForUiSelect(aData.results[i].AccountValues);
            
            }
            // $scope.$apply( function() {
            //     $scope.aDeficiencies = aData.results;
            // });

            $scope.$evalAsync(function() {
                $scope.aDeficiencies = $scope.aDeficiencies.concat(aData.results);
                $scope.iTotalDeficienciesNumber = aData.__count;
            });
        };

        $scope.onOpenPhasesSidenav = function() {
            $timeout($mdSidenav('phasesSidenav').open, 200);
        };

        $scope.onClosePhasesSidenav = function() {
            $timeout($mdSidenav('phasesSidenav').close, 200);
        };

        $scope.onShowMore = function() {
            iPageNumberDeficiencies++;
            loadDeficiencies(iPageNumberDeficiencies);
        };

        var loadDeficiencies = function(iPageNumberDeficiencies) {

            var sFilterByPhaseGuid = "";
            var sFilterByStatusGuid = "";
            var sFilterByAccountsGuids = "";
            var sFilterByUnitsGuids = "";

            if (oPhaseForSearch) {
                sFilterByPhaseGuid = " and PhaseGuid eq '" + oPhaseForSearch.Guid + "'";
            }

            if ($scope.oUserProfile.sCurrentRole === "contractor") {
                sFilterByAccountsGuids = " and substringof('" + $scope.oUserProfile.oUserContact.AccountDetails.Guid + "', AccountGuids) eq true";
            }

            if ($scope.oUnits.aSelectedUnits.length) {
                sFilterByUnitsGuids = " and ( ";

                for (var i = $scope.oUnits.aSelectedUnits.length - 1; i >= 0; i--) {
                    sFilterByUnitsGuids = sFilterByUnitsGuids + "substringof('" + $scope.oUnits.aSelectedUnits[i].sGuid + "', UnitGuid) eq true";
                    if (i !== 0) {
                        sFilterByUnitsGuids = sFilterByUnitsGuids + " or ";
                    } else {
                        sFilterByUnitsGuids = sFilterByUnitsGuids + " )";
                    }
                }
            }

            if($scope.aStatuses.aSelectedStatuses && $scope.aStatuses.aSelectedStatuses.length){
                sFilterByStatusGuid = " and ( ";

                for (var i = $scope.aStatuses.aSelectedStatuses.length - 1; i >= 0; i--) {
                    sFilterByStatusGuid = sFilterByStatusGuid + "TaskStatusGuid eq '" + $scope.aStatuses.aSelectedStatuses[i].Guid + "'";
                    if (i !== 0) {
                        sFilterByStatusGuid = sFilterByStatusGuid + " or ";
                    } else {
                        sFilterByStatusGuid = sFilterByStatusGuid + " )";
                    }
                }

            }

            if ($scope.oContractors.aSelectedContractors.length) {
                sFilterByAccountsGuids = " and ( ";

                for (var i = $scope.oContractors.aSelectedContractors.length - 1; i >= 0; i--) {
                    sFilterByAccountsGuids = sFilterByAccountsGuids + "substringof('" + $scope.oContractors.aSelectedContractors[i].sGuid + "', AccountGuids) eq true";
                    if (i !== 0) {
                        sFilterByAccountsGuids = sFilterByAccountsGuids + " or ";
                    } else {
                        sFilterByAccountsGuids = sFilterByAccountsGuids + " )";
                    }
                }
            }

            var sOtherUrlParams = "$top=10&$orderby=CreatedAt desc&$inlinecount=allpages";
            if (iPageNumberDeficiencies > 1) {
                sOtherUrlParams = sOtherUrlParams + "&$skip=" + 10 * (iPageNumberDeficiencies - 1);
            }

            apiProvider.getMobileDeficiencies({
                sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,TaskPriorityDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails,CommentSetDetails/CommentDetails/ContactDetails/UserDetails",
                sFilter: "CompanyName eq '" + $scope.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByPhaseGuid + sFilterByUnitsGuids + sFilterByAccountsGuids + sFilterByStatusGuid,
                sOtherUrlParams: sOtherUrlParams,
                bShowSpinner: true,
                onSuccess: onDeficienciesLoaded,
                bNoCaching: true,
            });
        };

        var onDeficiencyStatusesLoaded = function(oData) {

            for (var i = 0; i < oData.length; i++) {
                if (oData[i].NameFR && $translate.use() === "fr") {
                    oData[i].sDescription = oData[i].NameFR;
                } else {
                    oData[i].sDescription = oData[i].NameEN;
                }
                oData[i].sIconUrl = CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + oData[i].AssociatedIconFileGuid;
            }

            $scope.aStatuses = oData;
            $scope.aStatuses.aSelectedStatuses = oData;
        };

        var onAccountsAndUnitsLoaded = function(oData) {
            oData.AccountDetails.results = $filter('filter')(oData.AccountDetails.results, function(oItem, iIndex) {
                if (!oItem.GeneralAttributes.IsDeleted && oItem.AccountTypeDetails.NameEN === "Contractor") {
                    return true;
                } else {
                    return false;
                }
            });

            for (var i = 0; i < oData.AccountDetails.results.length; i++) {
                $scope.oContractors.aContractors.push({
                    sGuid: oData.AccountDetails.results[i].Guid,
                    sName: oData.AccountDetails.results[i].Name,
                    sCleanedName: utilsProvider.replaceSpecialChars(utilsProvider.convertStringToInt(oData.AccountDetails.results[i].Name)),
                    bTicked: false
                });
            }

            oData.UnitDetails.results = $filter('filter')(oData.UnitDetails.results, function(oItem, iIndex) {
                if (!oItem.GeneralAttributes.IsDeleted) {
                    return true;
                } else {
                    return false;
                }
            });

            for (var i = 0; i < oData.UnitDetails.results.length; i++) {
                $scope.oUnits.aUnits.push({
                    sGuid: oData.UnitDetails.results[i].Guid,
                    sName: oData.UnitDetails.results[i].Name,
                    sCleanedName: utilsProvider.replaceSpecialChars(utilsProvider.convertStringToInt(oData.UnitDetails.results[i].Name)),
                    bTicked: false
                });
            }
        };

        var loadContractorsAndUnits = function() {


            apiProvider.getPhase({
                sExpand: "AccountDetails/AccountTypeDetails, UnitDetails",
                sKey: oPhaseForSearch.Guid,
                onSuccess: onAccountsAndUnitsLoaded
            });

        };

        var loadDeficiencyStatuses = function() {

            apiProvider.getDeficiencyStatuses({
                onSuccess: onDeficiencyStatusesLoaded
            });

        };

        loadDeficiencyStatuses();

        $scope.onSelectDeficiency = function(oDeficiency) {
            $scope.sDisplayedView = 'details';
            $scope.oSelectedDeficiency = angular.copy(oDeficiency);
        };

        $scope.onDone = function() {
            $scope.sDisplayedView = 'list';
        };

        $scope.onSearch = function() {

            iPageNumberDeficiencies = 1;
            $scope.aDeficiencies = [];
            loadDeficiencies();
        };

        $scope.$on("$destroy", function() {
            if (historyProvider.getPreviousStateName() === $rootScope.sCurrentStateName) { //current state was already put to the history in the parent views
                return;
            }

            historyProvider.addStateToHistory({
                sStateName: $rootScope.sCurrentStateName,
                oStateParams: angular.copy($rootScope.oStateParams)
            });
        });
    }
]);