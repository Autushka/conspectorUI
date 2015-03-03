viewControllers.controller('deficienciesListItemsListsHybridView', ['$rootScope', '$scope', '$state', 'servicesProvider', 'apiProvider', '$translate', '$stateParams', 'cacheProvider', 'utilsProvider', '$filter', 'dataProvider', 'CONSTANTS', 'historyProvider', 'rolesSettings', '$timeout', '$mdSidenav', '$window', '$cordovaCamera', '$cordovaKeyboard',
    function($rootScope, $scope, $state, servicesProvider, apiProvider, $translate, $stateParams, cacheProvider, utilsProvider, $filter, dataProvider, CONSTANTS, historyProvider, rolesSettings, $timeout, $mdSidenav, $window, $cordovaCamera, $cordovaKeyboard) {

        $scope.onClose = function() {
            if(CONSTANTS.bIsHybridApplication){
                $cordovaKeyboard.close();
            }
            switch ($rootScope.sCurrentSearhCriteria) {
                case "phase":
                    $rootScope.oSearchCriterias["oPhase"].sSelectedItemGuid = "";
                    if ($rootScope.oSearchCriterias.bPhaseWasSelected) {
                        $rootScope.oSearchCriterias["oUnit"].bIsSelectionUnabled = true;
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
                    if ($rootScope.oSearchCriterias.bUnitWasSelected) {
                        $rootScope.oSearchCriterias["oUnit"].sValue = "";
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
            //     case $rootScope.oDeficiencyAttributes.oPriority.sDescription:
            //         if ($rootScope.bPriorityWasSelected) {
            //             $rootScope.oDeficiencyAttributes["oPriority"].sValue = "";
            //             for (var i = 0; i < $rootScope.aPriorities.length; i++) {
            //                 if ($rootScope.aPriorities[i].bTicked) {
            //                     $rootScope.oDeficiencyAttributes["oPriority"].sValue = $rootScope.aPriorities[i].sName;
            //                     $rootScope.oDeficiencyAttributes["oPriority"].sSelectedItemGuid = $rootScope.aPriorities[i].sGuid;
            //                     break;
            //                 }
            //             }
            //         }
            //         break;
            //     case $rootScope.oDeficiencyAttributes.oUser.sDescription:
            //         if ($rootScope.bUserWasSelected) {
            //             $rootScope.oDeficiencyAttributes["oUser"].sValue = "";
            //             for (var i = 0; i < $rootScope.aUsers.length; i++) {
            //                 if ($rootScope.aUsers[i].bTicked) {
            //                     $rootScope.oDeficiencyAttributes["oUser"].sValue = $rootScope.aUsers[i].sName;
            //                     $rootScope.oDeficiencyAttributes["oUser"].sSelectedItemGuid = $rootScope.aUsers[i].sGuid;
            //                     break;
            //                 }
            //             }
            //         }
            //         break;
            //     case $rootScope.oDeficiencyAttributes.oDescriptionTags.sDescription:
            //         if ($rootScope.aDescriptionTags.length) {
            //             $rootScope.oDeficiencyAttributes["oDescriptionTags"].sValue = utilsProvider.tagsArrayToTagsString($rootScope.aDescriptionTags);
            //         } else {
            //             $rootScope.oDeficiencyAttributes["oDescriptionTags"].sValue = "...";
            //         }
            //         break;
            //     case $rootScope.oDeficiencyAttributes.oLocationTags.sDescription:
            //         if ($rootScope.aLocationTags.length) {
            //             $rootScope.oDeficiencyAttributes["oLocationTags"].sValue = utilsProvider.tagsArrayToTagsString($rootScope.aLocationTags);
            //         } else {
            //             $rootScope.oDeficiencyAttributes["oLocationTags"].sValue = "...";
            //         }
            //         break;
            //     case $rootScope.oDeficiencyAttributes.oContractors.sDescription:
            //         if ($rootScope.bContractorWasSelected) {
            //             $rootScope.oDeficiencyAttributes["oContractors"].sValue = "";
            //             $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
            //             for (var i = 0; i < $rootScope.aContractors.length; i++) {
            //                 if ($rootScope.aContractors[i].bTicked) {
            //                     $rootScope.oDeficiencyAttributes["oContractors"].sValue = $rootScope.oDeficiencyAttributes["oContractors"].sValue + $rootScope.aContractors[i].sName + "; ";
            //                     $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids.push($rootScope.aContractors[i].sGuid);
            //                 }
            //             }
            //         } else {
            //             $rootScope.oDeficiencyAttributes["oContractors"].sValue = "...";
            //             $rootScope.oDeficiencyAttributes["oContractors"].aSelectedItemsGuids = [];
            //         }
            //         break;
            }
            // $rootScope.bIsDeficienciesListItemsListsOpen = false;
            // $rootScope.bIsListViewOpen = true;
            if($rootScope.sCurrentSearhCriteria){
                $rootScope.sDeficienciesListView = "deficienciesListSearch"; 
            }else{
                $rootScope.sDeficienciesListView = "deficienciesList"; 
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
            }
            $scope.onClose();
            //$timeout($scope.onClose, 300);
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

        // $scope.onSelectPriority = function(oPriority) {
        //     $rootScope.bPriorityWasSelected = true;
        //     if (!oPriority.bTicked) {
        //         for (var i = 0; i < $rootScope.aPriorities.length; i++) {
        //             $rootScope.aPriorities[i].bTicked = false;
        //         }
        //         oPriority.bTicked = true;
        //     }

        //     $timeout($scope.onClose, 300);
        // };

        // $scope.onSelectUser = function(oUser) {
        //     $rootScope.bUserWasSelected = true;
        //     if (!oUser.bTicked) {
        //         for (var i = 0; i < $rootScope.aUsers.length; i++) {
        //             $rootScope.aUsers[i].bTicked = false;
        //         }
        //         oUser.bTicked = true;
        //     }

        //     $timeout($scope.onClose, 300);
        // };

        // $scope.onSelectContractor = function(oContractor) {
        //     $rootScope.bContractorWasSelected = false;
        //     oContractor.bTicked = !oContractor.bTicked;

        //     if (!oContractor.bTicked) {
        //         for (var i = 0; i < $rootScope.aContractors.length; i++) {
        //             if ($rootScope.aContractors[i].bTicked) {
        //                 $rootScope.bContractorWasSelected = true;
        //                 break;
        //             }
        //         }
        //     } else {
        //         $rootScope.bContractorWasSelected = true;
        //     }
        // };        

        $scope.onChangeSearchCriteriaUnitFilter = function(sFilter) {
            $rootScope.oSearchCriterias.sUnitFilter = utilsProvider.replaceSpecialChars(sFilter);
            $rootScope.oSearchCriterias.aFilteredUnits = $filter('filter')($rootScope.oSearchCriterias.aUnits, {
                sCleanedName: $rootScope.oSearchCriterias.sUnitFilter
            });
        };

        // $scope.onChangeContractorsFilter = function(sFilter) {
        //     $rootScope.sContractorsFilter = utilsProvider.replaceSpecialChars(sFilter);
        //     $rootScope.aFilteredContractors = $filter('filter')($rootScope.aContractors, {
        //         sCleanedName: $rootScope.sContractorsFilter
        //     });
        // }; 

        // $scope.onAddImage = function(sImageSource) {
        //     $rootScope.bIsItemsListsOpen = false;
        //     var options = {
        //         quality: 80,
        //         destinationType: Camera.DestinationType.DATA_URL,
        //         sourceType: sImageSource, //Camera.PictureSourceType.CAMERA, //SAVEDPHOTOALBUM
        //         allowEdit: true,
        //         encodingType: Camera.EncodingType.JPEG,
        //         targetWidth: 500,
        //         targetHeight: 500,
        //         popoverOptions: CameraPopoverOptions,
        //         saveToPhotoAlbum: true
        //     };

        //     $cordovaCamera.getPicture(options).then(function(imageData) {
        //         var onSuccessUpload = function() {
        //             $scope.$apply(function() {
        //                 $rootScope.$emit('UNLOAD');
        //                 $rootScope.oDeficiencyAttributes.oImages.iValue++;


        //             });
        //         }
        //         imageData = "data:image/jpeg;base64," + imageData; //http://stackoverflow.com/questions/4998908/convert-data-uri-to-file-then-append-to-formdata

        //         var byteString = atob(imageData.split(',')[1]);
        //         var ab = new ArrayBuffer(byteString.length);
        //         var ia = new Uint8Array(ab);
        //         for (var i = 0; i < byteString.length; i++) {
        //             ia[i] = byteString.charCodeAt(i);
        //         }

        //         var oBlob = new Blob([ab], {
        //             type: 'image/jpeg'
        //         });

        //         var formData = new FormData();
        //         formData.append('blob', oBlob, "quickAddAttachment");

        //         servicesProvider.uploadAttachmentsForEntity({
        //             sPath: "Tasks",
        //             aFiles: [formData],
        //             sParentEntityGuid: "",
        //             sParentEntityFileMetadataSetGuid: $rootScope.sFileMetadataSetGuid,
        //             onSuccess: onSuccessUpload
        //         });
        //     }, function(err) {

        //     });
        // };        

        // $scope.onUseCamera  = function(){
        //      $scope.onAddImage(Camera.PictureSourceType.CAMERA);
        // };

        // $scope.onUseLibrary  = function(){
        //     $scope.onAddImage(Camera.PictureSourceType.SAVEDPHOTOALBUM);
        // };        
    }
]);