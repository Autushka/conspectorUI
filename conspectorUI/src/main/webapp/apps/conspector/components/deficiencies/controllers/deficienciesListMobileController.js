viewControllers.controller('deficienciesListMobileView', ['$scope', '$location', '$anchorScroll', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout',
    function($scope, $location, $anchorScroll, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout) {
        historyProvider.removeHistory();

        $scope.sDisplayedView = "list";//list or details
        $scope.sDisplayMode = "display";//display, edit or add
        // sMode = "list"; // search and list
        // = "add"; // show form to add new def
        // = "display"; // show expanded card with edit button sMode
        // = "edit";

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation  
        $scope.bShowContractorInList = true;
        $scope.bFadeImagesIcon = true;
        $scope.bFadeCommentsIcon = true;
        if($scope.oUserProfile.sCurrentRole === "contractor"){
             $scope.bShowContractorInList = false;
        }
        var iPageNumberDeficiencies = 1;
        var bPhaseWasSelected = false;

        $scope.aDeficiencies = [];
        $scope.aProjects = [];
        $scope.bPhasesButtonDisabled = false;
        var oPhaseForSearch = {};
        var oUnitsForSearch = {};
        var oStatusForSearch = {};
        var oContractorsForSearch = {};

        $scope.oContractors = {};
        $scope.oContractors.aContractors = [];
        $scope.oContractors.aSelectedContractors = [];
        $scope.oUnits = {};
        $scope.oUnits.aUnits = [];
        $scope.oUnits.aSelectedUnits = [];
        $scope.sProjectandPhase = "...";
        // $scope.sUnits = $filter('translate')('global_allUnits');
        $scope.sStatuses = $filter('translate')('global_allStatuses');
        // $scope.sContractors = $filter('translate')('global_allContractors');


        $scope.onSelectPhaseSearchCriteria = function() {
            $scope.aProjects = [];
            $scope.bPhasesButtonDisabled = true;
            $scope.onOpenPhasesSidenav();

            var aPhases = [];

            var aProjectsWithPhases = servicesProvider.constructUserProjectsPhases();
            for (var i = 0; i < aProjectsWithPhases.length; i++) {
                var aPhases = [];
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

                    aPhases.push({
                        sProjectName: aProjectsWithPhases[i].sDescription,
                        sPhaseName: aProjectsWithPhases[i].PhaseDetails.results[j].sDescription,
                        Guid: aProjectsWithPhases[i].PhaseDetails.results[j].Guid,
                        bTicked: false,
                    });
                }
                $scope.aProjects.push({
                    sProjectName: aProjectsWithPhases[i].sDescription,
                    aPhases: aPhases
                });
                $scope.bPhasesButtonDisabled = false;
            }
        };

        $scope.onSelectSearchCriteriaPhase = function(oPhase) {
            bPhaseWasSelected = true;
            if (!oPhase.bTicked) {
                for (var i = 0; i < $scope.aProjects.length; i++) {
                    for (var j = 0; j < $scope.aProjects[i].aPhases.length; j++) {
                        $scope.aProjects[i].aPhases[j].bTicked = false;
                    }
                }
                oPhase.bTicked = true;
                $scope.sProjectandPhase = oPhase.sProjectName + " - " + oPhase.sPhaseName;
                oPhaseForSearch = oPhase;

                oContractorsForSearch = {};
                $scope.oContractors = {};
                $scope.oContractors.aContractors = [];
                $scope.oContractors.aSelectedContractors = [];

                oUnitsForSearch = {};
                $scope.oUnits = {};
                $scope.oUnits.aUnits = [];
                $scope.oUnits.aSelectedUnits = [];
                
                loadContractorsAndUnits();
                
                // $rootScope.oSearchCriterias["oUnit"].sValue = "...";
                // $rootScope.oSearchCriterias["oUnit"].aSelectedItemsGuids = [];
                // $rootScope.oSearchCriterias.bUnitWasSelected = false;
                
                // $rootScope.oSearchCriterias.aContractors = [];
                // $rootScope.oSearchCriterias.aFilteredContractors = [];
                // $rootScope.oSearchCriterias.sContractorFilter = "";
                // $rootScope.oSearchCriterias["oContractor"].sValue = "...";
                // $rootScope.oSearchCriterias["oContractor"].aSelectedItemsGuids = [];
                // $rootScope.oSearchCriterias.bContractorWasSelected = false;                
            }
            // $scope.onClose();
        };

        // $scope.onSelectUnitSearchCriteria = function() {
        //     if (!$rootScope.oSearchCriterias.oUnit.bIsSelectionUnabled) {
        //         return;
        //     }

        //     $rootScope.sCurrentSearhCriteria = "unit";
        //     if (!$rootScope.oSearchCriterias.aUnits.length) {
        //         apiProvider.getPhase({
        //             sExpand: "UnitDetails",
        //             sKey: $rootScope.oSearchCriterias["oPhase"].sSelectedItemGuid,
        //             onSuccess: onUnitsLoaded
        //         });

        //     }

        //     $rootScope.sDeficienciesListView = "deficienciesListItemsLists";
        // };

       

        var onDeficienciesLoaded = function(aData) {

            
            // $scope.$apply( function() {
            //     $scope.aDeficiencies = aData.results;
            // });

            $scope.$evalAsync( function() {
                $scope.aDeficiencies = aData.results;
            });

            // for(var i = 0; i < aData.results.length; i++){
            //     $scope.aDeficiencies.push(aData.results[i]);
            // }

            // $scope.aDeficiencies = angular.copy(aData.results);
        }

        $scope.onOpenPhasesSidenav = function() {
            $timeout($mdSidenav('phasesSidenav').open, 200);
        };

        $scope.onClosePhasesSidenav = function() {
            $timeout($mdSidenav('phasesSidenav').close, 200);
        };


        var loadDeficiencies = function(iPageNumberDeficiencies) {

            var sFilterByPhaseGuid = "";
            var sFilterByAccountsGuids = "";
            var sFilterByUnitsGuids = "";

            if(oPhaseForSearch){
                sFilterByPhaseGuid = " and PhaseGuid eq '" + oPhaseForSearch.Guid + "'";
            }

            //cant filter by extended value
            // if($rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids.length){
            //  for (var i = 0; i < $rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids.length; i++) {
            //      sUnitsGuids = sUnitsGuids + $rootScope.oSearchCriterias.oUnit.aSelectedItemsGuids[i] + ",";
            //  }
            //  sFilterByUnitsGuids = " and substringof(UnitGuid, '" + sUnitsGuids+ "') eq true";
            //  //sFilterByPhaseGuid = " "
            // }            

            // if (cacheProvider.oUserProfile.sCurrentRole === "contractor") {
            //     sFilterByAccountGuid = " and substringof('" + cacheProvider.oUserProfile.oUserContact.AccountDetails.Guid + "', sUnitsGuids) eq true";
            // }

            if($scope.oUnits.aSelectedUnits.length){
                sFilterByUnitsGuids = " and ( "

                for (var i = $scope.oUnits.aSelectedUnits.length - 1; i >= 0; i--) {
                    sFilterByUnitsGuids = sFilterByUnitsGuids + "substringof('" + $scope.oUnits.aSelectedUnits[i].sGuid + "', UnitGuid) eq true";
                    if(i !== 0){
                        sFilterByUnitsGuids = sFilterByUnitsGuids + " or ";
                    }else{
                        sFilterByUnitsGuids = sFilterByUnitsGuids + " )";
                    }
                }
            }

            if($scope.oContractors.aSelectedContractors.length){
                sFilterByAccountsGuids = " and ( "

                for (var i = $scope.oContractors.aSelectedContractors.length - 1; i >= 0; i--) {
                    sFilterByAccountsGuids = sFilterByAccountsGuids + "substringof('" + $scope.oContractors.aSelectedContractors[i].sGuid + "', AccountGuids) eq true";
                    if(i !== 0){
                        sFilterByAccountsGuids = sFilterByAccountsGuids + " or ";
                    }else{
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
                sFilter: "CompanyName eq '" + $scope.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByPhaseGuid + sFilterByUnitsGuids + sFilterByAccountsGuids,
                sOtherUrlParams: sOtherUrlParams,
                bShowSpinner: true,
                onSuccess: onDeficienciesLoaded,
                bNoCaching: true,
            });
        };

        var onAccountsAndUnitsLoaded = function(oData) {
            oData.AccountDetails.results = $filter('filter')(oData.AccountDetails.results, function(oItem, iIndex) {
                if(!oItem.GeneralAttributes.IsDeleted && oItem.AccountTypeDetails.NameEN === "Contractor"){
                    return true;
                }else{
                    return false;
                }
            });

            for (var i = 0; i < oData.AccountDetails.results.length; i++) {
                $scope.oContractors.aContractors.push({
                    sGuid: oData.AccountDetails.results[i].Guid,
                    sName: oData.AccountDetails.results[i].Name,
                    sCleanedName: utilsProvider.replaceSpecialChars(utilsProvider.convertStringToInt(oData.AccountDetails.results[i].Name)),
                    bTicked: false
                })
            }

            oData.UnitDetails.results = $filter('filter')(oData.UnitDetails.results, function(oItem, iIndex) {
                if(!oItem.GeneralAttributes.IsDeleted){
                    return true;
                }else{
                    return false;
                }
            });

            for (var i = 0; i < oData.UnitDetails.results.length; i++) {
                $scope.oUnits.aUnits.push({
                    sGuid: oData.UnitDetails.results[i].Guid,
                    sName: oData.UnitDetails.results[i].Name,
                    sCleanedName: utilsProvider.replaceSpecialChars(utilsProvider.convertStringToInt(oData.UnitDetails.results[i].Name)),
                    bTicked: false
                })
            }
            // $rootScope.oSearchCriterias.aContractors = $filter('orderBy')($rootScope.oSearchCriterias.aContractors, ["sName"]);
            // $rootScope.oSearchCriterias.aFilteredContractors = $filter('filter')($rootScope.oSearchCriterias.aContractors, {
            //     sName: $rootScope.oSearchCriterias.sContractorFilter
            // });
        };

        var loadContractorsAndUnits = function(){

             if (oPhaseForSearch.bTicked) {
                apiProvider.getPhase({
                    sExpand: "AccountDetails/AccountTypeDetails, UnitDetails",
                    sKey: oPhaseForSearch.Guid,
                    onSuccess: onAccountsAndUnitsLoaded
                });

            }  

        };

        


        $scope.onSelectDeficiency = function(oDeficiency) {
            cacheProvider.putListViewScrollPosition("deficienciesList", $("#body")[0].scrollTop); //saving scroll position...
            for (var i = 0; i < $rootScope.aSelectedDeficiencyStatuses.length; i++) {
                if (oDeficiency.sStatusGuid === $rootScope.aSelectedDeficiencyStatuses[i].sGuid) {
                    $rootScope.aSelectedDeficiencyStatuses[i].bTicked = true;
                } else {
                    $rootScope.aSelectedDeficiencyStatuses[i].bTicked = false;
                }
            }

            $rootScope.oSelectedDeficiency = angular.copy(oDeficiency);
            $rootScope.sDeficienciesListView = "deficiencyDetails";
            // the element you wish to scroll to.
            //$location.hash('top');
            // call $anchorScroll()
            //$anchorScroll();
        };

        $scope.onSearch = function() {
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