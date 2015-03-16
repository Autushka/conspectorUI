viewControllers.controller('deficienciesListHybridView', ['$scope', '$location', '$anchorScroll', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'utilsProvider', 'historyProvider', '$mdSidenav', '$window', '$filter', '$cookieStore', 'rolesSettings', '$timeout',
    function($scope, $location, $anchorScroll, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, utilsProvider, historyProvider, $mdSidenav, $window, $filter, $cookieStore, rolesSettings, $timeout) {
        historyProvider.removeHistory();

        servicesProvider.constructLogoUrl();
        servicesProvider.constructMenuIconUrl();

        $rootScope.sCurrentStateName = $state.current.name; // for backNavigation   
        $rootScope.oStateParams = angular.copy($stateParams); // for backNavigation  

        $scope.onMainMenu = function() {
            $state.go("mainMenuHybrid");
        };

        $scope.onBackToSearch = function() {
            $rootScope.sDeficienciesListView = "deficienciesListSearch"
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