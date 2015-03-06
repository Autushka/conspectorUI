viewControllers.controller('unitDetailsWrapperView', ['$scope', '$location', '$anchorScroll', '$rootScope', '$state', '$stateParams', 'servicesProvider', '$translate', 'apiProvider', 'cacheProvider', 'historyProvider', '$timeout',
    function($scope, $location, $anchorScroll, $rootScope, $state, $stateParams, servicesProvider, $translate, apiProvider, cacheProvider, historyProvider, $timeout) {
        $scope.bDisplayAttachmentsList = false;
        $scope.bDisplayDeficienciesList = false;
        $scope.bDisplayActivitiesList = false;

        $rootScope.bDataHasBeenModified = false;
        $scope.scrollTo = function() {
            $location.hash($scope.sHtmlId);
            $anchorScroll();
        };

        // $rootScope.$on('$viewContentLoaded', function() {

        //        $scope.scrollTo();
        //    });


        $scope.onDisplayDeficienciesList = function() {
            $scope.bDisplayDeficienciesList === false ? $scope.bDisplayDeficienciesList = true : $scope.bDisplayDeficienciesList = false;
            $scope.sHtmlId = 'embeddedDeficienciesList';
            $rootScope.$on('ngTableAfterReloadData', function() {
                $timeout($scope.scrollTo, 1);
            });

           
        };

        $scope.onDisplayActivitiesList = function() {
            $scope.bDisplayActivitiesList === false ? $scope.bDisplayActivitiesList = true : $scope.bDisplayActivitiesList = false;
            $scope.sHtmlId = 'embeddedActivitiesList';
            $rootScope.$on('ngTableAfterReloadData', function() {
                $timeout($scope.scrollTo, 1);
            });

           
        };

        $scope.onDisplayDeficienciesList = function() {
            $scope.bDisplayDeficienciesList === false ? $scope.bDisplayDeficienciesList = true : $scope.bDisplayDeficienciesList = false;
            $scope.sHtmlId = 'embeddedDeficienciesList';
            $rootScope.$on('ngTableAfterReloadData', function() {
                $timeout($scope.scrollTo, 1);
            });

           
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