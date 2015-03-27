viewControllers.controller('deficienciesListItemsListsHybridView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout', '$mdSidenav', '$window', '$cordovaCamera', '$cordovaKeyboard',
    function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout, $mdSidenav, $window, $cordovaCamera, $cordovaKeyboard) {

        $scope.onClose = function() {
            if (CONSTANTS.bIsHybridApplication) {
                $cordovaKeyboard.close();
            }

            switch ($rootScope.sCurrentSearhCriteria) {
                case "phase":
                    $rootScope.oSearchCriterias["oPhase"].sSelectedItemGuid = "";
                    $rootScope.oSearchCriterias["oPhase"].sValue = "...";
                    if ($rootScope.oSearchCriterias.bPhaseWasSelected) {
                        $rootScope.oSearchCriterias["oUnit"].bIsSelectionUnabled = true;
                        $rootScope.oSearchCriterias["oContractor"].bIsSelectionUnabled = true;
                        $rootScope.oSearchCriterias["oPhase"].sValue = "";
                        for (var i = 0; i < $rootScope.oSearchCriterias.aPhases.length; i++) {
                            for (var j = 0; j < $rootScope.oSearchCriterias.aPhases[i].aPhases.length; j++) {
                                if ($rootScope.oSearchCriterias.aPhases[i].aPhases[j].bTicked) {
                                    $rootScope.oSearchCriterias["oPhase"].sValue = $rootScope.oSearchCriterias["oPhase"].sValue + $rootScope.oSearchCriterias.aPhases[i].sProjectName + " - " + $rootScope.oSearchCriterias.aPhases[i].aPhases[j].sPhaseName;
                                    $rootScope.oSearchCriterias["oPhase"].sSelectedItemGuid = $rootScope.oSearchCriterias.aPhases[i].aPhases[j].Guid;
                                    break;
                                }
                            }
                        }
                    }
                    break;
                case "unit":
                    $rootScope.oSearchCriterias["oUnit"].aSelectedItemsGuids = [];
                    $rootScope.oSearchCriterias["oUnit"].sValue = "...";
                    if ($rootScope.oSearchCriterias.bUnitWasSelected) {
                        $rootScope.oSearchCriterias["oUnit"].sValue = ""
                        for (var i = 0; i < $rootScope.oSearchCriterias.aUnits.length; i++) {
                            if ($rootScope.oSearchCriterias.aUnits[i].bTicked) {
                                $rootScope.oSearchCriterias["oUnit"].sValue = $rootScope.oSearchCriterias["oUnit"].sValue + $rootScope.oSearchCriterias.aUnits[i].sName + "; ";
                                $rootScope.oSearchCriterias["oUnit"].aSelectedItemsGuids.push($rootScope.oSearchCriterias.aUnits[i].sGuid);
                                //break;
                            }
                        }
                    }
                    break;
                case "status":
                    $rootScope.oSearchCriterias["oStatus"].aSelectedItemsGuids = [];
                    $rootScope.oSearchCriterias["oStatus"].sValue = "...";
                    if ($rootScope.oSearchCriterias.bStatusWasSelected) {
                        $rootScope.oSearchCriterias["oStatus"].sValue = "";
                        for (var i = 0; i < $rootScope.oSearchCriterias.aStatuses.length; i++) {
                            if ($rootScope.oSearchCriterias.aStatuses[i].bTicked) {
                                $rootScope.oSearchCriterias["oStatus"].sValue = $rootScope.oSearchCriterias["oStatus"].sValue + $rootScope.oSearchCriterias.aStatuses[i].sName + "; ";
                                $rootScope.oSearchCriterias["oStatus"].aSelectedItemsGuids.push($rootScope.oSearchCriterias.aStatuses[i].sGuid);
                                // $rootScope.oSearchCriterias["oStatus"].sIconUrl = $rootScope.oSearchCriterias.aStatuses[i].sIconUrl;
                            }
                        }
                    }
                    break;
                case "contractor":
                    $rootScope.oSearchCriterias["oContractor"].aSelectedItemsGuids = [];
                    $rootScope.oSearchCriterias["oContractor"].sValue = "...";
                    if ($rootScope.oSearchCriterias.bContractorWasSelected) {
                        $rootScope.oSearchCriterias["oContractor"].sValue = "";
                        for (var i = 0; i < $rootScope.oSearchCriterias.aContractors.length; i++) {
                            if ($rootScope.oSearchCriterias.aContractors[i].bTicked) {
                                $rootScope.oSearchCriterias["oContractor"].sValue = $rootScope.oSearchCriterias["oContractor"].sValue + $rootScope.oSearchCriterias.aContractors[i].sName + "; ";
                                $rootScope.oSearchCriterias["oContractor"].aSelectedItemsGuids.push($rootScope.oSearchCriterias.aContractors[i].sGuid);
                                // $rootScope.oSearchCriterias["oStatus"].sIconUrl = $rootScope.oSearchCriterias.aStatuses[i].sIconUrl;
                            }
                        }
                    }
                    break;                    

            }

            switch ($rootScope.sSelectedDeficiencyAttribute) {
                case "statuses":

                    for (var i = 0; i < $rootScope.aSelectedDeficiencyStatuses.length; i++) {
                        if ($rootScope.aSelectedDeficiencyStatuses[i].bTicked) {
                            $rootScope.oSelectedDeficiency.sStatusGuid = $rootScope.aSelectedDeficiencyStatuses[i].sGuid;
                            $rootScope.oSelectedDeficiency.sStatusDescription = $rootScope.aSelectedDeficiencyStatuses[i].sName;
                            $rootScope.oSelectedDeficiency.sStatuseIconUrl = $rootScope.aSelectedDeficiencyStatuses[i].sIconUrl;
                        }
                    }

                    break;

            }
            if ($rootScope.sCurrentSearhCriteria) {
                $rootScope.sDeficienciesListView = "deficienciesListSearch";
            } else {
                if ($rootScope.sSelectedDeficiencyAttribute) {
                    $rootScope.sSelectedDeficiencyAttribute = "";
                    $rootScope.sDeficienciesListView = "deficiencyDetails";
                } else {
                    $rootScope.sDeficienciesListView = "deficienciesList";
                }
            }

        };

        $scope.onSelectSearchCrireriaPhase = function(oPhase) {
            $rootScope.oSearchCriterias.bPhaseWasSelected = true;
            if (!oPhase.bTicked) {
                for (var i = 0; i < $rootScope.oSearchCriterias.aPhases.length; i++) {
                    for (var j = 0; j < $rootScope.oSearchCriterias.aPhases[i].aPhases.length; j++) {

                        $rootScope.oSearchCriterias.aPhases[i].aPhases[j].bTicked = false;
                    }
                }
                oPhase.bTicked = true;
                $rootScope.oSearchCriterias.aUnits = [];
                $rootScope.oSearchCriterias.aFilteredUnits = [];
                $rootScope.oSearchCriterias.sUnitFilter = "";
                $rootScope.oSearchCriterias["oUnit"].sValue = "...";
                $rootScope.oSearchCriterias["oUnit"].aSelectedItemsGuids = [];
                $rootScope.oSearchCriterias.bUnitWasSelected = false;
                
                $rootScope.oSearchCriterias.aContractors = [];
                $rootScope.oSearchCriterias.aFilteredContractors = [];
                $rootScope.oSearchCriterias.sContractorFilter = "";
                $rootScope.oSearchCriterias["oContractor"].sValue = "...";
                $rootScope.oSearchCriterias["oContractor"].aSelectedItemsGuids = [];
                $rootScope.oSearchCriterias.bContractorWasSelected = false;                
            }
            $scope.onClose();
        };

        $scope.onSelectSearchCrireriaUnit = function(oUnit) {
            $rootScope.oSearchCriterias.bUnitWasSelected = false;
            oUnit.bTicked = !oUnit.bTicked;

            if (!oUnit.bTicked) {
                for (var i = 0; i < $rootScope.oSearchCriterias.aUnits.length; i++) {
                    if ($rootScope.oSearchCriterias.aUnits[i].bTicked) {
                        $rootScope.oSearchCriterias.bUnitWasSelected = true;
                        break;
                    }
                }
            } else {
                $rootScope.oSearchCriterias.bUnitWasSelected = true;
            }
        };

        $scope.onSelectSearchCrireriaContractor = function(oContractor) {
            $rootScope.oSearchCriterias.bContractorWasSelected = false;
            oContractor.bTicked = !oContractor.bTicked;

            if (!oContractor.bTicked) {
                for (var i = 0; i < $rootScope.oSearchCriterias.aContractors.length; i++) {
                    if ($rootScope.oSearchCriterias.aContractors[i].bTicked) {
                        $rootScope.oSearchCriterias.bContractorWasSelected = true;
                        break;
                    }
                }
            } else {
                $rootScope.oSearchCriterias.bContractorWasSelected = true;
            }
        };        

        $scope.onSelectSearchCrireriaStatus = function(oStatus) {
            $rootScope.oSearchCriterias.bStatusWasSelected = false;
            oStatus.bTicked = !oStatus.bTicked;

            if (!oStatus.bTicked) {
                for (var i = 0; i < $rootScope.oSearchCriterias.aStatuses.length; i++) {
                    if ($rootScope.oSearchCriterias.aStatuses[i].bTicked) {
                        $rootScope.oSearchCriterias.bStatusWasSelected = true;
                        break;
                    }
                }
            } else {
                $rootScope.oSearchCriterias.bStatusWasSelected = true;
            }
        };

        $scope.onSelectDeficiencyAttributeStatus = function(oStatus) {
            $rootScope.oSelectedDeficiency.bDataHasBeenModified = true;
            if (!oStatus.bTicked) {
                for (var i = 0; i < $rootScope.aSelectedDeficiencyStatuses.length; i++) {
                    $rootScope.aSelectedDeficiencyStatuses[i].bTicked = false;
                }
                oStatus.bTicked = true;
            }
        }

        $scope.onChangeSearchCriteriaUnitFilter = function(sFilter) {
            $rootScope.oSearchCriterias.sUnitFilter = utilsProvider.replaceSpecialChars(sFilter);
            $rootScope.oSearchCriterias.aFilteredUnits = $filter('filter')($rootScope.oSearchCriterias.aUnits, {
                sCleanedName: $rootScope.oSearchCriterias.sUnitFilter
            });
        };

        $scope.onChangeSearchCriteriaContractorFilter = function(sFilter) {
            $rootScope.oSearchCriterias.sContractorFilter = utilsProvider.replaceSpecialChars(sFilter);
            $rootScope.oSearchCriterias.aFilteredContractors = $filter('filter')($rootScope.oSearchCriterias.aContractors, {
                sCleanedName: $rootScope.oSearchCriterias.sContractorFilter
            });
        };        

        $scope.onAddImage = function(sImageSource) {
            var options = {
                quality: 80,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: sImageSource, //Camera.PictureSourceType.CAMERA, //SAVEDPHOTOALBUM
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 500,
                targetHeight: 500,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: true
            };

            $cordovaCamera.getPicture(options).then(function(imageData) {
                var onSuccessUpload = function() {
                    $scope.$apply(function() {
                        $rootScope.$emit('UNLOAD');
                        $rootScope.bIgnoreNavigation = true;
                        $rootScope.loadDeficiencies();
                        $rootScope.sSelectedDeficiencyAttribute = "";
                        $rootScope.sDeficienciesListView = "deficiencyDetails";
                    });

                    var onInterestedUsersLoaded = function(aData) {
                        apiProvider.logEvents({
                            aData: aData,
                        });
                    };

                    apiProvider.getInterestedUsers({
                        sEntityName: "deficiency",
                        sOperationNameEN: CONSTANTS.newAttachmentEN,
                        sOperationNameFR: CONSTANTS.newAttachmentEN,
                        aData: [{
                            Guid: $rootScope.oSelectedDeficiency._guid
                        }],
                        onSuccess: onInterestedUsersLoaded
                    });
                }
                imageData = "data:image/jpeg;base64," + imageData; //http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata

                var byteString = atob(imageData.split(',')[1]);
                var ab = new ArrayBuffer(byteString.length);
                var ia = new Uint8Array(ab);
                for (var i = 0; i < byteString.length; i++) {
                    ia[i] = byteString.charCodeAt(i);
                }

                var oBlob = new Blob([ab], {
                    type: 'image/jpeg'
                });

                var formData = new FormData();
                formData.append('blob', oBlob, "quickAddAttachment");

                servicesProvider.uploadAttachmentsForEntity({
                    sPath: "Tasks",
                    aFiles: [formData],
                    sParentEntityGuid: $rootScope.oSelectedDeficiency._guid,
                    sParentEntityFileMetadataSetGuid: $rootScope.oSelectedDeficiency._fileMetadataSetGuid,
                    onSuccess: onSuccessUpload
                });
            }, function(err) {

            });
        };

        $scope.onSaveNewComment = function() {
            var onSuccess = function() {
                $rootScope.oNewComment.sText = "";
                $rootScope.bIgnoreNavigation = true;
                $rootScope.loadDeficiencies();
                $rootScope.sSelectedDeficiencyAttribute = "";
                $cordovaKeyboard.close();
                $rootScope.sDeficienciesListView = "deficiencyDetails";

                var onInterestedUsersLoaded = function(aData) {
                    apiProvider.logEvents({
                        aData: aData,
                    });
                };

                apiProvider.getInterestedUsers({
                    sEntityName: "deficiency",
                    sOperationNameEN: CONSTANTS.newCommentEN,
                    sOperationNameFR: CONSTANTS.newCommentFR,
                    aData: [{
                        Guid: $rootScope.oSelectedDeficiency._guid
                    }],
                    onSuccess: onInterestedUsersLoaded
                });
            };
            var oDataForSave = {
                GeneralAttributes: {}
            };

            oDataForSave.ContactGuid = cacheProvider.oUserProfile.oUserContact.Guid;
            oDataForSave.Text = $rootScope.oNewComment.sText;

            servicesProvider.addCommentForEntity({
                sPath: "Tasks",
                oData: oDataForSave,
                sParentEntityGuid: $rootScope.oSelectedDeficiency._guid,
                sParentEntityCommentSetGuid: $rootScope.oSelectedDeficiency._commentSetGuid,
                onSuccess: onSuccess,
            });
        };

        $scope.onUseCamera = function() {
            $scope.onAddImage(Camera.PictureSourceType.CAMERA);
        };

        $scope.onUseLibrary = function() {
            $scope.onAddImage(Camera.PictureSourceType.SAVEDPHOTOALBUM);
        };
    }
]);