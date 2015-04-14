viewControllers.controller('deficienciesListMobileView', ['$scope', '$location', '$anchorScroll', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout',
    function($scope, $location, $anchorScroll, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout) {
        
        historyProvider.removeHistory();

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation  
        $scope.bShowContractorInList = true;
        var iPageNumberDeficiencies = 1;
        $scope.aDeficiencies = [];




        $scope.onSelectPhaseSearchCriteria = function() {
            $rootScope.sCurrentSearhCriteria = "phase";
            $rootScope.sDeficienciesListView = "deficienciesListItemsLists";
        };

        var onDeficienciesLoaded = function(aData) {

            $scope.aDeficiencies = aData;

        }


        $scope.loadDeficiencies = function(iPageNumberDeficiencies) {

            var sFilterByAccountGuid = "";
            var sFilterByPhaseGuid = "";
            var sFilterByAccountsGuids = "";
            
            var sOtherUrlParams = "$top=5&$orderby=CreatedAt desc&$inlinecount=allpages";
            if (iPageNumberDeficiencies > 1) {
                sOtherUrlParams = sOtherUrlParams + "&$skip=" + 5 * (iPageNumberDeficiencies - 1);
            }

            apiProvider.getMobileDeficiencies({
                sExpand: "PhaseDetails/ProjectDetails,TaskStatusDetails,TaskPriorityDetails,AccountDetails,UnitDetails,FileMetadataSetDetails/FileMetadataDetails,CommentSetDetails/CommentDetails/ContactDetails/UserDetails",
                sFilter: "CompanyName eq '" + $scope.oUserProfile.sCurrentCompany + "' and GeneralAttributes/IsDeleted eq false" + sFilterByPhaseGuid + sFilterByAccountGuid + sFilterByAccountsGuids,
                sOtherUrlParams: sOtherUrlParams,
                bShowSpinner: true,
                onSuccess: onDeficienciesLoaded,
                bNoCaching: true,
            });
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