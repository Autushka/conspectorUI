viewControllers.controller('deficiencyDetailsHybridView', ['$scope', '$location', '$anchorScroll', '$rootScope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout',
    function($scope, $location, $anchorScroll, $rootScope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout) {
        $scope.onClose = function() {
            $rootScope.sDeficienciesListView = "deficienciesList";

            $timeout(function() {
                if ($("#body")[0]) {
                    $("#body")[0].scrollTop = cacheProvider.getListViewScrollPosition("deficienciesList");
                    cacheProvider.putListViewScrollPosition("deficienciesList", 0);
                }
            }, 0);            
        }


        var onStatusesLoaded = function(aData) {
            var sDescription = "";
            for (var i = 0; i < aData.length; i++) {
                aData[i]._sortingSequence = aData[i].GeneralAttributes.SortingSequence;
            }

            aData = $filter('orderBy')(aData, ["_sortingSequence"]);
            for (var i = 0; i < aData.length; i++) {
                sDescription = "";

                if (aData[i].NameFR && $translate.use() === "fr") {
                    sDescription = aData[i].NameFR;
                } else {
                    sDescription = aData[i].NameEN;
                }

                if (aData[i].NameEN != "Done by Contractor" && aData[i].NameEN != "In Progress" && aData[i].NameEN != "Non Conform" && cacheProvider.oUserProfile.sCurrentRole === "contractor") {
                    continue;
                }

                $rootScope.aSelectedDeficiencyStatuses.push({
                    sGuid: aData[i].Guid,
                    sName: sDescription,
                    bTicked: false,
                    sIconUrl: CONSTANTS.sAppAbsolutePath + "rest/file/v2/get/" + aData[i].AssociatedIconFileGuid,
                })
            }
        };

        if (!$rootScope.aSelectedDeficiencyStatuses || !$rootScope.aSelectedDeficiencyStatuses.length) {
            $rootScope.aSelectedDeficiencyStatuses = [];

            apiProvider.getDeficiencyStatuses({
                onSuccess: onStatusesLoaded
            });
        }

        $scope.onSave = function() {
            var oDataForSave = {};
            var onSuccessUpdate = function(oData) {
                $rootScope.oSelectedDeficiency._lastModifiedAt = oData.LastModifiedAt;
                for (var i = 0; i < $rootScope.aDeficiencies.length; i++) {
                    if ($rootScope.aDeficiencies[i]._guid === $rootScope.oSelectedDeficiency._guid) {
                        $rootScope.aDeficiencies[i]._lastModifiedAt = oData.LastModifiedAt;
                        $rootScope.aDeficiencies[i].sStatusDescription = $rootScope.oSelectedDeficiency.sStatusDescription;
                        $rootScope.aDeficiencies[i].sStatuseIconUrl = $rootScope.oSelectedDeficiency.sStatuseIconUrl;
                        $rootScope.aDeficiencies[i].sStatusGuid = $rootScope.oSelectedDeficiency.sStatusGuid;
                        break;
                    }
                }

                var onInterestedUsersLoaded = function(aData) {
                    apiProvider.logEvents({
                        aData: aData,
                    });
                };
                apiProvider.getInterestedUsers({
                    sEntityName: "deficiency",
                    sOperationNameEN: CONSTANTS.updatedDeficiencyEN,
                    sOperationNameFR: CONSTANTS.updatedDeficiencyEN,
                    // sEntityGuid: oData.Guid,
                    aData: [{
                        Guid: oData.Guid
                    }],
                    onSuccess: onInterestedUsersLoaded
                });
            }

            oDataForSave.Guid = $rootScope.oSelectedDeficiency._guid;
            oDataForSave.TaskStatusGuid = $rootScope.oSelectedDeficiency.sStatusGuid;
            oDataForSave.LastModifiedAt = $rootScope.oSelectedDeficiency._lastModifiedAt;
            apiProvider.updateDeficiency({
                bShowSpinner: true,
                sKey: oDataForSave.Guid,
                //aLinks: aLinks,
                oData: oDataForSave,
                bShowSuccessMessage: true,
                bShowErrorMessage: true,
                onSuccess: onSuccessUpdate
            });
        };

        $scope.onMainMenu = function() {
            $state.go("mainMenuHybrid");
        };

        $scope.onImagesAttribute = function() {
            $rootScope.aSelectedDeficiencyImages = angular.copy($rootScope.oSelectedDeficiency._aImages);

            for (var i = 0; i < $rootScope.aSelectedDeficiencyImages.length; i++) {
                $rootScope.aSelectedDeficiencyImages[i].sImgUrl = servicesProvider.constructImageUrl($rootScope.aSelectedDeficiencyImages[i].Guid);
            };

            $rootScope.sCurrentSearhCriteria = "";

            $rootScope.sSelectedDeficiencyAttribute = "images";
            $rootScope.sDeficienciesListView = "deficienciesListItemsLists";
        };

        $scope.onCommentsAttribute = function() {
            //$rootScope.aSelectedDeficiencyComments = angular.copy($rootScope.oSelectedDeficiency._oComments);
            $rootScope.aSelectedDeficiencyComments = angular.copy(servicesProvider.processListOfComments({
                oData: $rootScope.oSelectedDeficiency._oComments,
            }));

            $rootScope.aSelectedDeficiencyComments = $filter('orderBy')($rootScope.aSelectedDeficiencyComments, ["_createdAt"]);
            $rootScope.sCurrentSearhCriteria = "";

            $rootScope.sSelectedDeficiencyAttribute = "comments";
            $rootScope.sDeficienciesListView = "deficienciesListItemsLists";
        };

        $scope.onStatusAttribute = function() {
            if ($rootScope.oSelectedDeficiency.sStatusDescriptionEN != "Done by Contractor" && $rootScope.oSelectedDeficiency.sStatusDescriptionEN != "In Progress" && $rootScope.oSelectedDeficiency.sStatusDescriptionEN != "Non Conform" && cacheProvider.oUserProfile.sCurrentRole === "contractor") {
                return;
            }
            $rootScope.sCurrentSearhCriteria = "";
            $rootScope.sSelectedDeficiencyAttribute = "statuses";
            $rootScope.sDeficienciesListView = "deficienciesListItemsLists";
        };
    }
]);